import React, { Component } from 'react';
import { Menu, Spin } from 'antd';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FormattedMessage } from '../../locales';
import BaseView from './components/base';
import BindingView from './components/binding';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import './index.css';

const { Item } = Menu;

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    const menuMap = {
      base: (
        <FormattedMessage id="accountandsettings.menuMap.basic" defaultMessage="Basic Settings" />
      ),
      security: (
        <FormattedMessage
          id="accountandsettings.menuMap.security"
          defaultMessage="Security Settings"
        />
      ),
      notification: (
        <FormattedMessage
          id="accountandsettings.menuMap.notification"
          defaultMessage="New Message Notification"
        />
      ),
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map((item) => (
      <Item key={item}>{menuMap[item]}</Item>
    ));
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { currentUser, updateRestaurant, updateAvatar } = this.props;
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'base':
        return (
          <BaseView
            currentUser={currentUser}
            updateRestaurant={updateRestaurant}
            updateAvatar={updateAvatar}
          />
        );
      case 'security':
        return <SecurityView />;
      case 'notification':
        return <NotificationView />;
      default:
        break;
    }

    return null;
  };

  render() {
    const { mode, selectKey } = this.state;
    // const { currentUser, currentUserLoading } = this.props;
    // const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);
    return (
      <div className="account-settings">
        <div
          className="main"
          ref={(ref) => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className="leftMenu">
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className="right">
            <div className="title">{this.getRightTitle()}</div>
            <Spin spinning={false}>
              {this.renderChildren()}
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

const RESTAURANT_QUERY = gql`
  {
    getCurrUser {
      ... on Restaurant {
        restaurantId
        avatar
        address
        restaurantName
        firstName
        lastName
        email
        phone
        signature
      }
    }
  }
`;

const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant(
    $email: String!
    $restaurantName: String!
    $firstName: String!
    $lastName: String!
    $phone: String!
    $address: String!
  ) {
    updateRestaurant(
      email: $email
      restaurantName: $restaurantName
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      address: $address
    ) {
      restaurant {
        restaurantId
        email
        restaurantName
        firstName
        lastName
        phone
        address
      }
      token {
        authToken
        refreshToken
      }
    }
  }
`;

const UPDATE_AVATAR = gql`
  mutation UpdateRestaurant($avatar: String!) {
    updateRestaurant(avatar: $avatar) {
      restaurant {
        restaurantId
        avatar
      }
    }
  }
`;

export default compose(
  graphql(RESTAURANT_QUERY, {
    props: ({ data: { getCurrUser, loading } }) => ({
      currentUser: getCurrUser,
      currentUserLoading: loading,
    }),
  }),
  graphql(UPDATE_RESTAURANT, {
    props: ({ mutate }) => ({
      updateRestaurant: (variables) => mutate({ variables }),
    }),
  }),
  graphql(UPDATE_AVATAR, {
    props: ({ mutate }) => ({
      updateAvatar: (avatar) => mutate({ variables: { avatar } }),
    }),
  }),
)(AccountSettings);
