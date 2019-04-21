import React from 'react'

const TabsContainer = () => {
  const TabPane = Tabs.TabPane;
  showHeadsTableInfo = (tableName) => {
    const expandedRowRender = () => {
      const columns = [
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
        { title: 'Проверка в Google', dataIndex: 'operation', key: 'operation', render: () => <Button>Поиск</Button>},
      ];
  
      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          date: '2014-12-24 23:12:00',
          name: 'This is production name',
          upgradeNum: 'Upgraded: 56',
        });
      }

      let loadingDelay = false

      return (
        <>
          {
            loadingDelay ? 
            <Spin spinning={loadingDelay}>
              <Empty/>
            </Spin>
            :
            <Table
              className="tabs-info__table-children"
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          }
        </>
      );
    };

  const columns = [
    { title: 'ФИО', dataIndex: 'fio', key: 'name' },
    { title: 'ОГРН', dataIndex: 'ogrn', key: 'createdAt' },
    { title: 'Проверка в Google', key: 'operation', render: () => <Button>Проверить</Button> },
  ];

  const data = [];
  for (let i = 0; i < 2; ++i) {
    data.push({
      key: i,
      fio: 'Масюгина Жанна Ивановна',
      ogrn: '1117746763672',
    });
  }
  
  return (
    <>
      <Col className="tabs-info__lable-table">{tableName}</Col>
      <Table
        className="tabs-info__table-main"
        columns={columns}
        expandedRowRender={expandedRowRender}
        dataSource={data}
        pagination={false}
      />
    </>
  )}

  return (
    <div className="tabs-info">
      <Tabs defaultActiveKey="2" onChange={this.callback} >
        <TabPane tab="Организация" key="1">{this.showOrganisationIngo()}</TabPane>
        <TabPane tab="Руководители" key="2">
          {this.showHeadsTableInfo('Руководители')}
          {this.showHeadsTableInfo('Совладельцы')}
          {this.showHeadsTableInfo('Бенефицары')}
        </TabPane>
      </Tabs>
    </div>
  )
}

export { TabsContainer }