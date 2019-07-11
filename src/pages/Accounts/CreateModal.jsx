import React from 'react';

import { Modal, Form, Input, Checkbox } from 'antd';

export default Form.create({ name: 'create_account' })(
    class extends React.Component {
      render() {
        const { visible, onCancel, onCreate, form } = this.props;
        const { getFieldDecorator } = form;

        return (
          <Modal
            visible={visible}
            title="Add Account"
            okText="Create"
            onCancel={onCancel}
            onOk={onCreate}
            style={{ top: 20 }}
          >
            <Form layout="vertical">
              <Form.Item label="Username">
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please input the username!' }]
                })(<Input />)}
              </Form.Item>

              <Form.Item label="Password">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input the password!' }]
                })(<Input />)}
              </Form.Item>

              <Form.Item>
                {getFieldDecorator('isMember', {
                    valuePropName: 'checked',
                    initialValue: false
                })(<Checkbox>Membership</Checkbox>)}
                </Form.Item>
            </Form>
          </Modal>
        );
      }
    },
);