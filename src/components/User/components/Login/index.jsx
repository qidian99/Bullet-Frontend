import React, { useState } from 'react';
import { Alert, Checkbox } from 'antd';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import LoginFrom from './components/Login';
import './index.css';

const {
  Tab, UserName, Password, Mobile, Captcha, Submit,
} = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const [submitting, setsubmitting] = useState(false);
  const [status, setstatus] = useState('');
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');

  const handleSubmit = (values) => {
    const { signIn, loginUser, history } = props;
    setsubmitting(true);
    signIn(values)
      .then(({ data: { signInRestaurant: { authToken, refreshToken, id } } }) => {
        setsubmitting(false);
        sessionStorage.setItem('authToken', authToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        loginUser(id);
        history.push('/');
      })
      .catch(() => {
        setstatus('error');
        setsubmitting(false);
      });
  };

  return (
    <div className="login-main">
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && type === 'account' && !submitting && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="email"
            placeholder="用户名: admin or user"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码: ant.design"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Tab key="mobile" tab="手机号登录">
          {status === 'error' && type === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <div style={{ float: 'right' }}>
            <a style={{ marginRight: 20 }}>忘记密码</a>
            <Link className="register" to="/user/register">
              注册账户
            </Link>
          </div>
        </div>
        <Submit loading={submitting}>登录</Submit>
      </LoginFrom>
    </div>
  );
};

const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signInRestaurant(email: $email, password: $password) {
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
  graphql(SIGN_IN_MUTATION, {
    props: ({ mutate }) => ({
      signIn: (variables) => mutate({ variables }),
    }),
  }),
)(Login);
