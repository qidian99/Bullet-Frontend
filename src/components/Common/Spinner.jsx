import React from 'react';
import 'antd/dist/antd.css';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './index.css';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default () => (
  <div style={{ position: 'relative' }}>
    <Spin indicator={antIcon} className="spinner" />
  </div>
);
