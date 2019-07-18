import React from 'react';
import { Drawer, Spin, Descriptions, Tabs, Collapse, Empty, PageHeader, Button} from "antd";
import { htmlTransform, htmlTransformFssp } from '../../../../../services/utils'
import toggleDrawer from '../index'

/** Инлайновые стили */
const styleCss = {
  stopList: {
    title: {
      color: "red",
      fontWeight: 500
    }
  }
}

const CroinformDrawer = props => {
  const {onClose, visible, croinformRes, loading, user, user: { stop_lists =[] }, fsspInfo, fssploading, userSelected} = props
  const { Item: DescriptionsItem } = Descriptions
  const { TabPane } = Tabs
  const { Panel } = Collapse

  const styledIdentifyRes = user.hasOwnProperty('identifyInfo') ? htmlTransform(user.identifyInfo.html) : ""
  const styledfsspInfo = fsspInfo ? htmlTransformFssp(fsspInfo) : ""
  const styledCroinformHtmlRes = (croinformRes && croinformRes.html)? htmlTransform(croinformRes.html) : ""
  const croinformVectorRes = (croinformRes && croinformRes.hasOwnProperty('vector')) ? croinformRes.vector : []
  const croinformListsRes = (croinformRes && croinformRes.lists.length) ? croinformRes.lists : []
  const stopLists = stop_lists ? stop_lists : []

  const renderDescrList = (arr = []) => {
    const renderVector = croinformVectorRes.map((item, index) =>  <div key={index}>{item}</div> )
    const renderLists = croinformListsRes.map((item, index) =>  <div key={index}>{item}</div> )
    const renderStopLists =  stopLists.map((item, index) => 
      <div key={index} >
        { item.rows.map((list, i) =>
          <div key={i}>
            <label style={styleCss.stopList.title}> {`${list.HOW}`} </label>
            <label> {`( ${list.comment} )`} </label>
          </div>
          )
        }
      </div>
    )
    if (croinformRes.vector.length) {
      arr.push(
        <DescriptionsItem key="vector" label="Вектор заемщика" span={1} >
          { renderVector }
        </DescriptionsItem>
      )
    } 
    if(croinformRes.lists.length) {
      arr.push(
        <DescriptionsItem key="lists" label="Списки" span={1} >
          { renderLists }
        </DescriptionsItem>
      )
    }
    if(stop_lists.length) {
      arr.push(
        <DescriptionsItem key="lists" label="Стоп-листы" span={1} >
          { renderStopLists }
        </DescriptionsItem>
      )
    }
    return arr
  }

  const renderDtSearch = () => {
    return (
      <DescriptionsItem key="lists" label="Поисковые запросы" span={1} >
        {[
          <div 
            key="search-word-1"
            id={`${userSelected.SurName} w/5 ${userSelected.FirstName} w/5 ${userSelected.MiddleName}`}
          >
            {`${userSelected.SurName} w/5 ${userSelected.FirstName} w/5 ${userSelected.MiddleName}`}
          </div>,
          <div
            key="search-word-2"
            id={`${userSelected.SurName} w/5 ${userSelected.FirstName} w/5 ${userSelected.MiddleName} w/25 ${userSelected.birthday}`}
          >
            {`${userSelected.SurName} w/5 ${userSelected.FirstName} w/5 ${userSelected.MiddleName} w/25 ${userSelected.birthday}`}
          </div>,
          <div 
            key="search-word-3"
            id={`${userSelected.SurName} w/25 ${userSelected.birthday} w/55 ${userSelected.StreetExp}`}
          >
            {`${userSelected.SurName} w/25 ${userSelected.birthday} w/55 ${userSelected.StreetExp}`}
          </div>,
          <div 
            key="search-word-4"
            id={`${userSelected.SurName} w/55 ${userSelected.StreetExp}`}
          >
            {`${userSelected.SurName} w/55 ${userSelected.StreetExp}`}
          </div>,
          <div 
            key="search-word-5"
            id={`${userSelected.CityExp} w/5 ${userSelected.StreetExp} w/5 ${userSelected.HouseExp} w/5 ${userSelected.FlatExp}`}
          >
            {`${userSelected.CityExp} w/5 ${userSelected.StreetExp} w/5 ${userSelected.HouseExp} w/5 ${userSelected.FlatExp}`}
          </div>
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
          <Panel header="Ключевые слова для ручного поиска в DtSearch" key="2" showArrow={false}>
            <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
              <Descriptions
                key="DtSearch"
                size="small"
                bordered
                border
                column={{ md: 1, sm: 1, xs: 1 }}
              >
                { renderDtSearch() }
              </Descriptions>
            </Spin>
          </Panel>
          <Panel header="Данные ФССП" key="3" showArrow={false}>
            <Spin spinning={fssploading} tip="Идет поиск данных в ФССП">
              { fsspInfo ?
                <iframe srcDoc={styledfsspInfo} frameBorder="0" title="identify-data" width="100%" height="600px"/> :
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ <span> Данные отвутствуют </span> } />
              }
            </Spin>
          </Panel>
        </Collapse>
      </TabPane>
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
          extra={[
            <Button 
              key="searh_in_internet"
              size="small" 
              icon="ie" 
              href={`https://www.google.com/search?hl=ru&as_oq=отзывы+криминал+компромат+обыск+уголовное+мошенник+обнал+откат+взятка+жулик+нарушения+претензии+конфликт+подан-иск+преследование+расследование+разбирательство+следствие+прокуратура+МВД+ФСБ+полиция+хищение+отмывание&as_q=${user.fio}`}
              target="_blank"
              title="Поиск негативной информации в интернетe" 
              style={{color: "#52c41a", marginRight: ".5rem"}}
            />
          ]}
        >
          <Tabs >
            { (croinformRes && (croinformRes.vector.length || croinformRes.lists.length || fsspInfo.length)) && renderList() }
            { (croinformRes && croinformRes.html) &&
              <TabPane tab="Croinform" key="2">
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
                </Tabs>
              </TabPane>
            }
            { (styledIdentifyRes && !styledCroinformHtmlRes) ?
              <TabPane tab="Идентификация" key="1">
                <Spin spinning={false} tip="Идет поиск данных по измененному запросу">
                  <iframe srcDoc={styledIdentifyRes} frameBorder="0" title="identify-data" width="100%" height={`${window.innerHeight*0.84}px`}/>
                </Spin>
              </TabPane> : null
            }
          </Tabs>
        </PageHeader>
      </Drawer>
  );
}

export default toggleDrawer(CroinformDrawer)