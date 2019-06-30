import React from 'react';

import { Row, Col, Card, Button, Table, Popconfirm, Tag, message } from 'antd';

import CreateModal from './CreateModal';

const axios = require('axios');

export default class Accounts extends React.Component {
    state = {
        accounts: [],
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

          axios.post('http://localhost:3001/api/accounts', values).then(res => {
            if(res.status === 200) {
                message.success('Added Account');

                let newAccounts = [...this.state.accounts];

                res.data.membership = res.data.isMember.toString();

                newAccounts.push(res.data);

                this.setState({
                    accounts: newAccounts
                });
            } else {
                message.error('Failed to add account. Status Code: ' + res.status);
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

        axios.get('http://localhost:3001/api/accounts/stats').then(statsRes => {
            let url = `http://localhost:3001/api/accounts?skip=${ (this.state.pagination.current - 1) * 10 }&limit=10`;

            console.log(url);

            axios.get(url).then(accountsRes => {
                let pag = { ...this.state.pagination };

                pag.total = statsRes.data.totalCount;

                accountsRes.data.forEach(account => {
                    account.key = account._id;
                    account.isMember = account.isMember.toString();
                });

                this.setState({
                    loading: false,
                    accounts: accountsRes.data,
                    pagination: pag
                });
            });
        });
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    handleAccountDelete = (record) => {
        console.log(record);

        axios.delete('http://localhost:3001/api/accounts/' + record._id).then(res => {
            message.success('Deleted account.');

            for(let i = 0; i < this.state.accounts.length; i++) {
                if(this.state.accounts[i]._id === record._id) {
                    let newAccounts = [...this.state.accounts];

                    newAccounts.splice(i, 1);

                    this.setState({
                        accounts: newAccounts
                    });
                }
            }
        }).catch(err => {
            message.error('Failed to delete account.');
        });
    }

    render() {
        const columns = [
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: 'State',
                dataIndex: 'state',
                render: (text, record) => {
                    console.log(record);
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
                            <Button type="success" onClick={ this.showModal }>Add Account</Button>

                            <Table size="middle" columns={ columns } dataSource={ this.state.accounts } pagination={ this.state.pagination } loading={ this.state.loading } onChange={ this.handleTableChange } expandedRowRender={ record => (
                                <ul>
                                    <li><strong>ID:</strong> { record._id }</li>
                                    <li><strong>Username:</strong> { record.username }</li>
                                    <li><strong>Password:</strong> { record.password }</li>
                                    <li><strong>Created At:</strong> { record.createdAt }</li>
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