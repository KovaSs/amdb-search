import React from 'react'
import idGenerator from 'react-id-generator';
import { Row, Col } from 'antd';
import './additional-links.scss';

const AdditionaLinks = ({additionaLinks}) => {
  const addAdditionaLinks = additionaLinks.map(item => {
    console.log(`link ->`, item)
    const { title, links } = item;
    const addLinks = links.map(link => {
      return (
        <a 
          href={link} 
          rel="noopener noreferrer"
          target="_blank"
          key = {`${idGenerator('link-')}`}
        > 
          {' КЛИК'}
        </a>
      )
    })
    return (
      <li 
        className="lesson-content__additional-link"
        key = {`${idGenerator('title-link-')}`}
      >
        {title} {addLinks}
      </li>
    )
  })
  return (
    <Row>
      <Col>
        <div>
          <ul>
            {addAdditionaLinks}
          </ul>
        </div>
      </Col>
    </Row>
  )
}

export default AdditionaLinks