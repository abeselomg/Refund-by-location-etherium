import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Modal, Table, Input, Button, Row, Col, Space } from "antd";
// Import ABI Code to interact with smart contract
import gpsContract from "../assets/gpsContract.json";

// The contract address
const gpsAddress = "0x0828B707B7a3E3730F38bbaBD4b788Ae84ee8C16";

function WebTree() {
  // Property Variables

  const [address, setAddress] = useState("");
  const [employeesList, setEmployeesList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setModalLoading(true);
    addEmployees();
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
      dataIndex:"key",
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
        const objList = data.map((address,i) => {
          return {
            key: i+1,
            address: address,
          };
        }
        );
        
        setEmployeesList(objList);
        // setCurrentGreeting(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // Sets the greeting from input text box
  async function addEmployees() {
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

  // Return
  return (
    <div>
      <div style={{ margin: "15px" }}>
        <Button onClick={showModal} type={"primary"}>
          Add Employee{" "}
        </Button>
      </div>

      <Table columns={columns} dataSource={employeesList} />
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={modalLoading}
      >
        <div>Add Address:</div>
        <Input
          placeholder="Address"
          onChange={(value) => {
            setAddress(value.target.value);
          }}
        />
      </Modal>
    </div>
  );
}

export default WebTree;
