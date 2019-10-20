import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import { connect } from "react-redux"
import { Table, Input, Button, Icon, ConfigProvider, Empty, Progress, Popconfirm, Tag } from 'antd';
import { getDate, getTimeDev, uuid } from '../../../../services/utils'
import { 
  decodedRequestLoading,
  decodedEbgData,
  decodedErrors,
  takeEbgItem
} from "../../../../store/ducks/EBG";
import "./elsecronic-bank-garantees.scss";

const styleCss = {
  loadData: {
    position: "absolute",
    width: 50,
    right: 0,
    top: 6,
    fontSize: 24,
    color: "#1890ff"
  },
  errorLoading: {
    position: "absolute",
    right: 0,
    top: 8
  },
  grayDescr: {
    color: "#808080bf"
  }
}

class TableContainer extends Component {
  state = {
    searchText: [],
    loading: false,
    dataTable: null,
    dateNow: ""
  }

  componentDidMount() {
    document.title = "AC - Проверка | Электронные банковские гарантии"
    this.interval = setInterval(() =>  this.setState({dateNow: Date.now()}), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  takeInWork = record => {
    const {takeEbgItem} = this.props
    takeEbgItem({
      inn: record.info.inn
    })
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input 
          ref={node => { this.searchInput = node; }}
          placeholder={'Введите значение'}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Поиск
        </Button>
        <Button onClick={() => this.handleReset(selectedKeys, clearFilters)} size="small" style={{ width: 90 }}>
          Сбросить
        </Button>
      </div>
    ),

    filterIcon: filtered => (
      <Icon type="search" title="Меню поиска" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilter: (value, record) => {
      if(dataIndex !== 'info') {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      } else {
        for (const key in record['info']) {
          if (record[dataIndex][key] && record[dataIndex][key].toString().toLowerCase().includes(value.toLowerCase())) {
            return record[dataIndex][key].toString().toLowerCase().includes(value.toLowerCase())
          }
        }
      }
    },

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },

    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={this.state.searchText}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState(({searchText}) => { searchText.push(selectedKeys[0]) })
  };

  handleReset = (selectedKeys, clearFilters) => {
    const {searchText} = this.state
    const newSearchText = searchText.filter(item => item !== selectedKeys[0])
    clearFilters()
    this.setState({ searchText:  newSearchText})
  };

  getLeftCheckTime = recTime => {
    const { dateNow } = this.state
    const leftTime = getTimeDev(recTime, dateNow)
    if(Number.isNaN(leftTime.diff)) return <Icon style={{fontSize: 16}} type="loading" />
    else if(!leftTime.status) return <Icon style={{fontSize: 16}} type="close-circle" />
    return leftTime.text
  }

  getLeftCheckPercentTime = recTime => {
    const { dateNow } = this.state
    const leftTimePercent = getTimeDev(recTime, dateNow)
    return leftTimePercent.hasOwnProperty("percent") ? leftTimePercent.percent : 0
  }

  render() {
    const columns = [
      {
        title: '№ п/п',
        dataIndex: 'number',
        key: 'number',
        width: '5%',
        // ...this.getColumnSearchProps('number'),
      },
      {
        title: 'Дата поступления',
        dataIndex: 'date',
        key: 'date',
        width: '10%',
        ...this.getColumnSearchProps('date'),
      },
      {
        title: 'Инициатор запроса',
        dataIndex: 'owner_detail',
        key: 'owner_detail',
        width: '10%',
        // ...this.getColumnSearchProps('owner_detail'),
      },
      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        // ...this.getColumnSearchProps('owner_detail'),
        render: (text, record) => record.status === "0" ? <Tag key={uuid()} color="green"> Готово к проверке </Tag> : <Tag key={uuid()} color="blue"> Объект в работе </Tag>
      },
      {
        title: 'Оператор',
        dataIndex: 'user',
        key: 'user',
        width: '10%',
        // ...this.getColumnSearchProps('owner_detail'),
      },
      {
        title: 'Объект запроса',
        key: 'info',
        dataIndex: 'info',
        width: '25%',
        // ...this.getColumnSearchProps('info'),
        render: (text, record) => (
          <>
            <div> 
              {
                record.info.name ? 
                record.info.name.toString().toUpperCase() : 
                <label style={styleCss.grayDescr}>
                  {("Название организации отсутствует").toUpperCase()}
                </label> 
              } 
            </div>
            { record.info.inn ?
              <><small style={{marginRight: 10}}><b>ИНН: </b> {record.info.inn ? record.info.inn : "Не указан"} </small></> : null
            }
            { record.info.ogrn ?
              <small style={{marginRight: 10}}><b>ОГРН: </b> {record.info.ogrn ? record.info.ogrn : "Не указан"} </small> : null
            }
            { record.info.birthday ?
              <small><b>Дата рождения: </b> { record.info.birthday ? `${getDate(record.info.birthday)}г.` : "Не указана"} </small> : null
            }
          </>
        ),
      },
      {
        title: 'Времени осталось',
        key: 'time',
        width: '20%',
        render: (text, record) => {
          const leftCheckPercentTime = this.getLeftCheckPercentTime(record.time)
          if(leftCheckPercentTime === 0) return <Tag key={uuid()} color="red"> Заявка просрочена </Tag>
          return (
            <Progress
              size="small"
              style={{width: "80%"}}
              format={() => this.getLeftCheckTime(record.time)}
              percent={leftCheckPercentTime}
              className={leftCheckPercentTime >= 50 ? "success-time" : leftCheckPercentTime < 25 ? "danger-time" : ""}
              status="active"
            />
          )
        }
      },
      {
        title: '',
        key: 'action',
        width: '10%',
        render: (text, record) => {
          const disabledBtn = record.user && record.user.indexOf(document.cookie.split("=")[1]) !== -1
          return (
            <>
              { record.status === "0" ?
                <Popconfirm
                  title={
                    <div style={{width: 230}}>
                      <div style={{fontWeight: 500}}> Взять в работу? </div>
                      <div> 
                        После подтверждения, проверка данного объекта будет закреплена за Вами и должна быть осуществлена в течении указанного времени - {this.getLeftCheckTime(record.time)}
                      </div>
                    </div>
                  }
                  onConfirm={ () => this.takeInWork(record) }
                  icon={<Icon type="question-circle-o" style={{color: "#28a745"}}/>}
                  placement="left"
                  okText="Да"
                  cancelText="Нет" 
                >
                  <Button type="primary"> Взять в работу </Button>
                </Popconfirm> : 
                <Button disabled={!disabledBtn} onClick={ () => this.takeInWork(record) } > Взято в работу </Button>
              }
            </>
            
          )
        }
      },
    ];

    const { requestLoading, ebgData, errors } = this.props
    return (
      <div className="bank-garanties-container">
        <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>Очередь проверки пуста</span>} /> } >
          <Table
            bordered
            size="small"
            columns={columns}
            dataSource={ebgData}
            loading = {{
              spinning: ebgData === null || requestLoading.get('ebgMainDataRequest'),
              size:"large",
              tip: requestLoading.get('ebgMainDataRequest') ? "Получение данных об выбранном объекте" : "Получение текущего списка объектов"
            }}
            title={() => (
              <>
                <label>Электронные банковские гарантии</label>
                { 
                  requestLoading.get('ebgSyncTableData') && 
                  <Icon 
                    style={ styleCss.loadData } 
                    type="loading" 
                  />
                }
                {
                  errors.get('ebgSyncTableData') && 
                  <Tag 
                  color="red"
                    style={ styleCss.errorLoading }
                  > Нет соединения с сервером </Tag>
                }
              </>
            )}
            pagination={{
              defaultPageSize: 12,
              hideOnSinglePage: true,
              showTotal: (total) => `Всего элементов: ${total}`
            }}
          />
        </ConfigProvider>
      </div>
    )
  }
}

const putStateToProps = state => {
  return {
    ebgData: decodedEbgData(state),
    requestLoading: decodedRequestLoading(state),
    errors: decodedErrors(state),
  }
}

const putActionToProps = {
  takeEbgItem
}

export default connect(putStateToProps, putActionToProps)(withRouter(TableContainer))