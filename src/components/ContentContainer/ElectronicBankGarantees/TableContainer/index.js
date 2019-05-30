import React, { Component } from 'react'
import { Table, Input, Button, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import moment from 'moment'

const data = [
  {
    key: '1',
    number: '1',
    date: moment('2010-12-08').format('DD.MM.YYYY'),
    info: {
      name: 'ШАМКОВ МАКСИМ АНАТОЛЬЕВИЧ',
      inn: '552801899036',
      birthday: '1969-04-22',
    }
  },
  {
    key: '2',
    number: '2',
    date: moment('2010-12-09').format('DD.MM.YYYY'),
    info: {
      name: "ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ \"БЕЛЫЙ ДОМ\"",
      inn: '2901178314',
      ogrn: '1082901005263',
    }
  },
];

class TableContainer extends Component {
  state = {
    searchText: '',
    loading: false,
    tableData: ''
  };

  componentDidMount() {
    this.setState({loading : true})
    setTimeout(() => {
      this.setState({loading : false, dataTable : data})
    }, 3000);
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
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Сбросить
        </Button>
      </div>
    ),

    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },

    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: '№ п/п',
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
        key: 'object',
        render: (text, record) => (
          <div>
            <div> {`${ record.info.name }`} </div>
            <small><b>ИНН:</b> { record.info.inn }</small>{"  "}
            { record.info.ogrn ?
              <small><b>ОГРН:</b> { record.info.ogrn }</small> :
              <small><b>Дата рождения:</b> {  `${moment(record.info.birthday).format('DD.MM.YYYY')}г.` }</small> 
            }
          </div>
        ),
      },
      {
        title: '',
        key: 'action',
        render: (text, record) => (
          <Button onClick={ () => this.props.history.push(record.info.inn)}> Взять в работу </Button>
        )
      },
    ];

    const { dataTable, loading } = this.state
    return <Table
      bordered
      columns={columns}
      dataSource={dataTable}
      loading = {loading}
      title={() => 'Электронные банковские гарантии'}
      size="small"
    />;
  }
}

export default withRouter(TableContainer)