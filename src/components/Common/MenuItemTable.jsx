import React, { Fragment } from 'react';
import {
  Divider,
  Table,
  Tag,
  Popover,
  Avatar,
  InputNumber,
} from 'antd';

const MenuItemTable = ({ menuItems, actions, onUpdate }) => {
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      render: (text) => (
        <Popover content={(
          <img
            alt=""
            src={text}
            style={{ width: '240px', height: 'auto' }}
          />
            )}
        >
          <Avatar shape="square" src={text} />
        </Popover>
      ),
    },
    {
      title: '配菜',
      dataIndex: 'courses',
      render: (tags) => (
        <span>
          {tags.map((tag) => <Tag key={tag} color="blue">{tag}</Tag>)}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 110,
      render: (text) => (
        <span>
          {actions.map(({ label, callback }, index) => (
            <Fragment key={label}>
              <a onClick={() => callback(text)}>{label}</a>
              {index !== actions.length - 1 && <Divider type="vertical" />}
            </Fragment>
          ))}
        </span>
      ),
    },
  ];

  if (onUpdate) {
    const quantity = {
      title: '商品数量',
      dataIndex: 'quantity',
      render: (text, record) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => onUpdate(record.itemId, value)}
          className="quantity"
        />
      ),
    };
    columns.splice(-2, 0, quantity);
  }

  return (
    <Table
      rowKey={(record) => record.itemId}
      columns={columns}
      dataSource={menuItems}
    />
  );
};

export default MenuItemTable;
