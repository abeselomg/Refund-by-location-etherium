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
//npx hardhat run scripts/deploy.js --network rinkeby

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
    values.end_time=moment(values.end_time).format("HH:mm");
    values.start_time = moment(values.start_time).format("HH:mm");

    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input Employee Address!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Longtude"
            name="longtude"
            rules={[
              {
                required: true,
                message: "Please input Longtude!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Latitude"
            name="latitude"
            rules={[
              {
                required: true,
                message: "Please input Latitude!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input Amount in ETH!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[
              {
                required: true,
                message: "Please input Start Time!",
              },
            ]}
          >
            <TimePicker format={"hh:mm"} />
          </Form.Item>
          <Form.Item
            label="End Time"
            name="end_time"
            rules={[
              {
                required: true,
                message: "Please input Start Time!",
              },
            ]}
          >
            <TimePicker format={"hh:mm"} />
          </Form.Item>

          <Form.Item
            label="Radius"
            name="radius"
            rules={[
              {
                required: true,
                message: "Please input Radius!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
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
