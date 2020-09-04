import { BellOutlined } from '@ant-design/icons';
import { Badge, Spin, Tabs } from 'antd';
import useMergeValue from 'use-merge-value';
import React from 'react';
import classNames from 'classnames';
import NoticeList from './NoticeList';
import HeaderDropdown from '../HeaderDropdown';
import './index.css';

const { TabPane } = Tabs;

const NoticeIcon = (props) => {
  const getNotificationBox = () => {
    const {
      children,
      loading,
      onClear,
      onTabChange,
      onItemClick,
      onViewMore,
      clearText,
      viewMoreText,
    } = props;

    if (!children) {
      return null;
    }

    const panes = [];
    React.Children.forEach(children, (child) => {
      if (!child) {
        return;
      }

      const {
        list, title, count, tabKey, showClear, showViewMore,
      } = child.props;
      const len = list && list.length ? list.length : 0;
      const msgCount = count || count === 0 ? count : len;
      const tabTitle = msgCount > 0 ? `${title} (${msgCount})` : title;
      panes.push(
        <TabPane tab={tabTitle} key={tabKey}>
          <NoticeList
            clearText={clearText}
            viewMoreText={viewMoreText}
            data={list}
            onClear={() => onClear && onClear(title, tabKey)}
            onClick={(item) => onItemClick && onItemClick(item, child.props)}
            onViewMore={(event) => onViewMore && onViewMore(child.props, event)}
            showClear={showClear}
            showViewMore={showViewMore}
            title={title}
            {...child.props}
          />
        </TabPane>,
      );
    });
    return (
      <Spin spinning={loading} delay={300}>
        <Tabs className="tabs" onChange={onTabChange}>
          {panes}
        </Tabs>
      </Spin>
    );
  };

  const {
    className, count, bell, popupVisible, onPopupVisibleChange,
  } = props;
  const [visible, setVisible] = useMergeValue(false, {
    value: popupVisible,
    onChange: onPopupVisibleChange,
  });
  const noticeButtonClass = classNames(className, 'noticeButton');
  const notificationBox = getNotificationBox();
  const NoticeBellIcon = bell || <BellOutlined className="icon" />;
  const trigger = (
    <span
      className={classNames(noticeButtonClass, {
        opened: visible,
      })}
    >
      <Badge
        count={count}
        style={{
          boxShadow: 'none',
        }}
        className="badge"
      >
        {NoticeBellIcon}
      </Badge>
    </span>
  );

  if (!notificationBox) {
    return trigger;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName="popover"
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
    >
      {trigger}
    </HeaderDropdown>
  );
};

NoticeIcon.defaultProps = {
  emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
};
NoticeIcon.Tab = NoticeList;
export default NoticeIcon;
