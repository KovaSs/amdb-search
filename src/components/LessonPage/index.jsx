import React, { Component } from 'react'
import { Row, Col } from 'antd';
import { withRouter } from 'react-router-dom';
import HeaderPage from './HeaderPage';
import PageVideo from './PageVideo';
import AdditionaLinks from './AdditionaLinks';
import "./lessonPage.scss"

class LessonPage extends Component {
  render() {
    const { data, maxLesson } = this.props
    const { mainVideo, additionaLinks } = this.props.data.content
    console.log(`Page-data ->`, data, this.props)
    return (
      <Row className="lesson-page">
        <Col span={20} offset={2} >
          <HeaderPage data={data} maxLesson={maxLesson}/>
          <PageVideo mainVideo={mainVideo}/>
          <AdditionaLinks additionaLinks={additionaLinks}/>
        </Col>
      </Row>
    )
  }
}

export default withRouter(LessonPage)
