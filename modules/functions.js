
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
const dayjs = require('dayjs');
const e = require("express");

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
getCounts: () => {
  let count = {}
  employeHelpers.getWorkingEmployeeCount()
    .then((countE) => {
        count.workingemployees = countE
    })
    .catch((error) => {
        console.error("Error fetching count:", error);
    });
    projectHelpers.getOngoingProjectCount()
    .then((countP) => {
     count.activeProjects = countP
    })
    .catch((error) => {
        console.error("Error fetching count:", error);
    });
  return count
  
},
 reportForDashboard : async () => {
  const currentMonth = new Date();
  const lastMonth = new Date(currentMonth);
  lastMonth.setMonth(currentMonth.getMonth() - 1);

  const sixMonthsAgo = new Date(currentMonth);
  sixMonthsAgo.setMonth(currentMonth.getMonth() - 6);

  const lastYear = new Date(currentMonth);
  lastYear.setFullYear(currentMonth.getFullYear() - 1);

  const dateFormat = (date) => date.toISOString().slice(0, 7); // YYYY-MM

  const currentMonthStr = dateFormat(currentMonth);
  const lastMonthStr = dateFormat(lastMonth);
  const sixMonthsAgoStr = dateFormat(sixMonthsAgo);
  const lastYearStr = dateFormat(lastYear);

  let topProjects = {
      currentMonth: [],
      lastMonth: [],
      lastSixMonths: [],
      overall: []
  };

  try {
      // Fetch all projects
      const projects = await projectHelpers.getAllproject();

      for (const project of projects) {
          let projectReports = [];

          if (project.projectstatus === "Ongoing") {
              // Fetch reports for ongoing projects by their project name across all months
              const allMonths = await getMonthsInRange("2024-01", currentMonthStr);
              for (const month of allMonths) {
                  const report = await reportHelpers.getProjectReportByDate(month);
                  if (report && Array.isArray(report.projectimesheets) && report.projectimesheets.some((timesheet) => timesheet.projectname === project.projectname)) {
                      projectReports.push(report);
                  } else {
                      console.warn(`Invalid or missing data for project '${project.projectname}' in month: ${month}`);
                  }
              }
          } else {
              // Fetch reports for non-ongoing projects for the last year only
              const lastYearMonths = await getMonthsInRange(lastYearStr + "-01", lastYearStr + "-12");
              for (const month of lastYearMonths) {
                  const report = await reportHelpers.getProjectReportByDate(month);
                  if (report && report.projectimesheets.some((timesheet) => timesheet.projectname === project.projectname)) {
                      projectReports.push(report);
                  }
              }
          }

          // Aggregate project reports
          const aggregatedReport = aggregateProjectReports(projectReports);
          aggregatedReport.projectname = project.projectname;

          // Categorize reports into the required periods
          const isWithinRange = (start, end, date) => date >= start && date <= end;
          projectReports.forEach((report) => {
              const reportMonth = report.date;

              if (reportMonth === currentMonthStr) {
                  topProjects.currentMonth.push(aggregatedReport);
              }

              if (reportMonth === lastMonthStr) {
                  topProjects.lastMonth.push(aggregatedReport);
              }

              if (isWithinRange(sixMonthsAgoStr, currentMonthStr, reportMonth)) {
                  topProjects.lastSixMonths.push(aggregatedReport);
              }
          });

          // Add to overall only for Ongoing projects
          if (project.projectstatus === "Ongoing") {
              topProjects.overall.push(aggregatedReport);
          }
      }

      // Sort and get top 7 performing projects for each category
      const sortAndLimitTop7 = (projects) => 
          projects.sort((a, b) => b.total - a.total).slice(0, 7);

      topProjects.currentMonth = sortAndLimitTop7(topProjects.currentMonth);
      topProjects.lastMonth = sortAndLimitTop7(topProjects.lastMonth);
      topProjects.lastSixMonths = sortAndLimitTop7(topProjects.lastSixMonths);
      topProjects.overall = sortAndLimitTop7(topProjects.overall);

      return topProjects;
  } catch (error) {
      console.error("Error fetching dashboard reports:", error);
      throw new Error("Failed to generate reports for dashboard.");
  }
},
}
// Helper function to aggregate project reports
const aggregateProjectReports = (reports) => {
  return reports.reduce(
      (acc, report) => {
          acc.totalownlaboursalary += report.sumemployeetype.totalownlaboursalary || 0;
          acc.totalhiredlabourmsalary += report.sumemployeetype.totalhiredlabourmsalary || 0;
          acc.totalhiredstaffhourly += report.sumemployeetype.totalhiredstaffhourly || 0;
          acc.totalownstaffsalary += report.sumemployeetype.totalownstaffsalary || 0;
          acc.totalhiredstaffsalary += report.sumemployeetype.totalhiredstaffsalary || 0;
          acc.totaloperationcost += report.sumemployeetype.totaloperationcost || 0;
          acc.totaloverheadcost += report.sumemployeetype.totaloverheadcost || 0;
          acc.total += report.sumemployeetype.total || 0;
          return acc;
      },
      {
          totalownlaboursalary: 0,
          totalhiredlabourmsalary: 0,
          totalhiredstaffhourly: 0,
          totalownstaffsalary: 0,
          totalhiredstaffsalary: 0,
          totaloperationcost: 0,
          totaloverheadcost: 0,
          total: 0
      }
  );
};

// Helper function to get months in a range
const getMonthsInRange = async (startMonth, endMonth) => {
  const start = new Date(startMonth + "-01");
  const end = new Date(endMonth + "-01");
  const months = [];

  while (start <= end) {
      months.push(start.toISOString().slice(0, 7));
      start.setMonth(start.getMonth() + 1);
  }

  return months;
};
