var express = require('express');

const bodyParser = require('body-parser');

var router = express.Router();
var employeHelpers = require('../helpers/employee-helpers')
var projectHelpers = require('../helpers/project-helpers')
var userHelpers = require('../helpers/user-helper');
const { all } = require('../app');
const async = require('hbs/lib/async');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cron = require('node-cron')
const schedule = require('node-schedule');
process.env.TZ = 'Asia/Qatar';


function getthedate() {
  var dateObj1 = new Date();
  dateObj1.setDate(dateObj1.getDate() - 1);

  var date1 = dateObj1.getFullYear() + '-' + (dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();
  var dateObj2 = new Date();
  dateObj2.setDate(dateObj2.getDate() - 2);

  var date2 = dateObj2.getFullYear() + '-' + (dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();
  const dates = [{ date1, date2 }]

  return dates;
}


// cron.schedule('39 11 * * *', () => {

//    let expiredata = []
//   userHelpers.getDatasheet().then(function (employeedatasheet) {
 
//     for (let z = 0 ; z<employeedatasheet.length; z++){
      
//       if(employeedatasheet[z].datevalue === date2){
//         expiredata = employeedatasheet[z]
//       }
//     }
//   })

//   var dateObj2 = new Date();
//   dateObj2.setDate(dateObj2.getDate() - 2);

//   var date2 = dateObj2.getFullYear() + '-' + (dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();

 
//     employeHelpers.getAllemployee().then((employee) => {
    
     
//       for(let i = 0; i<employee.length; i++){


//         if(employee[i].Employeestatus === 'On Vacation'){
          
//         var tempobj = { }
//         tempobj.employee_id =  employee[i]._id.toString()
//        tempobj.givenName = employee[i].givenName
//        tempobj.datevalue = date2
//        tempobj.todaystatus = employee[i].Employeestatus
//        tempobj.projectname1 = ''
//        tempobj.workhour1 = ''
//        tempobj.projectname2 = ''
//        tempobj.workhour2 = ''
//        tempobj.projectname3 = ''
//        tempobj.workhour3 = ''  
//        tempobj.projectname4 = ''
//        tempobj.workhour4 = ''
//        tempobj.projectname5 = ''
//        tempobj.workhour5 = ''
//        tempobj.date= dateObj2
//        tempobj.employeeType = employee[i].employeeType
//        if(employee[i].employeeType === 'Hired Labour'){
//         tempobj.srateph = employee[i].srateph
//        }else{
//        tempobj.sbasic = employee[i].sbasic
//        tempobj.sallowance = employee[i].sallowance
//        tempobj.sbonus = employee[i].sbonus
//       }
//        userHelpers.addDatasheet(tempobj, (result) => {
//        })
//       }else if(employee[i].Employeestatus === 'Dismissed')   {
//         return 0;
      
//       }else{
       
   
//         if(expiredata.length === 0){
        
//           if(dateObj2.getDay() === 5){
//              var tempobj = { }
//           tempobj.employee_id =  employee[i]._id.toString()
//          tempobj.givenName = employee[i].givenName
//          tempobj.datevalue = date2
//          tempobj.todaystatus =  'Paid Leave'
//          tempobj.projectname1 = ''
//          tempobj.workhour1 = ''
//          tempobj.projectname2 = ''
//          tempobj.workhour2 = ''
//          tempobj.projectname3 = ''
//          tempobj.workhour3 = ''  
//          tempobj.projectname4 = ''
//          tempobj.workhour4 = ''
//          tempobj.projectname5 = ''
//          tempobj.workhour5 = ''
//          tempobj.date= dateObj2
//          tempobj.employeeType = employee[i].employeeType
//          if(employee[i].employeeType === 'Hired Labour'){
//           tempobj.srateph = employee[i].srateph
//          }else{
//          tempobj.sbasic = employee[i].sbasic
//          tempobj.sallowance = employee[i].sallowance
//          tempobj.sbonus = employee[i].sbonus
//          userHelpers.addDatasheet(tempobj, (result) => {
//          })
//         }

//           }else{
//             console.log('zero but not friday')
//             var tempobj = { }
//             tempobj.employee_id =  employee[i]._id.toString()
//            tempobj.givenName = employee[i].givenName
//            tempobj.datevalue = date2
//            tempobj.todaystatus =  'Unpaid Leave'
//            tempobj.projectname1 = ''
//            tempobj.workhour1 = ''
//            tempobj.projectname2 = ''
//            tempobj.workhour2 = ''
//            tempobj.projectname3 = ''
//            tempobj.workhour3 = ''  
//            tempobj.projectname4 = ''
//            tempobj.workhour4 = ''
//            tempobj.projectname5 = ''
//            tempobj.workhour5 = ''
//            tempobj.date= dateObj2
//            tempobj.employeeType = employee[i].employeeType
//            if(employee[i].employeeType === 'Hired Labour'){
//             tempobj.srateph = employee[i].srateph
//            }else{
//            tempobj.sbasic = employee[i].sbasic
//            tempobj.sallowance = employee[i].sallowance
//            tempobj.sbonus = employee[i].sbonus
//            userHelpers.addDatasheet(tempobj, (result) => {
//            })
//           }
//           }
//         }else{
     
//         var checker = 0;
//        for(let j=0; j<expiredata.length; j++){
//         console.log('i am not zero')
// if(expiredata[j].employee_id === employee[i]._id.toString()){
//  checker++;
// }
//       }
// if(checker=0){
//   if(dateObj2.getDay() === 5){
    

//  }else{
  
//  }
// }else {
//   return 0;
// }
//         }
      
//       }
//       }
//     });
    
  
//   console.log('cron running')
//  // Define searchdatasheet array here
// });

router.get('/', function (req, res, next) {
  res.render('./users/user-login');
});
router.get('/employeelist', function (req, res) {
  if (req.session.users) {

    employeHelpers.getAllemployee().then(function (employees) {
      var activeEmployees = [];
      for (let i = 0; i < employees.length; i++) {
        if (employees[i].Employeestatus === 'Working') {
          if (employees[i].Employeeasigned === req.session.usernames) {
            activeEmployees.push(employees[i]);
          }
        }
      }
      projectHelpers.getAllproject().then((projects) => {
        var activeProjects = [];
        for (let j = 0; j < projects.length; j++) {
          if (projects[j].projectstatus === 'Ongoing') {
            activeProjects.push(projects[j]);

          }
        }
        let datess = getthedate()

        res.render('./users/employee-list', {

          user: true, employees: JSON.stringify(activeEmployees), activeProjects, datess
        });
      })

    });
  }
})
router.post('/', (req, res) => {
  userHelpers.uLogin(req.body).then((response) => {
    if (response.status) {

      req.session.users = response.user
      req.session.usernames = response.user.usernames

      req.session.users = true
      res.redirect('/employeelist');

    } else {
      res.redirect('/')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})


//Time sheet upload
router.post('/users/employee-list/', async (req, res) => {

   
    let semployee = await employeHelpers.getEmployeeDetails(req.body.employee_id);



  var datasheet = req.body
  var datevalue = req.body.datevalue
  let datess = getthedate()

  if (datevalue === datess[0].date1) {
    var dateObj11 = new Date();
    dateObj11.setDate(dateObj11.getDate() - 1);
    datasheet.date = dateObj11;
  } else if (datevalue === datess[0].date2) {
    var dateObj22 = new Date();
    dateObj22.setDate(dateObj22.getDate() - 2);
    datasheet.date = dateObj22;
  } else {
    return 0;
  }
datasheet.employeeType = semployee.employeeType;
if(semployee.employeeType === 'Hired Labour'){
  datasheet.sbasic = '';
datasheet.sallowance = '';
datasheet.sbonus = ''; 
datasheet.srateph = semployee.srateph;
}else{
datasheet.sbasic = semployee.sbasic;
datasheet.sallowance = semployee.sallowance;
datasheet.sbonus = semployee.sbonus;
datasheet.srateph = '';
}

userHelpers.getDatasheet().then(function (edatasheet) {
  
  if (!edatasheet.length) {
    userHelpers.addDatasheet(datasheet, (result) => {

    })
  } else {
    let count = 0;
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let datec = 0;
    for (let i = 0; i < edatasheet.length; i++) {
     
      if (edatasheet[i].date.getFullYear() === datasheet.date.getFullYear()) {
        if (edatasheet[i].date.getMonth() === datasheet.date.getMonth()) {
          if (edatasheet[i].date.getDate() === datasheet.date.getDate()) {
            datec++;
            if (edatasheet[i].employee_id === datasheet.employee_id) {
              
              break;
            } else {

              count++;
            }
          }

          else {
            count1++;
            if (count1 === edatasheet.length) {
              userHelpers.addDatasheet(datasheet, (result) => {

              })
              break;
            }
          }
        } else {
          count2++;
          if (count2 === edatasheet.length) {
            userHelpers.addDatasheet(datasheet, (result) => {

            })
            break;
          }
        }
      } else {
        count3++;
        if (count3 === edatasheet.length) {
          userHelpers.addDatasheet(datasheet, (result) => {

          })
          break;
        }
      }
    }
    if (count === datec) {
      userHelpers.addDatasheet(datasheet, (result) => {

      })

    }
  }
})

});

router.get('/employee-data', function (req, res, next) {

  if (req.session.users) {
    userHelpers.getDatasheet().then(function (employeedatasheet) {
      let alloweddatasheet = []
      let alloweddatasheet1 = []
      let alloweddatasheet2 = []
      var activeEmployees1 = [];
      let lastdates = getthedate()

      for (let i = 0; i < employeedatasheet.length; i++) {


        if (employeedatasheet[i].datevalue === lastdates[0].date1) {
          alloweddatasheet1.push(employeedatasheet[i]);
        } else if (employeedatasheet[i].datevalue === lastdates[0].date2) {
          alloweddatasheet2.push(employeedatasheet[i]);
        }
      }
      employeHelpers.getAllemployee().then(function (employees) {
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].Employeeasigned === req.session.usernames) {
            activeEmployees1.push(employees[i]);
          }
        }
      })
      alloweddatasheet1.date = lastdates[0].date1;
      alloweddatasheet2.date = lastdates[0].date2;
      res.render('./users/datasheet', { user: true, alloweddatasheet1, alloweddatasheet2 });

    })
  }
});
router.get('/edit-datasheet/:id', async (req, res) => {

  let edatasheet = await userHelpers.getDatasheetDetails(req.params.id)
  var activeProjects = [];
  projectHelpers.getAllproject().then((projects) => {
    for (let j = 0; j < projects.length; j++) {
      if (projects[j].projectstatus === 'Ongoing') {
        activeProjects.push(projects[j]);
      }
    }
  })
  res.render('./users/edit-datasheet', { user: true, edatasheet, activeProjects })
})
router.post('/edit-datasheet/:id', (req, res) => {

  userHelpers.updateDatasheet(req.params.id, req.body).then(() => {
    res.redirect('/employee-data')
  })
})

module.exports = router;
