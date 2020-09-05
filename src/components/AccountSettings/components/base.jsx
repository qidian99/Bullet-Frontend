import React, { Component } from 'react';
import {
  Button, Input, Upload, Form, message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FormattedMessage, formatMessage } from '../../../locales';
import PhoneView from './PhoneView';
import './baseView.css';

const DEFAULT_AVATAR = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

const AvatarView = ({ avatar, onChange, userId }) => (
  <>
    <div className="avatar_title">
      <FormattedMessage id="accountandsettings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className="avatar">
      <img src={avatar} alt="avatar" />
    </div>
    <Upload
      showUploadList={false}
      action={`https://tritonbyte-server.herokuapp.com/image/upload/:${userId}`}
      listType="picture"
      onChange={onChange}
    >
      <div className="button_view">
        <Button>
          <UploadOutlined />
          <FormattedMessage
            id="accountandsettings.basic.change-avatar"
            defaultMessage="Change avatar"
          />
        </Button>
      </div>
    </Upload>
  </>
);

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

class BaseView extends Component {
  view = undefined;

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = DEFAULT_AVATAR;
      return url;
    }
    return '';
  }

  getViewDom = (ref) => {
    this.view = ref;
  };

  handleFinish = async (values) => {
    const { updateRestaurant } = this.props;
    const { data: { updateRestaurant: { token } } } = await updateRestaurant(values);
    if (token) {
      sessionStorage.setItem('authToken', token.authToken);
      sessionStorage.setItem('refreshToken', token.refreshToken);
    }
    message.success(
      formatMessage({
        id: 'accountandsettings.basic.update.success',
      }),
    );
  };

  handleChange = (info) => {
    const { updateAvatar } = this.props;
    if (info.file.status === 'done') {
      updateAvatar(info.file.response)
        .then(() => {
          message.success(
            formatMessage({
              id: 'accountandsettings.basic.update.success',
            }),
          );
        });
    }
  };

  render() {
    const { currentUser } = this.props;
    return (
      <div className="baseView" ref={this.getViewDom}>
        <div className="left">
          <Form
            layout="vertical"
            onFinish={this.handleFinish}
            initialValues={currentUser}
            hideRequiredMark
          >
            <Form.Item
              name="email"
              label={formatMessage({
                id: 'accountandsettings.basic.email',
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage(
                    {
                      id: 'accountandsettings.basic.email-message',
                    },
                    {},
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label={formatMessage({
                id: 'accountandsettings.basic.address',
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage(
                    {
                      id: 'accountandsettings.basic.address-message',
                    },
                    {},
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="联系人" noStyle>
              <Form.Item
                name="firstName"
                label="姓氏"
                rules={[
                  {
                    required: true,
                    message: '请输入您的姓氏！',
                  },
                ]}
                style={{ display: 'inline-block', width: 'calc(50% - 4px)', marginRight: 8 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的名字！',
                  },
                ]}
                style={{ display: 'inline-block', width: 'calc(50% - 4px)' }}
              >
                <Input />
              </Form.Item>
            </Form.Item>
            <Form.Item
              name="phone"
              label={formatMessage({
                id: 'accountandsettings.basic.phone',
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage(
                    {
                      id: 'accountandsettings.basic.phone-message',
                    },
                    {},
                  ),
                },
                {
                  validator: validatorPhone,
                },
              ]}
            >
              <PhoneView />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                <FormattedMessage
                  id="accountandsettings.basic.update"
                  defaultMessage="Update Information"
                />
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="right">
          <AvatarView
            avatar={this.getAvatarURL()}
            onChange={this.handleChange}
            userId={currentUser ? currentUser.userId : 'null'}
          />
        </div>
      </div>
    );
  }
}

export default BaseView;
