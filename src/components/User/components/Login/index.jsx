/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Alert, Checkbox } from 'antd';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import LoginFrom from './components/Login';

import { ReactComponent as EmailIcon } from '../../../../assets/email.svg';
import { ReactComponent as LockIcon } from '../../../../assets/lock.svg';

import './index.scss';

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

const FormInput = ({
  name, value, onChange, placeholder, type = 'text',
}) => (
  <input
    type={type}
    name={name}
    value={value}
    className="input-text"
    onChange={onChange}
    placeholder={placeholder}
  />
);

const Login = (props) => {
  const [submitting, setsubmitting] = useState(false);
  const [status, setstatus] = useState('');
  const [autoLogin, setAutoLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    const values = {
      email,
      password,
    };
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
    <div id="sign-in" className="login-main">
      <form onSubmit={handleSubmit}>
        <div className="form-label">
          <EmailIcon className="icon" />
          <FormInput
            name="email"
            value={email}
            onChange={(target) => setEmail(target.value)}
            placeholder="用户名"
          />
          {/* <input
            type="text"
            name="email"
            value={email}
            className="input-text"
            onChange={(target) => setEmail(target.value)}
            placeholder="用户名"
          /> */}
        </div>
        <div className="form-label">
          <LockIcon className="icon" />
          <FormInput
            type="password"
            name="password"
            value={password}
            onChange={(target) => setPassword(target.value)}
            placeholder="密码"
          />
          {/* <input
            type="password"
            name="password"
            value={password}
            className="input-text"
            onChange={setPassword}
            placeholder="密码"
          /> */}
        </div>
        <div className="actions-container">
          <div className="remember-me">
            <input
              name="remember"
              type="checkbox"
              checked={false}
              className="check-box"
              readOnly
            />
            自动登录
          </div>
          <div className="forgot-password">
            <a>忘记密码</a>
          </div>
        </div>
        <div className="form-group">
          <input type="submit" value="Sign In" className="submit-button login-button" />
        </div>
      </form>
      <div className="form-group">
        <Link style={{ color: '#C85548' }} to="/user/register">
          注册账户
        </Link>
      </div>
    </div>
  // <div className="login-main">
  //   <LoginFrom onSubmit={handleSubmit}>
  //     {status === 'error' && type === 'account' && !submitting && (
  //     <LoginMessage content="账户或密码错误（admin/ant.design）" />
  //     )}

  //     <UserName
  //       name="email"
  //       placeholder="用户名: admin or user"
  //       rules={[
  //         {
  //           required: true,
  //           message: '请输入用户名!',
  //         },
  //       ]}
  //     />
  //     <Password
  //       name="password"
  //       placeholder="密码: ant.design"
  //       rules={[
  //         {
  //           required: true,
  //           message: '请输入密码！',
  //         },
  //       ]}
  //     />
  //     <div>
  //       <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
  //         自动登录
  //       </Checkbox>
  //       <div style={{ float: 'right' }}>
  //         <a style={{ marginRight: 20 }}>忘记密码</a>
  //         <Link className="register" to="/user/register">
  //           注册账户
  //         </Link>
  //       </div>
  //     </div>
  //     <Submit loading={submitting}>登录</Submit>
  //   </LoginFrom>
  // </div>
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
