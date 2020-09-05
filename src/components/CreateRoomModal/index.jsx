import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { CustomModal } from '../Common';

import './index.scss';
import { Form, Select } from 'antd';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class CreateRoomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

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

    return (
      <div>
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
      </div>
    );
  }
}

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

export default compose(
  withRouter,
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
)(CreateRoomModal);
