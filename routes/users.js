var express = require('express');

const bodyParser = require('body-parser');

var router = express.Router();
var employeHelpers = require('../helpers/employee-helpers')
var projectHelpers = require('../helpers/project-helpers')
var userHelpers = require('../helpers/user-helper');
var expiringTimeliest = require('../modules/cron');
var DayView = require('../modules/DayView')

const { all } = require('../app');
const async = require('hbs/lib/async');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cron = require('node-cron')
const schedule = require('node-schedule');
process.env.TZ = 'Asia/Qatar';
const pdf = require('html-pdf');
const puppeteer = require('puppeteer');
cron.schedule('55 23 * * *',() => {
  var dateObj2 = new Date();
  dateObj2.setDate(dateObj2.getDate() - 2);
  if(dateObj2.getDay() === 5){
 expiringTimeliest.cronfriday()
  }else{
    expiringTimeliest.cronnotfriday()
  }
})


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


router.get('/', function (req, res, next) {
  res.render('./users/user-login');
});

function checkAdminSession(req, res, next) {
  if (req.session.user) {
    next(); // User is authenticated, proceed to the next middleware or route
  } else {
    res.redirect('/'); // Redirect to login page if not authenticated
  }
}
// Apply middleware to all admin routes
router.use(checkAdminSession);
// routes/admin.js

// Middleware for checking admin session
function checkAdminSession(req, res, next) {
  if (req.session.user) {
    next(); // Proceed if the admin session exists
  } else {
    res.redirect('/'); // Redirect to login if not authenticated
  }
}

// Apply middleware to all routes
router.use(checkAdminSession);

router.get('/employeelist', async function (req, res) {
  if (req.session.users) {
    try {
      let dateObj1 = new Date();
        dateObj1.setDate(dateObj1.getDate() - 1);
        var date1 = dateObj1.getFullYear() + '-' + (dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();
        let datess = []
        datess.date1 = date1
        var days = DayView.dayview(date1)
        datess.days = days

      // Fetch all employees
      let employees = await employeHelpers.getAllemployee();
      
      // Fetch last date values
      let lastdates = getthedate(); // Assuming getthedate is synchronous and returns an array of date objects
      let employeedatasheet = await userHelpers.gettimesheetbydatevalue(lastdates[0].date1);
      
      // Filter active employees
      let activeEmployees = employees.filter(employee => {
        return employee.Employeestatus === 'Working' &&
          !employeedatasheet.some(sheet => sheet.employee_id === employee._id.toString()) &&
          employee.Employeeasigned === req.session.usernames;
      });

      // Fetch all projects
      let projects = await projectHelpers.getAllproject();
      
      // Filter active projects
      let activeProjects = projects.filter(project => project.projectstatus === 'Ongoing');
      

      if(activeEmployees.length === 0){
        res.render('./users/submissiondone', {
          user: true,
          employees: JSON.stringify(activeEmployees),
          activeProjects,
          datess
        });
       
        }else{
         res.render('./users/employee-list', {
          user: true,
          employees: JSON.stringify(activeEmployees),
          activeProjects,
          datess
        });  
        }
    } catch (error) {
      console.error("Error fetching employee list:", error);
      res.status(500).send("Internal Server Error");
    }
  } 
})
router.get('/employeelist2', async function (req, res) {
  if (req.session.users) {
    try {
      let dateObj1 = new Date();
        dateObj1.setDate(dateObj1.getDate() - 2);
        var date2 = dateObj1.getFullYear() + '-' + (dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();
        let datess = []
        datess.date2 = date2
        var days = DayView.dayview(date2)
        datess.days = days

      // Fetch all employees
      let employees = await employeHelpers.getAllemployee();
      
      // Fetch last date values
      let lastdates = getthedate(); // Assuming getthedate is synchronous and returns an array of date objects
      let employeedatasheet = await userHelpers.gettimesheetbydatevalue(lastdates[0].date2);
      
      // Filter active employees
      let activeEmployees = employees.filter(employee => {
        return employee.Employeestatus === 'Working' &&
          !employeedatasheet.some(sheet => sheet.employee_id === employee._id.toString()) &&
          employee.Employeeasigned === req.session.usernames;
      });

      // Fetch all projects
      let projects = await projectHelpers.getAllproject();
      
      // Filter active projects
      let activeProjects = projects.filter(project => project.projectstatus === 'Ongoing');
      if(activeEmployees.length === 0){
      res.render('./users/submissiondone', {
          user: true,
          employees: JSON.stringify(activeEmployees),
          activeProjects,
          datess
        });
      }else{
        res.render('./users/employee-list2', {
          user: true,
          employees: JSON.stringify(activeEmployees),
          activeProjects,
          datess
        });
        
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
      res.status(500).send("Internal Server Error");
    }
  } 
})


router.get('/printdatasheet', async (req, res) => {
  try {
    const employeedatasheet = await userHelpers.getDatasheet();
    const alloweddatasheet1 = [];
    const activeEmployees1 = [];
    const lastdates = getthedate();

    const employees = await employeHelpers.getAllemployee();
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].Employeeasigned === req.session.usernames) {
        activeEmployees1.push(employees[i]);
      }
    }

    for (let z = 0; z < employeedatasheet.length; z++) {
      if (employeedatasheet[z].datevalue === lastdates[0].date1) {
        for (let x = 0; x < activeEmployees1.length; x++) {
          if (activeEmployees1[x]._id.toString() === employeedatasheet[z].employee_id) {
            alloweddatasheet1.push(employeedatasheet[z]);
          }
        }
      }
    }

    for (let t = 0; t < alloweddatasheet1.length; t++) {
      alloweddatasheet1[t].index = t + 1;
    }


    alloweddatasheet1.date = DayView.dayview(lastdates[0].date1) ;

    res.render('template', { alloweddatasheet1 }, (err, html) => {
      if (err) {
        return res.status(500).send(err);
      }

      (async () => {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        res.setHeader('Content-Type', 'application/pdf');
        const formattedDate = DayView.dayview(lastdates[0].date1);
        res.setHeader('Content-Disposition', `attachment; filename="${formattedDate}_Timesheet.pdf"`);

        res.send(pdfBuffer);

        await browser.close();
      })();
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/printdatasheet2', async (req, res) => {
  try {
    const employeedatasheet = await userHelpers.getDatasheet();
    const alloweddatasheet1 = [];
    const activeEmployees1 = [];
    const lastdates = getthedate();

    const employees = await employeHelpers.getAllemployee();
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].Employeeasigned === req.session.usernames) {
        activeEmployees1.push(employees[i]);
      }
    }

    for (let z = 0; z < employeedatasheet.length; z++) {
      if (employeedatasheet[z].datevalue === lastdates[0].date2) {
        for (let x = 0; x < activeEmployees1.length; x++) {
          if (activeEmployees1[x]._id.toString() === employeedatasheet[z].employee_id) {
            alloweddatasheet1.push(employeedatasheet[z]);
          }
        }
      }
    }

    for (let t = 0; t < alloweddatasheet1.length; t++) {
      alloweddatasheet1[t].index = t + 1;
    }

    alloweddatasheet1.date = DayView.dayview(lastdates[0].date2) ;

    res.render('template', { alloweddatasheet1 }, (err, html) => {
      if (err) {
        return res.status(500).send(err);
      }

      (async () => {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        res.setHeader('Content-Type', 'application/pdf');
        const formattedDate = DayView.dayview(lastdates[0].date2);
        res.setHeader('Content-Disposition', `attachment; filename="${formattedDate}_Timesheet.pdf"`);
        res.send(pdfBuffer);

        await browser.close();
      })();
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});



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
// router.post('/users/employee-list/', async (req, res) => {
  

   
//  let semployee = await employeHelpers.getEmployeeDetails(req.body.employee_id);

//   var datasheet = req.body
//   var datevalue = req.body.datevalue
//   let datess = getthedate()

//   if (datevalue === datess[0].date1) {
//     var dateObj11 = new Date();
//     dateObj11.setDate(dateObj11.getDate() - 1);
//     datasheet.date = dateObj11;
//   } else if (datevalue === datess[0].date2) {
//     var dateObj22 = new Date();
//     dateObj22.setDate(dateObj22.getDate() - 2);
//     datasheet.date = dateObj22;
//   } else {
//     return 0;
//   }
// datasheet.employeeType = semployee.employeeType;
//   const dd = new Date(datasheet.date); 
//   if(dd.getDay() === 5){
//     if(semployee.employeeType === 'Hired Labour (Hourly)'){
//       datasheet.sbasic = '';
//     datasheet.sallowance = '';
//     datasheet.sbonus = ''; 
//     datasheet.srateph = semployee.srateph;
//     datasheet.workinghour = '0';
//     if(datasheet.todaystatus === 'Paid Leave'){
//       datasheet.todaystatus = 'Unpaid Leave'
//     }
//     }else{
//     datasheet.sbasic = semployee.sbasic;
//     datasheet.sallowance = semployee.sallowance;
//     datasheet.sbonus = semployee.sbonus;
//     datasheet.srateph = '';
//     datasheet.workinghour = '0';
//     }

//   }else{

// if(semployee.employeeType === 'Hired Labour (Hourly)'){
//   datasheet.sbasic = '';
// datasheet.sallowance = '';
// datasheet.sbonus = ''; 
// datasheet.srateph = semployee.srateph;
// datasheet.workinghour = '8';
// if(datasheet.todaystatus === 'Paid Leave'){
//   datasheet.todaystatus = 'Unpaid Leave'
// }
// }else{
// datasheet.sbasic = semployee.sbasic;
// datasheet.sallowance = semployee.sallowance;
// datasheet.sbonus = semployee.sbonus;
// datasheet.srateph = '';
// datasheet.workinghour = '8';
// }
// }
// userHelpers.getTimesheet(datevalue , datasheet.employee_id).then(function (edatasheets) {
// if(edatasheets.length === 0){
//   userHelpers.addDatasheet(datasheet, (result) => {
//  })
  
// }
// })

// });
router.post('/users/employee-list/batch', async (req, res) => {
  const timesheets = req.body.timesheets; // This is an array of timesheet objects.
  
  // Loop through each timesheet entry and process it.
  for (const datasheet of timesheets) {
    // Retrieve employee details.
    let semployee = await employeHelpers.getEmployeeDetails(datasheet.employee_id);
    
    // Adjust date as needed using your current logic.
    var datevalue = datasheet.datevalue;
    let datess = getthedate();
    if (datevalue === datess[0].date1) {
      var dateObj11 = new Date();
      dateObj11.setDate(dateObj11.getDate() - 1);
      datasheet.date = dateObj11;
    } else if (datevalue === datess[0].date2) {
      var dateObj22 = new Date();
      dateObj22.setDate(dateObj22.getDate() - 2);
      datasheet.date = dateObj22;
    } else {
      continue;  // Skip processing this entry if date doesn’t match.
    }
    
    datasheet.employeeType = semployee.employeeType;
    const dd = new Date(datasheet.date); 
    if (dd.getDay() === 5) {
      if (semployee.employeeType === 'Hired Labour (Hourly)') {
        datasheet.sbasic = '';
        datasheet.sallowance = '';
        datasheet.sbonus = ''; 
        datasheet.srateph = semployee.srateph;
        datasheet.workinghour = '0';
        if (datasheet.todaystatus === 'Paid Leave') {
          datasheet.todaystatus = 'Unpaid Leave';
        }
      } else {
        datasheet.sbasic = semployee.sbasic;
        datasheet.sallowance = semployee.sallowance;
        datasheet.sbonus = semployee.sbonus;
        datasheet.srateph = '';
        datasheet.workinghour = '0';
      }
    } else {
      if (semployee.employeeType === 'Hired Labour (Hourly)') {
        datasheet.sbasic = '';
        datasheet.sallowance = '';
        datasheet.sbonus = ''; 
        datasheet.srateph = semployee.srateph;
        datasheet.workinghour = '8';
        if (datasheet.todaystatus === 'Paid Leave') {
          datasheet.todaystatus = 'Unpaid Leave';
        }
      } else {
        datasheet.sbasic = semployee.sbasic;
        datasheet.sallowance = semployee.sallowance;
        datasheet.sbonus = semployee.sbonus;
        datasheet.srateph = '';
        datasheet.workinghour = '8';
      }
    }

    // Check if an entry already exists before adding:
    const edatasheets = await userHelpers.getTimesheet(datevalue, datasheet.employee_id);
    if (edatasheets.length === 0) {
      // You can perform a bulk insert here if your database supports it.
      await userHelpers.addDatasheet(datasheet, (result) => {
        // Callback logic if needed.
      });
    }
  }


});


router.get('/employee-data', function (req, res, next) {

  if (req.session.users) {
    let lastdates = getthedate() 
    userHelpers.gettimesheetbydatevalue(lastdates[0].date1).then(function (employeedatasheet) {    
      let alloweddatasheet1 = []
      var activeEmployees1 = [];
      employeHelpers.getAllemployee().then(function (employees) {
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].Employeeasigned === req.session.usernames) {
            activeEmployees1.push(employees[i]);
          }
        }

        for (let z = 0; z < employeedatasheet.length; z++) {          
            for(let x=0; x < activeEmployees1.length; x++){
              if(activeEmployees1[x]._id.toString() === employeedatasheet[z].employee_id){
                alloweddatasheet1.push(employeedatasheet[z]);
               
              } 
            }

        }   
        for(let t=0; t<alloweddatasheet1.length; t++){
          alloweddatasheet1[t].index = t+1
        }    
      alloweddatasheet1.date = DayView.dayview(lastdates[0].date1) ;
        res.render('./users/datasheet' , { user: true,  alloweddatasheet1 });
      });
    });
  }
});



router.get('/employee-data2', function (req, res, next) {

  if (req.session.users) {
    userHelpers.getDatasheet().then(function (employeedatasheet) {
     
      let alloweddatasheet2 = []
      var activeEmployees1 = [];
      let lastdates = getthedate() 

      employeHelpers.getAllemployee().then(function (employees) {
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].Employeeasigned === req.session.usernames) {
            activeEmployees1.push(employees[i]);
          }
        }

        for (let z = 0; z < employeedatasheet.length; z++) {
           if (employeedatasheet[z].datevalue === lastdates[0].date2) {
            for(let x=0; x < activeEmployees1.length; x++){
              if(activeEmployees1[x]._id.toString() === employeedatasheet[z].employee_id){
                alloweddatasheet2.push(employeedatasheet[z]);
               
              } 
            }
          }
        }

   
        for(let t=0; t<alloweddatasheet2.length; t++){
          alloweddatasheet2[t].index = t+1
        }

     
    
      alloweddatasheet2.date = DayView.dayview(lastdates[0].date2) ;
      

        res.render('./users/datasheet2' , { user: true,  alloweddatasheet2 });
      });
    });
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



