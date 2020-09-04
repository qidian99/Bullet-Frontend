import React from 'react';
import {
  Avatar, Card, List, Tooltip, Row, Col, Statistic, message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PieChartOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import moment from 'moment';
import { RESTAURANT_QUERY } from '../../queries';
import './index.css';

const dealStatus = {
  SAVED: {
    text: '已保存',
    color: null,
  },
  PUBLISHED: {
    text: '已发布',
    color: '#1890ff',
  },
};

const CardInfo = ({ orderCount, totalRevenue }) => (
  <Row className="cardInfo">
    <Col span={12}>
      <Statistic title="总订单数" value={orderCount} />
    </Col>
    <Col span={12}>
      <Statistic title="总收入" value={totalRevenue} precision={2} />
    </Col>
  </Row>
);

const DealCardList = ({ deals, loading, deleteDeal }) => (
  <List
    rowKey="id"
    className="filterCardList"
    grid={{
      gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1,
    }}
    dataSource={_.orderBy(deals, ['endedAt'], ['desc'])}
    pagination={{ pageSize: 20 }}
    loading={loading}
    renderItem={(item) => {
      const status = dealStatus[item.status];
      const revenue = _.chain(item.orders)
        .map('items')
        .flatten()
        .sumBy((o) => o.numOrdered * o.price)
        .value();
      return (
        <List.Item key={item.dealId}>
          <Card
            hoverable
            bodyStyle={{ paddingBottom: 20 }}
            actions={[
              <Link to={{ pathname: '/newDeal', search: `?dealId=${item.dealId}` }}>
                <Tooltip title="编辑" key="edit">
                  <EditOutlined />
                </Tooltip>
              </Link>,
              <Tooltip title="删除" key="delete">
                <DeleteOutlined onClick={() => deleteDeal(item.dealId)} />
              </Tooltip>,
              <Link to={{ pathname: '/analysis', search: `?dealId=${item.dealId}` }}>
                <Tooltip title="详细信息" key="detail">
                  <PieChartOutlined />
                </Tooltip>
              </Link>,
              <Tooltip title="分享" key="share">
                <ShareAltOutlined onClick={() => message.success('Link copied!')} />
              </Tooltip>,
            ]}
          >
            <Card.Meta
              avatar={(
                <Avatar style={{ backgroundColor: status.color, verticalAlign: 'middle' }}>
                  {status.text}
                </Avatar>
                  )}
              title={moment(item.endedAt).locale('zh-cn').format('lll')}
            />
            <div className="cardItemContent">
              <CardInfo
                orderCount={item.orders.length}
                totalRevenue={revenue}
              />
            </div>
          </Card>
        </List.Item>
      );
    }}
  />
);

const DELETE_DEAL = gql`
  mutation DeleteDeal($dealId: ID!) {
    deleteDeal(dealId: $dealId) {
      dealId
    }
  }
`;

export default compose(
  graphql(DELETE_DEAL, {
    options: ({ restaurantId }) => ({
      update: (store, { data: { deleteDeal: { dealId } } }) => {
        const data = store.readQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
        });
        store.writeQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
          data: {
            ...data,
            getCurrUser: {
              ...data.getCurrUser,
              deals: data.getCurrUser.deals.filter((deal) => deal.dealId !== dealId),
            },
          },
        });
      },
    }),
    props: ({ mutate }) => ({
      deleteDeal: (dealId) => mutate({ variables: { dealId } }),
    }),
  }),
)(DealCardList);
