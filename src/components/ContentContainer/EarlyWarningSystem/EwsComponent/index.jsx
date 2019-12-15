import React, { Component } from 'react'
import { Table, Input, Button, Icon, ConfigProvider, Empty } from 'antd';
import { connect } from "react-redux";
import Highlighter from 'react-highlight-words';
import { sl, actions } from "../../../../store/ducks/earlyWarningSystem";
import { filter } from 'lodash';

class EwsComponent extends Component {
  state = {
    searchText: [],
    dataTable: null,
    dateNow: ""
  };

  componentDidMount() {
    const { getMainData } = this.props
    getMainData({
      method: "mainData",
      isUtf8: true,
      startDate: "2019-07-14", 
      endDate: "2019-08-14"
    })
  }
  
  componentDidUpdate(prevProps) {
    const { mainData } = this.props
    if(mainData !== prevProps.mainData) {
      this.setState({dataTable : mainData})
    }
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
        textToHighlight={text ? text.toString() : ""}
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

  renderIventDescr = (record, renderArr=[]) => {
    const arr = [
      {title: "Дата регистрации", key: "regDate"},
      {title: "Измененное значение", key: "ChangedProperty"},
      {title: "Старое значение", key: "OldValue"},
      {title: "Новое значение", key: "NewValue"},
      {title: "Номер дела", key: "caseNumber"},
      {title: "Участник", key: "caseSide"},
      {title: "Сумма иска", key: "summ"},
      {title: "Категория иска", key: "caseCategory"},
      {title: "Состояние", key: "isActive"},
      {title: "Вердикт", key: "resultCode"},
      {title: "Группа мониторинга", key: "tag"},
    ]

    arr.map(field => 
    filter(record, (value, key) => {if(key === field.key && value) renderArr.push(
      <div key={`${record.key}-${key}`}>
        <b style={{marginRight: 5}}>{field.title}:</b>
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
          searchWords={this.state.searchText} 
          autoEscape 
          textToHighlight={record[key].toString()}
        /> 
      </div>
    )}))

    return renderArr
  }

  render() {
    const columns = [
      {
        title: 'Название / ИНН',
        dataIndex: 'shortName',
        key: 'shortName',
        width: '10%',
        ...this.getColumnSearchProps('shortName'),
      },
      {
        title: '№, Негативное событие СРП',
        dataIndex: 'crmInd',
        key: 'crmInd',
        width: '25%',
        ...this.getColumnSearchProps('crmInd')
      },
      {
        title: 'Описание события',
        key: 'regDate',
        dataIndex: 'regDate',
        width: '30%',
        ...this.getColumnSearchProps('regDate'),
        render: (text, record) =>  <> {this.renderIventDescr(record)} </>
      },
      {
        title: 'Дата обнаружения',
        key: 'sysDate',
        dataIndex: 'sysDate',
        width: '10%',
        // ...this.getColumnSearchProps('sysDate'),
        render: (text, record) =>  <div dangerouslySetInnerHTML={{__html: text}}/>
      },
      {
        title: 'Решение',
        key: 'action',
        width: '10%',
        render: (text, record) => {
          return <Button> Взять в работу </Button>
        }
      },
    ];

    const { dataTable } = this.state
    const { requestLoading } = this.props
    return (
      <div style={{padding: 15}}>
        <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>Данные отсутствуют</span>} /> } >
          <Table
            bordered
            columns={columns}
            title={ () => 'Первичный акцепт индикаторов' }
            dataSource={dataTable}
            loading = {{
              spinning: requestLoading.get("mainData"),
              size:"large",
              tip:"Идет запрос данных"
            }}
            pagination={{
              defaultPageSize: 5,
              hideOnSinglePage: true,
              showTotal: (total) => `Всего найдено: ${total}`
            }}
            size="small"
          />
        </ConfigProvider>
      </div>
    )
  }
}

const putStateToProps = state => {
  return {
    mainData: sl.ewsMainData(state),
    requestLoading: sl.ewsRequestLoading(state),
  }
}

const putActionToProps = {
  getMainData: actions.getMainData
}

export default connect(putStateToProps, putActionToProps)(EwsComponent)