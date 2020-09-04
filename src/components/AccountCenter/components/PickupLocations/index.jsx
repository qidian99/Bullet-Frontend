import React, { Component } from 'react';
import { List, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { compose } from 'redux';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import PickupCreateForm from './PickupLocationCreateForm';
import { RESTAURANT_QUERY } from '../../queries';

class PickupLocations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      location: null,
    };
  }

  handleAdd = () => {
    this.setState({
      visible: true,
      location: null,
    });
  };

  handleEdit = (location) => {
    this.setState({
      visible: true,
      location,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = async (location) => {
    const { createPickupLocation, updatePickupLocation } = this.props;
    if (location.locationId) {
      await updatePickupLocation(location);
    } else {
      await createPickupLocation(location);
    }
    this.setState({ visible: false });
  }

  handleDelete = (location) => {
    const { deletePickupLocation } = this.props;
    deletePickupLocation(location.locationId);
    message.success('操作成功！');
  };

  render() {
    const { pickupLocations } = this.props;
    const { visible, location } = this.state;
    return (
      <div>
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          onClick={this.handleAdd}
        >
          <PlusOutlined />
          添加
        </Button>
        <List
          dataSource={pickupLocations}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a onClick={() => this.handleEdit(item)}>编辑</a>,
                <a onClick={() => this.handleDelete(item)}>删除</a>,
              ]}
            >
              {item.name}
            </List.Item>
          )}
        />
        <PickupCreateForm
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          location={location}
        />
      </div>
    );
  }
}

const PickupFragment = gql`
  fragment Pickup on PickupLocation {
    locationId
    latitude
    longitude
    name
    alias
    startTime
    endTime
  }
`;

const CREATE_PICKUP_LOCATION = gql`
  mutation CreatePickupLocation(
    $lat: Float!
    $lng: Float!
    $name: String!
    $alias: String
    $startTime: String!
    $endTime: String!
  ) {
    createPickupLocation(
      latitude: $lat
      longitude: $lng
      name: $name
      alias: $alias
      startTime: $startTime
      endTime: $endTime
    ) {
      ...Pickup
    }
  }
  ${PickupFragment}
`;

const UPDATE_PICKUP_LOCATION = gql`
  mutation UpdatePickupLocation(
    $locationId: ID!
    $lat: Float
    $lng: Float
    $name: String
    $alias: String
    $startTime: String
    $endTime: String
  ) {
    updatePickupLocation(
      locationId: $locationId
      latitude: $lat
      longitude: $lng
      name: $name
      alias: $alias
      startTime: $startTime
      endTime: $endTime
    ) {
      ...Pickup
    }
  }
  ${PickupFragment}
`;

const DELETE_PICKUP_LOCATION = gql`
  mutation DeletePickupLocation($locationId: ID!) {
    deletePickupLocation(locationId: $locationId) {
      ...Pickup
    }
  }
  ${PickupFragment}
`;

export default compose(
  graphql(CREATE_PICKUP_LOCATION, {
    options: ({ restaurantId }) => ({
      update: (store, { data: { createPickupLocation } }) => {
        const data = store.readQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
        });
        data.getCurrUser.pickupLocations.push(createPickupLocation);
        store.writeQuery({
          query: RESTAURANT_QUERY,
          variables: { restaurantId },
          data,
        });
      },
    }),
    props: ({ mutate }) => ({
      createPickupLocation: (variables) => mutate({ variables }),
    }),
  }),
  graphql(UPDATE_PICKUP_LOCATION, {
    props: ({ mutate }) => ({
      updatePickupLocation: (variables) => mutate({ variables }),
    }),
  }),
  graphql(DELETE_PICKUP_LOCATION, {
    options: ({ restaurantId }) => ({
      update: (store, { data: { deletePickupLocation: { locationId } } }) => {
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
              pickupLocations: data.getCurrUser.pickupLocations.filter(
                (o) => o.locationId !== locationId,
              ),
            },
          },
        });
      },
    }),
    props: ({ mutate }) => ({
      deletePickupLocation: (locationId) => mutate({ variables: { locationId } }),
    }),
  }),
  withApollo,
)(PickupLocations);
