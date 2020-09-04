import React, { PureComponent } from 'react';
import { Input } from 'antd';
import './PhoneView.css';

class PhoneView extends PureComponent {
  render() {
    const { value, onChange } = this.props;
    let values = ['', ''];
    if (value) {
      values = value.split('-');
    }
    return (
      <>
        <Input
          className="area_code"
          value={values[0]}
          onChange={(e) => {
            if (onChange) {
              onChange(`${e.target.value}-${values[1]}`);
            }
          }}
        />
        <Input
          className="phone_number"
          onChange={(e) => {
            if (onChange) {
              onChange(`${values[0]}-${e.target.value}`);
            }
          }}
          value={values[1]}
        />
      </>
    );
  }
}

export default PhoneView;
