import React from 'react'
import { Spin, Alert } from 'antd'

const HeadsLoader = props => {
  const { requestLoading, company }  = props
  return (
    <Spin spinning={requestLoading.get("getAffilatesList")}>
      <Alert
        size="small"
        message={`Запрос данных об аффилированных лицах кампании ${company}`}
        type="info"
      />
    </Spin>
  )
}

export default HeadsLoader
