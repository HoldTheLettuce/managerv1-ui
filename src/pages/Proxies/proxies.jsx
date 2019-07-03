import React from 'react';

import { Row, Col, Card, Button, Table, Popconfirm, Tag, message } from 'antd';

import CreateModal from './CreateModal';

const axios = require('axios');

export default class Proxies extends React.Component {
    state = {
        proxies: [],
        pagination: {},
        loading: false,
        visible: false
    }

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const form = this.formRef.props.form;

        form.validateFields((err, values) => {
          if(err) {
            return;
          }

          form.resetFields();

          axios.post('/api/proxies', values).then(res => {
            if(res.status === 200) {
                message.success('Added Proxy');

                let newProxies = [...this.state.proxies];

                res.data.auth = res.data.auth.toString();

                newProxies.push(res.data);

                this.setState({
                    proxies: newProxies
                });
            } else {
                message.error('Failed to add proxy. Status Code: ' + res.status);
            }
          });

          this.setState({ visible: false });
        });
    };

    componentDidMount() {
        this.fetch({ current: 0 });
    }

    handleTableChange = (pagination, filters, sorter) => {
        console.log('onTableChange:')
        console.log(pagination);
        const pager = { ...this.state.pagination };

        pager.current = pagination.current;

        this.setState({
            pagination: pager
        });

        this.fetch();
    }

    fetch = () => {
        console.log(this.state.pagination)

        this.setState({
            loading: true
        });

        axios.get('/api/proxies/stats').then(statsRes => {
            let url = `/api/proxies?skip=${ (this.state.pagination.current - 1) * 10 }&limit=10`;

            console.log(url);

            axios.get(url).then(proxiesRes => {
                let pag = { ...this.state.pagination };

                pag.total = statsRes.data.totalCount;

                proxiesRes.data.forEach(proxy => {
                    proxy.key = proxy._id;
                    proxy.auth = proxy.auth.toString();
                });

                this.setState({
                    loading: false,
                    proxies: proxiesRes.data,
                    pagination: pag
                })
            });
        });
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    handleAccountDelete = (record) => {
        console.log(record);

        axios.delete('/api/proxies/' + record._id).then(res => {
            message.success('Deleted proxy.');

            for(let i = 0; i < this.state.proxies.length; i++) {
                if(this.state.proxies[i]._id === record._id) {
                    let newProxies = [...this.state.proxies];

                    newProxies.splice(i, 1);

                    this.setState({
                        proxies: newProxies
                    });
                }
            }
        }).catch(err => {
            message.error('Failed to delete proxy.');
        });
    }

    render() {
        const columns = [
            {
                title: 'Host',
                dataIndex: 'host',
                key: 'host'
            },
            {
                title: 'State',
                dataIndex: 'state',
                render: (text, record) => {
                    if(record.inUse === true) {
                        return (
                            <Tag color="red">Occupied</Tag>
                        );
                    } else {
                        return (
                            <Tag color="blue">Available</Tag>
                        );
                    }
                }
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                  <span>
                      <Popconfirm title="Are you sure?" onConfirm={ () => { this.handleAccountDelete(record) } }><Button type="link">Delete</Button></Popconfirm>
                  </span>
                )
            }
        ];

        return (
            <div>
                <Row gutter={16}>
                    <Col xs={24}>
                        <Card bordered={ false }>
                            <Button type="primary" style={{ marginRight: '15px', marginBottom: '15px' }} onClick={ () => { this.fetch() } }>Refresh</Button>
                            <Button type="success" onClick={ this.showModal }>Add Proxy</Button>

                            <Table size="middle" columns={ columns } dataSource={ this.state.proxies } pagination={ this.state.pagination } loading={ this.state.loading } onChange={ this.handleTableChange } expandedRowRender={ record => (
                                <ul>
                                    <li><strong>ID:</strong> { record._id }</li>
                                    <li><strong>Port:</strong> { record.port }</li>
                                    <li><strong>Authentication:</strong> { record.auth }</li>
                                    <li><strong>Username:</strong> { record.username }</li>
                                    <li><strong>Password:</strong> { record.password }</li>
                                    <li><strong>Registered At:</strong> { record.createdAt }</li>
                                </ul>
                            ) } bordered />
                        </Card>
                    </Col>
                </Row>

                <CreateModal
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}