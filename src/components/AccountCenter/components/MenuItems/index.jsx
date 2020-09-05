import React from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { graphql, withApollo } from 'react-apollo';
import { RESTAURANT_QUERY } from '../../queries';

class MenuTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      menuItem: null,
    };
  }

  handleAdd = () => {
    this.setState({
      modalVisible: true,
      menuItem: null,
    });
  };

  handleEdit = (item) => {
    this.setState({
      modalVisible: true,
      menuItem: item,
    });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleCreate = async (item) => {
    const { createMenuItem, updateMenuItem } = this.props;
    console.log(item);
    if (item.itemId) {
      await updateMenuItem(item);
    } else {
      await createMenuItem(item);
    }
    this.setState({
      modalVisible: false,
    });
  }

  handleDelete = async (item) => {
    const { deleteMenuItem } = this.props;
    await deleteMenuItem(item.itemId);
    message.success('操作成功！');
  };

  render() {
    const { items, restaurantId } = this.props;
    const { modalVisible, menuItem } = this.state;
    const actions = [
      { label: '编辑', callback: this.handleEdit },
      { label: '删除', callback: this.handleDelete },
    ];
    return (
      <div className="menu-table" style={{ backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" onClick={this.handleAdd}>
            <PlusOutlined />
            新建
          </Button>
        </div>
        {/* <MenuItemTable menuItems={items} actions={actions} />
        <MenuCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          userId={restaurantId}
          menuItem={menuItem}
        /> */}
      </div>
    );
  }
}

const MenuItemFragment = gql`
  fragment Item on MenuItem {
    itemId
    name
    imageUrl
    price
    courses
  }
`;

const CREATE_MENU_ITEM = gql`
  mutation CreateMenuItem(
    $name: String!
    $imageUrl: String
    $price: Float!
    $courses: [String!]
  ) {
    createMenuItem(
      name: $name
      imageUrl: $imageUrl
      price: $price
      courses: $courses
    ) {
      ...Item
    }
  }
  ${MenuItemFragment}
`;

const UPDATE_MENU_ITEM = gql`
  mutation UpdateMenuItem(
    $itemId: ID!
    $name: String!
    $imageUrl: String
    $price: Float!
    $courses: [String!]
  ) {
    updateMenuItem(
      itemId: $itemId
      name: $name
      imageUrl: $imageUrl
      price: $price
      courses: $courses
    ) {
      ...Item
    }
  }
  ${MenuItemFragment}
`;

const DELETE_MENU_ITEM = gql`
  mutation DeleteMenuItem($itemId: ID!) {
    deleteMenuItem(itemId: $itemId) {
      ...Item
    }
  }
  ${MenuItemFragment}
`;

export default compose(
  withApollo,
  graphql(CREATE_MENU_ITEM, {
    options: ({ restaurantId }) => ({
      update: (store, { data: { createMenuItem } }) => {
        const data = store.readQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
        });
        data.getCurrUser.menuItems.push(createMenuItem);
        store.writeQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
          data,
        });
      },
    }),
    props: ({ mutate }) => ({
      createMenuItem: (variables) => mutate({ variables }),
    }),
  }),
  graphql(UPDATE_MENU_ITEM, {
    props: ({ mutate }) => ({
      updateMenuItem: (variables) => mutate({ variables }),
    }),
  }),
  graphql(DELETE_MENU_ITEM, {
    options: ({ restaurantId }) => ({
      update: (store, { data: { deleteMenuItem: { itemId } } }) => {
        const data = store.readQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
        });
        store.writeQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
          data: {
            ...data,
            getCurrUser: {
              ...data.getCurrUser,
              menuItems: data.getCurrUser.menuItems.filter((item) => item.itemId !== itemId),
            },
          },
        });
      },
    }),
    props: ({ mutate }) => ({
      deleteMenuItem: (itemId) => mutate({ variables: { itemId } }),
    }),
  }),
)(MenuTable);
