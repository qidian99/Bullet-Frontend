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
import { LeftOutlined } from '@ant-design/icons';
import { formatTime, Spinner } from '../Common';
import VideoCard from '../Common/VideoCard';
import './index.scss';
import ModalView from '../CreateVideoModal';

const Room = ({
  videos, loading, location: { pathname }, refetch, history,
}) => {
  const roomId = pathname.split('/')[2];
  const cards = videos.map((v) => ({
    videoName: v.resource.name,
    videoId: v.resource.resourceId,
    bullets: v.bullets,
    lastUpdated: formatTime(v.updatedAt),
    pathname,
    videoAvatar: v.resource.avatar,
  }));
  cards.push({});

  return (
    <div className="container">
      {loading ? <Spinner />
        : (
          <>
            <div onClick={() => history.push('/')} style={{ marginBottom: 30 }}>
              <LeftOutlined style={{ marginRight: 10 }} />
              Back
            </div>

            <Row gutter={[16, 24]}>
              {!loading ? cards.map((card) => (
                <Col xl={8} lg={12} md={24} sm={24} xs={24}>
                  {card.videoId
                    ? <VideoCard card={card} />
                    : <ModalView roomId={roomId} refetch={refetch} />}
                </Col>
              )) : null}
            </Row>
          </>
        )}
    </div>
  );
};

const VIDEO_QUERY = gql`
  query getVideos($roomId: ID!) {
    resourceTeasersInRoom(roomId: $roomId) {
      resource {
        resourceId
        name
        avatar
      }
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
    props: ({ data: { resourceTeasersInRoom, loading, refetch } }) => ({
      videos: resourceTeasersInRoom || [],
      loading,
      refetch,
    }),
  }),
)(Room);
