import React, { useState } from 'react';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
import ParallaxMousemove from 'react-parallax-mousemove';
import ReactCardFlip from 'react-card-flip';
import Login from './components/Login';
import './index.css';

const { Footer, Content } = Layout;

const style = {
  outter: {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
    zIndex: -1,
  },
  bgLayerStyle: {
    position: 'absolute',
    height: '100%',
    zIndex: -1,
    transform: 'translate(0, 0)',
  },
};

const User = ({ match: { path } }) => {
  const [isLogin, setIsLogin] = useState(true);
  console.log('isLogin', isLogin);
  return (
    <div>
      <ParallaxMousemove containerStyle={style.outter}>
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
          <img src={require('../../assets/login.png')} alt="Parallax Layer" />
        </ParallaxMousemove.Layer>
      </ParallaxMousemove>
      <Layout className="user">
        <Content className="content">
          <div className="header">
            <ReactCardFlip isFlipped={!isLogin} flipDirection="vertical">
              <div className="title">Bullet</div>
              <div className="title">Register Bullet</div>
            </ReactCardFlip>
          </div>
          <Route path={`${path}`}>
            <Login isLogin={isLogin} setIsLogin={setIsLogin} />
          </Route>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
};

export default User;
