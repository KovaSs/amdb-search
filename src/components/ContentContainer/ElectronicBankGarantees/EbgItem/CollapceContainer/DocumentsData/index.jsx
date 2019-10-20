import React, { Component } from 'react'
import { Collapse, Icon, Spin, Empty } from 'antd'
import { Pdf } from './Icons/Icons'
import DocumentDrawer from '../../DrawerContainer/DocumentDrawer'

const styleCss = {
  autoScroll : {
    maxHeight: 102,
    minWidth: 300,
    overflowY: "auto",
    overflowX: "hidden"
  },
  container: {
    padding: "0 20px"
  },
  iconStyle: {
    fill: "rgb(123, 123, 123)",
    marginRight: 15,
    cursor: "pointer",
    height: "40px"
  }
}

class DocumentsData extends Component {
  state = {
    toggleDrawer: false,
    docSelected: ""
  }

  /* Отображение Drawer с данными из Croinform */
  showDrawer = e => {
    e.stopPropagation();
    this.setState({
      toggleDrawer: new Date()
    });
  };

  render() {
    const { Panel } = Collapse;
    const { documents = [], onAction, loading =false} = this.props
    const { toggleDrawer, docSelected } = this.state
  
    const downloadDoc = doc => {
      if(!doc.blob) onAction.getDocument(doc)
      this.setState({
        toggleDrawer: new Date(),
        docSelected: doc
      })
    }
  
    const renderDocs = documents.map(doc => <Pdf className="logo-img" onAction={() => downloadDoc(doc)} key={doc.xhdoc} style={styleCss.iconStyle} title={doc.filename}/> )
  
    return (
      <Collapse 
        defaultActiveKey={['1']} //Раскоментировать при реализации стоп-листов
        expandIcon={({isActive}) => <Icon type={ !isActive ? "plus-square" : "minus-square"} />}
        style={{marginTop: "5px"}}
      >
        <Panel header="Документы" key="1" showArrow={false}>
          <Spin spinning={loading.get("getDocuments")} tip="Поиск прикрепленных документов">
            <div style={styleCss.container}>
              { documents.length ?
                renderDocs : 
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data-documents" description={ <span > Документы отстутствуют </span> } />
              }
            </div>
          </Spin>
        </Panel>
        <DocumentDrawer
          loading={loading}
          document={docSelected}
          toggleDrawer={toggleDrawer} 
        />
      </Collapse> 
    )
  }
}

export default DocumentsData
