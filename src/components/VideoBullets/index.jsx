import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import './index.scss';
<<<<<<< HEAD
=======
import { Form, Select } from 'antd';
import { CustomModal, DropDownSelect, FormInput } from '../Common';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
>>>>>>> 6a4c4508a4517e0decdd278136c2fcd770047969

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

<<<<<<< HEAD
  render() {
    const { isOpen } = this.state;
    // const { currentUser: { friends } } = this.props;
=======
  openModal = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  onValueChange = (name, value) => {
    this.setState({ [name]: value });
  }

  onFinish = () => {
    const { createRoom } = this.props;
  }

  render() {
    const { isOpen } = this.state;
    const { currentUser: { friends } } = this.props;
>>>>>>> 6a4c4508a4517e0decdd278136c2fcd770047969

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
<<<<<<< HEAD
        <BulletRow
          time="1:05"
          name="EnqiZhang"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          connector={false}
        />
=======
        <div style={{ width: 100, height: 100, backgroundColor: 'black' }} onClick={this.openModal} />
        <CustomModal
          isOpen={isOpen}
          onClose={() => this.setState({ isOpen: false })}
        >
          <Form
            {...formItemLayout}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="users"
              label="Add Members"
              rules={[
                {
                  type: 'array',
                },
              ]}
            >
              <Select mode="multiple" placeholder="Please select friends to join your group.">
                {friends.map(({ username }) => (
                  <Select.Option value={username}>{username}</Select.Option>
                ))}   
              </Select>
            </Form.Item>
          </Form>
        </CustomModal>
>>>>>>> 6a4c4508a4517e0decdd278136c2fcd770047969
      </div>
    );
  }
}

<<<<<<< HEAD
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
=======
const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoom(
    $alias: String!
    $users: JSON!
    $admins: JSON!
    $public: Boolean
  ) {
    createRoom(
      alias: $alias
      users: $users
      admins: $admins
      public: $public
    ) {
      roomId
      widgets
      avatar
    }
  }
`;

const CURR_USER = gql`
{
  currentUser {
    uesrId
    friends
  }
}
`;
>>>>>>> 6a4c4508a4517e0decdd278136c2fcd770047969

export default compose(
  withRouter,
  connect(null, (dispatch) => ({
    loginUser: (userId) => dispatch({
      type: 'LOGIN_USER',
      userId,
    }),
  })),
<<<<<<< HEAD
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
=======
  graphql(CREATE_ROOM_MUTATION, {
    props: ({ mutate }) => ({
      createRoom: (variables) => mutate({ variables }),
    }),
  }),
  graphql(CURR_USER, {
    props: ({ data: { currentUser, loading } }) => ({
      currentUser,
      currentUserLoading: loading,
    }),
  }),
)(VideoBullets);
>>>>>>> 6a4c4508a4517e0decdd278136c2fcd770047969
