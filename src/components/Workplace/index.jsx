import React from 'react';
import {
  Row,
  Col,
} from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import 'moment/locale/zh-cn';
import { formatTime } from '../Common';
import RoomCard from '../Common/RoomCard';
import AddCard from '../Common/AddCard';
import './index.css';

class Workplace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onAddCardClick = () => {
    alert('Add new room');
  }

  render() {
    const { rooms, loading } = this.props;
    const cards = rooms.map((r) => ({
      roomName: r.alias,
      roomId: r.roomId,
      members: r.users.length,
      roomAvatar: r.avatar,
      roomPublic: r.public,
      lastUpdated: formatTime(r.updatedAt),
    }));
    cards.push({});

    return (
      <div className="container">
        <Row gutter={[16, 24]}>
          {!loading ? cards.map((card) => (
            <Col xl={8} lg={12} md={24} sm={24} xs={24}>
              {card.roomId ? <RoomCard card={card} /> : <AddCard onClick={this.onAddCardClick} />}
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
      avatar
      updatedAt
    }
  }

  ${USER_FRAGMENT}
`;

const mapStateToProps = ({ auth }) => ({ userId: auth.userId });

export default compose(
  connect(mapStateToProps),
  graphql(ROOMS_QUERY, {
    options: (props) => ({ variables: { userId: props.userId } }),
    props: ({ data: { allRooms, loading } }) => ({
      rooms: allRooms || [],
      loading,
    }),
  }),
)(Workplace);
