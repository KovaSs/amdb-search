import React, { Component } from 'react'
import { Table, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';

const data = [
  {
    key: '1',
    number: 'John Brown',
    date: 32,
    object: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    number: 'Joe Black',
    date: 42,
    object: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    number: 'Jim Green',
    date: 32,
    object: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    number: 'Jim Red',
    date: 32,
    object: 'London No. 2 Lake Park',
  },
];

class TableContainer extends Component {
  state = {
    searchText: '',
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input 
          ref={node => { this.searchInput = node; }}
          placeholder={'Введите поисковое значение'}
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
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
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
      dataIndex: 'object',
      key: 'object',
      ...this.getColumnSearchProps('object'),
    },
    {
      title: 'Взять в работу',
      dataIndex: 'object',
      key: 'object',
      ...this.getColumnSearchProps('object'),
    },
  ];
  return <Table bordered columns={columns} dataSource={data} />;
  }
}

export default TableContainer