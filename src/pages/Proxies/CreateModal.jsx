import React from 'react';

import { Modal, Form, Input, Checkbox } from 'antd';

export default Form.create({ name: 'create_proxy' })(
    class extends React.Component {
      render() {
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;

        return (
          <Modal
            visible={visible}
            title="Add Proxy"
            okText="Create"
            onCancel={onCancel}
            onOk={onCreate}
            style={{ top: 20 }}
          >
            <Form layout="vertical">
              <Form.Item label="Host">
                {getFieldDecorator('host', {
                  rules: [{ required: true, message: 'Please input the host!' }],
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Port">
                {getFieldDecorator('port', {
                  rules: [{ required: true, message: 'Please input the port!' }],
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Username">
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please input the username!' }],
                  initialValue: 'none'
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input the password!' }],
                  initialValue: 'none'
                })(<Input />)}
              </Form.Item>

              <Form.Item>
                {getFieldDecorator('auth', {
                    valuePropName: 'checked',
                    initialValue: false
                })(<Checkbox>Authentication</Checkbox>)}
                </Form.Item>
            </Form>
          </Modal>
        );
      }
    },
);