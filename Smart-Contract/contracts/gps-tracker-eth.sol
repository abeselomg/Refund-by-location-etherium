//SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

//e9445f523f0940059e14a148a598ef3d : PROJECT ID
//c1b5a2f4325c473a93d38033851fb4be : PROJECT SECRET

// Deploying contracts with the account: 0xd42E30f8E8baCD00744ce6100c74050B697bE03c
// gpsContract deployed to: 0x72EdA49AdaF59a169b15042a1759A237160266cf

contract gpsContract {
    address public owner;
    address[] private Employees;

    constructor() payable{
        owner = msg.sender;
    }

    //structs
    struct GpsCordinates {
        uint256 latitude;
        uint256 longtude;
    }
    struct DateTime {
        uint8 hour;
        uint8 minute;
        
    }
    struct EmployeeContract {
        address emp_add;
        uint256 latitude;
        uint256 longtude;
        bool isactive;
        bool ispayed;
        uint8 start_hour;
        uint8 start_minute;
        uint8 end_hour;
        uint8 end_minute;
        uint amount;
        uint8 validRadius;
    }

    // The address of the player and => the user info
    mapping(address => EmployeeContract) private EmployeeContrInfo;

    function kill() public {
        if (msg.sender == owner) selfdestruct(payable(owner));
    }

    //***************************UTILITY FUNCTIONS******************************* */

    function checkEmployeeExists(address emp) public view returns (bool) {
        for (uint256 i = 0; i < Employees.length; i++) {
            if (Employees[i] == emp) return true;
        }
        return false;
    }

    function time_has_passed(
        DateTime memory fir,
        DateTime memory end_time
    ) private pure returns (bool) {
        if (fir.hour > end_time.hour ) {
            return true;
        }  

        return false;
    }





    function sqrt(uint256 x) private pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function pow(uint256 A, uint256 B) private pure returns (uint256) {
        return A**B;
    }

    function calculateDistance(
        GpsCordinates memory gps_cor,
        GpsCordinates memory gps_cor2
    ) private pure returns (uint256) {
        uint256 lat1 = gps_cor.latitude;
        uint256 lat2 = gps_cor2.latitude;
        uint256 long1 = gps_cor.longtude;
        uint256 long2 = gps_cor2.longtude;
        uint256 distance = 0;
        distance = sqrt(pow(lat1 - lat2, 2) + pow(long1 - long2, 2));
        return distance;
    }

    //***************************EMPLOYER FUNCTIONS******************************* */

    function addEmployee(address emp_address) public {
        if (!checkEmployeeExists(emp_address)) {
            Employees.push(emp_address);
        }
    }
    function listEmployees() public view returns (address  [] memory) {
        return Employees;
    }

    //array of structs

    function getkeys() public pure returns(string [] memory){

        string[] memory all_keys= new string[](11);
        all_keys[0]="emp_add";
        all_keys[1]="longtude_val";
        all_keys[2]="latitude_val";
        all_keys[3]="isactive";
        all_keys[4]="ispayed";
        all_keys[5]="start_hour";
        all_keys[6]="start_minute";
        all_keys[7]="end_hour";
        all_keys[8]="end_minute";
        all_keys[9]="amount";
        all_keys[10]="radius";

        return all_keys;
}

function get_contracts() public view returns (string [] memory, EmployeeContract [] memory){
    string[] memory keys=getkeys();
     EmployeeContract[] memory all_contracts= new EmployeeContract[](Employees.length);
     for (uint256 i = 0; i < Employees.length; i++) {
        all_contracts[i]=EmployeeContrInfo[Employees[i]];   
    }
    return (keys,all_contracts);
}

    function createContract(
        address emp_add,
        uint256 longtude_val,
        uint256 latitude_val,
        uint amount,
        uint8 start_hour,
        uint8 start_minute,
        
        uint8 end_hour,
        uint8 end_minute,
        
        uint8 radius
    ) public payable {
        EmployeeContrInfo[emp_add].emp_add = emp_add;
        EmployeeContrInfo[emp_add].latitude = latitude_val;
        EmployeeContrInfo[emp_add].longtude = longtude_val;
        EmployeeContrInfo[emp_add].isactive = true;
        EmployeeContrInfo[emp_add].ispayed = false;
        EmployeeContrInfo[emp_add].start_hour=start_hour;
        EmployeeContrInfo[emp_add].start_minute = start_minute;
        EmployeeContrInfo[emp_add].end_hour = end_hour;
        EmployeeContrInfo[emp_add].end_minute = end_minute;
        EmployeeContrInfo[emp_add].amount = amount;
        EmployeeContrInfo[emp_add].validRadius = radius;
    }

    // ToDo: compare time, check area value

    function terminateContract(address emp_add) private {
        
        EmployeeContrInfo[emp_add].isactive = false;
    }

    function pay(address  emp_add) public payable{
        EmployeeContrInfo[emp_add].isactive = false;
        EmployeeContrInfo[emp_add].ispayed = true;

       payable(emp_add).transfer(EmployeeContrInfo[emp_add].amount);
        

    
    }



    function remove_contract(address emp_add) public{
        delete EmployeeContrInfo[emp_add];
    }


    // For Employee

    function sendCoordinates(
        uint256 lat,
        uint256 long
    ) public {
        require(!checkEmployeeExists(msg.sender),"You are not an employee");

        GpsCordinates memory gps_cor = GpsCordinates(lat, long);

        GpsCordinates memory orig_cor=GpsCordinates(EmployeeContrInfo[msg.sender].latitude,EmployeeContrInfo[msg.sender].longtude);
        uint256 distance = calculateDistance(gps_cor, orig_cor);

        if (distance > EmployeeContrInfo[msg.sender].validRadius) {
            terminateContract(msg.sender);
        } 
        // if inside area?check for time and activeness
    }
}
