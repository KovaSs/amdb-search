import React, { Component } from 'react'
import { Table, Input, Button, Icon, ConfigProvider, Empty, Progress } from 'antd';
import { withRouter } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import { getDate, getTime } from '../../../../services/utils'
import { ebgData as data } from '../../../../store/mock'

class TableContainer extends Component {
  state = {
    searchText: [],
    loading: false,
    dataTable: null,
    dateNow: ""
  };

  componentDidMount() {
    this.setState({loading : true})
    setTimeout(() => {
      this.setState({loading : false, dataTable : data})
    }, 1000);
    this.interval = setInterval(() =>  this.setState({dateNow: Date.now()}), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  takeInWork = inn => {
    this.props.history.push(`/electronic-bank-garantees/${inn}`)
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
          if (record[dataIndex][key].toString().toLowerCase().includes(value.toLowerCase())) {
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
    const leftTime = (recTime + (20*60000))-dateNow
    if(leftTime <= 0) return <Icon style={{fontSize: 16}} type="close-circle" />
    return getTime(leftTime)
  }

  getLeftCheckPercentTime = recTime => {
    const { dateNow } = this.state
    const leftTimePercent = ((recTime + (20*60000))-dateNow ) * 100 / (20 * 60000)
    return leftTimePercent
  }

  render() {
    const columns = [
      {
        title: '№ запроса',
        dataIndex: 'number',
        key: 'number',
        width: '10%',
        ...this.getColumnSearchProps('number'),
      },
      {
        title: 'Дата поступления',
        dataIndex: 'date',
        key: 'date',
        width: '20%',
        ...this.getColumnSearchProps('date'),
      },
      {
        title: 'Объект запроса',
        key: 'info',
        dataIndex: 'info',
        ...this.getColumnSearchProps('info'),
        render: (text, record) => (
          <>
            <div>
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                searchWords={this.state.searchText} 
                autoEscape 
                textToHighlight={record.info.name.toString().toUpperCase()}
              /> 
            </div>
            <small><b>ИНН: </b>
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                searchWords={this.state.searchText} 
                autoEscape 
                textToHighlight={record.info.inn.toString()}
              />
            </small>{"  "}
            { record.info.ogrn ?
              <small><b>ОГРН: </b>
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                  searchWords={this.state.searchText} 
                  autoEscape 
                  textToHighlight={ record.info.ogrn.toString()}
                />
              </small> :
              <small><b>Дата рождения: </b> 
                <Highlighter
                  highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                  searchWords={this.state.searchText} 
                  autoEscape 
                  textToHighlight={ (`${getDate(record.info.birthday)}г.`).toString()}
                />
              </small> 
            }
          </>
        ),
      },
      {
        title: 'Времени осталось',
        key: 'time',
        render: (text, record) => {
          return (
            <Progress
              size="small"
              style={{width: "80%"}}
              format={() => this.getLeftCheckTime(record.time)}
              percent={this.getLeftCheckPercentTime(record.time)}
              className={this.getLeftCheckPercentTime(record.time) >= 75 ? "success-time" : this.getLeftCheckPercentTime(record.time) < 25 ? "danger-time" : ""}
              status="active"
            />
          )
        }
      },
      {
        title: '',
        key: 'action',
        render: (text, record) => {
          return <Button onClick={ () => this.takeInWork(record.info.inn) }> Взять в работу </Button>
        }
      },
    ];

    const { dataTable, loading } = this.state
    return (
      <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>Данные отсутствуют</span>} /> } >
        <Table
          bordered
          columns={columns}
          dataSource={dataTable}
          loading = {{
            spinning: loading,
            size:"large",
            tip:"Идет запрос данных"
          }}
          title={() => 'Электронные банковские гарантии'}
          size="small"
        />
      </ConfigProvider>
    )
  }
}

export default withRouter(TableContainer)