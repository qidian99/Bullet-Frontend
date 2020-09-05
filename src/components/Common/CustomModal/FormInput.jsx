import React from 'react';
import classnames from 'classnames';
import { Header } from './index';

import './index.scss';

const FormTextInput = ({
  label, onChange, value, name, placeholder, className, containerClassName,
}) => (
  <div className={containerClassName}>
    <Header label={label} />
    <input
      className={classnames('text-input', className)}
      type="text"
      onChange={(e) => onChange(name, e.target.value)}
      value={value}
      placeholder={placeholder}
    />
  </div>
);

export default FormTextInput;
