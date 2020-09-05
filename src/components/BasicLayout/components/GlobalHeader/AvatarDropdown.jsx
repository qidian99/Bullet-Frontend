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

const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

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
      sessionStorage.removeItem('Authorization');
      history.push('/user');
      return;
    }
    history.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser,
      loading,
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
    return !loading ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className="action account">
          <Avatar size="small" className="avatar" src={currentUser.avatar || DEFAULT_AVATAR} alt="avatar" />
          <span className="name">{currentUser.username || 'Unknown'}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}

const CURRENT_USER_QUERY = gql`
  query currentUser {
    currentUser {
      userId
      username
      avatar
    }
  }
`;

export default compose(
  withRouter,
  connect(({ auth: { userId } }) => ({ userId })),
  graphql(CURRENT_USER_QUERY, {
    props: ({ data: { currentUser, loading } }) => ({
      currentUser,
      loading,
    }),
  }),
)(AvatarDropdown);
