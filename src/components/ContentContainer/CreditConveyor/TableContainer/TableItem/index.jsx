import React from "react";
import { Table } from "antd";
import HeaderInfo from "./HeaderInfo";

const TableItem = () => {

  const ShowHeadsInfo = () => {
    const columns = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Age", dataIndex: "age", key: "age", width: "12%" },
      { title: "Address", dataIndex: "address", width: "30%", key: "address" }
    ];

    const data = [
      {
        key: "1-1",
        name: "Физические лица",
        children: [{ key: "1-1-1", name: "Jimmy Brown" }]
      },
      {
        key: "1-2",
        name: "Юридические лица",
        children: [
          {
            key: "1-2-1",
            name: "Jim Green",
            children: [
              {
                key: "1-2-2",
                name: "Jim Green jr."
              },
              {
                key: "1-2-3",
                name: "Jimmy Green sr."
              }
            ]
          }
        ]
      }
    ];
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    );
  };

  const columns = [
    { title: "Руководящие органы", dataIndex: "name", key: "name" }
  ];
  const data = [
    {
      key: "1",
      name: "Руководство",
    },
    {
      key: 2,
      name: "Совладельцы",
      children: [
        {
          key: 12,
          name: "Физические лица",
          children: [
            {
              key: 121,
              name: "Jimmy Brown"
            }
          ]
        },
        {
          key: 13,
          name: "Юридические лица",
          children: [
            {
              key: 131,
              name: "Jim Green",
              children: [
                {
                  key: 1311,
                  name: "Jim Green jr."
                },
                {
                  key: 1312,
                  name: "Jimmy Green sr."
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      expandedRowRender={() => <ShowHeadsInfo />}
      pagination={false}
      title={() => <HeaderInfo />}
    />
  );
};

export { TableItem };
