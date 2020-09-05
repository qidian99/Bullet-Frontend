import React from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import './index.css';

const { Footer, Content } = Layout;

const User = ({ match: { path } }) => (
  <Layout className="user">
    <Content>
      <div className="header">
        <div className="title">Bullet</div>
        <div className="description">我们是一群在除夕夜放飞梦想的有志青年！</div>
      </div>
      <Route path={`${path}/login`}>
        <Login />
      </Route>
      <Route path={`${path}/register`}>
        <Register />
      </Route>
    </Content>
    <Footer />
  </Layout>
);

export default User;
