import React from 'react';
import { PlusCircleFilled } from '@ant-design/icons';
import { Card } from 'antd';
import './RoomCard.css';

const RoomCard = ({
  card: {
    roomName, members, roomAvatar, lastUpdated,
  },
}) => {
  if (!roomName) {
    return (
      <Card.Grid className="card-empty">
        <PlusCircleFilled style={{ fontSize: '100px', color: '#BDBDBD' }} />
      </Card.Grid>
    );
  }

  return (
    <Card.Grid
      className="card-container"
    >
      <Card bodyStyle={{ padding: 0 }} bordered={false}>
        <Card.Meta
          title={(
            <div className="card-title">
              <p style={{ fontSize: 20 }}>{roomName}</p>
            </div>
          )}
        />
        <div className="card-image">
          <img src={roomAvatar} alt="room avatar" width="100%" />
        </div>
        <div className="card-text">
          <p style={{ color: '#4F4F4F' }}>{`${members} ${members > 1 ? 'people' : 'person'}`}</p>
          <p style={{ color: '#4F4F4F' }}>{lastUpdated}</p>
        </div>
      </Card>
    </Card.Grid>
  );
};

export default RoomCard;
