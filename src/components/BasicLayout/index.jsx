import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import { connect } from 'react-redux';
import Avatar from './components/Avatar';
import GlobalHeader from './components/GlobalHeader/RightContent';
import './index.css';
import logo from '../../assets/logo.svg';

const { Header, Sider, Content } = Layout;

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    icon: <DashboardOutlined />,
  },
  {
    path: '/account/center',
    name: 'Account Center',
    icon: <UserOutlined />,
  },
  {
    path: '/account/settings',
    name: 'Account Settings',
    icon: <SettingOutlined />,
  },
];

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  static getDerivedStateFromProps(props) {
    let { location: { pathname } } = props;
    if (pathname.startsWith('/chat')) {
      pathname = '/chat';
    }
    const route = _.find(routes, { path: pathname });
    if (route) {
      return {
        selectedKey: route.name,
      };
    }
    return null;
  }

  onRouteChanged = () => {}

  resize = () => {}

  toggleCollapsed = () => {
    const { collapsed, collapse, expand } = this.props;
    if (collapsed) {
      expand();
    } else {
      collapse();
    }
  };

  render() {
    const { component, collapsed } = this.props;
    const { selectedKey } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width="256"
          style={{
            position: 'relative',
            zIndex: 10,
            minHeight: '100vh',
            boxShadow: '2px 0 6px rgba(0,21,41,.35)',
          }}
        >
          <div className="sider-menu-logo">
            <Avatar src={logo} />
            <h1>Bullet</h1>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            style={{ padding: '16px 0' }}
            selectedKeys={[selectedKey]}
          >
            {routes.map((route) => (
              <Menu.Item key={route.name}>
                <Link to={route.path}>
                  {route.icon}
                  <span>{route.name}</span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              position: 'relative',
              padding: 0,
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
              zIndex: 9,
            }}
          >
            <span className="trigger" onClick={this.toggleCollapsed}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <GlobalHeader />
          </Header>
          <Content style={{ margin: 24 }}>
            {React.createElement(withRouter(component))}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  ({ settings: { collapsed } }) => ({ collapsed }),
  (dispatch) => ({
    collapse: () => dispatch({ type: 'COLLAPSE' }),
    expand: () => dispatch({ type: 'EXPAND' }),
  }),
)(withRouter(BasicLayout));
