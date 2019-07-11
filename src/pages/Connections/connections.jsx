import React from 'react';

import { Row, Col, Card, Button, Table, Icon, Tag, message } from 'antd';

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

        axios.get('api/bots').then(res => {
            this.setState({
                bots: res.data,
                loading: false
            });

            console.log(this.state.bots)
        });
    }

    componentDidMount() {
        this.fetch();

        this.interval = setInterval(() => {
            this.fetch();
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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

                axios.put('/api/bots', {
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

    sendCommand = (trigger, content) => {
        axios.put('/api/bots', {
            ids: this.state.selectedRowKeys,
            command: {
                trigger,
                content
            }
        }).then(res => {
            message.success('Command sent.');
        }).catch(err => {
            console.log(err);
            message.error('Failed.');
        });
    }

    millisToMinutesAndSeconds = (millis) => {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    render() {
        const columns = [
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Target',
                dataIndex: 'customData.target',
                key: 'customData.target'
            },
            {
                title: 'Duration Min',
                dataIndex: 'customData.durationMinutes',
                key: 'customData.durationMinutes'
            },
            {
                title: 'Duration Left',
                dataIndex: 'customData.durationLeft',
                key: 'customData.durationLeft',
                render: (text, record) => (
                    <span>{ this.millisToMinutesAndSeconds(record.customData.durationLeft) }</span>
                )
            },
            {
                title: 'Logged In',
                dataIndex: 'isLoggedIn',
                key: 'isLoggedIn',
                render: (text, record) => (
                    <span>{ record.isLoggedIn.toString() }</span>
                )
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

        return (
            <div>
                <Row gutter={16}>
                    <Card bordered={ false }>
                        <Col xs={24}>
                            <Button color="default" className="control-button" onClick={ this.fetch }><Icon type="sync" /> Refresh</Button>
                            <Button color="default" disabled={ !hasSelected } className="control-button" onClick={ () => { this.sendCommand('CLOSE', {}) } }><Icon type="close" /> Close Client</Button>
                            <Button color="default" disabled={ !hasSelected } className="control-button" onClick={ () => { this.sendCommand('STOP', {}) } }><Icon type="stop" /> Stop & Logout</Button>
                            <Button color="default" disabled={ !hasSelected } className="control-button" onClick={ () => {
                                let target = prompt("What's the target's username?");
                                let minutes = prompt("How many minutes should it run for?");

                                if(target != null && minutes != null && target !== "") {
                                    this.sendCommand('CHANGE_TARGET', { target, minutes });
                                }
                            } } style={{ marginBottom: '15px' }}><Icon type="swap" /> Change Target</Button>

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

export default Connections;