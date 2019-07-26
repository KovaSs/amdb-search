import React from 'react'
import { Spin, Alert } from 'antd'

const HeadsLoader = props => {
  const { company, loading } = props
  return (
    <Spin spinning={loading}>
      <Alert
      size="small"
      message={`Запрос данных об аффилированных лицах кампании ${company}`}
      type="info"
      />
    </Spin>
  )
}
export default HeadsLoader
