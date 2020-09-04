import React from 'react';
import {
  Avatar,
  Row,
  Col,
  Statistic,
  PageHeader,
  Card,
  Radio,
  List,
  Skeleton,
  Empty,
  Button,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import 'moment/locale/zh-cn';
import EditableLinkGroup from './components/EditableLinkGroup';
import './index.css';

// eslint-disable-next-line no-unused-vars
const dealStatus = {
  SAVED: {
    label: '已保存',
    color: '#faad14',
  },
  PUBLISHED: {
    label: '已发布',
    color: '#1890ff',
  },
};

const links = [
  {
    title: '创建团购',
    href: '',
  },
  {
    title: '管理订单',
    href: '',
  },
  {
    title: '管理配送',
    href: '',
  },
  {
    title: '管理司机',
    href: '',
  },
  {
    title: '私信买家',
    href: '',
  },
];

const routes = [
  {
    path: '/',
    breadcrumbName: 'Home',
  },
  {
    path: 'first',
    breadcrumbName: 'Workplace',
  },
];

const PageHeaderContent = ({
  currentUser = {
    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    name: '黑龙鱼',
  },
}) => (
  <div className="pageHeaderContent">
    <div className="avatar">
      <Avatar size="large" src={currentUser.avatar} />
    </div>
    <div className="content">
      <div className="contentTitle">
        早安，
        {currentUser.name}
        ，祝你开心每一天！
      </div>
      <div>
        交互专家 | 蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED
      </div>
    </div>
  </div>
);

const ExtraContent = ({ deals }) => {
  const activeDeals = _.filter(deals, { status: 'PUBLISHED' });
  const ordersToday = _.chain(activeDeals)
    .map('orders')
    .flatten()
    .filter((o) => moment().isSame(o.createdAt))
    .value();
  const revenue = _.chain(ordersToday)
    .map('items')
    .flatten()
    .sumBy((o) => o.numOrdered * o.price)
    .value();

  return (
    <div className="extraContent">
      <div className="statItem">
        <Statistic title="团购数" value={activeDeals.length} />
      </div>
      <div className="statItem">
        <Statistic title="当天总收入 (USD)" value={revenue} precision={2} />
      </div>
      <div className="statItem">
        <Statistic title="当天订单" value={ordersToday.length} />
      </div>
    </div>
  );
};

class Workplace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 'all',
    };
  }

  getFilteredOrders = (deals) => {
    const { key } = this.state;
    let orders = _.flatten(_.map(deals, 'orders'));
    if (key !== 'all') {
      orders = _.filter(orders, { status: 'REFUND_REQUESTED' });
    }
    return _.orderBy(orders, ['endedAt'], ['desc']).slice(0, 6);
  };

  renderActivities = (order) => {
    const events = _
      .chain(order.items)
      .map((item) => `${item.name} X ${item.numOrdered}`)
      .join(', ')
      .value();
    return (
      <List.Item key={order.orderId}>
        <List.Item.Meta
          avatar={<Avatar src={order.customer.avatar} />}
          title={(
            <span>
              <a className="username">{order.customer.username}</a>
              &nbsp;
              {order.status === 'REFUND_REQUESTED' ? '退订了' : '订购了'}
              &nbsp;
              <span className="event">{events}</span>
            </span>
          )}
          description={(
            <span className="datetime" title={order.createdAt}>
              {moment(order.createdAt).fromNow()}
            </span>
          )}
        />
      </List.Item>
    );
  };

  render() {
    // const { key } = this.state;
    // const { currentUser, currentUserLoading } = this.props;
    // const deals = currentUserLoading ? [] : _.orderBy(currentUser.deals, ['endedAt'], ['desc']);

    return (
      <div className="workplace">
        <PageHeader
          title="Workplace"
          style={{ margin: '-24px -24px 0' }}
          breadcrumb={{ routes }}
        >
          <div style={{ display: 'flex', width: '100%' }}>
            <PageHeaderContent />
          </div>
        </PageHeader>
        {/*
        <div style={{ marginTop: 24 }}>
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card
                className="dealList"
                style={{ marginBottom: 24 }}
                title="进行中的团购"
                bordered={false}
                extra={<Link to="/account-center">全部团购</Link>}
                loading={currentUserLoading}
                bodyStyle={{ padding: 0 }}
              >
                {deals.length ? (
                  deals.slice(0, 6).map((deal) => (
                    <Card.Grid className="projectGrid" key={deal.dealId}>
                      <Card bodyStyle={{ padding: 0 }} bordered={false}>
                        <Card.Meta
                          title={(
                            <div className="cardTitle">
                              <Avatar size="small">{deal.status}</Avatar>
                              <Link to={{ pathname: '/analysis', search: `?dealId=${deal.dealId}` }}>
                                {moment(deal.endedAt).locale('zh-cn').format('MMMDo h:mm A')}
                              </Link>
                            </div>
                          )}
                          description={deal.description}
                        />
                        <div className="projectItemContent">
                          <span className="datetime" title={deal.createdAt}>
                            Created&nbsp;
                            {moment(deal.createdAt).fromNow()}
                          </span>
                        </div>
                      </Card>
                    </Card.Grid>
                  ))
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="创建您的第一个团购">
                    <Button type="primary">前往编辑</Button>
                  </Empty>
                )}
              </Card>
              <Card
                bodyStyle={{ padding: 0 }}
                bordered={false}
                className="activeCard"
                title="最新订单"
                extra={(
                  <Radio.Group
                    value={key}
                    onChange={(e) => this.setState({ key: e.target.value })}
                  >
                    <Radio.Button value="all">所有订单</Radio.Button>
                    <Radio.Button value="refund">退单请求</Radio.Button>
                  </Radio.Group>
                )}
                loading={currentUserLoading}
              >
                <List
                  loading={currentUserLoading}
                  renderItem={(item) => this.renderActivities(item)}
                  dataSource={this.getFilteredOrders(deals)}
                  className="ordersList"
                  size="large"
                />
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card
                style={{ marginBottom: 24 }}
                title="快速开始 / 便捷导航"
                bordered={false}
                bodyStyle={{ padding: 0 }}
              >
                <EditableLinkGroup
                  onAdd={() => {}}
                  links={links}
                  linkElement={Link}
                />
              </Card>
              <Card
                bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
                bordered={false}
                title="团队"
                loading={currentUserLoading}
              >
                <div className="members">
                  <Row gutter={48}>
                    {currentUser && currentUser.drivers.length ? (
                      currentUser.drivers.map((item) => (
                        <Col span={12} key={`members-item-${item.driverId}`}>
                          <Link to="">
                            <Avatar src={item.avatar} size="small" />
                            <span className="member">{`${item.lastName} ${item.firstName}`}</span>
                          </Link>
                        </Col>
                      ))
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="添加您的配送司机">
                        <Button type="primary">前往添加</Button>
                      </Empty>
                    )}
                  </Row>
                </div>
              </Card>
            </Col>
          </Row>
        </div> */}
      </div>
    );
  }
}

const RESTAURANT_QUERY = gql`
  query {
    getCurrUser {
      ... on Restaurant {
        restaurantId
        avatar
        restaurantName
        deals {
          dealId
          items {
            imageUrl
          }
          orders {
            orderId
            customer {
              avatar
            }
            items {
              itemId
              name
              imageUrl
              price
              numOrdered
            }
            delivery {
              location {
                locationId
                name
              }
            }
          }
          description
          endedAt
          createdAt
          status
        }
        drivers {
          driverId
          firstName
          lastName
          avatar
        }
      }
    }
  }
`;

export default
// compose(
//   graphql(RESTAURANT_QUERY, {
//     props: ({ data: { getCurrUser, loading } }) => ({
//       currentUser: getCurrUser,
//       currentUserLoading: loading,
//     }),
//   }),
// )
(Workplace);
