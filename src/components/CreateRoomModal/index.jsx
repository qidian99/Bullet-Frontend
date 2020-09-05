import React, { useState } from 'react';
import {
  Input, Form, Select, Radio, Modal,
} from 'antd';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import AddCard from '../Common/AddCard';
import './index.scss';


const GroupCreateForm = ({
  visible, onCreate, onCancel, friends,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new group"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="alias"
          label="Group Name"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="users"
          label="Members"
          rules={[
            {
              type: 'array',
            },
          ]}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select friends to join your group."
          >
            {friends.map(({ userId, username }) => (
              <Select.Option value={userId}>{username}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const GroupPage = ({
  currentUser = { friends: [] }, createRoom, extraStyle, refetch,
}) => {
  const [visible, setVisible] = useState(false);

  const onCreate = async (values) => {
    console.log('Received values of form: ', values);
    const formData = {
      alias: values.alias,
      users: JSON.stringify([...(values.users || []), currentUser.userId]),
      admins: JSON.stringify([currentUser.userId]),
      public: values.modifier === 'public',
    };
    const { data: { createRoom: room } } = await createRoom(formData);
    console.log(room);
    setVisible(false);
    refetch();
  };

  return (
    <div>
      <AddCard onClick={() => { setVisible(true); }} extraStyle={extraStyle} />
      <GroupCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
        friends={currentUser.friends}
      />
    </div>
  );
};

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
    userId
    friends {
      userId
      username
      email
      avatar
    }
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
)(GroupPage);
