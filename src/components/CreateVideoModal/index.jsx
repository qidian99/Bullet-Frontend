import React, { useState } from 'react';
import {
  Input, Form, Modal,
} from 'antd';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import AddCard from '../Common/AddCard';

const VideoCreateForm = ({
  visible, onCreate, onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new video"
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
          name="name"
          label="Video Name"
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
          name="url"
          label="Video Link (Optional)"
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Introduction">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const VideoPage = ({ createVideo, refetch, roomId }) => {
  const [visible, setVisible] = useState(false);

  const onCreate = async (values) => {
    const formData = {
      roomId,
      name: values.name,
      description: values.description,
      url: values.url,
    };
    const { data: { createResource: video } } = await createVideo(formData);
    console.log('Created video', video);
    setVisible(false);
    refetch();
  };

  return (
    <div>
      <AddCard onClick={() => { setVisible(true); }} />
      <VideoCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

const CREATE_VIDEO_MUTATION = gql`
  mutation createVideo(
    $roomId: ID!
    $name: String!
    $description: String
    $url: String
  ) {
    createResource(
      roomId: $roomId
      name: $name
      description: $description
      url: $url
    ) {
      resourceId
      name
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
  graphql(CREATE_VIDEO_MUTATION, {
    props: ({ mutate }) => ({
      createVideo: (variables) => mutate({ variables }),
    }),
  }),
  graphql(CURR_USER, {
    props: ({ data: { currentUser, loading } }) => ({
      currentUser,
      currentUserLoading: loading,
    }),
  }),
)(VideoPage);
