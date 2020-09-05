import React from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import ParallaxMousemove from 'react-parallax-mousemove';
import Login from './components/Login';
import Register from './components/Register';
import './index.css';

const { Footer, Content } = Layout;

const style = {
  outter: {
    // background: 'radial-gradient(50% 150%, #6CD7E8 50%, #59C2D3 100%)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  bgLayerStyle: {
    position: 'absolute',
    zIndex: -1,
    height: '100%',
    // left: 0,
    // top: 0,
    transform: 'translate(0, 0)',
  },
};

const User = ({ match: { path } }) => (
  <ParallaxMousemove containerStyle={style.outter} fullHeight>
    <ParallaxMousemove.Layer
      layerStyle={style.bgLayerStyle}
      config={{
        xFactor: 0.05,
        yFactor: 0.05,
        springSettings: {
          stiffness: 50,
          damping: 30,
        },
      }}
    >
      {/* background-image: url("../../assets/login.png"); */}
      <img src={require('../../assets/login.png')} alt="Parallax Layer" />
    </ParallaxMousemove.Layer>
    <Layout className="user">
      <Content className="content">
        <div className="header">
          <div className="title">Bullet</div>
          {/* <div className="description">我们是一群在除夕夜放飞梦想的有志青年！</div> */}
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
  </ParallaxMousemove>
);

export default User;
