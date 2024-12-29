var express = require("express");
var router = express.Router();
var employeHelpers = require("../helpers/employee-helpers");
var projectHelpers = require("../helpers/project-helpers");
var adminHelpers = require("../helpers/admin-helper");
var userHelpers = require("../helpers/user-helper");
var reportHelpers = require("../helpers/report-helpers");
const { response } = require("../app");
const async = require("hbs/lib/async");
const { search } = require("./users");
var DayView = require('../modules/DayView')
var ProjectReport = require('../modules/functions')
var allprojectreport = require('../modules/project-report')
const puppeteer = require('puppeteer');
//var addcron = require('../modules/notcron')
var salarycalc = require('../modules/salarycalc')
const cron = require('node-cron')
const dayjs = require('dayjs'); // For date manipulations
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
router.get("/create", function (req, res, next) {
  
  res.render('admin/create');


});

// router.post("/create", async (req, res) => {
//   try {
//     const response = await adminHelpers.createAdmin(req.body);
//     if (response.status) {
//       // Admin created successfully
//       res.status(201).send("Admin created successfully");
//     } else {
//       // Could not create admin (maybe username is taken, etc.)
//       res.status(400).send(response.message || "Error creating admin");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

//admin login

router.get("/", function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/admin/dashboard");
  } else res.render("./admin/admin-login");
});
//post login

router.post("/", async (req, res) => {
  const response = await adminHelpers.doLogin(req.body);
  if (response.status) {
    // Store admin object in session or do whatever you need
    req.session.user = response.admin;
    req.session.user = true;
    
    // Redirect to dashboard or wherever
    res.redirect("/admin/dashboard");
  } else {
    // Login failed, redirect back or show an error
    res.redirect("/admin");
  }
});


// logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});


// routes/admin.js (or your relevant routes file)

// routes/admin.js

// routes/admin.js
router.get("/dashboard", async function (req, res, next) {
  try {
    let admin = req.session.user;

    const reportData = await ProjectReport.getProjectReportTotalsForLast12Months();
    const counts = await ProjectReport.getCounts();
      ProjectReport.reportForDashboard()

    // Render your view
    res.render("./admin/dashboard", {
      admin: true,
      counts,
      // possibly embed categories, data into the template too
      categories: reportData.categories,
      data: reportData.data
    });
  } catch (error) {
    console.error("Error in /dashboard route:", error);
    return res.status(500).send("Internal Server Error");
  }
});



//employee list

router.get("/employee", function (req, res, next) {
  let admin = req.session.user;
  if (admin) {

    employeHelpers.getAllemployee().then((employee) => {
   for(let i=0; i<employee.length; i++){
    employee[i].index = i+1;
   }
      res.render("./admin/employee", { admin: true, employee });
    });
  }
});


router.get("/projects", function (req, res, next) {
  let admin = req.session.user;

  if (admin) {
    
    projectHelpers.getAllproject().then((project) => {
    
      const statusOrder = { "Ongoing": 1, "OnHold": 2, "Completed": 3 };
      project.sort((a, b) => statusOrder[a.projectstatus] - statusOrder[b.projectstatus]);
      for(let i=0; i<project.length; i++){
        project[i].index = i+1;
       }
      res.render("./admin/projects", { admin: true, project });
    });
  }
});


//add employee

router.get("/add-employee", function (req, res, next) {
  let admin = req.session.user;
  if (admin) {
    userHelpers.getAlluser().then((users) => {

      

      res.render("./admin/add-employee", { admin: true, users });
    });
  }
});

//add project
 
router.get("/add-project", function (req, res, next) {
  let admin = req.session.user;
  if (admin) {
    res.render("./admin/add-project", { admin: true });
  }
});

//user setting

router.get("/user-setting", function (req, res, next) {
  let admin = req.session.user;
  if (admin) {
    userHelpers.getAlluser().then((users) => {
      for(let i = 0; i<users.length; i++){
        users[i].index = i+1;
      }
      res.render("./admin/user-setting", { admin: true, users });
    });
  }
});

//add user

router.get("/add-user", function (req, res, next) {
  let admin = req.session.user;
  if (admin) {
    res.render("./admin/add-user", { admin: true });
  }
});

//post add employee
router.post("/add-employee", function (req, res) {
  employeHelpers.getAllemployee().then((employees) => {
    const employeeExists = employees.some((employee) => employee.qid === req.body.qid);
    if (employeeExists) {
      res.redirect("/admin/add-employee?error=employeeExists");
    } else {
      employeHelpers.addemployee(req.body, (success) => {
        if (success) {
          res.redirect("/admin/add-employee?success=employeeAdded");
        } else {
          res.redirect("/admin/add-employee?error=addFailed");
        }
      });
    }
  });
});


//post add project

router.post("/add-project", function (req, res) {
  projectHelpers.addproject(req.body, () => {
    res.render("./admin/add-project", { admin: true });
  });
});

//post add user

router.post("/add-user", function (req, res) {
  userHelpers.adduser(req.body, () => {
    res.redirect("/admin/user-setting");
  });
});


//edit employee

router.get("/edit-employee/:id", async (req, res) => {
  let semployee = await employeHelpers.getEmployeeDetails(req.params.id);

  userHelpers.getAlluser().then((users) => {
    res.render("admin/edit-employee", { admin: true, semployee, users });
  });
});
router.post("/edit-employee/:id", (req, res) => {
  employeHelpers.updateEmployee(req.params.id, req.body).then(() => {
    res.redirect("/admin/employee");
  });
});
//delete employee

router.get("/delete-employee/:id", (req, res) => {
  let empId = req.params.id;
  employeHelpers.deleteEmployee(empId).then((response) => {
    res.redirect("/admin/employee");
  });
});

//edit project

router.get("/edit-project/:id", async (req, res) => {
  let sproject = await projectHelpers.getProjectDetails(req.params.id);

  res.render("admin/edit-project", { admin: true, sproject });
});
router.post("/edit-project/:id", (req, res) => {
  projectHelpers.updateProject(req.params.id, req.body).then(() => {
    res.redirect("/admin/projects");
  });
});
//delete project

router.get("/delete-project/:id", (req, res) => {
  let proId = req.params.id;
  projectHelpers.deleteProject(proId).then((response) => {
    res.redirect("/admin/projects");
  });
});
//edit user

router.get("/edit-user/:id", async (req, res) => {
  let suser = await userHelpers.getuserDetails(req.params.id);
  res.render("admin/edit-user", { admin: true, suser });
});
router.post("/edit-user/:id", (req, res) => {
  userHelpers.updateuser(req.params.id, req.body).then(() => {
    res.redirect("/admin/user-setting");
  });
});
//delete user

router.get("/delete-user/:id", (req, res) => {
  let userId = req.params.id;
  userHelpers.deleteuser(userId).then((response) => {
    res.redirect("/admin/user-setting");
  });
});

//adminsetting

router.get("/admin-dlogin", function (req, res, next) {
  let admin = req.session.user;
  if (admin) {
    res.render("./admin/admin-dlogin", { admin: true });
  }
});
router.get("/edit-admin", async function (req, res) {
  let sadmin = await adminHelpers.getadminDetails();
  if (req.session.adminuser) {
    res.render("admin/edit-admin", { admin: true, sadmin });
  }
});

router.post("/admin-dlogin", async (req, res) => {
  try {
    // Call your login helper
    const response = await adminHelpers.doLogin(req.body);
    
    if (response.status) {
      
      let sadmin = await adminHelpers.getadminDetails();

    res.render("admin/edit-admin", { admin: true, sadmin });        // redirect to the edit-admin page
    } else {
      // If login fails, perhaps set an error message and redirect to login again
      req.session.loginError = "Invalid credentials. Please try again.";
      res.redirect("/admin/admin-dlogin");
    }
  } catch (error) {
    console.error(error);
    // Handle unexpected errors
    res.status(500).send("Internal Server Error");
  }
});


router.post("/edit-admin/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const adminDetails = req.body;

    const response = await adminHelpers.updateadmin(adminId, adminDetails);
    if (response.status) {
      // Set a success message in the session
      warningMessage = `Admin Credentials Reseted successfully!`;
      req.session.destroy();
      res.redirect("/admin");
    } else {
      res.status(400).send("Failed to update admin details");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


//  datasheet
router.get("/datasheet", function (req, res) {
  let admin = req.session.user;
  if (admin) {
    res.render("./admin/datasheet", { admin: true });
  }
});

router.post("/datasheet", async function (req, res) {
  try {
    // Parse the date from the request body
    const d = new Date(req.body.searchdate);

    // Retrieve the timesheet data by date
    const searchdatasheet = await userHelpers.gettimesheetbydate(d);

    // Define the order for employeeType
    const employeeTypeOrder = [
      'Own Labour',
      'Hired Labour (Monthly)',
      'Hired Labour (Hourly)',
      'Hired Staff (Projects)',
      'Own Staff (Projects)', 
      'Own Staff (Operations)', 
      'Hired Staff (Operations)'  
    ];

    // Sort the searchdatasheet array based on the employeeType
    searchdatasheet.sort((a, b) => {
      return employeeTypeOrder.indexOf(a.employeeType) - employeeTypeOrder.indexOf(b.employeeType);
    });

    // Add an index to each element in the searchdatasheet array
    searchdatasheet.forEach((item, index) => {
      item.index = index + 1;
    });

    // Check if there are any results in the searchdatasheet array
    if(searchdatasheet[0]){

      searchdatasheet.date =DayView.dayview(searchdatasheet[0].datevalue) ;
      searchdatasheet.date1 = searchdatasheet[0].datevalue
      searchdatasheet.workinghour1 = searchdatasheet[0].workinghour
      searchdatasheet.searcheddate = d
      }
   

    // Render the template with the searchdatasheet data
    res.render("./admin/searchdatasheet", { admin: true, searchdatasheet });
  } catch (error) {
    console.error("Error fetching timesheet data:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/predatasheet/", async function (req, res) {
  try {
    // Parse the date from the request body and check if it's valid
    const d = new Date(req.body.searcheddate);
    if (isNaN(d)) {
      return res.status(400).send("Invalid date format");
    }

    // Subtract one day from the date
    d.setDate(d.getDate() - 1);

    // Retrieve the timesheet data by date
    const searchdatasheet = await userHelpers.gettimesheetbydate(d);

    // Define the order for employeeType
    const employeeTypeOrder = [
      'Own Labour',
      'Hired Labour (Monthly)',
      'Hired Labour (Hourly)',
      'Hired Staff (Projects)',
      'Own Staff (Projects)', 
      'Own Staff (Operations)', 
      'Hired Staff (Operations)'  
    ];

    // Sort the searchdatasheet array based on the employeeType
    searchdatasheet.sort((a, b) => {
      return employeeTypeOrder.indexOf(a.employeeType) - employeeTypeOrder.indexOf(b.employeeType);
    });

    // Add an index to each element in the searchdatasheet array
    searchdatasheet.forEach((item, index) => {
      item.index = index + 1;
    });

    // Check if there are any results in the searchdatasheet array
    if(searchdatasheet[0]){

      searchdatasheet.date =DayView.dayview(searchdatasheet[0].datevalue) ;
      searchdatasheet.date1 = searchdatasheet[0].datevalue
      searchdatasheet.workinghour1 = searchdatasheet[0].workinghour
      searchdatasheet.searcheddate = d
      }

    // Render the template with the searchdatasheet data
    res.render("./admin/searchdatasheet", { admin: true, searchdatasheet });
  } catch (error) {
    console.error("Error fetching timesheet by date:", error);
    res.status(500).send("Error fetching timesheet data");
  }
});

router.post("/nextdatasheet/", async function (req, res) {
  try {
    // Parse the date from the request body and check if it's valid
    const d = new Date(req.body.searcheddate);
    if (isNaN(d)) {
      return res.status(400).send("Invalid date format");
    }

    // Increment the date by one day
    d.setDate(d.getDate() + 1);

    // Get the current date at midnight
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (d > currentDate) {
      return res.status(400).send("No Timesheet available");
    }

    // Retrieve the timesheet data by date
    const searchdatasheet = await userHelpers.gettimesheetbydate(d);

    // Define the order for employeeType
    const employeeTypeOrder = [
      'Own Labour',
      'Hired Labour (Monthly)',
      'Hired Labour (Hourly)',
      'Hired Staff (Projects)',
      'Own Staff (Projects)', 
      'Own Staff (Operations)', 
      'Hired Staff (Operations)'  
    ];

    // Sort the searchdatasheet array based on the employeeType
    searchdatasheet.sort((a, b) => {
      return employeeTypeOrder.indexOf(a.employeeType) - employeeTypeOrder.indexOf(b.employeeType);
    });

    // Add an index to each element in the searchdatasheet array
    searchdatasheet.forEach((item, index) => {
      item.index = index + 1;
    });

    if(searchdatasheet[0]){

      searchdatasheet.date =DayView.dayview(searchdatasheet[0].datevalue) ;
      searchdatasheet.date1 = searchdatasheet[0].datevalue
      searchdatasheet.workinghour1 = searchdatasheet[0].workinghour
      searchdatasheet.searcheddate = d
      }

    // Render the template with the searchdatasheet data
    res.render("./admin/searchdatasheet", { admin: true, searchdatasheet });
  } catch (error) {
    console.error("Error fetching timesheet by date:", error);
    res.status(500).send("Error fetching timesheet data");
  }
});



router.post("/change-workhour/:date", function (req, res) {

const targetDate = req.params.date; // Replace with your target date
const newWorkingHour = req.body.workhour;
if(newWorkingHour > 0){
  userHelpers.updateWorkingHourForDate(targetDate, newWorkingHour);

}else{
  
  userHelpers.updateWorkingHourAndStatusForDate(targetDate, newWorkingHour)
  userHelpers.updateWorkingHourForDate(targetDate, newWorkingHour);
}

const d = new Date(req.params.date);
 userHelpers.gettimesheetbydate(d).then(function ( searchdatasheet){
    let ar = 0;
    for (let i = 0; i < searchdatasheet.length; i++) {
        searchdatasheet[ar].index = ar + 1;
        ar++;
    }
    if(searchdatasheet[0]){
    searchdatasheet.date =DayView.dayview(searchdatasheet[0].datevalue) ;
    searchdatasheet.date1 = searchdatasheet[0].datevalue
    searchdatasheet.workinghour1 = searchdatasheet[0].workinghour
    searchdatasheet.searcheddate = d
    }

    res.render("./admin/searchdatasheet", { admin: true, searchdatasheet });
  });
  
});

router.get("/edit-datasheets/:id", async (req, res) => {
  let edatasheet = await userHelpers.getDatasheetDetails(req.params.id);
  var activeProjects = [];
  projectHelpers.getAllproject().then((projects) => {
    for (let j = 0; j < projects.length; j++) {
      if (projects[j].projectstatus === "Ongoing") {
        activeProjects.push(projects[j]);
      }
    }
  });
  res.render("./admin/edit-datasheets", {
    admin: true,
    edatasheet,
    activeProjects,
  });
});
router.post("/edit-datasheets/:id", (req, res) => {
  userHelpers.updateDatasheet(req.params.id, req.body).then(() => {
    res.redirect("/admin/datasheet");
  });
});

router.get("/datasearch/:id", function (req, res) {
  let admin = req.session.user;

  if (admin) {
    var idd = req.params.id;

    res.render("./admin/datasearch", { admin: true, idd });
  }
});
router.post("/datasearch", async (req, res) => {
  let searcheddatas = [];

  // Fetch employee details using the employee_id from the request body
  let datadetail = await employeHelpers.getEmployeeDetails(req.body.employee_id);

  // Fetch data between startdate and enddate using userHelpers.getdatabdate
  userHelpers.getdatabdate(req.body.startdate, req.body.enddate).then(function (databdate) {
    // Iterate through the fetched data and filter by the given employee_id
    for (let i = 0; i < databdate.length; i++) {
      if (databdate[i].employee_id === req.body.employee_id) {
        searcheddatas.push({}); // Initialize with an empty object
        searcheddatas[searcheddatas.length - 1] = databdate[i];
      }
    }

    // Sort the searched data based on the 'date' property in ascending order
    const searcheddata = searcheddatas.sort(
      (objA, objB) => Number(objA.date) - Number(objB.date)
    );

    // Assign an 'index' property to each element in the searched data
    for(let j = 0; j < searcheddata.length; j++ ){ 
      searcheddata[j].index = j + 1;
    }

    // Render a view with the searched data, employee details, and some additional flags
    res.render("./admin/searcheddata", {
      admin: true,
      searcheddata,
      datadetail,
    });
  });
});


router.get("/edit-searcheddata/:id", async (req, res) => {
  let edatasheet = await userHelpers.getDatasheetDetails(req.params.id);
  var activeProjects = [];
  projectHelpers.getAllproject().then((projects) => {
    for (let j = 0; j < projects.length; j++) {
      if (projects[j].projectstatus === "Ongoing") {
        activeProjects.push(projects[j]);
      }
    }
  });
  res.render("./admin/edit-searcheddata", {
    admin: true,
    edatasheet,
    activeProjects,
  });
});
router.post("/edit-searcheddata/:id", (req, res) => {
  userHelpers.updateDatasheet(req.params.id, req.body).then(() => {
    res.redirect("/admin/employee");
  });
});


router.get("/search-report/", function (req, res) {
  let admin = req.session.user;
  if (admin) {
    var iddd = req.params.id;

    res.render("./admin/report-search", { admin: true, iddd });
  }
});

router.post("/search-report", async (req, res) => {
  
  try {
  let searchdata = {}
  let totalsum = {}

  var formattedDate = DayView.getMonthAndYear(req.body.searchdate)
  const salarystatus = await reportHelpers.getSalaryStatusByDate(req.body.searchdate);


  searchdata.formattedDate = formattedDate
  searchdata.searchdate = req.body.searchdate
  searchdata.employeeType = req.body.employeeType
   const result = await salarycalc.salarycalculate(req.body.searchdate , req.body.employeeType)
   result.Fstore.formattedDate = formattedDate
   result.Fstore.ClosedDate = DayView.getCurrentDate()
   let Fstore = result.Fstore
   let employeereport = result.employeereport
   totalsum.sum = result.sum
   const month = parseInt(req.body.searchdate.split('-')[1]);
   
   const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
   if (monthsWith31Days.includes(month)) {
       res.render("./admin/report-view", { admin: true, employeereport , searchdata , totalsum , Fstore , salarystatus });      
   } else {
       res.render("./admin/report-view2", { admin: true, employeereport , searchdata , totalsum , Fstore , salarystatus});
   }
  }
   catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/edit-salary/:id", (req, res) => {
  const todaydate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  
  let reqdate;

  if (req.body.month === 'This Month') {
    reqdate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
  } else if (req.body.month === 'Last Month') {
    reqdate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  }
  if(req.body.employeeType === 'Hired Labour (Hourly)'){
    req.body.sbasic = ''
    req.body.sallowance = ''
    req.body.sbonus = ''

  }else{
    req.body.srateph = ''
  }
  if(reqdate === todaydate){
      employeHelpers.updateSalary(req.params.id, req.body).then(() => {
      res.redirect("/admin/employee");
    })
  }else{
   userHelpers.getdatabdate(reqdate, todaydate).then(function (databdate) {
    let targetdata = databdate.filter((data) => data.employee_id === req.params.id);
   
    if(targetdata.length === 0){
      employeHelpers.updateSalary(req.params.id, req.body).then(() => {
        res.redirect("/admin/employee");
      })
    }else{
      for(i=0; i<targetdata.length; i++){ 
      
       userHelpers.deleteTimesheet(targetdata[i]._id.toString()).then((response) => {
        
        
    });
    if(targetdata[i].employeeType === 'Hired Labour (Hourly)' && req.body.employeeType === 'Hired Labour (Hourly)'){
      targetdata[i].srateph = req.body.srateph
    }else if(req.body.employeeType === 'Hired Labour (Hourly)' ){
      targetdata[i].employeeType = req.body.employeeType 
      targetdata[i].srateph = req.body.srateph
      delete targetdata[i].sbasic
      delete targetdata[i].sallowance
      delete targetdata[i].sbonus
    }else{
       targetdata[i].employeeType = req.body.employeeType 
       targetdata[i].sbasic = req.body.sbasic
       targetdata[i].sallowance = req.body.sallowance
       targetdata[i].sbonus = req.body.sbonus
       delete targetdata[i].srateph
    }
   
    userHelpers.addDatasheet(targetdata[i], (result) => {     
    })
    }

    employeHelpers.updateSalary(req.params.id, req.body).then(() => {
      res.redirect("/admin/employee");
    })
  }
  
  });
  }
  
});


router.post('/printreport', async (req, res) => {
 
  try {
    var index = 0
    let searchdata = {}
    let totalsum = {}
    searchdata.searchdate = req.body.searchdate
    const result = await salarycalc.salarycalculate(req.body.searchdate , req.body.employeeType)
   let employeereport = result.employeereport
   totalsum.sum = result.sum

  
   
   const month = parseInt(req.body.searchdate.split('-')[1]);
  var formattedDate = DayView.getMonthAndYear(req.body.searchdate)
  
  employeereport.date = formattedDate
  employeereport.currentDate = DayView.getCurrentDate()
  employeereport.employeeType = req.body.employeeType

   const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
   if (monthsWith31Days.includes(month)) {
      
      res.render('reporttemplate', { employeereport, totalsum }, async (err, html) => {
        if (err) {
          return res.status(500).send(err);
        }
  
        try {
          const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
          const page = await browser.newPage();
          await page.setContent(html);
  
          const pdfBuffer = await page.pdf({
            format: 'A4',            
            width: '1600px',          
            height: '595px',          
            landscape: true,      
            // margin: { top: 20, right: 20, bottom: 20, left: 20 },
          });
          
  
          res.setHeader('Content-Type', 'application/pdf');
          
          res.setHeader('Content-Disposition', `attachment; filename="Salary Statement_${formattedDate}.pdf"`);
          res.send(pdfBuffer);
  
          await browser.close();
        } catch (error) {
          console.error('Error generating PDF:', error);
          res.status(500).send('Internal Server Error');
        }
      });
      
       
   } else {
    res.render('reporttemplate2', { employeereport , totalsum }, async (err, html) => {
      if (err) {
        return res.status(500).send(err);
      }

      try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBuffer = await page.pdf({
          format: 'A4',
          width: '1600px',
          height: '595px',
          landscape: true,
        });
        

        res.setHeader('Content-Type', 'application/pdf');
       
        res.setHeader('Content-Disposition', `attachment; filename="Salary Statement_${formattedDate}.pdf"`);
        res.send(pdfBuffer);

        await browser.close();
      } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Internal Server Error');
      }
    });
   }
   
   
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// project report
router.get("/project-search/",  (req, res) => {
  let admin = req.session.user;
  if (admin) {
    res.render("./admin/project-search", { admin: true });
  }
});

router.post( "/project-search", async (req, res) => {
 
    try {
      const { searchdate } = req.body;

      // Fetch the existing projectreport document using the helper
      const existingReport = await reportHelpers.getProjectReportByDate(searchdate);

      if (!existingReport) {
        return res.status(404).send(`No project report found for date: ${searchdate}`);
      }

      if (existingReport.salarystatus.toLowerCase() === 'close') {
        const { projectimesheets, sumemployeetype } = existingReport;

        if (!projectimesheets || !sumemployeetype) {
          return res.status(500).send("Incomplete report data in the database.");
        }

        return res.render("./admin/project-report", { 
          admin: true, 
          projectimesheets, 
          sumemployeetype 
        });
      }

      // Proceed to generate and update the report as before
      const report = await ProjectReport.ProjectReport(searchdate);
      const { projectimesheets, sumemployeetype } = report;

      if (!projectimesheets || !sumemployeetype) {
        return res.status(500).send("Invalid report data generated.");
      }

      try {
        await reportHelpers.addProjectReportDataIfOpen(
          searchdate,
          projectimesheets,
          sumemployeetype
        );
      } catch (updateError) {
        return res.status(400).send(updateError.message);
      }

      res.render("./admin/project-report", { 
        admin: true, 
        projectimesheets, 
        sumemployeetype 
      });
    } catch (error) {
      console.error("Error generating project report:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);


router.post('/printprojectreport', async (req, res) => {

  const sumemployeetype = JSON.parse(req.body.sumemployeetype);
  const projectimesheets = JSON.parse(req.body.projectimesheets);
  sumemployeetype.currentDate = DayView.getCurrentDate()
  

      res.render('projecttemplate', { projectimesheets , sumemployeetype }, async (err, html) => {
        if (err) {
          return res.status(500).send(err);
        }
  
        try {
          const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
          const page = await browser.newPage();
          await page.setContent(html);
  
          const pdfBuffer = await page.pdf({
            format: 'A4',            
            width: '842px',          
            height: '595px',          
            landscape: true,      
            // margin: { top: 20, right: 20, bottom: 20, left: 20 },
          });
          
  
          res.setHeader('Content-Type', 'application/pdf');
          
          res.setHeader('Content-Disposition', `attachment; filename="Project Statement ${sumemployeetype.reqdate}.pdf"`);
          res.send(pdfBuffer);
  
          await browser.close();
        } catch (error) {
          console.error('Error generating PDF:', error);
          res.status(500).send('Internal Server Error');
        }
      });
      
    });
    router.get("/projectreportsearch", function (req, res) {
       let admin = req.session.user;
       if (admin) {
        res.render("./admin/project-reportsearch", { admin: true});
      }
    });
    


    // Schedule Monthly Cron Job
    cron.schedule('0 0 1 * *', async () => {
      try {
        await reportHelpers.closemonthlysalaryreportforcron(); // Close salary report for the previous month
        await reportHelpers.monthlyprojectreportforcron(); // Generate the project report for the new month
      } catch (error) {
        console.error('Error in scheduled tasks:', error);
      }
    });

 
    router.post('/authenticate-and-close', async (req, res) => {
      const { username, password, searchdate, fstore } = req.body;
    
      try {
        // 1. Authenticate admin credentials
        const authResponse = await adminHelpers.doLogin({ username, password });
    
        if (!authResponse.status) {
          console.warn(`Authentication failed for user: ${username}`);
          return res.status(401).json({ error: "Invalid admin credentials" });
        }
    
    
        // 2. Parse and validate Fstore object
        let fstoreObj;
        try {
          fstoreObj = JSON.parse(fstore);
        } catch (parseError) {
          console.error("Fstore JSON parse error:", parseError);
          return res.status(400).json({ error: "Invalid Fstore data" });
        }
    
        // 3. Determine the previous month's date string (format: "YYYY-MM")
        const [yearStr, monthStr] = searchdate.split('-'); // Assuming "YYYY-MM"
        let year = parseInt(yearStr, 10);
        let month = parseInt(monthStr, 10);
    
        // Calculate previous month
        if (month === 1) {
          month = 12;
          year -= 1;
        } else {
          month -= 1;
        }
    
        const prevMonthStr = `${year}-${String(month).padStart(2, '0')}`;
    

    
        // 4. Check the previous month's salary status
        const prevStatus = await reportHelpers.getSalaryStatusByDate(prevMonthStr);
    
        let warningMessage = null;
    
        if (prevStatus === 'open') {
          console.log(`Previous month's salary (${prevMonthStr}) is still open.`);
          warningMessage = `Previous month's salary (${prevMonthStr}) is not Saved.`;
        } else if (prevStatus === 'close') {
          console.log(`Previous month's salary (${prevMonthStr}) is already Saved.`);
        } else {
          console.log(`No salary report found for previous month (${prevMonthStr}). Treating as closed.`);
          // Depending on your business logic, you might want to handle this differently
        }
    
        // 5. Update the current month's salary report to 'close'
        const updateResult = await reportHelpers.updateMonthlySalaryReport(searchdate, fstoreObj);
        userHelpers.closeSalaryStatusForMonth(searchdate)
    
        if (updateResult.matchedCount === 0) {
          console.warn(`No open salary report found for date: ${searchdate}`);
          return res.status(400).json({ error: "No open salary report found for the given date." });
        }
    
        console.log(`Salary report for ${searchdate} closed successfully.`);
    
        // 6. Respond to the client with success and warning if any
        const response = { success: true };
        if (warningMessage) {
          response.warning = warningMessage;
        }
        res.json(response);
    
        // 7. Perform the time-consuming tasks asynchronously in the background
        setImmediate(async () => {
          try {
            // a. Fetch the report
            const report = await ProjectReport.ProjectReport(searchdate);
            const { projectimesheets, sumemployeetype } = report;
    
            // b. Update the report to close
            await reportHelpers.addProjectReportDataToClose(searchdate, projectimesheets, sumemployeetype);
            console.log(`Background processing for ${searchdate} completed successfully.`);
    
            // You can add more background tasks here if needed
    
          } catch (error) {
            console.error('Error during background processing:', error);
            // Optionally, implement retry logic or alerting mechanisms here
          }
        });
    
      } catch (err) {
        console.error("Error in authenticate-and-close:", err);
        res.status(500).json({ error: "Server error during salary closure." });
      }
    });
    const getMonthsInRange = (startMonth, endMonth) => {
      const start = dayjs(startMonth, 'YYYY-MM', true);
      const end = dayjs(endMonth, 'YYYY-MM', true);
      const months = [];
    
      if (!start.isValid() || !end.isValid()) {
        throw new Error('Invalid date format. Use YYYY-MM.');
      }
    
      if (start.isAfter(end)) {
        throw new Error('Start month must be before or equal to end month.');
      }
    
      let current = start.clone();
      while (current.isBefore(end) || current.isSame(end)) { // Modified condition
        months.push(current.format('YYYY-MM'));
        current = current.add(1, 'month');
      }
    
      return months;
    };
    
    // Helper function to aggregate sumemployeetype data
    const aggregateSumEmployeeType = (accumulator, current) => {
      return {
        totalownlaboursalary: accumulator.totalownlaboursalary + (current.totalownlaboursalary || 0),
        totalhiredlabourmsalary: accumulator.totalhiredlabourmsalary + (current.totalhiredlabourmsalary || 0),
        totalhiredstaffhourly: accumulator.totalhiredstaffhourly + (current.totalhiredstaffhourly || 0),
        totalownstaffsalary: accumulator.totalownstaffsalary + (current.totalownstaffsalary || 0),
        totalhiredstaffsalary: accumulator.totalhiredstaffsalary + (current.totalhiredstaffsalary || 0),
        totaloperationcost: accumulator.totaloperationcost + (current.totaloperationcost || 0),
        totaloverheadcost: accumulator.totaloverheadcost + (current.totaloverheadcost || 0),
        total: accumulator.total + (current.total || 0),
        // reqdate and reqmonth can be handled as needed
      };
    };
    
    // Helper function to aggregate projectimesheets by projectname with validation
    const aggregateProjectTimeSheets = (projectimesheetsArray) => {
      const aggregated = {};
      const skippedProjects = [];
    
      projectimesheetsArray.forEach((project) => {
        // Validate essential fields
        if (!project.projectname || typeof project.total !== 'number') {
          console.warn(`Skipping invalid project entry: ${JSON.stringify(project)}`);
          skippedProjects.push(project.projectname || 'Unknown Project');
          return; // Skip this project
        }
    
        const key = project.projectname;
    
        if (!aggregated[key]) {
          // Initialize the project entry with all necessary fields, defaulting to 0 if missing
          aggregated[key] = {
            projectname: project.projectname,
            ownlaboursalary: typeof project.ownlaboursalary === 'number' ? project.ownlaboursalary : 0,
            ownlabourot: typeof project.ownlabourot === 'number' ? project.ownlabourot : 0,
            hiredlabourmsalary: typeof project.hiredlabourmsalary === 'number' ? project.hiredlabourmsalary : 0,
            hiredlabourmot: typeof project.hiredlabourmot === 'number' ? project.hiredlabourmot : 0,
            hiredstaffhourly: typeof project.hiredstaffhourly === 'number' ? project.hiredstaffhourly : 0,
            ownstaffsalary: typeof project.ownstaffsalary === 'number' ? project.ownstaffsalary : 0,
            hiredstaffsalary: typeof project.hiredstaffsalary === 'number' ? project.hiredstaffsalary : 0,
            operationcost: typeof project.operationcost === 'number' ? project.operationcost : 0,
            overheadcost: typeof project.overheadcost === 'number' ? project.overheadcost : 0,
            total: typeof project.total === 'number' ? project.total : 0,
            index: project.index, // Assuming 'index' is consistent across projects
          };
        } else {
          // Sum numerical fields, excluding 'projectname', 'index', and 'percentage'
          const fieldsToSum = [
            'ownlaboursalary',
            'ownlabourot',
            'hiredlabourmsalary',
            'hiredlabourmot',
            'hiredstaffhourly',
            'ownstaffsalary',
            'hiredstaffsalary',
            'operationcost',
            'overheadcost',
            'total',
          ];
    
          fieldsToSum.forEach((field) => {
            aggregated[key][field] += typeof project[field] === 'number' ? project[field] : 0;
          });
    
          // Optionally, you can handle 'index' if needed (e.g., keep the first index)
        }
      });
    
      // Convert the aggregated object back to an array
      const aggregatedArray = Object.values(aggregated);
    
      return { aggregatedArray, skippedProjects };
    };
    
    // Helper function to recalculate percentages
    const recalculatePercentages = (projectimesheets, sumemployeetypeTotal) => {
      projectimesheets.forEach((project) => {
        if (sumemployeetypeTotal > 0) {
          project.percentage = parseFloat(((project.total / sumemployeetypeTotal) * 100).toFixed(2));
        } else {
          project.percentage = 0;
        }
      });
    };
    
    // POST route to handle project report for a date range
    router.post("/project-report-d-d", async (req, res) => {
      const { startmonth, endmonth } = req.body; // Expected format: "YYYY-MM"
    
      if (!startmonth || !endmonth) {
        return res.status(400).send("Start month and end month are required.");
      }
    
      let months;
      try {
        months = getMonthsInRange(startmonth, endmonth);
      } catch (error) {
        return res.status(400).send(error.message);
      }
    
      let aggregatedProjectimesheets = [];
      let aggregatedSumEmployeeType = {
        totalownlaboursalary: 0,
        totalhiredlabourmsalary: 0,
        totalhiredstaffhourly: 0,
        totalownstaffsalary: 0,
        totalhiredstaffsalary: 0,
        totaloperationcost: 0,
        totaloverheadcost: 0,
        total: 0,
        // reqdate and reqmonth can be handled as needed
      };
    
      // To keep track of months with issues
      const failedMonths = [];
    
      try {
        for (const month of months) {
          // Fetch existing report
          let report = await reportHelpers.getProjectReportByDate(month);
    
          // If report does not exist, generate and store it
          if (!report) {
            try {
              report = await ProjectReport.ProjectReport(month);
              
              if (!report || !report.projectimesheets || !report.sumemployeetype) {
                console.error(`Invalid report data generated for month: ${month}`);
                failedMonths.push(month);
                continue; // Skip to the next month
              }
    
              await reportHelpers.addProjectReportDataIfOpen(
                month,
                report.projectimesheets,
                report.sumemployeetype
              );
            } catch (error) {
              console.error(`Error generating or saving report for month ${month}:`, error);
              failedMonths.push(month);
              continue; // Skip to the next month
            }
          }
    
          // Accumulate projectimesheets
          if (report.projectimesheets && Array.isArray(report.projectimesheets)) {
            aggregatedProjectimesheets = aggregatedProjectimesheets.concat(report.projectimesheets);
          } else {
            console.warn(`Missing or invalid projectimesheets for month: ${month}`);
            failedMonths.push(month);
            continue; // Skip to the next month
          }
    
          // Accumulate sumemployeetype
          if (report.sumemployeetype) {
            aggregatedSumEmployeeType = aggregateSumEmployeeType(aggregatedSumEmployeeType, report.sumemployeetype);
          } else {
            console.warn(`Missing sumemployeetype for month: ${month}`);
            failedMonths.push(month);
            continue; // Skip to the next month
          }
        }
    
        // Check if all months failed
        if (failedMonths.length === months.length) {
          return res.status(500).send("Failed to generate reports for all selected months.");
        }
    
        // Aggregate projectimesheets by projectname with validation
        const { aggregatedArray: consolidatedProjectimesheets, skippedProjects } = aggregateProjectTimeSheets(aggregatedProjectimesheets);
    
        // Recalculate percentages based on the aggregated totals
        recalculatePercentages(consolidatedProjectimesheets, aggregatedSumEmployeeType.total);
    
        // Prepare response data
        const responseData = {
          admin: true,
          projectimesheets: consolidatedProjectimesheets,
          sumemployeetype: aggregatedSumEmployeeType,
        };
    
        // Inform the user about any failed months or skipped projects
        if (failedMonths.length > 0 || skippedProjects.length > 0) {
          responseData.failedMonths = failedMonths;
          responseData.skippedProjects = skippedProjects;
          // Optionally, handle this in the rendered view (e.g., display warnings)
        }
    
        res.render("./admin/project-report", responseData);
      } catch (error) {
        console.error("Error generating consolidated project report:", error);
        res.status(500).send("Internal Server Error");
      }
    });
    




module.exports = router;
