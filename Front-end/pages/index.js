import React from "react";
import { Space, Table, Button } from "antd";
import App from "../assets/CustomLayout";
const columns = [
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Contract Date",
    dataIndex: "contract_date",
    key: "contract_date",
  },
  {},
];

const data = [
  {
    key: "1",
    address: "0xc4A1531B289919f2b2B154aC1e208479235a1c5A",
    contract_date: "2020-01-01",
  },
];
export default function index() {
  return (
    <div>
      {/* <App> */}
        <Table columns={columns} dataSource={data} />
        <Button>Test</Button>
      {/* </App> */}
    </div>
  );
}
