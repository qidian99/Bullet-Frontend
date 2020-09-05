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
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import 'moment/locale/zh-cn';
import RoomCard from '../Common/RoomCard';
import './index.css';

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
    const { rooms, loading } = this.props;
    console.log(rooms, loading);
    const cards = [{}];
    cards.push(...rooms.map((r) => ({
      roomName: r.alias,
      roomId: r.roomId,
      members: r.users.length,
      roomAvatar: r.avatar,
      lastUpdated: r.updatedAt,
    })));
    return (
      <div className="container">
        <Row gutter={[16, 24]}>
          {loading ? cards.map((card) => (
            <Col xl={8} lg={12} md={24} sm={24} xs={24}>
              <RoomCard card={card} />
            </Col>
          )) : null}
        </Row>
      </div>
    );
  }
}

const USER_FRAGMENT = gql`
  fragment userProfile on User {
    userId
    username
    email
    firstname
    lastname
    avatar
  }
`;

const ROOMS_QUERY = gql`
  query getRooms($userId: ID) {
    allRooms(userId: $userId) {
      roomId
      alias
      users {
        ...userProfile
      }
      admins {
        ...userProfile
      }
      pending {
        ...userProfile
      }
      public
      widgets
    }
  }

  ${USER_FRAGMENT}
`;

const mapStateToProps = ({ auth }) => ({ userId: auth.userId });

export default compose(
  connect(mapStateToProps),
  graphql(ROOMS_QUERY, {
    // options: (props) => ({ variables: { userId: props.userId } }),
    props: ({ data }) => {
      console.log('data', data);
      return {
        rooms: data.allRooms || [],
        loading: data.loading,
      };
    },
  }),
)(Workplace);
