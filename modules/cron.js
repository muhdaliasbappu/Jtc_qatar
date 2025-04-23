var express = require('express');

const bodyParser = require('body-parser');
var logHelpers = require("../helpers/logger-helper");
var router = express.Router();
var employeHelpers = require('../helpers/employee-helpers')
var projectHelpers = require('../helpers/project-helpers')
var userHelpers = require('../helpers/user-helper');
const { all } = require('../app');
const async = require('hbs/lib/async');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));




module.exports = {

cronfriday:  async() => {



  var dateObj2 = new Date();
  dateObj2.setDate(dateObj2.getDate() - 2);

  var date2 = dateObj2.getFullYear() + '-' + (dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();


  
   let expiredata = []

   try {
    const [employeedatasheet] = await Promise.all([
      userHelpers.getDatasheet(),
     
    ]);
    let expiredata = employeedatasheet.filter((data) => data.datevalue === date2);



  employeHelpers.getAllemployee().then(async (employee) => {

    if(expiredata.length === 0 ){
        for(let i = 0; i<employee.length; i++){
            await new Promise(async (resolve, reject) => {
      

        if(employee[i].Employeestatus === 'On Vacation'){
            await new Promise((resolve, reject) => {

          var tempobj1 = { }
          tempobj1.employee_id =  employee[i]._id.toString()
         tempobj1.givenName = employee[i].givenName
         tempobj1.surname = employee[i].surname
         tempobj1.datevalue = date2
         tempobj1.todaystatus = employee[i].Employeestatus
         tempobj1.projectname1 = ''
         tempobj1.workhour1 = ''
         tempobj1.projectname2 = ''
         tempobj1.workhour2 = ''
         tempobj1.projectname3 = ''
         tempobj1.workhour3 = ''  
         tempobj1.projectname4 = ''
         tempobj1.workhour4 = ''
         tempobj1.projectname5 = ''
         tempobj1.workhour5 = ''
         tempobj1.workinghour = '0'
         tempobj1.date= dateObj2
         tempobj1.employeeType = employee[i].employeeType
         if(employee[i].employeeType === 'Hired Labour (Hourly)'){
          tempobj1.srateph = employee[i].srateph
         }else{
         tempobj1.sbasic = employee[i].sbasic
         tempobj1.sallowance = employee[i].sallowance
         tempobj1.sbonus = employee[i].sbonus
        }
        tempobj1.salarystatus = 'open'
         userHelpers.addDatasheet(tempobj1, (result) => {
          
      
         })

         resolve()
        })
         
        }else if (employee[i].Employeestatus === 'Working'){
            await new Promise((resolve, reject) => {
            var tempobj2 = { }
            tempobj2.employee_id =  employee[i]._id.toString()
            tempobj2.givenName = employee[i].givenName
            tempobj2.surname = employee[i].surname
            tempobj2.datevalue = date2
            if(employee[i].employeeType === 'Hired Labour (Hourly)'){
              tempobj2.todaystatus =  'Unpaid Leave'
               }else{
                tempobj2.todaystatus =  'Paid Leave'
               }
            tempobj2.projectname1 = ''
            tempobj2.workhour1 = ''
            tempobj2.projectname2 = ''
            tempobj2.workhour2 = ''
            tempobj2.projectname3 = ''
            tempobj2.workhour3 = ''  
            tempobj2.projectname4 = ''
            tempobj2.workhour4 = ''
            tempobj2.projectname5 = ''
            tempobj2.workhour5 = ''
            tempobj2.workinghour = '0'
            tempobj2.date= dateObj2
            tempobj2.employeeType = employee[i].employeeType
            if(employee[i].employeeType === 'Hired Labour (Hourly)'){
            tempobj2.srateph = employee[i].srateph
             }else{
                tempobj2.sbasic = employee[i].sbasic
                tempobj2.sallowance = employee[i].sallowance
                tempobj2.sbonus = employee[i].sbonus
                
            }
            tempobj2.salarystatus = 'open'
            userHelpers.addDatasheet(tempobj2, (result) => {
             
                })
            resolve()
        })
        }
        resolve()
    })
    }
    
    }else{
      let workinghour = expiredata[0].workinghour
      for(let i = 0; i<employee.length; i++){
        let check = 0;
        for(let j = 0; j<expiredata.length; j++){
         
          if(employee[i]._id.toString() === expiredata[j].employee_id){
            check = 1;
            
          }
        }
        if(check != 1){
           
            await new Promise(async (resolve, reject) => {
      

              if(employee[i].Employeestatus === 'On Vacation'){
                  await new Promise((resolve, reject) => {
      
                var tempobj1 = { }
                tempobj1.employee_id =  employee[i]._id.toString()
               tempobj1.givenName = employee[i].givenName
               tempobj1.surname = employee[i].surname
               tempobj1.datevalue = date2
               tempobj1.todaystatus = employee[i].Employeestatus
               tempobj1.projectname1 = ''
               tempobj1.workhour1 = ''
               tempobj1.projectname2 = ''
               tempobj1.workhour2 = ''
               tempobj1.projectname3 = ''
               tempobj1.workhour3 = ''  
               tempobj1.projectname4 = ''
               tempobj1.workhour4 = ''
               tempobj1.projectname5 = ''
               tempobj1.workhour5 = ''
               tempobj1.date= dateObj2
               tempobj1.workinghour = workinghour
               tempobj1.employeeType = employee[i].employeeType
               if(employee[i].employeeType === 'Hired Labour (Hourly)'){
                tempobj1.srateph = employee[i].srateph
               }else{
               tempobj1.sbasic = employee[i].sbasic
               tempobj1.sallowance = employee[i].sallowance
               tempobj1.sbonus = employee[i].sbonus
              }
              tempobj1.salarystatus = 'open'
               userHelpers.addDatasheet(tempobj1, (result) => {
           
            
               })
      
               resolve()
              })
               
              }else if (employee[i].Employeestatus === 'Working'){
                  await new Promise((resolve, reject) => {
                  var tempobj2 = { }
                  tempobj2.employee_id =  employee[i]._id.toString()
                  tempobj2.givenName = employee[i].givenName
                  tempobj2.surname = employee[i].surname
                  tempobj2.datevalue = date2
                  tempobj2.todaystatus =  'Paid Leave'
                  tempobj2.projectname1 = ''
                  tempobj2.workhour1 = ''
                  tempobj2.projectname2 = ''
                  tempobj2.workhour2 = ''
                  tempobj2.projectname3 = ''
                  tempobj2.workhour3 = ''  
                  tempobj2.projectname4 = ''
                  tempobj2.workhour4 = ''
                  tempobj2.projectname5 = ''
                  tempobj2.workhour5 = ''
                  tempobj2.date= dateObj2
                  tempobj2.workinghour = workinghour
                  tempobj2.employeeType = employee[i].employeeType
                  if(employee[i].employeeType === 'Hired Labour (Hourly)'){
                  tempobj2.srateph = employee[i].srateph
                   }else{
                      tempobj2.sbasic = employee[i].sbasic
                      tempobj2.sallowance = employee[i].sallowance
                      tempobj2.sbonus = employee[i].sbonus
                      
                  }
                  tempobj2.salarystatus = 'open'
                  userHelpers.addDatasheet(tempobj2, (result) => {
                     
                      })
                  resolve()
              })
              }
              resolve()
          })
          }
      }
    }

    })
    } catch (error) {
      console.error(error);
    }
    },

    cronnotfriday:  async() => {

     
      
        var dateObj2 = new Date();
        dateObj2.setDate(dateObj2.getDate() - 2);
      
        var date2 = dateObj2.getFullYear() + '-' + (dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();
      
      
        
         let expiredata = []
      
         try {
          const [employeedatasheet] = await Promise.all([
            userHelpers.getDatasheet(),
           
          ]);
          let expiredata = employeedatasheet.filter((data) => data.datevalue === date2);
      
      
      
        employeHelpers.getAllemployee().then(async (employee) => {
      
          if(expiredata.length === 0 ){
              for(let i = 0; i<employee.length; i++){
                  await new Promise(async (resolve, reject) => {
            
      
              if(employee[i].Employeestatus === 'On Vacation'){
                  await new Promise((resolve, reject) => {
      
                var tempobj1 = { }
                tempobj1.employee_id =  employee[i]._id.toString()
               tempobj1.givenName = employee[i].givenName
               tempobj1.surname = employee[i].surname
               tempobj1.datevalue = date2
               tempobj1.todaystatus = employee[i].Employeestatus
               tempobj1.projectname1 = ''
               tempobj1.workhour1 = ''
               tempobj1.projectname2 = ''
               tempobj1.workhour2 = ''
               tempobj1.projectname3 = ''
               tempobj1.workhour3 = ''  
               tempobj1.projectname4 = ''
               tempobj1.workhour4 = ''
               tempobj1.projectname5 = ''
               tempobj1.workhour5 = ''
               tempobj1.date= dateObj2
               tempobj1.workinghour = '8'
               tempobj1.employeeType = employee[i].employeeType
               if(employee[i].employeeType === 'Hired Labour (Hourly)'){
                tempobj1.srateph = employee[i].srateph
               }else{
               tempobj1.sbasic = employee[i].sbasic
               tempobj1.sallowance = employee[i].sallowance
               tempobj1.sbonus = employee[i].sbonus
              }
              tempobj1.salarystatus = 'open'
               userHelpers.addDatasheet(tempobj1, (result) => {
                
            
               })
      
               resolve()
              })
               
              }else if (employee[i].Employeestatus === 'Working'){
                  await new Promise((resolve, reject) => {
                  var tempobj2 = { }
                  tempobj2.employee_id =  employee[i]._id.toString()
                  tempobj2.givenName = employee[i].givenName
                  tempobj2.surname = employee[i].surname
                  tempobj2.datevalue = date2
                  tempobj2.todaystatus =  'Unpaid Leave'
                  tempobj2.projectname1 = ''
                  tempobj2.workhour1 = ''
                  tempobj2.projectname2 = ''
                  tempobj2.workhour2 = ''
                  tempobj2.projectname3 = ''
                  tempobj2.workhour3 = ''  
                  tempobj2.projectname4 = ''
                  tempobj2.workhour4 = ''
                  tempobj2.projectname5 = ''
                  tempobj2.workhour5 = ''
                  tempobj2.date= dateObj2
                  tempobj2.workinghour = '8'
                  tempobj2.employeeType = employee[i].employeeType
                  if(employee[i].employeeType === 'Hired Labour (Hourly)'){
                  tempobj2.srateph = employee[i].srateph
                   }else{
                      tempobj2.sbasic = employee[i].sbasic
                      tempobj2.sallowance = employee[i].sallowance
                      tempobj2.sbonus = employee[i].sbonus
                      
                  }
                  tempobj2.salarystatus = 'open'
                  userHelpers.addDatasheet(tempobj2, async (result) => {
                    const logMessage = `${employee[i].surname} ${employee[i].givenName}'s timesheet for ${date2}, was not submitted.`;
                    await logHelpers.addlog(req,logMessage)

                     
                      })
                  resolve()
              })
              }
              resolve()
          })
          }
          
          }else{
           let workinghour = expiredata[0].workinghour
            for(let i = 0; i<employee.length; i++){
              
              let check = 0;
              for(let j = 0; j<expiredata.length; j++){
               
                if(employee[i]._id.toString() === expiredata[j].employee_id){
                  check = 1;
     
                }
              }
              if(check != 1){
                 
                  await new Promise(async (resolve, reject) => {
            
      
                    if(employee[i].Employeestatus === 'On Vacation'){
                        await new Promise((resolve, reject) => {
            
                      var tempobj1 = { }
                      tempobj1.employee_id =  employee[i]._id.toString()
                     tempobj1.givenName = employee[i].givenName
                     tempobj1.surname = employee[i].surname
                     tempobj1.datevalue = date2
                     tempobj1.todaystatus = employee[i].Employeestatus
                     tempobj1.projectname1 = ''
                     tempobj1.workhour1 = ''
                     tempobj1.projectname2 = ''
                     tempobj1.workhour2 = ''
                     tempobj1.projectname3 = ''
                     tempobj1.workhour3 = ''  
                     tempobj1.projectname4 = ''
                     tempobj1.workhour4 = ''
                     tempobj1.projectname5 = ''
                     tempobj1.workhour5 = ''
                     tempobj1.date= dateObj2
                     tempobj1.workinghour = workinghour
                     tempobj1.employeeType = employee[i].employeeType
                     if(employee[i].employeeType === 'Hired Labour (Hourly)'){
                      tempobj1.srateph = employee[i].srateph
                     }else{
                     tempobj1.sbasic = employee[i].sbasic
                     tempobj1.sallowance = employee[i].sallowance
                     tempobj1.sbonus = employee[i].sbonus
                    }
                    tempobj1.salarystatus = 'open'
                     userHelpers.addDatasheet(tempobj1, (result) => {
                      
                  
                     })
            
                     resolve()
                    })
                     
                    }else if (employee[i].Employeestatus === 'Working'){
                        await new Promise((resolve, reject) => {
                        var tempobj2 = { }
                        tempobj2.employee_id =  employee[i]._id.toString()
                        tempobj2.givenName = employee[i].givenName
                        tempobj2.surname = employee[i].surname
                        tempobj2.datevalue = date2
                        tempobj2.todaystatus =  'Unpaid Leave'
                        tempobj2.projectname1 = ''
                        tempobj2.workhour1 = ''
                        tempobj2.projectname2 = ''
                        tempobj2.workhour2 = ''
                        tempobj2.projectname3 = ''
                        tempobj2.workhour3 = ''  
                        tempobj2.projectname4 = ''
                        tempobj2.workhour4 = ''
                        tempobj2.projectname5 = ''
                        tempobj2.workhour5 = ''
                        tempobj2.date= dateObj2
                        tempobj2.workinghour = workinghour
                        tempobj2.employeeType = employee[i].employeeType
                        if(employee[i].employeeType === 'Hired Labour (Hourly)'){
                        tempobj2.srateph = employee[i].srateph
                         }else{
                            tempobj2.sbasic = employee[i].sbasic
                            tempobj2.sallowance = employee[i].sallowance
                            tempobj2.sbonus = employee[i].sbonus
                            
                        }
                        tempobj2.salarystatus = 'open'
                        userHelpers.addDatasheet(tempobj2, async(result) => {
                          const logMessage = `${employee[i].surname} ${employee[i].givenName}'s timesheet for ${date2}, was not submitted.`;
                          await logHelpers.addlog(req,logMessage)
                            
                            })
                        resolve()
                    })
                    }
                    resolve()
                })
                }
            }
          }
      
          })
          } catch (error) {
            console.error(error);
          }
          }



}
