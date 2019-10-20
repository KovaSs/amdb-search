import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { Collapse, Icon, Tag, Badge, Popover, Button } from "antd"
import StopListData from "./StopListData"
import FoundersUlDrawer from "../../../DrawerContainer/FoundersUlDrawer"
import BtnExtra from "./BtnExtra"
import { getDate } from "../../../../../../../services/utils";
import { 
  decodedErrors,
  ebgRiskSource,
  loadingFoundersUl,
  ebgCompanyRes,
  ebgMainSourceUl,
  storeRiskFactors,
  storeStopLists,
  decodedRequestLoading
} from "../../../../../../../store/ducks/EBG"

const styleCss = {
  bange: {
    blue: {
      backgroundColor: "#e6f7ff",
      color: "#1890ff",
      boxShadow: "0 0 0 1px #91d5ff inset"
    },
    cyan: {
      backgroundColor: "#e6fffb",
      color: "#13c2c2",
      boxShadow: "0 0 0 1px #87e8de inset"
    },
    volcano: {
      backgroundColor: "#fff2e8",
      color: "#fa541c",
      boxShadow: "0 0 0 1px #ffbb96 inset"
    },
    red: {
      backgroundColor: "rgb(255, 241, 240)",
      color: "#f5222d",
      boxShadow: "0 0 0 1px #ffa39e inset"
    },
    gray: {
      backgroundColor: "#fafafa",
      color: "rgba(0, 0, 0, 0.65)",
      boxShadow: "0 0 0 1px #d9d9d9 inset"
    },
    green: {
      backgroundColor: "#f6ffed",
      color: "#52c41a",
      boxShadow: "0 0 0 1px #b7eb8f inset"
    },
  },
  popover: {
    maxWidth: 300,
    maxHeight: 102,
    overflowY: "auto"
  },
  stopList: {
    title: {
      color: "red",
      fontWeight: 500
    },
    rowTitle: {
      fontWeight: 600,
      color: "red",
      marginTop: 5
    },
    text: {
      color: "red"
    },
    rowKey: {
      fontWeight: 600,
      marginTop: 5
    }
  }
}

export class FoundersUlItem extends PureComponent {
  state = {
    showRiskFactorsDrawer: false
  };


  componentDidCatch(err) {
    console.log('err', err)
    return this.setState({
      error: true
    })
  }

  /* Отображение Drawer с данными из Croinform */
  showDrawer = e => {
    e.stopPropagation();
    this.setState({
      showRiskFactorsDrawer: new Date()
    });
  };

  callback = key => null

  renderPositionTag = item => {
    const content = (
      <div className="position-tag" style={styleCss.popover}>
        <Tag key={item.key} color="green"> Учредитель </Tag>
        <div style={{margin: "5px 0"}} >Организация: {item.shortName}</div>
        <div>ИНН: {item.inn}</div>
        <div>ОГРН: {item.ogrn}</div>
        <div style={{marginBottom: 5}} >ОГРН: {item.kpp}</div>
        { item.percent && <div>{`Учредитель имеет долю в уставном капитале, в количестве ${item.percent}%`}</div> }
      </div>
    )

    return (
      <Popover 
        trigger="hover"
        key={`position-tag-${item.key}` }
        content={content} 
        style={{...styleCss.popover, maxHeight: 150}}
      >
        <Badge 
          count={1} 
          offset={[-9,1]} 
          style={styleCss.bange.green}
        >
          <Tag key={item.key} color="green"> Учредитель </Tag>
        </Badge>
      </Popover>
    )
  }

  renderTagsInfo = (arr =[]) => {
    const { stopLists, item, digets } = this.props
    try {
      if(stopLists && stopLists.length) {
        const content = 
          <div style={styleCss.popover}>
            {
              stopLists.map((item, index) => {
                return (
                  <div key={index}>
                    <label style={styleCss.stopList.rowTitle}> {`${item.report_name ? item.report_name : "Без названия"} ${item.ID_base ? `( ${item.ID_base} ${item.ID_table ? `/ ${item.ID_table} ` : ""})` : ""}`}</label>
                  </div>
                )
              })
            }
          </div>
        arr.push(
          <Popover key={`stop-lists-${item.key}`} title="Найден в стоп-листах" content={content} trigger="hover" >
            <Badge 
              count={stopLists.length} 
              offset={[-9,1]} 
              style={styleCss.bange.red}
              overflowCount={99}
            >
              <Tag color="red" > Стоп-листы </Tag> 
            </Badge>
          </Popover>
        )
      } else if (stopLists) {
        const content = <div style={styleCss.popover}>Данных состояния в стоп-листах по данному запросу не найдено</div>
        arr.push(
          <Popover key="stop-lists" title="Данные стоп-листов" content={content} trigger="hover" >
            <Badge 
              count={0} 
              showZero 
              offset={[-9,1]} 
              style={styleCss.bange.red}
              overflowCount={99}
            >
              <Tag color="red" > Стоп-листы </Tag> 
            </Badge>
          </Popover>
        )
      }
    } catch (error) {
      console.log('Stop lists', error)
    }
    try {
      if(digets.history.length) {
        const content = 
          <div style={styleCss.popover}>
            Найдены исторические данные с предыдущих проверок
            <Button
              title="Показать найденные риск факторы"
              size="small"
              type="link"
              onClick={e => this.showDrawer(e)}
            >
              Подробнее
            </Button>
          </div>
        arr.push(
          <Popover key={`risk-factors-${item.key}`} title="Найдены риск факторы" content={content} trigger="hover" >
            <Badge 
              count={digets.digets.length} 
              offset={[-9,1]} 
              style={styleCss.bange.red}
              overflowCount={99}
            >
              <Tag color="red" > Риск факторы </Tag> 
            </Badge>
          </Popover>
        )
      }
    } catch (error) {
      console.log('Risk fastors', error)
    }
    return arr
  }

  render() {
    const { Panel } = Collapse
    const { item, riskSource = [], foundersUlloading, requestLoading, companyRes, companySource } = this.props
    const { showRiskFactorsDrawer } = this.state
    const arbiter = riskSource.length ? riskSource.find(item => item.id === "arbiter").data : []

    const foundersTitle = (
      <div className="leader-name-header">
        <label className="leader-name-header_fio">
          { item.shortName }
        </label>
        <label className="leader-name-header_position">
          { item.inn }
        </label>
        <label className="leader-name-header_position" onClick={e => e.stopPropagation(e)}>
          { this.renderPositionTag(item) }
        </label>
        <label className="leader-name-header_position">
          Юридическое лицо
        </label>
        <label className="leader-name-header_date">
          { getDate(item.registerDate) }
        </label>
        <label className="leader-name-header_date" onClick={e => e.stopPropagation(e)}>
          { this.renderTagsInfo() }
        </label>
    </div>
    )

    return (
      <>
        <Collapse
          key={item.key}
          className="managment"
          onChange={this.callback}
          bordered={false}
          expandIcon={({ isActive }) => (
            <Icon type={!isActive ? "plus-square" : "minus-square"} />
          )}
        >
          <Panel
            key={item.key}
            header={foundersTitle}
            extra={
              <BtnExtra 
                keyId={item.key}
                icon={foundersUlloading ? "loading" : "reconciliation"}
                disabled={!!!riskSource.length}
                riskCount={riskSource.length}
                onAction={{
                  showDrawer: this.showDrawer
                }}
              />
            }
          >
            <StopListData  
              keyId={item.key}
              column={{md:2, sm:1, xs:1}}
              mainLoading={foundersUlloading} 
              stopListsLoading={requestLoading.getIn(["getStopListsUl", item.key], false)}
              riskInfo={riskSource} 
              arbiter={arbiter}
            />
          </Panel>
        </Collapse>
        <FoundersUlDrawer
          keyId={item.key}
          companyUl={companySource}
          nameUl={companyRes.name}
          innUl={companyRes.inn} 
          reqnumUl={companyRes.reqnum} 
          requestLoading={requestLoading}
          toggleDrawer={showRiskFactorsDrawer}
          riskInfo={riskSource}
          arbiter={arbiter}
        />
      </>
    );
  }
}

const putStateToProps = (state, props) => {
  return {
    digets: storeRiskFactors(state).get(props.item.key, {digets: [], history: []}),
    stopLists: storeStopLists(state).get(props.item.key),
    companyRes: ebgCompanyRes(state, props.item.key),
    companySource: ebgMainSourceUl(state, props.item.key),
    foundersUlloading: loadingFoundersUl(state, props.item.key),
    riskSource: ebgRiskSource(state, props.item.key),
    requestLoading: decodedRequestLoading(state),
    errors: decodedErrors(state),
  }
}

export default connect(putStateToProps)(FoundersUlItem)
