
var employeHelpers = require("../helpers/employee-helpers");
var projectHelpers = require("../helpers/project-helpers");
var adminHelpers = require("../helpers/admin-helper");
var userHelpers = require("../helpers/user-helper");
var reportHelpers = require("../helpers/report-helpers");


var DayView = require('./DayView')

var allprojectreport = require('./project-report')
const puppeteer = require('puppeteer');
var salarycalc = require('./salarycalc')
const cron = require('node-cron')


module.exports = {

        ProjectReport: async (searchdate) => {
          let employeetype = ['Own Labour', 'Hired Labour (Monthly)', 'Hired Labour (Hourly)', 'Own Staff (Projects)', 'Hired Staff (Projects)'];
          let projectimesheets = [];
      
          try {
            let projects = await projectHelpers.getAllproject();
      
            for (let i = 0; i < projects.length; i++) {
              let tempobj = {};
      
              for (let j = 0; j < employeetype.length; j++) {
                let report = {};
                let projectimesheet = await projectHelpers.projecttimesheet(searchdate, projects[i].projectname, employeetype[j]);
      
                if (projectimesheet.length > 0) {
                  tempobj.projectname = projects[i].projectname;
      
                  switch (employeetype[j]) {
                    case 'Own Labour':
                      report = await allprojectreport.projectreportlabour(projectimesheet, projects[i].projectname);
                      tempobj.ownlaboursalary = report.totalsalary || 0;
                      tempobj.ownlabourot = report.otsalary;
                      break;
      
                    case 'Hired Labour (Monthly)':
                      report = await allprojectreport.projectreportlabour(projectimesheet, projects[i].projectname);
                      tempobj.hiredlabourmsalary = report.totalsalary || 0;
                      tempobj.hiredlabourmot = report.otsalary;
                      break;
      
                    case 'Own Staff (Projects)':
                      report = await allprojectreport.projectreportstaff(projectimesheet, projects[i].projectname);
                      tempobj.ownstaffsalary = report.totalsalary || 0;
                      break;
      
                    case 'Hired Staff (Projects)':
                      report = await allprojectreport.projectreportstaff(projectimesheet, projects[i].projectname);
                      tempobj.hiredstaffsalary = report.totalsalary || 0;
                      break;
      
                    case 'Hired Labour (Hourly)':
                      report = await allprojectreport.projectreporthourly(projectimesheet, projects[i].projectname);
                      tempobj.hiredstaffhourly = report.totalsalary || 0;
                      break;
      
                    default:
                      // Handle unexpected employee types if necessary
                      break;
                  }
                }
              }
      
              if (Object.keys(tempobj).length !== 0) {
                projectimesheets.push(tempobj);
              }
            }
      
            let operationcost = await allprojectreport.projectoperations(projectimesheets, searchdate);
      
            for (let g = 0; g < projectimesheets.length; g++) {
              projectimesheets[g].index = g + 1;
              projectimesheets[g].operationcost = operationcost[g].operationcost;
              projectimesheets[g].overheadcost = operationcost[g].overheadcost;
              projectimesheets[g].total = operationcost[g].total;
              projectimesheets[g].percentage = operationcost[g].percentage;
            }
      
            let sumemployeetype = await allprojectreport.sumemployeetype(projectimesheets);
            sumemployeetype.reqdate = searchdate;
            sumemployeetype.reqmonth = DayView.getMonthAndYear(searchdate);
      
         
            return { projectimesheets, sumemployeetype };
      
          } catch (error) {
            console.error(error);
            // Throw the error to be handled in the route
            throw error;
          }
        },

}