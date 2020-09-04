import React, { Component } from 'react';
import { AlipayOutlined, DingdingOutlined, TaobaoOutlined } from '@ant-design/icons';
import { List } from 'antd';
import { FormattedMessage, formatMessage } from '../../../locales';

class BindingView extends Component {
  getData = () => [
    {
      title: formatMessage(
        {
          id: 'accountandsettings.binding.taobao',
        },
        {},
      ),
      description: formatMessage(
        {
          id: 'accountandsettings.binding.taobao-description',
        },
        {},
      ),
      actions: [
        <a key="Bind">
          <FormattedMessage id="accountandsettings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <TaobaoOutlined className="taobao" />,
    },
    {
      title: formatMessage(
        {
          id: 'accountandsettings.binding.alipay',
        },
        {},
      ),
      description: formatMessage(
        {
          id: 'accountandsettings.binding.alipay-description',
        },
        {},
      ),
      actions: [
        <a key="Bind">
          <FormattedMessage id="accountandsettings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <AlipayOutlined className="alipay" />,
    },
    {
      title: formatMessage(
        {
          id: 'accountandsettings.binding.dingding',
        },
        {},
      ),
      description: formatMessage(
        {
          id: 'accountandsettings.binding.dingding-description',
        },
        {},
      ),
      actions: [
        <a key="Bind">
          <FormattedMessage id="accountandsettings.binding.bind" defaultMessage="Bind" />
        </a>,
      ],
      avatar: <DingdingOutlined className="dingding" />,
    },
  ];

  render() {
    return (
      <>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default BindingView;
