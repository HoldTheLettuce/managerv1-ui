import React from 'react';

import { Layout, Menu } from 'antd';

import { Route, Switch, Link } from 'react-router-dom';

import analysis from '../../pages/Analysis/analysis';
import launcher from '../../pages/Launcher/launcher';
import connections from '../../pages/Connections/connections';
import accounts from '../../pages/Accounts/accounts';
import proxies from '../../pages/Proxies/proxies';

const { Header, Content, Footer } = Layout;

export default class MainLayout extends React.Component {
    render() {
        return (
            <Layout className="layout" style={{ minHeight: '100vh' }}>
                <Header>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
                        <Menu.Item key="1">
                            <Link to="/" />
                            Analysis
                        </Menu.Item>

                        <Menu.Item key="2">
                            <Link to="/launcher" />
                            Launcher
                        </Menu.Item>

                        <Menu.Item key="3">
                            <Link to="/connections" />
                            Connections
                        </Menu.Item>

                        <Menu.Item key="4">
                            <Link to="/accounts" />
                            Accounts
                        </Menu.Item>

                        <Menu.Item key="5">
                            <Link to="/proxies" />
                            Proxies
                        </Menu.Item>
                    </Menu>
                </Header>

                <Content style={{ padding: '0 20px', marginTop: '2em' }}>
                    <Switch>
                        <Route exact path="/" component={ analysis } />
                        <Route exact path="/launcher" component={ launcher } />
                        <Route exact path="/connections" component={ connections } />
                        <Route exact path="/accounts" component={ accounts } />
                        <Route exact path="/proxies" component={ proxies } />
                    </Switch>
                </Content>

                <Footer style={{ textAlign: 'center' }}>Made with ♡ by Taylor.</Footer>
            </Layout>
        );
    }
}