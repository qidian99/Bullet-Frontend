/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Alert, Checkbox } from 'antd';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';
import ClipLoader from 'react-spinners/ClipLoader';
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

export const FormInput = ({
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

const SubmitButton = ({ label, loading = true, onClick }) => (
  <div className="submit-button login-button" onClick={onClick}>
    {loading
      ? <ClipLoader size={30} color="gray" />
      : <input type="submit" value={label} className="submit" />}
  </div>
);

const Login = (props) => {
  const [submitting, setsubmitting] = useState(false);
  const [status, setstatus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { history, isLogin, setIsLogin } = props;

  const handleSubmit = () => {
    const values = {
      username: email,
      password,
    };
    const { login, loginUser, signUp } = props;
    setsubmitting(true);
    console.log('in submit');

    if (isLogin) {
      console.log('signin', email, password);
      login(values)
        .then(({ data: { login: { user, token } } }) => {
          setsubmitting(false);
          sessionStorage.setItem('Authorization', token);
          loginUser(user.userId);
          history.push('/');
        })
        .catch(() => {
          setstatus('error');
          setsubmitting(false);
        });
    } else {
      signUp(values)
        .then(({ data: { createUser: { user, token } } }) => {
          console.log(user, token);
          setsubmitting(false);
          sessionStorage.setItem('Authorization', token);
          loginUser(user.userId);
          history.push('/');
        })
        .catch((e) => {
          console.log('loginerror', e);

          setstatus('error');
          setsubmitting(false);
        });
    }
  };

  const onClick = (e) => {
    // e.preventDefault();
    const login = !isLogin;
    setIsLogin(login);
  };

  return (
    <div id="sign-in" className="login-main">
      <form>
        <div className="form-label">
          <EmailIcon className="icon" />
          <FormInput
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="用户名"
          />
        </div>
        <div className="form-label">
          <LockIcon className="icon" />
          <FormInput
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
          />
        </div>
        <div style={{ height: 40, marginBottom: 30 }}>
          {isLogin && (
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
          )}
        </div>

        <div className="form-group">
          <ReactCardFlip isFlipped={!isLogin} flipDirection="vertical">
            <SubmitButton
              label="Sign In"
              loading={submitting}
              onClick={handleSubmit}
            />
            <SubmitButton
              label="Register"
              loading={submitting}
              onClick={handleSubmit}
            />
            {/* <input type="submit" value="Sign In" className="submit-button login-button" />
            <input type="submit" value="Register" className="submit-button login-button" /> */}
          </ReactCardFlip>
        </div>
      </form>

      <div className="form-group">
        {!isLogin
          ? (
            <div onClick={onClick} className="to-register">
              {/* <Link className="to-register" to="/user/register"> */}
              登录账户
            </div>
          ) : (
            <div onClick={onClick} className="to-register">
              {/* <Link className="to-register" to="/user/register"> */}
              注册账户
            </div>
          )}
        {/* </Link> */}
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
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        userId
      }
      token
    }
  }
`;

const SIGN_UP_MUTATION = gql`
  mutation SignUp(
    $username: String!
    $password: String!
  ) {
    createUser(
      username: $username
      password: $password
    ) {
      user {
        userId
      }
      token
    }
  }
`;

export default compose(
  withRouter,
  connect(null, (dispatch) => ({
    loginUser: (userId) => dispatch({
      type: 'LOGIN_USER',
      userId,
    }),
  })),
  graphql(SIGN_IN_MUTATION, {
    props: ({ mutate }) => ({
      login: (variables) => mutate({ variables }),
    }),
  }),
  graphql(SIGN_UP_MUTATION, {
    props: ({ mutate }) => ({
      signUp: (variables) => mutate({ variables }),
    }),
  }),
)(Login);
