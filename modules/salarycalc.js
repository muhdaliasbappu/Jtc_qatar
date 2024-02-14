var employeHelpers = require("../helpers/employee-helpers");
var userHelpers = require("../helpers/user-helper");
var allsalaryreport = require('../modules/report')


module.exports = {

    salarycalculate: async(searchdate , employeeType)=>{
        var employeereport = [];
        var index = 0
        let sum = 0;
        const employees = await employeHelpers.getAllemployee();  
        for (let i = 0; i < employees.length; i++) {
          
        if(employees[i].employeeType === 'Own Labour'){
          if(employeeType === 'All'){
            var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate, employees[i]._id.toString());    
            if (timesheet.length > 0) {
              const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
            
              const thedata = await allsalaryreport.salaryreportlabour(searcheddata);
              thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
              index++;
              thedata.index = index;
              employeereport.push(thedata);
              }
         }else if (employeeType === 'Own Labour'){
          var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(searchdate, employees[i]._id.toString() ,    employeeType );
          if (timesheet.length > 0) {
            const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
          
            const thedata = await allsalaryreport.salaryreportlabour(searcheddata);
            thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
            index++;
            thedata.index = index;
            employeereport.push(thedata);
            }
         }     
    
         }else if(employees[i].employeeType === 'Hired Labour (Monthly)'){
          if(employeeType === 'All'){
            var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate, employees[i]._id.toString());    
            if (timesheet.length > 0) {
              const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
            
              const thedata = await allsalaryreport.salaryreportlabour(searcheddata);
              thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
              index++;
              thedata.index = index;
              employeereport.push(thedata);
              }
         }else if (employeeType === 'Hired Labour (Monthly)'){
          var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(searchdate, employees[i]._id.toString(), employeeType );
          if (timesheet.length > 0) {
            const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
          
            const thedata = await allsalaryreport.salaryreportlabour(searcheddata);
            thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
            index++;
            thedata.index = index;
            employeereport.push(thedata);
            }
         }     
    
         }
         else if(employees[i].employeeType === 'Hired Labour (Hourly)'){
          if(employeeType === 'All'){
            var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate, employees[i]._id.toString());   
            if (timesheet.length > 0) {
              const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
            
              const thedata = await allsalaryreport.salaryreportlabourhourly(searcheddata);
              thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
              index++;
              thedata.index = index;
              employeereport.push(thedata);
              }
         }else if (employeeType === 'Hired Labour (Hourly)'){
          var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(searchdate, employees[i]._id.toString(), employeeType );
          if (timesheet.length > 0) {
            const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
          
            const thedata = await allsalaryreport.salaryreportlabourhourly(searcheddata);
            thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
            index++;
            thedata.index = index;
            employeereport.push(thedata);
            }
         }     
          
         }else if(employees[i].employeeType ==='Own Staff (Operations)'){
          if(employeeType === 'All'){
          var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate, employees[i]._id.toString());
          if (timesheet.length > 0) {
            const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
          
            const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
            thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
            index++;
            thedata.index = index;
            employeereport.push(thedata);
            } 
         }else if (employeeType === 'Own Staff (Operations)'){
          var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(searchdate, employees[i]._id.toString(), employeeType );
          if (timesheet.length > 0) {
            const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
          
            const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
            thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
            index++;
            thedata.index = index;
            employeereport.push(thedata);
            }
         }     
          
        }
        else if(employees[i].employeeType === 'Hired Staff (Operations)'  ){
          if(employeeType === 'All'){
            var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate, employees[i]._id.toString());
            const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
          const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);    
         }else if (employeeType === 'Hired Staff (Operations)'){
          var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(searchdate, employees[i]._id.toString(),employeeType );
          if (timesheet.length > 0) {
            const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
          
            const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
            thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
            index++;
            thedata.index = index;
            employeereport.push(thedata);
            }
         }     
          
        }else if(employees[i].employeeType === 'Own Staff (Projects)' ){
          if(employeeType === 'All'){
            var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate, employees[i]._id.toString());
            if (timesheet.length > 0) {
              const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
            
              const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
              thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
              index++;
              thedata.index = index;
              employeereport.push(thedata);
              }
         }else if (employeeType === 'Own Staff (Projects)'){ 
          var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(searchdate, employees[i]._id.toString(), employeeType );
          if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
         }     
          
        }
        else if(employees[i].employeeType === 'Hired Staff (Projects)'){
          if(employeeType === 'All'){
            var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate, employees[i]._id.toString());
            if (timesheet.length > 0) {
              const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
            
              const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
              thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
              index++;
              thedata.index = index;
              employeereport.push(thedata);
              }
         }else if (employeeType === 'Hired Staff (Projects)'){
          var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(searchdate, employees[i]._id.toString(), employeeType );
          if (timesheet.length > 0) {
            const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
          
            const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
            thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
            index++;
            thedata.index = index;
            employeereport.push(thedata);
            }
         }     
          
        }
       
       
       }
       for(let g= 0; g<employeereport.length; g++){
        sum = sum + employeereport[g].totalsalary

       }
       
       return { employeereport, sum };

    },
    paidleavecost: async (date , mdetails)=>{

      let total = 0 
      const employees = await employeHelpers.getAllemployee();  
        for (let i = 0; i < employees.length; i++) { 
          let fri = 1
          let paidleavedata = []
          paidleavedata = await userHelpers.getDatabByMonthofPaidLeave(date , employees[i]._id.toString() ,  'Own Staff (Projects)' )
          let count = await userHelpers.getLeaveAndVacationCount(date , employees[i]._id.toString())     
          if(paidleavedata.length != 0){
          for( let j = 0; j < paidleavedata.length; j++){
            const dd = new Date(paidleavedata[j].datevalue);
            let day = dd.getDay();
            if(day === 5){
              if(mdetails.has31Days === true && count === 0){
                
                if( fri != mdetails.fridayCount ){
                  fri++
                  total = total+paidleavedata[j].sbasic/30;
                  total = total+paidleavedata[j].sallowance/30;
                  total = total+paidleavedata[j].sbonus/30;
                }
              }else{
                  total = total+paidleavedata[j].sbasic/30;
                  total = total+paidleavedata[j].sallowance/30;
                  total = total+paidleavedata[j].sbonus/30;
              }
            }else{
              total = total+paidleavedata[j].sbasic/30;
              total = total+paidleavedata[j].sallowance/30;
              total = total+paidleavedata[j].sbonus/30;
            }
            
          
          
          }
        }
        }


      return total
    },
    operationpaidleavecost: async (date , mdetails)=>{

      let total = 0 
      const employees = await employeHelpers.getAllemployee();  
        for (let i = 0; i < employees.length; i++) { 
          let fri = 1
          let paidleavedata = []
          paidleavedata = await userHelpers.getDatabByMonthofPaidLeaveoperation(date , employees[i]._id.toString())
          let count = await userHelpers.getLeaveAndVacationCount(date , employees[i]._id.toString())     
          if(paidleavedata.length != 0){
          for( let j = 0; j < paidleavedata.length; j++){
            const dd = new Date(paidleavedata[j].datevalue);
            let day = dd.getDay();
            if(day === 5){
              if(mdetails.has31Days === true && count === 0){
                
                if( fri != mdetails.fridayCount ){
                  fri++
                  total = total+paidleavedata[j].sbasic/30;
                  total = total+paidleavedata[j].sallowance/30;
                  total = total+paidleavedata[j].sbonus/30;
                }
              }else{
                  total = total+paidleavedata[j].sbasic/30;
                  total = total+paidleavedata[j].sallowance/30;
                  total = total+paidleavedata[j].sbonus/30;
              }
            }else{
              total = total+paidleavedata[j].sbasic/30;
              total = total+paidleavedata[j].sallowance/30;
              total = total+paidleavedata[j].sbonus/30;
            }
            
          
          
          }
        }
        }

      return total
    },



    
}
