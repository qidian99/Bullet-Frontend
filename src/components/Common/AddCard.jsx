import React from 'react';
import { PlusCircleFilled } from '@ant-design/icons';
import { Card } from 'antd';
import './index.css';

const AddCard = ({ onClick, extraStyle }) => (
  <div onClick={onClick}>
    <Card.Grid className="card-empty" style={extraStyle}>
      <PlusCircleFilled style={{ fontSize: '100px', color: '#BDBDBD' }} />
    </Card.Grid>
  </div>
);

export default AddCard;
