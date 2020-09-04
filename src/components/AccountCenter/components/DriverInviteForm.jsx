import React from 'react';
import { Modal, Form, Input } from 'antd';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { graphql } from 'react-apollo';
import { RESTAURANT_QUERY } from '../queries';

class DriverInviteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      submitting: false,
    };
    this.formRef = React.createRef();
  }

  onCreate = () => {
    const { inviteDriver, form, onClose } = this.props;
    this.formRef.current.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      this.setState({ status: null, submitting: true });
      inviteDriver(values.email)
        .then(() => {
          form.resetFields();
          onClose();
          this.setState({ submitting: false });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ status: 'error', submitting: false });
        });
    });
  }

  render() {
    const {
      visible, onClose,
    } = this.props;
    const { status, submitting } = this.state;
    return (
      <Modal
        visible={visible}
        title="邀请配送员"
        okText="确认"
        cancelText="取消"
        onCancel={onClose}
        onOk={this.onCreate}
        confirmLoading={submitting}
      >
        <Form layout="vertical" ref={this.formRef}>
          <Form.Item
            name="email"
            label="Email"
            validateStatus={status}
            help={status === 'error' && '无法通过邮箱找到司机'}
            rules={[{ required: true, message: '请输入司机email地址!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const INVITE_DRIVER = gql`
  mutation InviteDriver($email: String!) {
    inviteDriver(email: $email) {
      driverId
      email
      phone
      firstName
      lastName
      confirmed
      avatar
    }
  }
`;

export default compose(
  graphql(INVITE_DRIVER, {
    options: ({ restaurantId }) => ({
      update: (store, { data: { inviteDriver } }) => {
        const data = store.readQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
        });
        data.restaurant.drivers.push(inviteDriver);
        store.writeQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
          data,
        });
      },
    }),
    props: ({ mutate }) => ({
      inviteDriver: (email) => mutate({ variables: { email } }),
    }),
  }),
)(DriverInviteForm);
