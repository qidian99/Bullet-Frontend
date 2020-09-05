import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import './index.scss';

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
      isOpen: false,
      alias: '',
    };
  }

  render() {
    const { isOpen } = this.state;
    // const { currentUser: { friends } } = this.props;

    return (
      <div className="video-bullets-container">
        <BulletRow
          time="1:05"
          name="EnqiZhang"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <BulletRow
          time="1:05"
          name="EnqiZhang"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <BulletRow
          time="1:05"
          name="EnqiZhang"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          connector={false}
        />
      </div>
    );
  }
}

const BULLETS_QUERY = gql`
  query Bullets($roomId: ID!, $source: String!) {
    allBulletsInVideo(roomId: $roomId, source: $source) {
      bulletId
      user {
        username
      }
      timestamp
      content
    }
  }
`

export default compose(
  withRouter,
  connect(null, (dispatch) => ({
    loginUser: (userId) => dispatch({
      type: 'LOGIN_USER',
      userId,
    }),
  })),
  graphql(BULLETS_QUERY, {
    options: () => ({
      variables: {
        roomId: 'test',
        source: 'test',
      },
    }),
    props: ({ data: { allBulletsInVideo, loading, refetch } }) => ({
      loading,
      bullets: allBulletsInVideo,
      refetch,
    }),
  }),
)(VideoBullets);