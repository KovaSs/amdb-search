import React, { Component } from 'react'
import idGenerator from 'react-id-generator';
// import Plyr from 'react-plyr';
// import PlyrComponent from '../../PlyrComponent';
import ReactPlayer from 'react-player'
import { Row, Col } from 'antd';
import './page-video.scss';
import 'plyr/dist/plyr.css';

class PageVideo extends Component {
  state = {
    videoUrl : '',
    videoProvider : '',
    // videoId: '',
  }

  updateVideoUrl = () => {
    const {mainVideo : {url, provider}} = this.props
    this.setState(({videoUrl, videoProvider}) => {
      // const id = url.match(/\w+:\/\/\w+.\w+.\w+\/\w+\/(\w+)/)
      return {
        // videoId: id[1],
        videoUrl : url,
        videoProvider : provider
      }
    })
  }

  componentWillMount() {
    this.updateVideoUrl()
  }

  componentWillReceiveProps(nextProps) {
    const {url, provider} = nextProps.mainVideo
    if(url !== this.state.videoUrl) {
      this.setState(({videoUrl, videoProvider, videoId}) => {
        // const id = url.match(/\w+:\/\/\w+.\w+.\w+\/\w+\/(\w+)/)
        return {
          // videoId: id[1],
          videoUrl : url,
          videoProvider : provider
        }
      })
    }
  }

  render() {
    const { mainVideo : { title, moments}} = this.props
    /** Plyr */
    // const {videoId, videoProvider } = this.state;
    /** PlyrComponent */
    // const {videoUrl, videoProvider } = this.state;
    /** ReactPlayer */
    const {videoUrl } = this.state;

    const addVideoMoments = moments.map(item => {
      const { title, time } = item
      return (
        <li 
          className="lesson-content__moment"
          key = {`${idGenerator('moment-')}`}
        >
          {title} <span>{time}</span>
        </li>
      )
    })

    return (
      <div className="lesson-content">
        <Row>
          <div className="lesson-content__video_title">
            <h2>{ title }</h2>
          </div>
          <Col span={12}>
            <div className="lesson-content__video">
              <ReactPlayer 
                url={videoUrl} 
                controls
                style={{margin: '0 auto'}}
                config={{
                  youtube: {
                    playerVars: { showinfo: 0 }
                  },
                }}
              />
              {/* <PlyrComponent videoProvider={videoProvider} videoUrl={videoUrl} /> */}
              {/* <Plyr type={videoProvider} videoId={videoId} /> */}
            </div>
          </Col>
          <Col span={12}>
            <div className="lesson-content__moments">
              <ul>
                { addVideoMoments }
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PageVideo