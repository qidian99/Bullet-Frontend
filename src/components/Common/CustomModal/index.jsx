import React from 'react';
import { Modal, Button } from 'antd';
import DropDownSelect from './DropDownSelect';


export const Header = ({ label }) => (
  <div className="header-text sub-header">
    {label}
  </div>
);

export const FormSelection = ({
  label, options, placeholder, value, multi,
}) => (
  <div>
    <Header label={label} />
    <DropDownSelect options={options} placeholder={placeholder} value={value} multi={multi} />
  </div>
);

const CustomModal = ({
  children, isOpen, onClose, onSubmit,
}) => (
  <Modal
    title="Basic Modal"
    visible={isOpen}
    onOk={onSubmit}
    onCancel={onClose}
  >
    {children}
  </Modal>
);

export default CustomModal;
