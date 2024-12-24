
var employeHelpers = require("../helpers/employee-helpers");
var projectHelpers = require("../helpers/project-helpers");
var adminHelpers = require("../helpers/admin-helper");
var userHelpers = require("../helpers/user-helper");
var reportHelpers = require("../helpers/report-helpers");
var reportHelpers = require("../helpers/report-helpers");

var DayView = require('./DayView')

var allprojectreport = require('./project-report')
const puppeteer = require('puppeteer');
var salarycalc = require('./salarycalc')
const cron = require('node-cron')
const dayjs = require('dayjs');

// For month abbreviations; adjust if you need full names or different locale
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun',
                     'Jul','Aug','Sep','Oct','Nov','Dec'];



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
     


getProjectReportTotalsForLast12Months: async()=> {
  try {
    // 1. Identify the last 12 months (excluding the current month)
    //    e.g., if today is 2024-10, we want from 2023-10 up to 2024-09
    const today = dayjs();
    const monthsInfo = [];

    for (let i = 1; i <= 12; i++) {
      const dateObj = today.subtract(i, 'month'); 
      const year = dateObj.year();
      const monthIndex = dateObj.month(); // 0-based
      const dateStr = dateObj.format('YYYY-MM'); // e.g. "2024-07"

      monthsInfo.unshift({
        year,
        monthIndex, // 0..11
        monthName: MONTH_NAMES[monthIndex], // "Jul", "Aug", ...
        dateStr
      });
    }

    // 2. Prepare arrays for final output
    const categories = [];
    const data = [];

    // 3. For each month in last 12, fetch the single doc from `projectreport`
    //    If you store each month's data in exactly one doc, use your helper:
    for (const mInfo of monthsInfo) {
      const { dateStr, monthName } = mInfo;

      // Fetch a single document for this dateStr (e.g. "2024-07")
      // Adjust `getProjectReportByDate` if it expects a string or an object
      const doc = await reportHelpers.getProjectReportByDate(dateStr);

      if (!doc) {
        // No document => skip this month entirely (do NOT push to categories/data)
        continue;
      }

      // If doc exists, check salarystatus
      let monthTotal = 0;

      if (doc.salarystatus && doc.salarystatus.toLowerCase() === 'open') {
        // If doc is open, total = 0
        monthTotal = 0;
      } else {
        // salarystatus is 'close' or something else => sum projectimesheets
        if (Array.isArray(doc.projectimesheets)) {
          for (const p of doc.projectimesheets) {
            if (typeof p.total === 'number') {
              monthTotal += p.total;
            }
          }
        }
      }

      // Only push if doc is found (either open or close)
      categories.push(monthName);
      data.push(monthTotal);
    }

    return { categories, data };
  } catch (error) {
    console.error('Error in getProjectReportTotalsForLast12Months:', error);
    throw error;
  }

},




}
