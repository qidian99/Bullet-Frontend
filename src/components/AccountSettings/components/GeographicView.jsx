import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import './GeographicView.css';

const { Option } = Select;
const nullSelectItem = {
  label: '',
  key: '',
};

class GeographicView extends Component {
  getProvinceOption() {
    const { province } = this.props;
    if (province) {
      return this.getOption(province);
    }
    return [];
  }

  getCityOption = () => {
    const { city } = this.props;
    if (city) {
      return this.getOption(city);
    }
    return [];
  };

  getOption = (list) => {
    if (!list || list.length < 1) {
      return (
        <Option key={0} value={0}>
          没有找到选项
        </Option>
      );
    }
    return list.map((item) => (
      <Option key={item.id} value={item.id}>
        {item.name}
      </Option>
    ));
  };

  conversionObject() {
    const { value } = this.props;
    if (!value) {
      return {
        province: nullSelectItem,
        city: nullSelectItem,
      };
    }
    const { province, city } = value;
    return {
      province: province || nullSelectItem,
      city: city || nullSelectItem,
    };
  }

  render() {
    const { province, city } = this.conversionObject();
    const { loading } = this.props;
    return (
      <Spin spinning={loading} wrapperClassName="row">
        <Select
          value={province}
          labelInValue
          showSearch
          onSelect={this.selectProvinceItem}
          className="item"
        >
          {this.getProvinceOption()}
        </Select>
        <Select
          value={city}
          labelInValue
          showSearch
          onSelect={this.selectCityItem}
          className="item"
        >
          {this.getCityOption()}
        </Select>
      </Spin>
    );
  }
}

const GEOGRAPHIC_QUERY = gql`
  query Geographic($province: String) {
    geographic(province: $province) {
      province
      city
    }
  }
`;

export default graphql(GEOGRAPHIC_QUERY, {
  options: ({ value }) => ({
    variables: {
      province: value ? value.province.key : null,
    },
  }),
  props: ({ data: { geographic, loading } }) => ({
    ...geographic,
    loading,
  }),
})(GeographicView);
