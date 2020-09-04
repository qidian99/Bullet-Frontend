import React, { useEffect, useState, useRef } from 'react';
import {
  Button, Modal, Form, Input, Upload, InputNumber, Row, Col, Divider,
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import './MenuCreateForm.css';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 14, offset: 6 },
};

const normFile = (e) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const MenuCreateForm = ({
  visible, onCreate, onCancel, userId, menuItem,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const itemId = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (menuItem) {
      form.setFieldsValue(menuItem);
      itemId.current = menuItem.itemId;
      setImageUrl(menuItem.imageUrl);
    } else {
      itemId.current = null;
      form.resetFields();
    }
  }, [menuItem]);

  const handleChange = (info) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      setUploading(true);
    }
    if (info.file.status === 'done') {
      setUploading(false);
      setImageUrl(info.file.response);
    }
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Modal
      getContainer={false}
      visible={visible}
      title="添加菜式"
      okText="保存"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            setLoading(true);
            await onCreate({ ...values, itemId: itemId.current, imageUrl });
            setLoading(false);
            setImageUrl(null);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        initialValues={{
          courses: [],
        }}
      >
        <Form.Item
          name="name"
          label="商品名称"
          rules={[
            {
              required: true,
              message: '请输入菜名！',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="价格"
          rules={[
            {
              required: true,
              message: '请输入商品价格！',
            },
          ]}
        >
          <InputNumber
            placeholder="商品单价"
            min={0}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: '60%' }}
          />
        </Form.Item>
        <Form.Item
          name="imageUrl"
          label="上传图片"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`https://tritonbyte-server.herokuapp.com/image/upload/:${userId}`}
            onChange={handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
          {/* <Upload
            action={`https://tritonbyte-server.herokuapp.com/image/upload/:${userId}`}
            listType="picture"
          >
            <Button>
              <UploadOutlined />
              &nbsp;点击上传
            </Button>
          </Upload> */}
        </Form.Item>
        <Form.List name="courses">
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? '配菜' : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入配菜名称！',
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="配菜名称" style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 0 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined />
                  &nbsp;添加配菜
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Divider />
        <Form.List name="selectables">
          {(fields, { add: addCombo, remove: removeCombo }) => (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  required={false}
                  key={field.key}
                  noStyle
                >
                  <Form.Item
                    {...formItemLayout}
                    label={`可选组合${index + 1}`}
                  >
                    <Form.Item name={[field.name, 'maxSelectable']} noStyle>
                      <InputNumber placeholder="最多可选数量" min={1} style={{ width: '60%' }} />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        removeCombo(field.name);
                      }}
                    />
                  </Form.Item>
                  <Form.List name={[field.name, 'courses']} required={false}>
                    {(subfields, { add: addSelectable, remove: removeSelectable }) => (
                      <div>
                        {subfields.map((subfield) => (
                          <Form.Item
                            wrapperCol={{ span: 18, offset: 6 }}
                            required={false}
                            key={subfield.key}
                          >
                            <Row gutter={8}>
                              <Col>
                                <Form.Item
                                  name={[subfield.name, 'name']}
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      whitespace: true,
                                      message: '请输入配菜名称！',
                                    },
                                  ]}
                                  noStyle
                                >
                                  <Input placeholder="配菜名称" />
                                </Form.Item>
                              </Col>
                              <Col>
                                <Form.Item
                                  name={[subfield.name, 'quantity']}
                                  validateTrigger={['onChange', 'onBlur']}
                                  rules={[
                                    {
                                      required: true,
                                      message: '请输入可选数量！',
                                    },
                                  ]}
                                  noStyle
                                >
                                  <InputNumber placeholder="可选数量" min={1} />
                                </Form.Item>
                              </Col>
                              <Col flex="none">
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  style={{ margin: '0 8px' }}
                                  onClick={() => {
                                    removeSelectable(subfield.name);
                                  }}
                                />
                              </Col>
                            </Row>
                          </Form.Item>
                        ))}
                        <Form.Item {...formItemLayoutWithOutLabel}>
                          <Button
                            type="dashed"
                            onClick={() => {
                              addSelectable();
                            }}
                            style={{ width: '60%' }}
                          >
                            <PlusOutlined />
                            &nbsp;添加可选配菜
                          </Button>
                        </Form.Item>
                        <Divider />
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              ))}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button
                  type="dashed"
                  onClick={() => {
                    addCombo();
                  }}
                  style={{ width: '60%' }}
                >
                  <PlusOutlined />
                  &nbsp;添加组合
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default MenuCreateForm;
