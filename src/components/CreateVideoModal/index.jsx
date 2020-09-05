import React, { useState } from 'react';
import {
  Input, Form, Modal, Button,
} from 'antd';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

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

const VideoPage = ({ createVideo }) => {
  const [visible, setVisible] = useState(false);

  const onCreate = async (values) => {
    console.log('Received values of form: ', values);
    const formData = {
      roomId: ,
      name: values.name,
      description: values.description,
      url: values.url,
    };
    const { data: { createResource: video } } = await createVideo(formData);
    console.log(room);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        New Video
      </Button>
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

const CREATE_ROOM_MUTATION = gql`
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
      room
    }
  }
`;

export default compose(
  withRouter,
  graphql(CURR_USER, {
    props: ({ data: { currentUser, loading } }) => ({
      currentUser,
      currentUserLoading: loading,
    }),
  }),
)(VideoPage);
