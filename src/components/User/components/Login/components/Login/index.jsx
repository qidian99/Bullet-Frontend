import { Tabs, Form } from 'antd';
import React, { useState } from 'react';
import useMergeValue from 'use-merge-value';
import classNames from 'classnames';
import LoginContext from './LoginContext';
import LoginItem from './LoginItem';
import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';
import './index.css';

const Login = ({
  className, activeKey, onTabChange, children, from, onSubmit,
}) => {
  const [tabs, setTabs] = useState([]);
  const [active, setActive] = useState();
  const [type, setType] = useMergeValue('', {
    value: activeKey,
    onChange: onTabChange,
  });
  const TabChildren = [];
  const otherChildren = [];
  React.Children.forEach(children, (child) => {
    if (!child) {
      return;
    }

    if (child.type.typeName === 'LoginTab') {
      TabChildren.push(child);
    } else {
      otherChildren.push(child);
    }
  });
  return (
    <LoginContext.Provider
      value={{
        tabUtil: {
          addTab: (id) => {
            setTabs([...tabs, id]);
          },
          removeTab: (id) => {
            setTabs(tabs.filter((currentId) => currentId !== id));
          },
        },
        updateActive: (activeItem) => {
          if (active[type]) {
            active[type].push(activeItem);
          } else {
            active[type] = [activeItem];
          }

          setActive(active);
        },
      }}
    >
      <div className={classNames(className, 'login')}>
        <Form
          form={from}
          onFinish={(values) => {
            if (onSubmit) {
              onSubmit(values);
            }
          }}
        >
          {tabs.length ? (
            <>
              <Tabs
                animated={false}
                className="tabs"
                activeKey={type}
                onChange={(key) => {
                  setType(key);
                }}
              >
                {TabChildren}
              </Tabs>
              {otherChildren}
            </>
          ) : (
            children
          )}
        </Form>
      </div>
    </LoginContext.Provider>
  );
};

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Login.UserName = LoginItem.UserName;
Login.Password = LoginItem.Password;
Login.Mobile = LoginItem.Mobile;
Login.Captcha = LoginItem.Captcha;
export default Login;
