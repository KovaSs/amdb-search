import React from 'react'
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import "./header-page.scss"

const HeaderPage = ({data : {title, description, num}, maxLesson}) => {
  return (
    <div className="lesson-header">
      <div className="lesson-header__title"><h3>{title}</h3></div>
      <div className="lesson-header__desc">{description}</div>
      <hr/>
      <div>{num} из {maxLesson} уроков</div>
      <Row>
        <Col span={8} className="lesson-header__prev">
          { num <= 1 ? 
            null
            : 
            <Link to={`/web-dev/web-les-${num - 1}`}>
              Предыдущий урок
            </Link>
          }
        </Col>
        <Col span={8} offset={8} className="lesson-header__next">
          { num !== maxLesson ? 
            <Link to={`/web-dev/web-les-${num + 1}`}>
              Следующий урок
            </Link>
            :
            null
          }
        </Col>
      </Row>
    </div>
  )
}

export default HeaderPage