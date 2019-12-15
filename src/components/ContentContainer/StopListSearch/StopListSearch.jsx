import React, { Component } from 'react'
import { uniqBy } from 'lodash'
import { connect } from "react-redux"
import Highlighter from 'react-highlight-words'
import { 
  Table, 
  Input, 
  Button, 
  Icon, 
  ConfigProvider, 
  Empty, 
  Select, 
  DatePicker, 
  notification 
} from 'antd';
import { sl, actions } from "../../../store/ducks/stopListSearch"
import { getDatePickerValue, getDPValue, getDate, uuid } from '../../../services/utils';
import config from '../../../config';
import "./stop-lists-search.scss"

const styleCss = {
  mainTitle: {
    fontWeight: 500, 
    margin: "0 10px 5px", 
    fontSize: 15
  }
}

class SlsComponent extends Component {
  state = {
    searchText: [],
    dataTable: null,
    dateNow: "",
    type: "fl",
    searchFl: {
      surname: "",
      firstname: "",
      middlename: "",
      series: "",
      number: "",
      inn: "",
      birthdate: ""
    },
    searchUl: {
      ulname: "",
      ulinn: "",
      ogrn: ""
    }
  };

  componentDidMount() {
    const { searchData, searchFields } = this.props
    document.title = "AC - Проверка | Поиск по стоп - листам"
    this.setState({dataTable : searchData})
    if(searchFields) {
      this.setState((searchFl, searchUl) => {
        if(searchFields.type === "fl") return {
          type: searchFields.type,
          searchFl: {
            ...searchFields.post,
            birthdate: searchFields.post.birthdate ? getDate(searchFields.post.birthdate) : ""
          }
        } 
        else return {
          type: searchFields.type,
          searchUl: searchFields.post
        }
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { searchData, errors } = this.props
    if(searchData !== prevProps.searchData) {
      this.setState({dataTable : searchData})
    }

    if(errors && errors !== prevProps.errors) {
      notification.error({
        message: "Ошибка получения данных",
        description: errors.message,
        duration: 4,
        key: errors.id,
      })
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
      if(dataIndex === 'fio') {
        return record.fio ? 
          record.fio.toString().toLowerCase().includes(value.toLowerCase()) :
          record.fullname.toString().toLowerCase().includes(value.toLowerCase())
      } else if(record[dataIndex]) {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
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

  handleChangeTypeSearch = value => this.setState({type: value})

  // Изменение данных поискового запроса по физику
  changeFirstName = ({target: {value = ""}}) => this.setState(({searchFl}) => ({searchFl: {...searchFl, firstname: value}}))
  changeMiddleName = ({target: {value = ""}}) => this.setState(({searchFl}) => ({searchFl: {...searchFl, middlename: value}}))
  changeSurName = ({target: {value = ""}}) => this.setState(({searchFl}) => ({searchFl: {...searchFl, surname: value}}))
  changeInn = ({target: {value = ""}}) => this.setState(({searchFl}) => ({searchFl: {...searchFl, inn: value}}))
  changeBirthdate = (dateObj, dateStr) => this.setState(({searchFl}) => ({searchFl: {...searchFl, birthdate: dateStr}}))
  changeNumber = ({target: {value = ""}}) => this.setState(({searchFl}) => ({searchFl: {...searchFl, number: value}}))
  changeSeries = ({target: {value = ""}}) => this.setState(({searchFl}) => ({searchFl: {...searchFl, series: value}}))

  // Изменение данных поискового запроса по юрику
  changeNameUl = ({target: {value = ""}}) => this.setState(({searchUl}) => ({searchUl: {...searchUl, ulname: value}}))
  changeInnUl = ({target: {value = ""}}) => this.setState(({searchUl}) => ({searchUl: {...searchUl, ulinn: value}}))
  changeOgrnUl = ({target: {value = ""}}) => this.setState(({searchUl}) => ({searchUl: {...searchUl, ogrn: value}}))

  // Очистка поисковых полей
  clearFields = () => {
    const { clearSearchData } = this.props
    clearSearchData()
    this.setState({
      searchFl: {
        surname: "",
        firstname: "",
        middlename: "",
        series: "",
        number: "",
        inn: "",
        birthdate: ""
      },
      searchUl: {
        ulname: "",
        ulinn: "",
        ogrn: ""
      }
    })
  }

  //Отправление поискового запроса
  submitSearch = () => {
    const { getSearchRequest } = this.props
    const { type, searchFl, searchUl } = this.state
    if(type === "fl") {
      if(
        ((searchFl.firstname && searchFl.middlename) ||
        (!searchFl.firstname && searchFl.middlename) ||
        (searchFl.firstname && !searchFl.middlename)) &&
        (!searchFl.surname && !searchFl.series && !searchFl.number && !searchFl.inn && !searchFl.birthdate)
      ) return notification.error({
          message: `Недостаточно поисковых данных`,
          description: `Пожалуйста введите дополнительные данные для поиска`,
          duration: 3,
          key: uuid(),
        });
      getSearchRequest({
        surname: searchFl.surname.trim(),
        firstname:  searchFl.firstname.trim(),
        middlename:  searchFl.middlename.trim(),
        series:  searchFl.series.trim(),
        number:  searchFl.number.trim(),
        inn:  searchFl.inn.trim(),
        birthdate: searchFl.birthdate ? getDPValue(searchFl.birthdate): ""
      }, type)
    } else if (type === "ul") {
      getSearchRequest({
        ulname: searchUl.ulname.trim(),
        ulinn: searchUl.ulinn.trim(),
        ogrn: searchUl.ogrn.trim()
      }, type)
    }
  }

  render() {
    const { Group : InputGroup } = Input
    const { Option } = Select
    const { dataTable } = this.state
    const { requestLoading } = this.props
    const nameBaseFilters = dataTable ? uniqBy(dataTable.map(item => ({
      text: item.report_name ? String(item.report_name) : String(item.nametable), 
      value: item.report_name ? String(item.report_name) : String(item.nametable)
    })), "value") : []
    const innFilters = dataTable ? uniqBy(dataTable.map(item => ({ text: String(item.inn),  value: String(item.inn) })), "value") : []
    const birthdateFilters = dataTable ? uniqBy(dataTable.map(item => ({ text: String(item.birthdate),  value: String(item.birthdate) })), "value") : []

    const columns = [
      {
        title: 'ФИО',
        dataIndex: 'fio',
        key: 'fio',
        width: '20%',
        align: "center",
        ...this.getColumnSearchProps('fio'),
        render: (text, record) => (
          <>
            { text === "-" ?
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } /> :
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                searchWords={this.state.searchText} 
                autoEscape 
                textToHighlight={text ? text.toString() : record.fullname.toString()}
              /> 
            }
          </>
        )
      },
      {
        title: 'Дата рождения',
        dataIndex: 'birthdate',
        key: 'birthdate',
        width: '10%',
        align: "center",
        // ...this.getColumnSearchProps('birthdate'),
        filters: birthdateFilters, 
        onFilter: (value, record) =>  String(record.inn).indexOf(value) === 0,
        render: (text, record) => (
          <>
            { text === "-" || !text ?
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } /> :
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                searchWords={this.state.searchText} 
                autoEscape 
                textToHighlight={text ? text.toString() : ""}
              /> 
            }
          </>
        ) 
      },
      {
        title: 'Паспорт',
        key: 'passport',
        dataIndex: 'passport',
        width: '10%',
        align: "center",
        ...this.getColumnSearchProps('passport'),
        render: (text, record) => (
          <>
            { text === "-" || !text ?
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } /> :
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                searchWords={this.state.searchText} 
                autoEscape 
                textToHighlight={text ? text.toString() : ""}
              /> 
            }
          </>
        ) 
      },
      {
        title: 'ИНН',
        key: 'inn',
        dataIndex: 'inn',
        width: '10%',
        align: "center",
        filters: innFilters, 
        onFilter: (value, record) =>  String(record.inn).indexOf(value) === 0,
        // ...this.getColumnSearchProps('inn'),
        render: (text, record) => (
          <>
            { text === "-" || !text ?
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } /> :
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                searchWords={this.state.searchText} 
                autoEscape 
                textToHighlight={text ? text.toString() : ""}
              /> 
            }
          </>
        ) 
      },
      {
        title: 'ОГРН',
        key: 'ogrn',
        dataIndex: 'ogrn',
        width: '10%',
        align: "center",
        ...this.getColumnSearchProps('ogrn'),
        render: (text, record) => (
          <>
            { text === "-" || !text ?
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } /> :
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} 
                searchWords={this.state.searchText} 
                autoEscape 
                textToHighlight={text ? text.toString() : ""}
              /> 
            }
          </>
        ) 
      },
      {
        title: 'Стоп-лист',
        key: 'reportname',
        dataIndex: 'report_name',
        width: '15%',
        align: "center",
        filters: nameBaseFilters, 
        onFilter: (value, record) => {
          return record.report_name ? 
            String(record.report_name).indexOf(value) === 0 : 
            String(record.nametable).indexOf(value) === 0
        },
        // ...this.getColumnSearchProps('sysDate'),
        render: (text, record) => (
          <>
            { text === "-" ?
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } /> :
              <div>{text ? text : record.nametable}</div>
            }
          </>
        )  
      },
      {
        title: 'Дата записи',
        key: 'inclusion_date',
        dataIndex: 'inclusion_date',
        width: '10%',
        align: "center",
        // ...this.getColumnSearchProps('sysDate'),
        render: (text, record) => (
          <>
            { text === "-" || !text ?
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } /> :
              <div>{text}</div>
            }
          </>
        ) 
      },
      {
        title: 'Актуальность',
        key: 'is_actual',
        dataIndex: 'is_actual',
        width: '10%',
        align: "center",
        // ...this.getColumnSearchProps('sysDate'),
        render: (text, record) => (
          <>
            { text === "-" || !text ?
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty-data" description={ <span ></span> } /> :
              <div>{text ? text : record.columnname}</div>
            }
          </>
        ) 
      },
      {
        title: 'Просмотр',
        key: 'action',
        width: '5%',
        align: "center",
        render: (text, record) => (
          <Button 
            size="small" 
            type="primary"
            href={
              record.search_request === "white" ?
              `${config.api()}/cgi-bin/serg/0/1/1/vi?baseid=${record.ID_base}&tableid=${record.ID_table}&basename=${record.namebase}&tablename=${record.nametable}&pk=${record.rowid}&pk_col=rowid&order_by=&pos_0=0&rezhim_pokaza_udal_zapisey=tolko_neudalennye&delta=30` :
              `${config.api()}/cgi-bin/ser4/0/1/1/vi?baseid=${record.ID_base}&tableid=${record.ID_table}&basename=${record.namebase}&tablename=${record.nametable}&pk=${record.rowid}&pk_col=rowid&order_by=&pos_0=0&rezhim_pokaza_udal_zapisey=tolko_neudalennye&delta=30`
            }
            target="_blank"
            title="Посмотреть данную запись в базе" 
          > 
            Подробнее 
          </Button>
        )
      },
    ];

    const tableTitle = () => {
      const {
        type,
        searchFl : {
          surname,
          firstname,
          middlename,
          inn,
          birthdate,
          series,
          number
        },
        searchUl: {
          ulname,
          ulinn,
          ogrn       }
      } = this.state
      // const
      return (
        <>
          <div style={{margin: "5px 0"}}>
            <InputGroup compact>
              <Select 
                style={{width: 100}}
                className="search-selector"
                value={type} 
                size="small"
                onChange={this.handleChangeTypeSearch}
              >
                <Option value="fl"> ФЛ / ИП </Option>
                <Option value="ul"> ЮЛ </Option>
              </Select>
              { type === "fl" ?
                <>
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 150}} value={surname} placeholder="Фамилия" size="small" onChange={e => this.changeSurName(e)} allowClear/>
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 150}} value={firstname} placeholder="Имя" size="small" onChange={e => this.changeFirstName(e)} allowClear/>
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 150}} value={middlename} placeholder="Отчество" size="small" onChange={e => this.changeMiddleName(e)} allowClear/>
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 150}} value={inn} placeholder="ИНН" size="small" onChange={e => this.changeInn(e)} allowClear/>
                  <DatePicker
                    key="date-picker-search-fl"
                    placeholder="Дата рождения"
                    format="DD.MM.YYYY"
                    showToday={false}
                    style={{ width: 200 }}
                    value={birthdate ? getDatePickerValue(birthdate) : null}
                    onChange={this.changeBirthdate}
                    size="small"
                    allowClear
                  />
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 150}} value={series} placeholder="Серия паспорта" size="small" onChange={e => this.changeSeries(e)} allowClear/>
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 150}} value={number} placeholder="Номер паспорта" size="small" onChange={e => this.changeNumber(e)} allowClear/>
                </> : 
                <>
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 300}} value={ulname} placeholder="Полное наименование организации" size="small" onChange={e => this.changeNameUl(e)} allowClear/>
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 150}} value={ulinn} placeholder="ИНН" size="small" onChange={e => this.changeInnUl(e)} allowClear/>
                  <Input onPressEnter={() => this.submitSearch()} style={{width: 150}} value={ogrn} placeholder="ОГРН" size="small" onChange={e => this.changeOgrnUl(e)} allowClear/>
                </>
              }
              <Button style={{color: "#1890ff"}} title="Очистить все" onClick={() => this.clearFields()} icon="close-circle" size="small" />
              <Button onClick={() => this.submitSearch()} type="primary" icon="search" size="small"> Поиск </Button>
            </InputGroup>
          </div>
        </>
      )
    }

    return (
      <div style={{padding: 15}}>
        <div style={styleCss.mainTitle}> Ручной поиск по стоп-листам </div>
        <ConfigProvider renderEmpty = { () => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>Данные отсутствуют</span>} /> } >
          <Table
            className="stop-list-search-table"
            columns={columns}
            title={tableTitle}
            dataSource={dataTable}
            size="small"
            loading = {{
              spinning: requestLoading.get("getSearchData"),
              size:"large",
              tip:"Идет запрос данных"
            }}
            pagination={{
              defaultPageSize: 12,
              hideOnSinglePage: true,
              showTotal: (total) => `Всего найдено: ${total}`
            }}
            bordered
          />
        </ConfigProvider>
      </div>
    )
  }
}

const putStateToProps = state => {
  return {
    searchData: sl.ewsSearchData(state),
    searchFields: sl.ewsSearchRequest(state),
    requestLoading: sl.ewsRequestLoading(state),
    errors: sl.ewsErrors(state).get('message'),
  }
}

const putActionToProps = {
  getSearchRequest: actions.getSearchRequest,
  clearSearchData: actions.clearSearchData
}

export default connect(putStateToProps, putActionToProps)(SlsComponent)