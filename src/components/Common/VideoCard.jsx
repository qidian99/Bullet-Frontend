import React from 'react';
import { Card, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { formatTime } from '.';

import './index.css';

const BulletPreview = ({
  bulletId, username, content, createdAt, isLast,
}) => (
  <div
    key={bulletId}
    style={{ borderBottom: isLast ? 'none' : '1px solid #EBEBEB' }}
    className="bullet-container"
  >
    <div className="bullet-title">
      <p
        style={{
          padding: 0,
          margin: 0,
          fontWeight: 'bold',
          color: '#000000',
        }}
      >
        {username}
      </p>
      <p style={{ padding: 0, margin: 0, color: '#818181' }}>
        {formatTime(createdAt)}
      </p>
    </div>
    <p style={{
      padding: 0, margin: 0, color: '#000000', maxLines: 2,
    }}
    >
      {content}
    </p>
  </div>
);

const VideoCard = ({
  card: {
    videoId, videoName, bullets, videoAvatar, pathname,
  },
}) => (
  <Link to={`${pathname}/video/${videoId}`}>
    <Card.Grid className="card-container" style={{ padding: 0, height: 400 }}>
      <div className="video-card-container">
        <div className="video-card-image">
          <img
            src={
              videoAvatar
              || 'https://s3-alpha-sig.figma.com/img/eb4d/f898/7da711b9847979aad994c2a617e20879?Expires=1600041600&Signature=FdiWqswn6iVVNc9paE7xI--1FLs8B0Eff7~iyk3rYHBW1kiw0n06MPOkqmPgBs6JJYz7XiDHPKFvcCQJr26UWnPRdZfjJyoKCelGRyhgc19JEnA0SaQvBDvK~C5AKv7z5E8W0OUBBKFu9dSoULZj0I-KPH8-exyzAn40H2TdjLsUPrOm1O2gqGNXMp99sROujw66-IB80uBP82gCwuLIVkPV9owA0tLRYuoWwFYrTjJHQbCEUNhCsx6CXEe6WhHTQwh6p4YgihSH8V3DvtsZEYDlkyrjgpeTeAkPws9AWy1fpCKrsSPvgCugj-x5p5keBd84RyqKrF6tp2ig-93GXw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'
            }
            alt="video avatar"
            width="100%"
          />
        </div>
        <div className="video-card-image-overlay">
          <div className="video-title-container">
            <p className="video-title-text">{videoName}</p>
            <Avatar size={30} style={{ backgroundColor: '#7E7E7E' }}>
              {bullets.length}
            </Avatar>
          </div>
        </div>
      </div>
      {bullets.map((b, index, arr) => {
        const {
          bulletId,
          user: { username },
          createdAt,
          content,
        } = b;
        return BulletPreview({
          bulletId,
          username,
          content,
          createdAt,
          isLast: index === arr.length - 1,
        });
      })}
      <div style={{
        position: 'absolute',
        bottom: 20,
        width: 320,
        display: 'flex',
        justifyContent: 'center',
      }}
      >
        <p style={{ color: '#A2A2A2', fontSize: 11 }}>VIEW MORE</p>
      </div>
    </Card.Grid>
  </Link>
);

export default VideoCard;
