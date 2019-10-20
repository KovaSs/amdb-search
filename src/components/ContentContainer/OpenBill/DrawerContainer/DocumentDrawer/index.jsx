import React from 'react';
import { Drawer, PageHeader, Empty, Spin } from "antd";
import toggleDrawer from '../index'

const styleCss = {
  emtyContainer: {
    height: `${window.innerHeight*0.9}px`,
    border: "1px solid #d9d9d9"
  },
  emty : {
    marginTop: `${window.innerHeight*0.4}px`
  }
}

const DocumentDrawer = props => {
  const {onClose, visible, document, document: {filename = ""}, loading } = props
  const blobSrc = document && document.blob ? document.blob : null

  return (
    <Drawer
      width={"50%"}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      className="drawer-history"
    >
      <PageHeader
        title={filename}
      >
        { document && document.blob ?
          <iframe src={blobSrc} frameBorder="0" title="identify-data" width="100%" height={`${window.innerHeight*0.9}px`}/> : 
          <Spin spinning={loading.getIn(["getDocumentItem", document.xhdoc])} size="large" tip="Загрузка содержимого документа" >
            <div style={styleCss.emtyContainer}>
              <Empty style={styleCss.emty} image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data-documents" description={ <span > {filename} </span> } />
            </div>
          </Spin>
        }
      </PageHeader>
    </Drawer>
  );
}

export default toggleDrawer(DocumentDrawer)