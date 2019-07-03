import React from 'react';

import { Row, Col, Card, Form, Input, InputNumber, Checkbox, Button, message } from 'antd';

const axios = require('axios');

class Launcher extends React.Component {
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if(!err) {
              console.log('Received values of form: ', values);

                axios.post('/api/launching', values).then(res => {
                    message.success('Launched.');
                }).catch(err => {
                    console.log(err);
                    message.error('Failed.');
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row gutter={16}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={ false }>
                            <Form onSubmit={ this.handleSubmit }>
                                <Form.Item label="Amount">
                                    {getFieldDecorator('amount', {
                                        rules: [{ required: true, message: 'Please input the amount!' }],
                                    })(
                                        <InputNumber
                                            placeholder="Amount"
                                            style={{ minWidth: '100%' }}
                                        />,
                                    )}
                                </Form.Item>

                                <Form.Item label="Stop In * Minutes">
                                    {getFieldDecorator('stopIn', {
                                        rules: [{ required: true, message: 'Please input the stop amount!' }]
                                    })(
                                        <InputNumber
                                            placeholder="Stop In x Minutes (0 for never)"
                                            style={{ minWidth: '100%' }}
                                        />,
                                    )}
                                </Form.Item>

                                <Form.Item label="Target">
                                    {getFieldDecorator('target', {
                                        rules: [{ required: true, message: 'Please input the target!' }],
                                    })(
                                        <Input
                                            placeholder="Target"
                                        />,
                                    )}
                                </Form.Item>

                                <Form.Item label="World">
                                    {getFieldDecorator('world', {
                                        rules: [{ required: true, message: 'Please input the world!' }],
                                    })(
                                        <Input
                                            placeholder="World (301, 360, F2P, P2P, etc...)"
                                        />,
                                    )}
                                </Form.Item>

                                <Form.Item>
                                    {getFieldDecorator('useProxies', {
                                        valuePropName: 'checked',
                                        initialValue: false,
                                    })(<Checkbox>Proxies</Checkbox>)}
                                </Form.Item>

                                <Form.Item>
                                    <Button type="danger" htmlType="submit" block>Launch</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Form.create({ name: 'launcher_form' })(Launcher);