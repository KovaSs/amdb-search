import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import OpenAnAccount from '../OpenAnAccount';
import SubMenuContainer from '../SubMenuContainer';
import "./app.scss"

const { Header, Content, Footer, Sider } = Layout;

class App extends Component {
  state = {
    collapsed: true,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  }

  onChangeRouteName = route => {
    this.setState({ nameRoute : route })
  }

  render() {
    const { lessons } = this.props
    const date = new Date()

    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Link to="/">
              <div className="logo" />
            </Link>
            <SubMenuContainer />
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>{" "}</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {/* <Route path='/' exact component={MainPage}/> */}
                <Route path='/open-an-account' exact render={({match}) => {
                  return <OpenAnAccount lesson={lessons}/>
                }}/>
                <Route path='/web-dev/:id' render={({match}) => {
                  const {id} = match.params;
                  const data = lessons.filter(item => item.id === id)
                  return <OpenAnAccount data={data[0]} maxLesson={lessons.length}/>
                }}/>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              <b>ГАЗПРОМБАНК</b> ©{ date.getFullYear() }
            </Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

const putStateToProps = state => {
  return {
    lessons: state.lessons.data
  }
}

export default connect(putStateToProps)(App);
