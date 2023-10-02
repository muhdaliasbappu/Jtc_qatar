var express = require("express");
var router = express.Router();
var employeHelpers = require("../helpers/employee-helpers");
var projectHelpers = require("../helpers/project-helpers");
var adminHelpers = require("../helpers/admin-helper");
var userHelpers = require("../helpers/user-helper");
const { response } = require("../app");
const async = require("hbs/lib/async");
const { search } = require("./users");

/* GET home page. */

//admin login

router.get("/", function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/admin/employee");
  } else res.render("./admin/admin-login");
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
    res.redirect("./admin/add-employee", { admin: true });
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

//post login

router.post("/", (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.admin;
      req.session.user = true;
      res.redirect("/admin/employee");
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
  const d = new Date(req.body.searchdate);

  userHelpers.getDatasheet().then(function (employeedatasheet) {
    let ar = 0;
    let searchdatasheet = []; // Define searchdatasheet array here

    for (let i = 0; i < employeedatasheet.length; i++) {
      if (
        d.getFullYear() === employeedatasheet[i].date.getFullYear() &&
        d.getMonth() === employeedatasheet[i].date.getMonth() &&
        d.getDate() === employeedatasheet[i].date.getDate()
      ) {
        searchdatasheet[ar] = employeedatasheet[i];
        searchdatasheet[ar].index = ar + 1;
        ar++;
      }
    }
    if(searchdatasheet[0]){
    searchdatasheet.date = searchdatasheet[0].datevalue;
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
  var searcheddatas = [];
  let datadetail = await employeHelpers.getEmployeeDetails(req.body.employee_id);
  userHelpers.getdatabdate(req.body.startdate, req.body.enddate).then(function (databdate) {
   
    
      for (i = 0; i < databdate.length; i++) {
        if (databdate[i].employee_id === req.body.employee_id) {
          searcheddatas[i] = databdate[i];
     
        }
      }

      const searcheddata = searcheddatas.sort(
        (objA, objB) => Number(objA.date) - Number(objB.date)
      );
      // for(let j = 0 ; j<searcheddata.length ; j++){
      //  console.log( searcheddata[j]).index //= j+1
      // }

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

// router.get("/add-datasheet/:id", async function (req, res) {
//   let admin = req.session.user;

//   if (admin) {
//     let person = await employeHelpers.getEmployeeDetails(req.params.id);
 
//       var activeProjects = [];
//       projectHelpers.getAllproject().then((projects) => {
//         for (let j = 0; j < projects.length; j++) {
//           if (projects[j].projectstatus === "Ongoing") {
//             activeProjects.push(projects[j]);
//           }
//         }
//       });

//       res.render("./admin/add-datasheet", {
//         admin: true,
//         person,
//         activeProjects,
//       });
    
//   }
// });

// router.post("/add-datasheet", async (req, res) => {
//   var datasheet = req.body;
//   let semployee = await employeHelpers.getEmployeeDetails(req.body.employee_id);
//   datasheet.date = new Date(req.body.datevalue);
//   datasheet.employeeType = semployee.employeeType;
//   if(semployee.employeeType === 'Hired Labour'){
//     datasheet.srateph = semployee.srateph;
//   }else{
//   datasheet.sbasic = semployee.sbasic;
//   datasheet.sallowance = semployee.sallowance;
//   datasheet.sbonus = semployee.sbonus;
//   }
//   userHelpers.getDatasheet().then(function (edatasheet) {
//     if (!edatasheet.length) {
//       userHelpers.addDatasheet(datasheet, (result) => {});
//     } else {
//       let count = 0;
//       let count1 = 0;
//       let count2 = 0;
//       let count3 = 0;
//       let datec = 0;
//       for (let i = 0; i < edatasheet.length; i++) {
//         if (edatasheet[i].date.getFullYear() === datasheet.date.getFullYear()) {
//           if (edatasheet[i].date.getMonth() === datasheet.date.getMonth()) {
//             if (edatasheet[i].date.getDate() === datasheet.date.getDate()) {
//               datec++;
//               if (edatasheet[i].passno === datasheet.passno) {
//                 break;
//               } else {
//                 count++;
//               }
//             } else {
//               count1++;
//               if (count1 === edatasheet.length) {
//                 userHelpers.addDatasheet(datasheet, (result) => {});
//                 break;
//               }
//             }
//           } else {
//             count2++;
//             if (count2 === edatasheet.length) {
//               userHelpers.addDatasheet(datasheet, (result) => {});
//               break;
//             }
//           }
//         } else {
//           count3++;
//           if (count3 === edatasheet.length) {
//             userHelpers.addDatasheet(datasheet, (result) => {});
//             break;
//           }
//         }
//       }
//       if (count === datec) {
//         userHelpers.addDatasheet(datasheet, (result) => {});
//       }
//     }
//   });

//   res.redirect("/admin/employee");
// });

router.get("/search-report/:id", function (req, res) {
  let admin = req.session.user;
  if (admin) {
    var iddd = req.params.id;

    res.render("./admin/report-search", { admin: true, iddd });
  }
});
router.post("/search-report", (req, res) => {
  var searcheddatas = [];

  userHelpers
    .getdatabdate(req.body.startdate, req.body.enddate)
    .then(function (databdate) {
      for (i = 0; i < databdate.length; i++) {
        if (databdate[i].passno === req.body.passno) {
          searcheddatas.push(databdate[i]);
        }
      }
      const searcheddata = searcheddatas.sort(
        (objA, objB) => Number(objA.date) - Number(objB.date)
      );

      var datadetail = databdate[0];
      //report
      var workingdayc = 0;
      var paidleavec = 0;
      var Unpaidleavec = 0;
      var tempreport = [];
      var totalot = 0;
      var totalworkhour = 0;
      for (j = 0; j < searcheddata.length; j++) {
        if (searcheddata[j].todaystatus === "working") {
          workingdayc++;
          tempreport.push(searcheddata[j]);

          const dd = new Date(searcheddata[j].datevalue);
          let day = dd.getDay();

          if (day === 5) {
            tempreport[j].workhourot =
              Number(tempreport[j].workhour1) +
              Number(tempreport[j].workhour2) +
              Number(tempreport[j].workhour3) +
              Number(tempreport[j].workhour4) +
              Number(tempreport[j].workhour5);
            tempreport[j].workhoursum = 0;
          } else {
            const reportresult =
              Number(tempreport[j].workhour1) +
              Number(tempreport[j].workhour2) +
              Number(tempreport[j].workhour3) +
              Number(tempreport[j].workhour4) +
              Number(tempreport[j].workhour5);

            tempreport[j].workhoursum = reportresult;
            if (reportresult > 8) {
              tempreport[j].workhourot = reportresult - 8;
            } else {
              tempreport[j].workhourot = 0;
            }
          }
        } else if (searcheddata[j].todaystatus === "Paid Leave") {
          paidleavec++;
          tempreport.push(searcheddata[j]);
          tempreport[j].workhoursum = 0;
          tempreport[j].workhourot = 0;
        } else if (searcheddata[j].todaystatus === "Unpaid Leave") {
          Unpaidleavec++;
          tempreport.push(searcheddata[j]);
          tempreport[j].workhoursum = 0;
          tempreport[j].workhourot = 0;
        }
      }
      for (c = 0; c < tempreport.length; c++) {
        totalot = totalot + tempreport[c].workhourot;
        totalworkhour = totalworkhour + tempreport[c].workhoursum;
      }

      var salarysheet = {};
      var monthlyallowance = 0;
      var monthlybonus = 0;
      var monthlybasic = 0;
      var otsalary = 0;
      var monthsalary = 0;
      employeHelpers.getAllemployee().then((employee) => {
        for (z = 0; z < employee.length; z++) {
          if (employee[z].passno === req.body.passno) {
            var selectedemployee = employee[z];

            if (
              employee[z].employeeType === "own" ||
              employee[z].employeeType === "hiredsalaried"
            ) {
              otsalary = (totalot * employee[z].sbasic) / 240;
              monthlyallowance =
                employee[z].sallowance -
                (employee[z].sallowance / 30) * Unpaidleavec;
              monthlybonus =
                employee[z].sbonus - (employee[z].sbonus / 30) * Unpaidleavec;
              monthlybasic =
                employee[z].sbasic - (employee[z].sbasic / 30) * Unpaidleavec;
              monthsalary =
                otsalary + monthlyallowance + monthlybasic + monthlybonus;
            } else if (employee[z].employeeType === "hired") {
              monthsalary = employee[z].srateph * totalworkhour;
            }
          }
        }

        salarysheet.monthsalary = monthsalary;
        salarysheet.otsalary = otsalary;
        salarysheet.totalot = totalot;
        salarysheet.totalworkhour = totalworkhour;
        salarysheet.workingdayc = workingdayc;
        salarysheet.Unpaidleavec = Unpaidleavec;
        salarysheet.paidleavec = paidleavec;

        res.render("./admin/report-view", {  admin: true,tempreport,salarysheet,datadetail, selectedemployee,
        
        });
      });
    });
});

// project report
router.get("/project-search/:id", async (req, res) => {
  let sproject = await projectHelpers.getProjectDetails(req.params.id);

  let admin = req.session.user;
  if (admin) {
    res.render("./admin/project-search", { admin: true, sproject });
  }
});

router.post("/project-report", (req, res) => {
  var projectemploye = [];
  var zone1 = 0;
  var projectworkhour = 0;
  var ec = 0;
  userHelpers.getdatabdate(req.body.startdate, req.body.enddate).then(function (databdate)
     {
      for (i = 0; i < databdate.length; i++) {
        var workhourc = 0;
        if (databdate[i].projectname1 === req.body.projectname) {
          workhourc = workhourc + Number(databdate[i].workhour1);
          zone1++;
        }
        if (databdate[i].projectname2 === req.body.projectname) {
          workhourc = workhourc + Number(databdate[i].workhour2);
          zone1++;
        }
        if (databdate[i].projectname3 === req.body.projectname) {
          workhourc = workhourc + Number(databdate[i].workhour3);
          zone1++;
        }
        if (databdate[i].projectname4 === req.body.projectname) {
          workhourc = workhourc + Number(databdate[i].workhour4);
          zone1++;
        }
        if (databdate[i].projectname5 === req.body.projectname) {
          workhourc = workhourc + Number(databdate[i].workhour5);
          zone1++;
        }
        projectworkhour = projectworkhour + workhourc;
        if (zone1 != 0) {
          var zone = 0;
          for (j = 0; j <= i; j++) {
            if (projectemploye.length === 0) {
              console.log("i am zero");
            } else if (j >= projectemploye.length) {
              console.log("i am repeated");
            } else if (projectemploye[j].passno === databdate[i].passno) {
              projectemploye[j].workhourc =
                projectemploye[j].workhourc + workhourc;
              projectemploye[j].noofday = projectemploye[j].noofday + 1;
             
              zone++;
            }
          }
          if (zone === 0) {
            projectdetails = {};
            projectdetails.passno = databdate[i].passno;
            projectdetails.givenName = databdate[i].givenName;
            projectdetails.workhourc = workhourc;
            projectdetails.noofday = 1;
            projectemploye.push(projectdetails);
            ec++;
          }

        }
      }
     
      res.render("./admin/project-report", { admin: true , projectemploye,projectworkhour,ec});
    });
});

router.get("/edit-salary/:id", async function (req, res) {
  let admin = req.session.user;
  if (admin) {
  let semployee = await employeHelpers.getEmployeeDetails(req.params.id);
 
    res.render("./admin/edit-salary", { admin: true , semployee});
  }
})
router.post("/edit-salary/:id", (req, res) => {
  const todaydate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const reqdate = new Date(req.body.datevalue);
 if(todaydate === reqdate){

 }
console.log(reqdate)
  console.log(req.body)
  employeHelpers.updateSalary(req.params.id, req.body).then(() => {
     res.redirect("/admin/employee");
 });
});
module.exports = router;
