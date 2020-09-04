import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, Form, Input, TimePicker, AutoComplete,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

const AUTOCOMPLETE_QUERY = gql`
  query AutoComplete($input: String!) {
    autoComplete(input: $input) {
      place_id
      description
    }
  }
`;

const PLACE_DETAIL_QUERY = gql`
  query PlaceDetail($place_id: String!) {
    placeDetail(placeid: $place_id) {
      geometry {
        location {
          lat
          lng
        }
      }
    }
  }
`;

const FIND_PLACE_QUERY = gql`
  query FindPlace($input: String!) {
    findPlace(input: $input, inputtype: "textquery") {
      geometry {
        location {
          lat
          lng
        }
      }
    }
  }
`;

const PickupLocationCreateForm = ({
  visible, onCancel, onCreate, location, client,
}) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeout = useRef(null);
  const locationId = useRef(null);
  const placeId = useRef('custon_address');

  useEffect(() => {
    if (location) {
      form.setFieldsValue({
        ...(_.pick(location, ['name', 'alias'])),
        startTime: moment(location.startTime, 'HH:mm:ss'),
        endTime: moment(location.endTime, 'HH:mm:ss'),
      });
      locationId.current = location.locationId;
    } else {
      form.resetFields();
      locationId.current = null;
    }
  }, [location]);

  const fetchLocations = async (value) => {
    const { data: { autoComplete } } = await client.query({
      query: AUTOCOMPLETE_QUERY,
      variables: { input: value },
    });
    setOptions([
      { place_id: 'custon_address', description: value },
      ...autoComplete,
    ]);
    timeout.current = null;
  };

  const handleChange = (value) => {
    if (error) {
      setError(null);
    }
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    const place = _.find(options, { description: value });
    if (place) {
      placeId.current = place.place_id;
    } else if (value.length) {
      setOptions([{ place_id: 'custon_address', description: value }]);
      timeout.current = setTimeout(() => {
        fetchLocations(value);
      }, 500);
    } else {
      setOptions([]);
    }
  };

  const handleCreate = async (values) => {
    setLoading(true);
    let geometry;
    if (placeId.current === 'custon_address') {
      const { data: { findPlace } } = await client.query({
        query: FIND_PLACE_QUERY,
        variables: { input: values.name },
      });
      if (!findPlace.length) {
        setError(`Cannot find place with name ${values.name}.`);
        return;
      }
      geometry = findPlace[0].geometry.location;
    } else {
      const { data: { placeDetail } } = await client.query({
        query: PLACE_DETAIL_QUERY,
        variables: { place_id: placeId.current },
      });
      geometry = placeDetail.geometry.location;
    }

    const newLocation = {
      locationId: locationId.current,
      ...(_.pick(values, ['name', 'alias'])),
      ...geometry,
      startTime: values.startTime.format('HH:mm:ss'),
      endTime: values.endTime.format('HH:mm:ss'),
    };

    await onCreate(newLocation);
    setLoading(false);
    form.resetFields();
  };

  return (
    <Modal
      getContainer={false}
      visible={visible}
      title="添加配送地点"
      okText="保存"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            handleCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="配送地址"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
          validateStatus={error ? 'error' : null}
          help={error}
        >
          <AutoComplete
            options={options.map((place) => ({ value: place.description }))}
            onChange={handleChange}
            placeholder="输入地址名称"
          />
        </Form.Item>
        <Form.Item name="alias" label="简称" extra="长地址使用简称在手机端上显示更佳">
          <Input />
        </Form.Item>
        <Form.Item label="配送时间" style={{ marginBottom: 0 }}>
          <Form.Item
            name="startTime"
            rules={[
              {
                required: true,
                message: '请选择开始配送时间！',
              },
            ]}
            style={{ display: 'inline-block' }}
          >
            <TimePicker use12Hours format="h:mm a" />
          </Form.Item>
          <span
            style={{
              display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center',
            }}
          >
            -
          </span>
          <Form.Item
            name="endTime"
            rules={[
              {
                required: true,
                message: '请选择离开时间！',
              },
            ]}
            style={{ display: 'inline-block' }}
          >
            <TimePicker use12Hours format="h:mm a" />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default withApollo(PickupLocationCreateForm);
