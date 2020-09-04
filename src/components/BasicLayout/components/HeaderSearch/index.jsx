import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import useMergeValue from 'use-merge-value';
import React, { useRef } from 'react';
import classNames from 'classnames';
import './index.css';

const HeaderSearch = (props) => {
  const {
    className,
    defaultValue,
    onVisibleChange,
    placeholder,
    open,
    defaultOpen,
    onChange,
    value: propsValue,
    ...restProps
  } = props;
  const inputRef = useRef(null);
  const [value, setValue] = useMergeValue(defaultValue, {
    value: propsValue,
    onChange,
  });
  const [searchMode, setSearchMode] = useMergeValue(defaultOpen || false, {
    value: open,
    onChange: onVisibleChange,
  });
  const inputClass = classNames('input', {
    show: searchMode,
  });
  return (
    <div
      className={classNames(className, 'headerSearch')}
      onClick={() => {
        setSearchMode(true);

        if (searchMode && inputRef.current) {
          inputRef.current.focus();
        }
      }}
      onTransitionEnd={({ propertyName }) => {
        if (propertyName === 'width' && !searchMode) {
          if (onVisibleChange) {
            onVisibleChange(searchMode);
          }
        }
      }}
    >
      <SearchOutlined
        key="Icon"
        style={{
          cursor: 'pointer',
        }}
      />
      <AutoComplete
        key="AutoComplete"
        className={inputClass}
        value={value}
        style={{
          height: 28,
          marginTop: -6,
        }}
        options={restProps.options}
        onChange={setValue}
      >
        <Input
          ref={inputRef}
          defaultValue={defaultValue}
          aria-label={placeholder}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (restProps.onSearch) {
                restProps.onSearch(value);
              }
            }
          }}
          onBlur={() => {
            setSearchMode(false);
          }}
        />
      </AutoComplete>
    </div>
  );
};

export default HeaderSearch;
