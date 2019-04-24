import React from 'react'
import { Collapse } from 'antd';

const CollapceItem = props => {
  console.log('props', props.store)
  const Panel = Collapse.Panel;

  /** Стандартный функционал отслеживания активный панелей */
  const callback = key => {
  }

  const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;

  return (
    <Collapse defaultActiveKey={['1', '2']} onChange={callback}>
      <Panel header="Общая информация" key="1" showArrow={false}>
        <p>{text}</p>
      </Panel>
      <Panel header="Руководство" key="2" forceRender>
        <p>{text}</p>
      </Panel>
      <Panel header="Совладельцы" key="3">
        <p>{text}</p>
      </Panel>
    </Collapse>
  )
}

export { CollapceItem }
