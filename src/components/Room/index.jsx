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
import VideoCard from '../Common/VideoCard';
import AddCard from '../Common/AddCard';
import './index.css';

class Room extends React.Component {
  onAddCardClick = () => {
    alert('Add new video');
  }

  render() {
    const { videos, loading, location: { pathname } } = this.props;

    const cards = videos.map((v) => ({
      videoName: v.source,
      videoId: v.source,
      bullets: v.bullets,
      lastUpdated: formatTime(v.createdAt),
      pathname,
    }));
    cards.push({});

    return (
      <div className="container">
        <Row gutter={[16, 24]}>
          {!loading ? cards.map((card) => (
            <Col xl={8} lg={12} md={24} sm={24} xs={24}>
              {card.videoId ? <VideoCard card={card} /> : <AddCard onClick={this.onAddCardClick} />}
            </Col>
          )) : null}
        </Row>
      </div>
    );
  }
}

const VIDEO_QUERY = gql`
  query getVideos($roomId: ID!) {
    videoTeasersInRoom(roomId: $roomId) {
      source
      bullets {
        bulletId
        user {
          userId
          username
        }
        createdAt
        content
      }
    }
  }
`;

const mapStateToProps = ({ auth }) => ({ userId: auth.userId });

export default compose(
  connect(mapStateToProps),
  graphql(VIDEO_QUERY, {
    options: (props) => ({ variables: { roomId: props.location.pathname.split('/')[2] } }),
    props: ({ data: { videoTeasersInRoom, loading } }) => ({
      videos: videoTeasersInRoom || [],
      loading,
    }),
  }),
)(Room);
