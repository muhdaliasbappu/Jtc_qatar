var express = require("express");
var router = express.Router();
var employeHelpers = require("../helpers/employee-helpers");
var projectHelpers = require("../helpers/project-helpers");
var adminHelpers = require("../helpers/admin-helper");
var userHelpers = require("../helpers/user-helper");
var reportHelpers = require("../helpers/report-helpers");
var logHelpers = require("../helpers/logger-helper");
var WPSHelpers = require('../modules/wps')
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

router.post("/create", async (req, res) => {
  try {
    const response = await adminHelpers.createAdmin(req.body);
    if (response.status) {
      // Admin created successfully
      res.status(201).send("Admin created successfully");
    } else {
      // Could not create admin (maybe username is taken, etc.)
      res.status(400).send(response.message || "Error creating admin");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

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




function checkAdminSession(req, res, next) {
  if (req.session.user) {
    next(); // User is authenticated, proceed to the next middleware or route
  } else {
    res.redirect('/login'); // Redirect to login page if not authenticated
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
    res.redirect('/admin'); // Redirect to login if not authenticated
  }
}

// Apply middleware to all routes
router.use(checkAdminSession);

// logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});

// routes/admin.js
router.get("/dashboard", async (req, res) => {
  try {
    // const reportData = await ProjectReport.getProjectReportTotalsForLast12Months();
     const counts = await ProjectReport.getCounts();
     let projectbar = await ProjectReport.getMultiCategoryReports();
    let PPerformance = await ProjectReport.getProjectsPerformanceReport();
    let typeCounts = await employeHelpers.getEmployeeTypeCounts()   
    let doc = await employeHelpers.getEmployeeCount(); 
    let projectNames = PPerformance.projectNames

    res.render("./admin/dashboard", {
      admin: true,
      counts,
      PPerformance,
      projectNames, 
      projectbar,
      typeCounts,
      doc
      
    });
  } catch (error) {
    console.error("Error in /dashboard route:", error);
    res.status(500).send("Internal Server Error");
  }
});



//employee list

router.get("/employee", function (req, res, next) {

    employeHelpers.getAllemployee().then((employee) => {
   for(let i=0; i<employee.length; i++){
    employee[i].index = i+1;
   }
      res.render("./admin/employee", { admin: true, employee });
    });
  
});


router.get("/projects", function (req, res, next) {
  
    
    projectHelpers.getAllproject().then((project) => {
    
      const statusOrder = { "Ongoing": 1, "OnHold": 2, "Completed": 3 };
      project.sort((a, b) => statusOrder[a.projectstatus] - statusOrder[b.projectstatus]);
      for(let i=0; i<project.length; i++){
        project[i].index = i+1;
       }
      res.render("./admin/projects", { admin: true, project });
    });
  
});


//add employee

router.get("/add-employee", async function (req, res, next) {
   let groups = await employeHelpers.getAllgroups()

    userHelpers.getAlluser().then((users) => {

      res.render("./admin/add-employee", { admin: true, users, groups });
    });
  
  
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

    userHelpers.getAlluser().then((users) => {
      for(let i = 0; i<users.length; i++){
        users[i].index = i+1;
      }
      res.render("./admin/user-setting", { admin: true, users });
    });
  
});

//add user

router.get("/add-user", function (req, res, next) {

    res.render("./admin/add-user", { admin: true });
  
});

//post add employee
router.post("/add-employee", function async (req, res) {
  employeHelpers.getAllemployee().then((employees) => {
    const employeeExists = employees.some((employee) => employee.qid === req.body.qid);
    if (employeeExists) {
      res.redirect("/admin/add-employee?error=employeeExists");
    } else {
      employeHelpers.addemployee(req.body, async (success) => {
        if (success) {
          const logMessage = `New Employee ${req.body.surname} ${req.body.givenName} was added.`;
          await logHelpers.addlog(req,logMessage, 'Employee')
          let employee = await employeHelpers.getEmployeeDetailswithQID(req.body.qid)
          if(req.body.groupname){
          let groupedEmployee = {}
          groupedEmployee.id = employee._id.toString();
          groupedEmployee.name = employee.givenName
          if (req.body.employeeType === "Own Labour" || req.body.employeeType === "Own Staff (Operations)" || req.body.employeeType === "Own Staff (Projects)" ) {
            groupedEmployee.category  = 'own'
          }else{
            groupedEmployee.category  = 'hired'
          }
          employeHelpers.addEmployeeToGroup(req.body.groupname, groupedEmployee).then(result => {
        
          })
          .catch(error => {
            console.error("Error adding employee:", error);
          });
          }

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
  projectHelpers.addproject(req.body, async () => {
    const logMessage = `New Project ${req.body.projectname} was added.`;
          await logHelpers.addlog(req,logMessage, 'Project')
    res.render("./admin/add-project", { admin: true });
  });
});

//post add user

router.post("/add-user", function (req, res) {
  userHelpers.adduser(req.body, async () => {
    const logMessage = `New User ${req.body.usernames} was added.`;
    await logHelpers.addlog(req,logMessage, 'User')
    
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
router.post("/edit-employee/:id", async (req, res) => {
  let semployee = await employeHelpers.getEmployeeDetails(req.params.id);
  employeHelpers.updateEmployee(req.params.id, req.body).then(async () => {

    if (semployee.Employeeasigned != req.body.Employeeasigned) {
      const logMessage = `${semployee.surname} ${semployee.givenName} was assigned to ${req.body.Employeeasigned} from ${semployee.Employeeasigned}.`;
      await logHelpers.addlog(req,logMessage, 'Employee');
    }
    if (semployee.Employeestatus != req.body.Employeestatus) {
      const logMessage = `${semployee.surname} ${semployee.givenName} working status was changed to ${req.body.Employeestatus}.`;
      await logHelpers.addlog(req, logMessage, 'Employee');
    }
   
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
  projectHelpers.updateProject(req.params.id, req.body).then(async() => {

    const logMessage = `Project: ${req.body.projectname} Status: Changed from  ${req.body.oldstatus} to ${req.body.projectstatus}`;
    await logHelpers.addlog(req, logMessage, 'Project')
    res.redirect("/admin/projects");
  });
});
//delete project

router.get("/delete-project/:id", async (req, res) => {
  let proId = req.params.id;
  let sproject = await projectHelpers.getProjectDetails(req.params.id);
  projectHelpers.deleteProject(proId).then(async (response) => {
    const logMessage = `Project: ${sproject.projectname} was deleted `;
    await logHelpers.addlog(logMessage, 'Project')
    res.redirect("/admin/projects");
  });
});
//edit user

router.get("/edit-user/:id", async (req, res) => {
  let suser = await userHelpers.getuserDetails(req.params.id);
  res.render("admin/edit-user", { admin: true, suser });
});
router.post("/edit-user/:id", (req, res) => {
  userHelpers.updateuser(req.params.id, req.body).then(async () => {
    const logMessage = `User: ${req.body.usernames} password was changed.`;
    await logHelpers.addlog(req,logMessage, 'User')
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
  
    res.render("./admin/admin-dlogin", { admin: true });
  
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
       await logHelpers.addlog(req,warningMessage, 'Admin')
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



router.post("/change-workhour/:date", async function (req, res) {

const targetDate = req.params.date; // Replace with your target date
const newWorkingHour = req.body.workhour;
const logMessage = `Working hours for ${targetDate},have been changed to ${newWorkingHour} `;
    await logHelpers.addlog(req,logMessage, 'Timesheet')
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
router.post("/edit-datasheets/:id",async (req, res) => {
  let edatasheet = await userHelpers.getDatasheetDetails(req.params.id);
 let  forstoring = []
  forstoring[0] = {}
  forstoring[0].projectname1 = edatasheet.projectname1
  forstoring[0].workhour1  = edatasheet.workhour1
  forstoring[0].projectname2  = edatasheet.projectname2
  forstoring[0].workhour2 = edatasheet.workhour2
  forstoring[0].projectname3 = edatasheet.projectname3
  forstoring[0].workhour3 = edatasheet.workhour3
  forstoring[0].projectname4 = edatasheet.projectname4
  forstoring[0].workhour4 = edatasheet.workhour4
  forstoring[0].projectname5 = edatasheet.projectname5
  forstoring[0].workhour5 = edatasheet.workhour5
  forstoring[0].date = edatasheet.date
  forstoring[1] = {}
  forstoring[1].projectname1 = req.body.projectname1
  forstoring[1].workhour1  = req.body.workhour1
  forstoring[1].projectname2  = req.body.projectname2
  forstoring[1].workhour2 = req.body.workhour2
  forstoring[1].projectname3 = req.body.projectname3
  forstoring[1].workhour3 = req.body.workhour3
  forstoring[1].projectname4 = req.body.projectname4
  forstoring[1].workhour4 = req.body.workhour4
  forstoring[1].projectname5 = req.body.projectname5
  forstoring[1].workhour5 = req.body.workhour5
  forstoring[1].date = edatasheet.date

  const logMessage = `The timesheet for employee ${edatasheet.givenName} ${edatasheet.surname}, dated ${edatasheet.datevalue}, was updated  `;
  await logHelpers.addlogtimesheet(req, logMessage, 'eTimesheet', forstoring)

  userHelpers.updateDatasheet(req.params.id, req.body).then(() => {
    res.redirect("/admin/datasheet");
  });
});

router.get("/datasearch/:id", function (req, res) {
    var idd = req.params.id;
    res.render("./admin/datasearch", { admin: true, idd });
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
router.post("/edit-searcheddata/:id",async (req, res) => {
  let edatasheet = await userHelpers.getDatasheetDetails(req.params.id);
  let  forstoring = []
   forstoring[0] = {}
   forstoring[0].projectname1 = edatasheet.projectname1
   forstoring[0].workhour1  = edatasheet.workhour1
   forstoring[0].projectname2  = edatasheet.projectname2
   forstoring[0].workhour2 = edatasheet.workhour2
   forstoring[0].projectname3 = edatasheet.projectname3
   forstoring[0].workhour3 = edatasheet.workhour3
   forstoring[0].projectname4 = edatasheet.projectname4
   forstoring[0].workhour4 = edatasheet.workhour4
   forstoring[0].projectname5 = edatasheet.projectname5
   forstoring[0].workhour5 = edatasheet.workhour5
   forstoring[0].date = edatasheet.date
   forstoring[1] = {}
   forstoring[1].projectname1 = req.body.projectname1
   forstoring[1].workhour1  = req.body.workhour1
   forstoring[1].projectname2  = req.body.projectname2
   forstoring[1].workhour2 = req.body.workhour2
   forstoring[1].projectname3 = req.body.projectname3
   forstoring[1].workhour3 = req.body.workhour3
   forstoring[1].projectname4 = req.body.projectname4
   forstoring[1].workhour4 = req.body.workhour4
   forstoring[1].projectname5 = req.body.projectname5
   forstoring[1].workhour5 = req.body.workhour5
   forstoring[1].date = edatasheet.date
 
   const logMessage = `The timesheet for employee ${edatasheet.givenName} ${edatasheet.surname}, dated ${edatasheet.datevalue}, was updated  `;
   await logHelpers.addlogtimesheet(req,logMessage, 'eTimesheet', forstoring)
 
  
  userHelpers.updateDatasheet(req.params.id, req.body).then(() => {

    res.redirect("/admin/employee");
  });
});


router.get("/search-report/", async function (req, res) {
  let admin = req.session.user;
  if (admin) {
    let groups = await employeHelpers.getAllgroups()
  let groupNames = []
  for(let i = 0; i<groups.length; i++){ 
      groupNames[i] = groups[i].groupName    
  }
    res.render("./admin/report-search", { admin: true, groupNames});
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
  // Define the valid employee type options
const validEmployeeTypes = [
  "Own Labour",
  "Own Staff (Operations)",
  "Own Staff (Projects)",
  "Hired Labour (Hourly)",
  "Hired Labour (Monthly)",
  "Hired Staff (Operations)",
  "Hired Staff (Projects)",
  "All"
];
let result;
// Assume req.body.employeeType comes from your form submission
const employeeType = req.body.employeeType;
if (validEmployeeTypes.includes(employeeType)) {
result = await salarycalc.salarycalculate(req.body.searchdate , req.body.employeeType)
} 
// Otherwise, the value is not recognized as valid
else {
 result = await salarycalc.salarycalculateforgroup(req.body.searchdate , req.body.employeeType)
}

  
   
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

router.post("/edit-salary/:id", async (req, res) => {
  const todaydate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  
  let reqdate;

  let edetail = await employeHelpers.getEmployeeDetails(req.params.id)
  let sdetails = [];

// Initialize sdetails[0] as an object
sdetails[0] = {};
sdetails[0].qid = edetail.qid;
sdetails[0].employeeType = edetail.employeeType;
sdetails[0].sbasic = edetail.sbasic;
sdetails[0].sallowance = edetail.sallowance;
sdetails[0].sbonus = edetail.sbonus;
sdetails[0].srateph = edetail.srateph;

// Initialize sdetails[1] as an object
sdetails[1] = {};
sdetails[1].qid = edetail.qid;
sdetails[1].employeeType = req.body.employeeType;
sdetails[1].sbasic = req.body.sbasic;
sdetails[1].sallowance = req.body.sallowance;
sdetails[1].sbonus = req.body.sbonus;
sdetails[1].srateph = req.body.srateph;


  const logMessage = `The salary for employee ${edetail.givenName} ${edetail.surname}, holding QID ${edetail.qid}, was updated for the ${req.body.month} `;
    await logHelpers.addlogsalary(req,logMessage, 'Salary', sdetails)
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
    const validEmployeeTypes = [
      "Own Labour",
      "Own Staff (Operations)",
      "Own Staff (Projects)",
      "Hired Labour (Hourly)",
      "Hired Labour (Monthly)",
      "Hired Staff (Operations)",
      "Hired Staff (Projects)",
      "All"
    ];
    let result;
    // Assume req.body.employeeType comes from your form submission
    const employeeType = req.body.employeeType;
    if (validEmployeeTypes.includes(employeeType)) {
    result = await salarycalc.salarycalculate(req.body.searchdate , req.body.employeeType)
    } 
    // Otherwise, the value is not recognized as valid
    else {
     result = await salarycalc.salarycalculateforgroup(req.body.searchdate , req.body.employeeType)
    }
    
    
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

router.post("/project-search", async (req, res) => {
  try {
    const { searchdate } = req.body;

    // Attempt to fetch an existing report from the database.
    const existingReport = await reportHelpers.getProjectReportByDate(searchdate);

    // If an existing report is found and it is closed, render it directly.
    if (existingReport && existingReport.salarystatus.toLowerCase() === "close") {
      const { projectimesheets, sumemployeetype } = existingReport;

      if (!projectimesheets || !sumemployeetype) {
        return res.status(500).send("Incomplete report data in the database.");
      }

      return res.render("./admin/project-report", {
        admin: true,
        projectimesheets,
        sumemployeetype,
      });
    }

    // If no report is found, or the found report is not closed, proceed to generate a new report.
    const report = await ProjectReport.ProjectReport(searchdate);
    const { projectimesheets, sumemployeetype } = report;

    if (!projectimesheets || !sumemployeetype) {
      return res.status(500).send("Invalid report data generated.");
    }

    // Update the report data in the database if it's open (or if it did not exist before).
    try {
      await reportHelpers.addProjectReportDataIfOpen(
        searchdate,
        projectimesheets,
        sumemployeetype
      );
    } catch (updateError) {
      return res.status(400).send(updateError.message);
    }

    // Render the view with the newly generated report data.
    res.render("./admin/project-report", {
      admin: true,
      projectimesheets,
      sumemployeetype,
    });
  } catch (error) {
    console.error("Error generating project report:", error);
    res.status(500).send("Internal Server Error");
  }
});


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
    
        const logMessage = `Salary report for ${searchdate} closed successfully.`;
        await logHelpers.addlog(req,logMessage, 'Employee')
        
    
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

    router.get("/createGroup", async function (req, res) {
      const employeeTypesOwn = [
        "Own Labour",
        "Own Staff (Operations)",
        "Own Staff (Projects)"
    ];
    const employeeTypesHired = [
      "Hired Labour (Monthly)",
      "Hired Staff (Operations)",
      "Hired Staff (Projects)"
    ];
    const employeeTypesHourly = [
      "Hired Labour (Hourly)",
    ];
      let ownEmployees = await employeHelpers.getEmployeesByType(employeeTypesOwn)
      let hiredEmployees = await employeHelpers.getEmployeesByType(employeeTypesHired)
      let hiredHourly = await employeHelpers.getEmployeesByType(employeeTypesHourly)
       res.render("./admin/creategroup", { admin: true , ownEmployees, hiredEmployees, hiredHourly });
     
   }); 
   router.post("/createGroup", async function (req, res) {
    let groupedEmployees = {}
    groupedEmployees.groupName = req.body.groupName
    groupedEmployees.selectedEmployees = JSON.parse(req.body.selectedEmployees);
    employeHelpers.addGroup(groupedEmployees)
    res.redirect("/admin/viewGroup");
}); 
router.get("/viewGroup", async function (req, res) {
  let groups = await employeHelpers.getAllgroups();
  let groupedEmployees = [];

  for (let i = 0; i < groups.length; i++) {
    // Retrieve the group name. Use a default value if it doesn't exist.
    let groupId = groups[i]._id
    let groupName = groups[i].groupName || `Group ${i + 1}`;

    // Create an array for the employees in this group.
    let employees = [];
    for (let j = 0; j < groups[i].selectedEmployees.length; j++) {
      let employeeId = groups[i].selectedEmployees[j].id;
      let temp = await employeHelpers.getEmployeeDetails(employeeId);
      employees.push(temp);
    }

    // Instead of pushing just the employee array, push an object with both group name and employees.
    groupedEmployees.push({
      groupId: groupId,
      groupName: groupName,
      employees: employees,
    });
  }

  res.render("admin/view-groups", { admin: true, groupedEmployees });
});
// GET: Render the Edit Group page
router.get("/editGroup/:groupId", async function (req, res) {
  const groupId = req.params.groupId;
  // Retrieve the group details (should include groupName and selectedEmployees array)
  let groupDetails = await employeHelpers.getGroupDetailswithID(groupId);
  // Assume groupDetails.selectedEmployees is an array of employee objects
  // Also assume each employee object has at least: _id, givenName, surname, qid, and category.
  // (If not, you can add a property “category” based on the employee type.)

  // Get lists of employees (by type) as in your createGroup route.
  const employeeTypesOwn = [
    "Own Labour",
    "Own Staff (Operations)",
    "Own Staff (Projects)"
  ];
  const employeeTypesHired = [
    "Hired Labour (Monthly)",
    "Hired Staff (Operations)",
    "Hired Staff (Projects)"
  ];
  const employeeTypesHourly = ["Hired Labour (Hourly)"];

  let ownEmployees = await employeHelpers.getEmployeesByType(employeeTypesOwn);
  let hiredEmployees = await employeHelpers.getEmployeesByType(employeeTypesHired);
  let hiredHourly = await employeHelpers.getEmployeesByType(employeeTypesHourly);

  // Remove employees that are already in the group from the left-side lists.
  const groupEmpIds = groupDetails.selectedEmployees.map(emp => emp.id);
  ownEmployees = ownEmployees.filter(emp => !groupEmpIds.includes(emp._id.toString()));
  hiredEmployees = hiredEmployees.filter(emp => !groupEmpIds.includes(emp._id.toString()));
  hiredHourly = hiredHourly.filter(emp => !groupEmpIds.includes(emp._id.toString()));


  res.render("./admin/editgroup", { 
    admin: true, 
    groupDetails, 
    ownEmployees, 
    hiredEmployees, 
    hiredHourly 
  });
});

// POST: Save the edited group
router.post("/editGroup/:groupId", async function (req, res) {
  const groupId = req.params.groupId;
  let groupedEmployees = {};
  // Parse the JSON array of selected employees (each with id, name and category)
  groupedEmployees.selectedEmployees = JSON.parse(req.body.selectedEmployees);
  await employeHelpers.updateGroup(groupId, groupedEmployees,req.body.groupName);
  res.redirect("/admin/viewGroup");
});

router.get("/generateWPS", async function (req, res) {
  let groups = await employeHelpers.getAllgroups()
  let groupNames = []
  for(let i = 0; i<groups.length; i++){ 
    if(groups[i].selectedEmployees[0].category === 'own'){
      groupNames[i] = groups[i].groupName
    }
  }

  res.render("./admin/generateWPS", { admin: true , groupNames});
})
router.post("/generateWPS", async function (req, res) {

    try {
      // Wait for the CSV file to be generated and get the file path
      const { filePath, fileName } = await WPSHelpers.generateCSV(req.body.searchdate, req.body.selectedgroup);

      // Send the file to the client for download using the dynamic file name
      res.download(filePath, fileName, (err) => {
          if (err) {
              console.error('Error sending file:', err);
          }
      });
  } catch (error) {
      console.error('Error generating CSV:', error);
      res.status(500).send('An error occurred while generating the CSV file.');
  }
  res.render("./admin/generateWPS", { admin: true });
})



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
    
    cron.schedule('58 23 * * *',async() => {
      try {
        // --------- 1. Current Month ---------
        const currentMonthStr = dayjs().format("YYYY-MM");
        report = await ProjectReport.ProjectReport(currentMonthStr);
        
        if (!report || !report.projectimesheets || !report.sumemployeetype) {
          console.error(`Invalid report data generated for month: ${month}`);
          failedMonths.push(month);
          
        }

        await reportHelpers.addProjectReportDataIfOpen(
          currentMonthStr,
          report.projectimesheets,
          report.sumemployeetype
        );
      } catch (error) {
        console.error(`Error generating or saving report for month ${month}:`, error);
      }

      
    })

    // Schedule Monthly Cron Job
    cron.schedule('00 01 2 * *', async () => {
      try {
        await reportHelpers.closemonthlysalaryreportforcron(); // Close salary report for the previous month
        await reportHelpers.monthlyprojectreportforcron(); // Generate the project report for the new month
      } catch (error) {
        console.error('Error in scheduled tasks:', error);
      }
    });

    router.get("/recent-activity", function (req, res, next) {
      logHelpers.getAllLog()
    .then((logs) => {
      logs.reverse();
        res.render("./admin/recent-activity", { admin: true, logs });
        // You can process the logs here
    })
    .catch((error) => {
        console.error('Error retrieving logs:', error);
    });


     
    
  });


  router.get("/add-datasheet/:id", async (req, res) => {
    let person = await employeHelpers.getEmployeeDetails(req.params.id);
    let projects = await projectHelpers.getAllproject();
      
      // Filter active projects
      let activeProjects = projects.filter(project => project.projectstatus === 'Ongoing');
      res.render("admin/add-datasheet", { admin: true, person, activeProjects });

  });
  router.post("/add-datasheet/", (req, res)=>{
    
    
    let date = new Date(req.body.datevalue);
    date.setHours(23, 59, 0, 0);
    req.body.date = date
    const originalDate = req.body.datevalue; 
    const [year, month, day] = originalDate.split("-");
    const formatted = `${parseInt(year, 10)}-${parseInt(month, 10)}-${parseInt(day, 10)}`;
    req.body.datevalue = formatted;
    userHelpers.getTimesheet(req.body.datevalue , req.body.employee_id).then( async function (edatasheets) {
      if(edatasheets.length === 0){
        userHelpers.addDatasheet(req.body, (result) => {

       })
       const logMessage = `Admin added the timesheet of ${originalDate} for ${req.body.surname} ${req.body.givenName} `;
        await logHelpers.addlog(req,logMessage, 'Employee')
       res.send(`
        <script>
          alert('Timesheet added successfully!');
          // Optionally redirect or go back
          window.history.back();
          //window.location.href = '/some-redirect-url';
        </script>
      `);
      }
      else{
        res.send(`
          <script>
            alert('Timesheet for this employee already exists on this date!');
            // Optionally redirect or go back
            window.history.back();
          </script>
        `);
      }
      })
      
    
  })

  cron.schedule('00 50 23 * * 4', async () => {
 
      try {
        // Get the current working employees count
        const counts =  ProjectReport.getCounts();
   
        // Retrieve the existing document (if any)
        let doc = await employeHelpers.getEmployeeCount();
        let updatedCounts;
    
        if (doc && Array.isArray(doc.counts)) {
          // If the document exists, add the new count to the existing counts array
          updatedCounts = doc.counts;
          updatedCounts.push(counts.workingemployees);
    
          // Keep only the latest 12 counts
          if (updatedCounts.length > 12) {
            updatedCounts = updatedCounts.slice(updatedCounts.length - 12);
          }
        } else {
          // If no document exists, initialize with 11 zeros and the current count as the 12th entry
          updatedCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, counts.workingemployees];
        }
        // Update the document in the collection (or create one if it doesn't exist)
        await employeHelpers.updateEmployeeCount({ counts: updatedCounts });
      } catch (error) {
        console.error('Error in scheduled tasks:', error);
      }
    });
    



module.exports = router;
