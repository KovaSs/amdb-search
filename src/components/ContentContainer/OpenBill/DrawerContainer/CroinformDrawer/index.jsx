import React from 'react';
import { 
  Drawer, 
  Spin, 
  Descriptions, 
  Tabs, 
  Collapse, 
  Empty, 
  PageHeader, 
  Button, 
  message 
} from "antd";
import { 
  uuid,
  getDownloadTime
} from '../../../../../services/utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import RiskFactorsDigets from './RiskFactorsDigets'
import toggleDrawer from '../index'

/** Инлайновые стили */
const styleCss = {
  stopList: {
    title: {
      color: "red",
      fontWeight: 500
    },
    rowTitle: {
      fontWeight: 600
    },
    text: {
      color: "red"
    },
    rowKey: {
      fontWeight: 600,
      marginTop: 5
    }
  },
  internetBtn : {
    color: "#0e75fdfd",
    marginRight: ".5rem",
    zIndex: 10
  },
  autoScroll : {
    maxHeight: 250,
    overflowY: "auto"
  },
  clipboard : {
    display: "table",
    cursor: "pointer"
  },
  downloadFile: {
    zIndex: 10,
    marginTop: 10,
    color: "#0e75fdfd"
  }
}

const CroinformDrawer = props => {
  const {
    onClose, 
    visible,
    croinformRes, 
    loading, 
    user,
    stopLists, 
    fsspInfo,
    identifyInfo,
    fssploading, 
    userSelected,
    downloadReport
  } = props
  const { Item: DescriptionsItem } = Descriptions
  const { TabPane } = Tabs
  const { Panel } = Collapse

  const styledIdentifyRes = identifyInfo && identifyInfo.html ? identifyInfo.html : ""
  const styledCroinformHtmlRes = (croinformRes && croinformRes.html !== null) ? croinformRes.html : ""
  const croinformVectorRes = (croinformRes && croinformRes.hasOwnProperty('vector')) ? croinformRes.vector : []
  const croinformListsRes = (croinformRes && croinformRes.lists.length) ? croinformRes.lists : []

  const renderDescrList = (arr = []) => {
    const renderVector = croinformVectorRes.map((item, index) =>  <div key={index}>{item}</div> )
    const renderLists = croinformListsRes.map((item, index) =>  <div key={index}>{item}</div> )
    const renderStopLists =  stopLists && stopLists.map((item, index) => {
      const renderRowsItem = (list, i, arr = []) => {
        arr.push(<div key={uuid()} style={styleCss.stopList.rowKey}>{`Запись №${i+1}: `}</div>)
        for (const key in list) {
          arr.push(
            <div key={uuid()} >
              <label>{`${key} : `}</label>
              <label style={{color: "red"}}>{list[key]}</label>
            </div>
          )
        }
        return arr
      }
      return (
        <div key={index} >
          <label style={styleCss.stopList.rowTitle}> {`${item.report_name ? item.report_name : ""} ${item.ID_base ? `( ${item.ID_base} ${item.ID_table ? `/ ${item.ID_table} ` : ""})` : ""}`}</label>
          { item.rows.map((list, i) =>
            <div key={i}>
              { renderRowsItem(list, i) }
            </div>
            )
          }
        </div>
      )
    })
    if (croinformRes && croinformRes.vector.length) {
      arr.push(
        <DescriptionsItem key="vector" label="Вектор заемщика" span={1} >
          <div style={styleCss.autoScroll}> { renderVector } </div>
        </DescriptionsItem>
      )
    } 
    if(croinformRes && croinformRes.lists.length) {
      arr.push(
        <DescriptionsItem key="lists" label="Списки" span={1} >
          <div style={styleCss.autoScroll}> { renderLists } </div>
        </DescriptionsItem>
      )
    }
    if(stopLists && stopLists.length) {
      arr.push(
        <DescriptionsItem key="lists" label="Стоп-листы" span={1} >
          <div style={styleCss.autoScroll}> { renderStopLists } </div>
        </DescriptionsItem>
      )
    } else {
      arr.push(
        <DescriptionsItem key="lists" label="Стоп-листы" span={1} >
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span> Упонинаний в списках стоп-листов не найдено </span> } /> 
        </DescriptionsItem>
      )
    }
    return arr
  }

  const renderDtSearch = () => {
    const searchText = {
      text1: `${userSelected.SurName} w/5 ${userSelected.FirstName} w/5 ${userSelected.MiddleName}`,
      text2: `${userSelected.SurName} w/5 ${userSelected.FirstName} w/5 ${userSelected.MiddleName} w/25 ${userSelected.birthday ? userSelected.birthday.split(".")[2] : ''}`,
      text3: `${userSelected.SurName} w/25 ${userSelected.birthday ? userSelected.birthday.split(".")[2] : ''} w/55 ${userSelected.StreetExp}`,
      text4: `${userSelected.SurName} w/55 ${userSelected.StreetExp}`,
      text5: `${userSelected.CityExp} w/5 ${userSelected.StreetExp} w/5 ${userSelected.HouseExp} w/5 ${userSelected.FlatExp}`,
    }
    return (
      <DescriptionsItem className="searching-copy-title" key="search-copy-text" label="Поисковые запросы в DtSearch">
        {[
          <CopyToClipboard key="search-word-1" title="Скопировать" style={styleCss.clipboard} text={searchText.text1} onCopy={() => message.success(`${searchText.text1} - скопировано!`)}>
            <span className="searching-copy-text"> {searchText.text1} </span>
          </CopyToClipboard>,
          <CopyToClipboard key="search-word-2" title="Скопировать" style={styleCss.clipboard} text={searchText.text2} onCopy={() => message.success(`${searchText.text2} - скопировано!`)}>
            <span className="searching-copy-text"> {searchText.text2} </span>
          </CopyToClipboard>,
          <CopyToClipboard key="search-word-3" title="Скопировать" style={styleCss.clipboard} text={searchText.text3} onCopy={() => message.success(`${searchText.text3} - скопировано!`)}>
            <span className="searching-copy-text"> {searchText.text3} </span>
          </CopyToClipboard>,
          <CopyToClipboard key="search-word-4" title="Скопировать" style={styleCss.clipboard} text={searchText.text4} onCopy={() => message.success(`${searchText.text4} - скопировано!`)}>
            <span className="searching-copy-text"> {searchText.text4} </span>
          </CopyToClipboard>,
          <CopyToClipboard key="search-word-5" title="Скопировать" style={styleCss.clipboard} text={searchText.text5} onCopy={() => message.success(`${searchText.text5} - скопировано!`)}>
            <span className="searching-copy-text"> {searchText.text5} </span>
          </CopyToClipboard>
        ]}
      </DescriptionsItem>
    )
  }

  const renderList = () => {
    return (
      <TabPane tab="Списки" key="1">
        <Collapse 
          defaultActiveKey={['1', '2', '3', '4']} 
        >
          <Panel header="Списки" key="1" showArrow={false}>
            <Spin spinning={loading} tip="Идет поиск данных по измененному запросу">
              <Descriptions
                key="vector-descr"
                size="small"
                bordered
                border
                column={{ md: 1, sm: 1, xs: 1 }}
              >
                { renderDescrList() }
              </Descriptions>
            </Spin>
          </Panel>
          <Panel header="Ключевые слова для ручного поиска" key="2" showArrow={false}>
            <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
              <Descriptions
                key="DtSearch"
                size="small"
                bordered
                border
                column={{ md: 2, sm: 2, xs: 2 }}
              >
                { renderDtSearch() }
                <DescriptionsItem key="searh_in_internet_descr" label="Поиск в интернете" span={1} >
                  <CopyToClipboard 
                    key="search-word-1" 
                    title="Поиск негативной информации в интернетe"
                    style={{...styleCss.clipboard, color:" #40a9ff"}} 
                    text={`www.google.com/search?hl=ru&as_oq=отзывы+криминал+компромат+обыск+уголовное+мошенник+обнал+откат+взятка+жулик+нарушения+претензии+конфликт+подан-иск+преследование+расследование+разбирательство+следствие+прокуратура+МВД+ФСБ+полиция+хищение+отмывание&as_q=${user.fio}`} 
                    onCopy={() => message.success(`Поисковой запрос - скопирован!`)}
                  >
                    <Button 
                      key="searh_in_internet"
                      size="small" 
                      icon="ie"
                      style={styleCss.internetBtn}
                    >
                      Скопировать запрос
                    </Button>
                  </CopyToClipboard>
                </DescriptionsItem>
              </Descriptions>
            </Spin>
          </Panel>
          <Panel header="Данные ФССП" key="3" showArrow={false}>
            <Spin spinning={fssploading} tip="Идет поиск данных в ФССП">
              { 
                fsspInfo && fsspInfo.indexOf("По вашему запросу ничего не найдено") === -1 ?
                <iframe srcDoc={fsspInfo} frameBorder="0" title="identify-data" width="100%" height="600px"/> :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <span> По вашему запросу ничего не найдено </span> } /> 
              }
            </Spin>
          </Panel>
        </Collapse>
      </TabPane>
    )
  }

  const DownloadBtn = () => {
    return (
      <Button
          style={styleCss.downloadFile}
          icon="save"
          title={`${user.fio} ${getDownloadTime(Date.now())}`}
          onClick={ () => downloadReport({ checkType: "fl", key: user.id }) }
      >
        Cкачать результаты
      </Button>
    )
  }

  return (
    <Drawer
      width={"55%"}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      className="drawer-history"
    >
      <PageHeader 
        title="Результаты проверки"
        subTitle={`| ${user.fio}`}
        extra={ <DownloadBtn/> }
      >
        <Tabs >
          { (
              (croinformRes && croinformRes.vector.length) || 
              (croinformRes && croinformRes.lists.length) || 
              (fsspInfo && fsspInfo.length) || 
              (stopLists && stopLists.length)
            ) ? renderList() : null 
          }
          { (croinformRes && croinformRes.html) &&
            <TabPane tab="Croinform" key="2">
              { styledIdentifyRes ?
                <Tabs>
                  <TabPane tab="Croinform" key="1">
                    <Spin spinning={loading} tip="Идет поиск данных по измененному запросу">
                      <iframe srcDoc={styledCroinformHtmlRes} frameBorder="0" title="crionform-data" width="100%" height={`${window.innerHeight*0.79}px`}/>
                    </Spin>
                  </TabPane>
                  <TabPane tab="Идентификация" key="2">
                    <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
                      <iframe srcDoc={styledIdentifyRes} frameBorder="0" title="identify-data" width="100%" height={`${window.innerHeight*0.79}px`}/>
                    </Spin>
                  </TabPane>
                </Tabs> : <iframe srcDoc={styledCroinformHtmlRes} frameBorder="0" title="crionform-data" width="100%" height={`${window.innerHeight*0.79}px`}/>
              }
            </TabPane>
          }
          { (styledIdentifyRes && !styledCroinformHtmlRes) ?
            <TabPane tab="Идентификация" key="3">
              <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
                <iframe srcDoc={styledIdentifyRes} frameBorder="0" title="identify-data" width="100%" height={`${window.innerHeight*0.84}px`}/>
              </Spin>
            </TabPane> : null
          }
          {
            <TabPane tab="Риск-факторы" key="4">
              <RiskFactorsDigets 
                user={user} 
                visible={visible} 
                userSelected={userSelected}
              />
            </TabPane>
          }
        </Tabs>
      </PageHeader>
    </Drawer>
  );
}

export default toggleDrawer(CroinformDrawer)