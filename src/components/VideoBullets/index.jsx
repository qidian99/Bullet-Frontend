import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Tooltip } from 'antd';
import { formatTime, Spinner } from '../Common';

import './index.scss';

function pad(num) {
  return (`0${num}`).slice(-2);
}
function hhmmss(secs) {
  let minutes = Math.floor(secs / 60);
  secs %= 60;
  const hours = Math.floor(minutes / 60);
  minutes %= 60;
  const result = secs < 3600 ? `${pad(minutes)}:${pad(secs)}` : `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  return result;
}

const BulletRow = ({
  time, name, text, connector = true,
}) => (
  <div className="bullet-row">
    <span className="time">
      {time}
    </span>
    <span className="sender">
      {name}
    </span>
    <span className="text">
      {text}
    </span>
    {connector && <div className="connector" />}
  </div>
);

class VideoBullets extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { allBulletsInResource = [], loading } = this.props;
    return (
      <div className="video-bullets-container">
        {loading ? <Spinner />
          : (
            <div>
              {
          allBulletsInResource.slice().reverse().map((bullet, index) => {
            const connector = index !== allBulletsInResource.length - 1;
            return (
              <Tooltip placement="topLeft" arrowPointAtCenter title={<div>{formatTime(bullet.createdAt)}</div>}>
                <BulletRow
                  time={hhmmss(bullet.timestamp)}
                  name={bullet.user.username}
                  text={bullet.content}
                  connector={connector}
                />
                <div />
              </Tooltip>
            );
          })
        }
            </div>
          )}
      </div>
    );
  }
}

const BULLETS_QUERY = gql`
  query allBulletsInResource($roomId: ID!, $resourceId: ID!) {
    allBulletsInResource(roomId: $roomId, resourceId: $resourceId) {
      bulletId
      user {
        username
      }
      timestamp
      content
      source
      createdAt
    }
  }
`;

export default compose(
  withRouter,
  connect(null, (dispatch) => ({
    loginUser: (userId) => dispatch({
      type: 'LOGIN_USER',
      userId,
    }),
  })),
  graphql(BULLETS_QUERY, {
    options: (props) => (
      {
        variables: {
          roomId: props.location.pathname.split('/')[2],
          resourceId: props.location.pathname.split('/')[4],
        },
      }
    ),
    props: ({ data: { allBulletsInResource, loading, refetch } }) => (
      {
        loading,
        allBulletsInResource,
        refetch,
      }),
  }),
)(VideoBullets);
