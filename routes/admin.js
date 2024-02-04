var express = require("express");
var router = express.Router();
var employeHelpers = require("../helpers/employee-helpers");
var projectHelpers = require("../helpers/project-helpers");
var adminHelpers = require("../helpers/admin-helper");
var userHelpers = require("../helpers/user-helper");
const { response } = require("../app");
const async = require("hbs/lib/async");
const { search } = require("./users");
var DayView = require('../modules/DayView')
var allsalaryreport = require('../modules/report')
var allprojectreport = require('../modules/project-report')
const puppeteer = require('puppeteer');
var addcron = require('../modules/notcron')
/* GET home page. */

//admin login

router.get("/", function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/admin/dashboard");
  } else res.render("./admin/admin-login");
});
//post login

router.post("/", (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.admin;
      req.session.user = true;
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/");
    }
  });
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});



router.get("/dashboard", function (req, res, next) {
  let admin = req.session.user;

      res.render("./admin/dashboard", { admin: true});
    
  
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

//project list

router.get("/projects", function (req, res, next) {
  let admin = req.session.user;

  if (admin) {
    projectHelpers.getAllproject().then((project) => {
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
  employeHelpers.addemployee(req.body, (result) => {
    res.redirect("/admin/add-employee");
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

router.post("/admin-dlogin", (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminuser = response.admin;
      req.session.adminuser = true;
      res.redirect("/admin/edit-admin");
    } else {
      res.redirect("/admin/admin-dlogin");
    }
  });
});
router.post("/edit-admin/:id", (req, res) => {
  adminHelpers.updateadmin(req.params.id, req.body).then(() => {
    res.redirect("/admin/employee/");
  });
});

//  datasheet
router.get("/datasheet", function (req, res) {
  let admin = req.session.user;
  if (admin) {
    res.render("./admin/datasheet", { admin: true });
  }
});

router.post("/datasheet", function (req, res) {
  const currentDate = new Date();
  const twoDaysAgo = new Date(currentDate);
  twoDaysAgo.setDate(currentDate.getDate() - 3);
  const d = new Date(req.body.searchdate);
  if (d < twoDaysAgo) {
  if(d.getDay() === 5){
    addcron.cronfridaynotyou(req.body.searchdate)
  }else{
    addcron.cronnotforyou(req.body.searchdate)
  }
  }
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
    }

    res.render("./admin/searchdatasheet", { admin: true, searchdatasheet });
  });
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
    var employeereport = [];
    var index = 0
    let searchdata = {}
    searchdata.searchdate = req.body.searchdate
    searchdata.employeeType = req.body.employeeType
    
    var formattedDate = DayView.getMonthAndYear(req.body.searchdate)
    searchdata.formattedDate = formattedDate
  
    const employees = await employeHelpers.getAllemployee();  
    for (let i = 0; i < employees.length; i++) {
    if(employees[i].employeeType === 'Own Labour'){
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());    
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportlabour(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Own Labour'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());    
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportlabour(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Hired Labour (Monthly)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());   
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportlabourhourly(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Hired Labour (Hourly)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());
      if (timesheet.length > 0) {
        const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
      
        const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
        thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
        index++;
        thedata.index = index;
        employeereport.push(thedata);
        } 
     }else if (req.body.employeeType === 'Own Staff (Operations)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());
        const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
      const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
      thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
      index++;
      thedata.index = index;
      employeereport.push(thedata);    
     }else if (req.body.employeeType === 'Hired Staff (Operations)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Own Staff (Projects)'){ 
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Hired Staff (Projects)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
   
   const month = parseInt(req.body.searchdate.split('-')[1]);

   const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
   if (monthsWith31Days.includes(month)) {
       res.render("./admin/report-view", { admin: true, employeereport , searchdata  });
       
   } else {
       res.render("./admin/report-view2", { admin: true, employeereport , searchdata });
   }
   

  }


   catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// project report
router.get("/project-search/",  (req, res) => {

  let admin = req.session.user;
  if (admin) {
    res.render("./admin/project-search", { admin: true });
  }
});

router.post("/project-search",async (req, res) => {
  let projectimesheet = await userHelpers.getDatabByproject1(req.body.searchdate, 'kATARA' , 'Own Labour');
projectimesheet.push(...await userHelpers.getDatabByproject2(req.body.searchdate, 'kATARA' , 'Own Labour'))
projectimesheet.push(...await userHelpers.getDatabByproject3(req.body.searchdate, 'kATARA' , 'Own Labour'))
projectimesheet.push(...await userHelpers.getDatabByproject4(req.body.searchdate, 'kATARA' , 'Own Labour'))
projectimesheet.push(...await userHelpers.getDatabByproject5(req.body.searchdate, 'kATARA' , 'Own Labour'))
  
     allprojectreport.projectreportlabour(projectimesheet, 'kATARA')
      res.render("./admin/project-report", { admin: true });
    
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
    var employeereport = [];
    var index = 0
    let searchdata = {}
    searchdata.searchdate = req.body.searchdate
    
   
    searchdata.employeeType = req.body.employeeType
    const employees = await employeHelpers.getAllemployee();  
    for (let i = 0; i < employees.length; i++) {
    if(employees[i].employeeType === 'Own Labour'){
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());    
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportlabour(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Own Labour'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());    
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportlabour(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Hired Labour (Monthly)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());   
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportlabourhourly(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Hired Labour (Hourly)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
      if (timesheet.length > 0) {
        const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
      
        const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
        thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
        index++;
        thedata.index = index;
        employeereport.push(thedata);
        }
     }     
      
     }else if(employees[i].employeeType ==='Own Staff (Operations)'){
      if(req.body.employeeType === 'All'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());
      if (timesheet.length > 0) {
        const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
      
        const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
        thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
        index++;
        thedata.index = index;
        employeereport.push(thedata);
        }    
     }else if (req.body.employeeType === 'Own Staff (Operations)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Hired Staff (Operations)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Own Staff (Projects)'){ 
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
      if(req.body.employeeType === 'All'){
        var timesheet = await userHelpers.getDatabByMonthAndEmployee(req.body.searchdate, employees[i]._id.toString());
        if (timesheet.length > 0) {
          const searcheddata = timesheet.sort((objA, objB) => Number(objA.date) - Number(objB.date));
        
          const thedata = await allsalaryreport.salaryreportoperations(searcheddata);
          thedata.employeename = employees[i].surname+ ' ' +employees[i].givenName
          index++;
          thedata.index = index;
          employeereport.push(thedata);
          }
     }else if (req.body.employeeType === 'Hired Staff (Projects)'){
      var timesheet = await userHelpers.getDatabByMonthAndEmployeewithType(req.body.searchdate, employees[i]._id.toString(),req.body.employeeType );
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
   
   const month = parseInt(req.body.searchdate.split('-')[1]);
  var formattedDate = DayView.getMonthAndYear(req.body.searchdate)
  
  employeereport.date = formattedDate

   const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];
   if (monthsWith31Days.includes(month)) {
      
      res.render('reporttemplate', { employeereport }, async (err, html) => {
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
    res.render('reporttemplate2', { employeereport }, async (err, html) => {
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

module.exports = router;


