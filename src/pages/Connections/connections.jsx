import React from 'react';

import { Row, Col, Card, Button, Table, Form, Input, Tag, message } from 'antd';

const axios = require('axios');

class Connections extends React.Component {
    state = {
        bots: [],
        selectedRowKeys: [],
        loading: false
    }

    fetch = () => {
        this.setState({
            loading: true
        });

        axios.get('http://localhost:3001/api/bots').then(res => {
            this.setState({
                bots: res.data,
                loading: false
            });

            console.log(this.state.bots)
        });
    }

    componentDidMount() {
        this.fetch();
    }

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if(!err) {
                console.log('Received values of form: ', values);

                console.log(this.state.selectedRowKeys);

                axios.put('http://localhost:3001/api/bots', {
                    ids: this.state.selectedRowKeys,
                    message: values.message
                }).then(res => {
                    message.success('Message sent.');
                }).catch(err => {
                    console.log(err);
                    message.error('Failed.');
                });
            }
        });
    }

    render() {
        const columns = [
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Script',
                dataIndex: 'script',
                key: 'script'
            },
            {
                title: 'State',
                dataIndex: 'state',
                key: 'state',
                render: (text, record) => (
                    <Tag color="blue">{ record.state }</Tag>
                )
            }
        ];

        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const hasSelected = selectedRowKeys.length > 0;

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row gutter={16}>
                    <Card bordered={ false }>
                        <Col xs={24} style={{ marginBottom: '2em' }}>
                            <Button type="primary" onClick={ () => { this.fetch() } }>Refresh</Button>
                        </Col>

                        <Col xs={24} lg={5}>
                            <Form onSubmit={ this.handleSubmit }>
                                <Form.Item>
                                    {getFieldDecorator('message', {
                                        rules: [{ required: true, message: 'Please input the message!' }],
                                    })(
                                        <Input
                                            placeholder="Message"
                                        />,
                                    )}
                                </Form.Item>

                                <Form.Item>
                                    <Button type="dashed" htmlType="submit" disabled={ !hasSelected } block>Send</Button>
                                </Form.Item>
                            </Form>
                        </Col>

                        <Col xs={24} lg={19}>
                            <Table size="middle" columns={ columns } dataSource={ this.state.bots } loading={ this.state.loading } onChange={ this.handleTableChange } rowSelection={ rowSelection } rowKey="id" expandedRowRender={ record => (
                                <ul>
                                    <li><strong>Metadata:</strong> <pre>{ JSON.stringify(record, null, 2) }</pre></li>
                                </ul>
                            ) } bordered />
                        </Col>
                    </Card>
                </Row>
            </div>
        );
    }
}

export default Form.create({ name: 'connections_send' })(Connections);