import React from 'react';
import { LockFilled } from '@ant-design/icons';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import './index.css';

const RoomCard = ({
  card: {
    roomId, roomName, members, roomAvatar, lastUpdated, roomPublic,
  },
}) => (
  <Link to={`/room/${roomId}`}>
    <Card.Grid className="card-container">
      <Card bodyStyle={{ padding: 0 }} bordered={false}>
        <Card.Meta
          title={(
            <div className="card-title">
              <p style={{ fontSize: 20, margin: 0, padding: 0 }}>{roomName}</p>
              {roomPublic ? null : <LockFilled style={{ fontSize: '20px', color: '#BDBDBD' }} />}
            </div>
          )}
        />
        <div className="card-image">
          <img src={roomAvatar || 'https://esportsobserver.com/wp-content/uploads/2020/04/Bilibili-Investment.jpg'} alt="room avatar" width="100%" />
        </div>
        <div className="card-text">
          <p style={{ color: '#4F4F4F' }}>{`${members} ${members > 1 ? 'people' : 'person'}`}</p>
          <p style={{ color: '#4F4F4F' }}>{lastUpdated}</p>
        </div>
      </Card>
    </Card.Grid>
  </Link>
);

export default RoomCard;
