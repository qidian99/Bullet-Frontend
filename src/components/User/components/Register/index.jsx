import React, { useState, useEffect } from 'react';
import {
  Form, Button, Input, Popover, Progress, Select,
} from 'antd';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import './index.css';
import { FormattedMessage, formatMessage } from '../../../../locales';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const passwordStatusMap = {
  ok: (
    <div className="success">
      <FormattedMessage id="userandregister.strength.strong" />
    </div>
  ),
  pass: (
    <div className="warning">
      <FormattedMessage id="userandregister.strength.medium" />
    </div>
  ),
  poor: (
    <div className="error">
      <FormattedMessage id="userandregister.strength.short" />
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const Register = ({
  signUp, loginUser, history,
}) => {
  const [submitting, setsubmitting] = useState(false);
  const [visible, setvisible] = useState(false);
  const [prefix, setprefix] = useState('86');
  const [popover, setpopover] = useState(false);
  const confirmDirty = false;
  let interval;
  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const onFinish = (values) => {
    const restaurant = { ...values, prefix };
    delete restaurant.confirm;
    setsubmitting(true);
    signUp(restaurant)
      .then(({ data: { signUpRestaurant: { authToken, refreshToken, id } } }) => {
        setsubmitting(false);
        sessionStorage.setItem('authToken', authToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        loginUser(id);
        history.push('/');
      })
      .catch(() => {
        setsubmitting(false);
      });
  };

  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(
        formatMessage({
          id: 'userandregister.password.twice',
        }),
      );
    }

    return promise.resolve();
  };

  const checkPassword = (_, value) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      setvisible(!!value);
      return promise.reject(
        formatMessage({
          id: 'userandregister.password.required',
        }),
      );
    } // 有值的情况

    if (!visible) {
      setvisible(!!value);
    }

    setpopover(!popover);

    if (value.length < 6) {
      return promise.reject('');
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }

    return promise.resolve();
  };

  const changePrefix = (value) => {
    setprefix(value);
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={`progress-${passwordStatus}`}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className="progress"
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className="register-main">
      <h3>
        <FormattedMessage id="userandregister.register.register" />
      </h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <Form.Item
          name="restaurantName"
          rules={[
            {
              required: true,
              message: 'What\'s the name of the restaurant?',
              whitespace: true,
            },
          ]}
        >
          <Input size="large" placeholder="用户名" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="lastName"
            rules={[
              {
                required: true,
                message: 'What\'s your last name?',
                whitespace: true,
              },
            ]}
            style={{ display: 'inline-block', width: '50%' }}
          >
            <Input size="large" placeholder="姓" />
          </Form.Item>
          <Form.Item
            name="firstName"
            rules={[
              {
                required: true,
                message: 'What\'s your first name?',
                whitespace: true,
              },
            ]}
            style={{ display: 'inline-block', width: '50%' }}
          >
            <Input size="large" placeholder="名" />
          </Form.Item>

        </Form.Item>
        <FormItem
          name="email"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'userandregister.email.required',
              }),
            },
            {
              type: 'email',
              message: formatMessage({
                id: 'userandregister.email.wrong-format',
              }),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={formatMessage({
              id: 'userandregister.email.placeholder',
            })}
          />
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode;
            }

            return node;
          }}
          content={
            visible && (
              <div
                style={{
                  padding: '4px 0',
                }}
              >
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <FormattedMessage id="userandregister.strength.msg" />
                </div>
              </div>
            )
          }
          overlayStyle={{
            width: 240,
          }}
          placement="right"
          visible={visible}
        >
          <FormItem
            name="password"
            className={
              form.getFieldValue('password')
              && form.getFieldValue('password').length > 0
              && 'password'
            }
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder={formatMessage({
                id: 'userandregister.password.placeholder',
              })}
            />
          </FormItem>
        </Popover>
        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'userandregister.confirm-password.required',
              }),
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input
            size="large"
            type="password"
            placeholder={formatMessage({
              id: 'userandregister.confirm-password.placeholder',
            })}
          />
        </FormItem>
        <InputGroup compact>
          <Select
            size="large"
            value={prefix}
            onChange={changePrefix}
            style={{
              width: '20%',
            }}
          >
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
          <FormItem
            style={{
              width: '80%',
            }}
            name="phone"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: 'userandregister.phone-number.required',
                }),
              },
              {
                pattern: /^\d{11}$/,
                message: formatMessage({
                  id: 'userandregister.phone-number.wrong-format',
                }),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={formatMessage({
                id: 'userandregister.phone-number.placeholder',
              })}
            />
          </FormItem>
        </InputGroup>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className="submit"
            type="primary"
            htmlType="submit"
          >
            <FormattedMessage id="userandregister.register.register" />
          </Button>
          <Link className="login" to="/user/login">
            <FormattedMessage id="userandregister.register.sign-in" />
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};

const SIGN_UP_MUTATION = gql`
  mutation SignUp(
    $restaurantName: String!
    $address: String!
    $firstName: String!
    $lastName: String!
    $prefix: String!
    $phone: String!
    $email: String!
    $password: String!
  ) {
    signUpRestaurant(
      restaurantName: $restaurantName
      address: $address
      firstName: $firstName
      lastName: $lastName
      prefix: $prefix
      phoneNumber: $phone
      email: $email
      password: $password
    ) {
      authToken
      refreshToken
      id
    }
  }
`;

export default compose(
  withRouter,
  connect(null, (dispatch) => ({
    loginUser: (restaurantId) => dispatch({
      type: 'LOGIN_USER',
      restaurantId,
    }),
  })),
  graphql(SIGN_UP_MUTATION, {
    props: ({ mutate }) => ({
      signUp: (variables) => mutate({ variables }),
    }),
  }),
)(Register);
