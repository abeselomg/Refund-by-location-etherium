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
        uint8 validRadius;
     
    }

// The address of the player and => the user info   
   mapping(address => EmployeeContract) private EmployeeContrInfo;



    function kill() public {
      if(msg.sender == owner) selfdestruct(payable(owner));
    }

    //***************************UTILITY FUNCTIONS******************************* */
    
   function checkEmployeeExists(address emp) private view returns(bool){
      for(uint256 i = 0; i < Employees.length; i++){
         if(Employees[i] == emp) return true;
      }
      return false;
   }

    function time_is_valid(DateTime memory fir,DateTime memory start_time,DateTime memory end_time)private pure returns(bool) {

        if (fir.hour > end_time.hour || fir.hour < start_time.hour) {
            return false;
        } else if (fir.hour == end_time.hour || fir.hour == start_time.hour) {
            if (fir.minute > end_time.minute || fir.minute < start_time.minute) {
                return false;
            } else if (fir.minute == end_time.minute || fir.minute == start_time.minute) {
                if (fir.second > end_time.second || fir.second < start_time.second) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }

        return false;

    }
        function sqrt(uint x) private pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    function pow(uint256 A, uint256 B) private pure returns (uint256){ 
            return A**B;
        }

    function calculateDistance(GpsCordinates memory gps_cor,GpsCordinates memory gps_cor2) private pure returns(uint){
        uint256 lat1=gps_cor.latitude;
        uint256 lat2=gps_cor2.latitude;
        uint256 long1=gps_cor.longtude;
        uint256 long2=gps_cor2.longtude;
        uint256 distance=0;
        distance=sqrt(pow(lat1-lat2,2)+pow(long1-long2,2));
        return distance;
    }



    //***************************EMPLOYEE FUNCTIONS******************************* */

    function addEmployee(address emp_address) private{
        
        if(!checkEmployeeExists(emp_address)){
            Employees.push(emp_address);
            }
        // if(!checkEmployeeExists(emp_address)){
        //     Employees.push(emp_address);
        //     EmployeeContrInfo[emp_address].emp_cord.latitude=0;
        //     EmployeeContrInfo[emp_address].emp_cord.longtude=0;
        //     EmployeeContrInfo[emp_address].isactive=false;
        //     EmployeeContrInfo[emp_address].startTime.hour=0;
        //     EmployeeContrInfo[emp_address].startTime.minute=0;
        //     EmployeeContrInfo[emp_address].startTime.second=0;
        //     EmployeeContrInfo[emp_address].endTime.hour=0;
        //     EmployeeContrInfo[emp_address].endTime.minute=0;
        //     EmployeeContrInfo[emp_address].endTime.second=0;
        //     EmployeeContrInfo[emp_address].amount=0;
        //     EmployeeContrInfo[emp_address].validRadius=0;
        // }
    }

   function createContract(address emp_add,uint longtude_val,uint latitude_val,uint8 amount,
                            uint8 start_hour,uint8 start_minute,uint8 start_second,
                            uint8 end_hour,uint8 end_minute,uint8 end_second,uint8 radius) public payable{
       Employees.push(emp_add);//add to valid emps

       GpsCordinates memory gps_cor=GpsCordinates(latitude_val,longtude_val);
       DateTime memory start_time=DateTime(start_hour,start_minute,start_second);
       DateTime memory end_time=DateTime(end_hour,end_minute,end_second);

       EmployeeContrInfo[emp_add].emp_cord=gps_cor;
       EmployeeContrInfo[emp_add].isactive=true;
       EmployeeContrInfo[emp_add].startTime=start_time;
       EmployeeContrInfo[emp_add].endTime=end_time;
       EmployeeContrInfo[emp_add].amount=amount;
       EmployeeContrInfo[emp_add].validRadius=radius;

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
   
   
   
    function sendCoordinates(uint256 lat,uint256 long,uint8 hour,uint8 minute, uint8 second ) public view{
        require(!checkEmployeeExists(msg.sender));
        GpsCordinates memory gps_cor=GpsCordinates(lat,long);
        GpsCordinates memory orig_cor=EmployeeContrInfo[msg.sender].emp_cord;
        uint distance=calculateDistance(gps_cor,orig_cor);

        if(distance<EmployeeContrInfo[msg.sender].validRadius){
            //check if time is valid
            DateTime memory cur_time=DateTime(hour,minute,second);
            DateTime memory start_time=EmployeeContrInfo[msg.sender].startTime;
            DateTime memory end_time=EmployeeContrInfo[msg.sender].endTime;
            bool isValidTime=time_is_valid(cur_time,start_time,end_time);
            if(isValidTime){

                //Logic to pay the employee and terminate the contract if the time past the end time

            }

           
        }

        // if inside area?check for time and activeness

    }


}