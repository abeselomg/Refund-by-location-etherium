import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Modal,
  Table,
  Input,
  Button,
  InputNumber,
  TimePicker,
  Form,
  Divider,
} from "antd";
import moment from "moment";
// Import ABI Code to interact with smart contract
import gpsContract from "../assets/gpsContract.json";

// The contract address
const gpsAddress = "0x0828B707B7a3E3730F38bbaBD4b788Ae84ee8C16";

function WebTree() {
  // Property Variable
  const [form] = Form.useForm();
  const [address, setAddress] = useState("");
  const [employeesList, setEmployeesList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Helper Functions
  const columns = [
    {
      title: " ",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => <a>{text}</a>,
    },
  ];
  // Requests access to the user's Meta Mask Account
  // https://metamask.io/
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Fetches the current value store in greeting
  async function fetchEmployees() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        gpsAddress,
        gpsContract.abi,
        provider
      );
      try {
        const data = await contract.listEmployees();
        console.log("data: ", data);
        const objList = data.map((address, i) => {
          return {
            key: i + 1,
            address: address,
          };
        });

        setEmployeesList(objList);
        // setCurrentGreeting(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // Sets the greeting from input text box
  async function createContracts() {
    if (!address) return;

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(gpsAddress, gpsContract.abi, signer);
      const transaction = await contract.addEmployee(address);

      setAddress("");
      await transaction.wait();
      fetchEmployees();
      setModalLoading(true);
      setIsModalVisible(false);
    }
  }

  function listEmployeesContract() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        gpsAddress,
        gpsContract.abi,
        provider
      );
      contract.getActiveEmployees().then(console.log);
    }
  }
    const onFinish = (values) => {
      console.log("Success:", values);
    };

  // Return
  return (
    <div>
      <div style={{ margin: "15px" }}>
        <Button onClick={showModal} type={"primary"}>
          Add Contract{" "}
        </Button>
      </div>

      <Table columns={columns} dataSource={employeesList} />
      <Modal
        visible={isModalVisible}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        confirmLoading={modalLoading}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item>
            <Input placeholder="Address" name="address" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="Longtude" name="long" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="Latitude" name="lat" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="Amount(ETH)" name="amount" />
          </Form.Item>
          <Form.Item>
            <TimePicker
              placeholder="Start time"
              format={"HH:mm"}
              name="starttime"
            />
          </Form.Item>
          <Form.Item>
            <TimePicker
              placeholder="End time"
              format={"HH:mm"}
              name="endtime"
            />
          </Form.Item>
          <Form.Item>
            <InputNumber placeholder="Valid Radius" name="radius" />
          </Form.Item>
          {/* <Divider /> */}
          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ textAlign: "right" }}
          >
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default WebTree;
