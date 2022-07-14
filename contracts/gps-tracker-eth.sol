//SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

contract gpsContract{
    address public owner;
    address[] private Employees;

    constructor() {
        owner = msg.sender;
    }
        
    
//structs
    struct GpsCordinates{
        uint256 latitude;
        uint256 longtude;
    }
    struct DateTime {
        uint8 hour;
        uint8 minute;
        uint8 second;
        
}
    struct EmployeeContract{
        //address emp_add;
        GpsCordinates emp_cord;
        bool isactive;
        DateTime startTime;
        DateTime endTime;
        uint8 amount;
     
    }

// The address of the player and => the user info   
   mapping(address => EmployeeContract) private EmployeeContrInfo;

//Functions

    function kill() public {
      if(msg.sender == owner) selfdestruct(payable(owner));
    }
    
   function checkEmployeeExists(address emp) private view returns(bool){
      for(uint256 i = 0; i < Employees.length; i++){
         if(Employees[i] == emp) return true;
      }
      return false;
   }

    function checkIfFirstIsLatterThanSecond(DateTime memory fir,DateTime memory sec)private pure returns(bool) {
        if(fir.hour>sec.hour){
            if(fir.minute>sec.minute){
            return true;
            }
        }

        return false;

    }


   function createContract(address emp_add,uint longtude_val,uint latitude_val,uint8 amount,
                            uint8 start_hour,uint8 start_minute,uint8 start_second,
                            uint8 end_hour,uint8 end_minute,uint8 end_second) public payable{
       Employees.push(emp_add);//add to valid emps

       GpsCordinates memory gps_cor=GpsCordinates(latitude_val,longtude_val);
       DateTime memory start_time=DateTime(start_hour,start_minute,start_second);
       DateTime memory end_time=DateTime(end_hour,end_minute,end_second);

       EmployeeContrInfo[emp_add].emp_cord=gps_cor;
       EmployeeContrInfo[emp_add].isactive=true;
       EmployeeContrInfo[emp_add].startTime=start_time;
       EmployeeContrInfo[emp_add].endTime=end_time;
       EmployeeContrInfo[emp_add].amount=amount;

       }


    // ToDo: compare time, check area value



    function terminateContract(address emp_add) private {
        EmployeeContrInfo[emp_add].isactive=false;

    }

    function pay(address payable emp_add) public{
        EmployeeContrInfo[emp_add].isactive=false;
        emp_add.transfer(EmployeeContrInfo[emp_add].amount);
    }

// For Employee
    function sendCoordinates(uint lat,uint long) public{
        require(!checkEmployeeExists(msg.sender));

        // if inside area?check for time and activeness

    }


}