import React from 'react';
import { Avatar, Menu, Spin } from 'antd';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import HeaderDropdown from '../HeaderDropdown';
import './index.css';

class AvatarDropdown extends React.Component {
  onMenuClick = (event) => {
    const { history } = this.props;
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
      history.push('/user');
      return;
    }
    history.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        name: '黑龙鱼',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className="menu" selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className="action account">
          <Avatar size="small" className="avatar" src={currentUser.avatar} alt="avatar" />
          <span className="name">{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}

const RESTAURANT_QUERY = gql`
  query Restaruant($restaurantId: ID!) {
    restaurant(restaurantId: $restaurantId) {
      restaurantId
      restaurantName
      avatar
    }
  }
`;

export default compose(
  withRouter,
  connect(({ auth: { restaurantId } }) => ({ restaurantId })),
  // graphql(RESTAURANT_QUERY, {
  //   options: ({ restaurantId }) => ({
  //     variables: { restaurantId },
  //   }),
  //   props: ({ data: { restaurant, loading } }) => ({
  //     currentUser: restaurant,
  //     currentUserLoading: loading,
  //   }),
  // }),
)(AvatarDropdown);
