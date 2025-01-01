
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
/**
 * Main function to get the "current month", "last month",
 * "last 6 months", "last year", and "overall" reports.
 *
 * - Each category only shows top 7 performing projects by total.
 * - "Overall" report only shows projects where projectstatus = "Ongoing".
 *
 * Returns an object with each category containing 8 separate arrays.
 */
 getMultiCategoryReports : async () => {
  try {
    // --------- 1. Current Month ---------
    const currentMonthStr = dayjs().format("YYYY-MM");
    const {
      consolidatedProjectimesheets: currentMonthProjects,
      aggregatedSumEmployeeType: currentMonthSum,
    } = await getAggregatedDataForMonths([currentMonthStr]);

    // Sort by total desc, keep top 7
    const topCurrentMonthProjects = currentMonthProjects
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);

    // Transform to 8 separate arrays sorted ascending by total
    const transformedCurrentMonth = transformTop7Projects(topCurrentMonthProjects);

    // --------- 2. Last Month ---------
    const lastMonthStr = dayjs().subtract(1, "month").format("YYYY-MM");
    const {
      consolidatedProjectimesheets: lastMonthProjects,
      aggregatedSumEmployeeType: lastMonthSum,
    } = await getAggregatedDataForMonths([lastMonthStr]);

    const topLastMonthProjects = lastMonthProjects
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);

    const transformedLastMonth = transformTop7Projects(topLastMonthProjects);

    // --------- 3. Last 6 Months ---------
    // From 5 months ago up to the current month (total 6 months)
    const sixMonthsAgo = dayjs().subtract(5, "month");
    const sixMonthsRange = getMonthsInRange(
      sixMonthsAgo.format("YYYY-MM"),
      currentMonthStr
    );
    const {
      consolidatedProjectimesheets: lastSixMonthsProjects,
      aggregatedSumEmployeeType: lastSixMonthsSum,
    } = await getAggregatedDataForMonths(sixMonthsRange);

    const topSixMonthsProjects = lastSixMonthsProjects
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);

    const transformedLastSixMonths = transformTop7Projects(topSixMonthsProjects);

    // --------- 4. Last 12 Months ---------
    // From 11 months ago up to the current month (total 12 months)
    const twelveMonthsAgo = dayjs().subtract(11, "month");
    const twelveMonthsRange = getMonthsInRange(
      twelveMonthsAgo.format("YYYY-MM"),
      currentMonthStr
    );
    const {
      consolidatedProjectimesheets: lastTwelveMonthsProjects,
      aggregatedSumEmployeeType: lastTwelveMonthsSum,
    } = await getAggregatedDataForMonths(twelveMonthsRange);

    const topTwelveMonthsProjects = lastTwelveMonthsProjects
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);

    const transformedLastTwelveMonths = transformTop7Projects(topTwelveMonthsProjects);

    // --------- 5. Overall ---------
    // Define "overall" as from the earliest available month to the current month
    // You can adjust the start date based on your data availability
    // For demonstration, let's assume data starts from "2020-01"
    const overallStart = dayjs("2020-01", "YYYY-MM"); // Example start date
    const overallEnd = dayjs().format("YYYY-MM");
    const overallMonthsRange = getMonthsInRange(
      overallStart.format("YYYY-MM"),
      overallEnd
    );
    let {
      consolidatedProjectimesheets: overallProjects,
      aggregatedSumEmployeeType: overallSum,
    } = await getAggregatedDataForMonths(overallMonthsRange);

    // Fetch all projects and filter by status "Ongoing"
    const allProjectsInfo = await projectHelpers.getAllproject();
    const ongoingProjectNames = allProjectsInfo
      .filter((proj) => proj.projectstatus === "Ongoing")
      .map((proj) => proj.projectname);

    // Filter overallProjects to include only ongoing projects
    overallProjects = overallProjects.filter((proj) =>
      ongoingProjectNames.includes(proj.projectname)
    );

    // Sort by total desc, keep top 7
    const topOverallProjects = overallProjects
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);

    // Transform to 8 separate arrays sorted ascending by total
    const transformedOverall = transformTop7Projects(topOverallProjects);

    // Compile all categories
    const reports = {
      currentMonth: transformedCurrentMonth,
      lastMonth: transformedLastMonth,
      lastSixMonths: transformedLastSixMonths,
      lastYear: transformedLastTwelveMonths,
      overall: transformedOverall,
    };

    return reports;
  } catch (error) {
    console.error("Error fetching multi-category reports:", error);
    throw error;
  }
},



}
const getMonthsInRange = (startMonth, endMonth) => {
  const start = dayjs(startMonth, "YYYY-MM", true);
  const end = dayjs(endMonth, "YYYY-MM", true);
  const months = [];

  if (!start.isValid() || !end.isValid()) {
    throw new Error("Invalid date format. Use YYYY-MM.");
  }

  if (start.isAfter(end)) {
    throw new Error("Start month must be before or equal to end month.");
  }

  let current = start.clone();
  while (current.isBefore(end) || current.isSame(end)) {
    months.push(current.format("YYYY-MM"));
    current = current.add(1, "month");
  }
  return months;
};

/**
 * Helper function to aggregate sumemployeetype data
 */
const aggregateSumEmployeeType = (accumulator, current) => {
  return {
    totalownlaboursalary:
      accumulator.totalownlaboursalary + (current.totalownlaboursalary || 0),
    totalhiredlabourmsalary:
      accumulator.totalhiredlabourmsalary + (current.totalhiredlabourmsalary || 0),
    totalhiredstaffhourly:
      accumulator.totalhiredstaffhourly + (current.totalhiredstaffhourly || 0),
    totalownstaffsalary:
      accumulator.totalownstaffsalary + (current.totalownstaffsalary || 0),
    totalhiredstaffsalary:
      accumulator.totalhiredstaffsalary + (current.totalhiredstaffsalary || 0),
    totaloperationcost:
      accumulator.totaloperationcost + (current.totaloperationcost || 0),
    totaloverheadcost:
      accumulator.totaloverheadcost + (current.totaloverheadcost || 0),
    total: accumulator.total + (current.total || 0),
  };
};

/**
 * Helper function to aggregate projectimesheets by projectname with validation
 */
const aggregateProjectTimeSheets = (projectimesheetsArray) => {
  const aggregated = {};
  const skippedProjects = [];

  projectimesheetsArray.forEach((project) => {
    // Validate essential fields
    if (!project.projectname || typeof project.total !== "number") {
      console.warn(
        `Skipping invalid project entry: ${JSON.stringify(project)}`
      );
      skippedProjects.push(project.projectname || "Unknown Project");
      return; // Skip this project
    }

    const key = project.projectname;
    if (!aggregated[key]) {
      // Initialize the project entry with all necessary fields, defaulting to 0 if missing
      aggregated[key] = {
        projectname: project.projectname,
        ownlaboursalary: typeof project.ownlaboursalary === "number" ? project.ownlaboursalary : 0,
        ownlabourot: typeof project.ownlabourot === "number" ? project.ownlabourot : 0,
        hiredlabourmsalary: typeof project.hiredlabourmsalary === "number" ? project.hiredlabourmsalary : 0,
        hiredlabourmot: typeof project.hiredlabourmot === "number" ? project.hiredlabourmot : 0,
        hiredstaffhourly: typeof project.hiredstaffhourly === "number" ? project.hiredstaffhourly : 0,
        ownstaffsalary: typeof project.ownstaffsalary === "number" ? project.ownstaffsalary : 0,
        hiredstaffsalary: typeof project.hiredstaffsalary === "number" ? project.hiredstaffsalary : 0,
        operationcost: typeof project.operationcost === "number" ? project.operationcost : 0,
        overheadcost: typeof project.overheadcost === "number" ? project.overheadcost : 0,
        total: typeof project.total === "number" ? project.total : 0,
        index: project.index, // Assuming 'index' is consistent across projects
      };
    } else {
      // Sum numerical fields, excluding non-numeric
      const fieldsToSum = [
        "ownlaboursalary",
        "ownlabourot",
        "hiredlabourmsalary",
        "hiredlabourmot",
        "hiredstaffhourly",
        "ownstaffsalary",
        "hiredstaffsalary",
        "operationcost",
        "overheadcost",
        "total",
      ];
      fieldsToSum.forEach((field) => {
        aggregated[key][field] += typeof project[field] === "number" ? project[field] : 0;
      });
    }
  });

  // Convert the aggregated object back to an array
  const aggregatedArray = Object.values(aggregated);
  return { aggregatedArray, skippedProjects };
};

/**
 * Helper function to recalculate percentages
 */
const recalculatePercentages = (projectimesheets, sumemployeetypeTotal) => {
  projectimesheets.forEach((project) => {
    if (sumemployeetypeTotal > 0) {
      project.percentage = parseFloat(
        ((project.total / sumemployeetypeTotal) * 100).toFixed(2)
      );
    } else {
      project.percentage = 0;
    }
  });
};

/**
 * Fetch (or generate) a monthly report for a given month.
 * Returns { projectimesheets, sumemployeetype }
 */
const fetchOrGenerateMonthlyReport = async (month) => {
  let report = await reportHelpers.getProjectReportByDate(month);
  if (!report) {
    // If report does not exist, generate and store it
    try {
      report = await ProjectReport.ProjectReport(month);
      if (!report || !report.projectimesheets || !report.sumemployeetype) {
        throw new Error(`Invalid report data generated for month: ${month}`);
      }
      await reportHelpers.addProjectReportDataIfOpen(
        month,
        report.projectimesheets,
        report.sumemployeetype
      );
    } catch (error) {
      console.error(
        `Error generating or saving report for month ${month}:`,
        error
      );
      // Return empty data so aggregator can skip or handle
      return { projectimesheets: [], sumemployeetype: null };
    }
  }
  return {
    projectimesheets: report.projectimesheets || [],
    sumemployeetype: report.sumemployeetype || null,
  };
};

/**
 * Helper to get aggregated data for a given range of months
 * Returns { consolidatedProjectimesheets, aggregatedSumEmployeeType, failedMonths, skippedProjects }
 */
const getAggregatedDataForMonths = async (months) => {
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
  };
  const failedMonths = [];
  const allSkippedProjects = [];

  // Fetch and accumulate data for each month
  for (const month of months) {
    const { projectimesheets, sumemployeetype } =
      await fetchOrGenerateMonthlyReport(month);

    // If sumemployeetype is null or projectimesheets is empty, consider it a "failed" month
    if (
      !sumemployeetype ||
      !Array.isArray(projectimesheets) ||
      !projectimesheets.length
    ) {
      failedMonths.push(month);
      continue;
    }

    // Accumulate projectimesheets
    aggregatedProjectimesheets = aggregatedProjectimesheets.concat(
      projectimesheets
    );

    // Accumulate sumemployeetype
    aggregatedSumEmployeeType = aggregateSumEmployeeType(
      aggregatedSumEmployeeType,
      sumemployeetype
    );
  }

  // Now aggregate the projectimesheets by project name
  const { aggregatedArray: consolidatedProjectimesheets, skippedProjects } =
    aggregateProjectTimeSheets(aggregatedProjectimesheets);

  // Recalculate percentages in the consolidated array
  recalculatePercentages(
    consolidatedProjectimesheets,
    aggregatedSumEmployeeType.total
  );

  return {
    consolidatedProjectimesheets,
    aggregatedSumEmployeeType,
    failedMonths,
    skippedProjects,
  };
};

/**
 * Helper to transform top 7 projects into 8 separate arrays sorted ascending by total
 */
const transformTop7Projects = (projects) => {
  // 1) Sort the array in ascending order by total
  const sortedAscending = [...projects].sort((a, b) => a.total - b.total);

  // 2) Create the arrays
  const ownlaboursalary = sortedAscending.map(
    (proj) => proj.ownlaboursalary || 0
  );
  const hiredlabourmsalary = sortedAscending.map(
    (proj) => proj.hiredlabourmsalary || 0
  );
  const hiredstaffhourly = sortedAscending.map(
    (proj) => proj.hiredstaffhourly || 0
  );
  const ownstaffsalary = sortedAscending.map(
    (proj) => proj.ownstaffsalary || 0
  );
  const hiredstaffsalary = sortedAscending.map(
    (proj) => proj.hiredstaffsalary || 0
  );
  const operationcost = sortedAscending.map(
    (proj) => proj.operationcost || 0
  );
  const overheadcost = sortedAscending.map(
    (proj) => proj.overheadcost || 0
  );
  const projectname = sortedAscending.map((proj) => proj.projectname);

  return {
    ownlaboursalary,
    hiredlabourmsalary,
    hiredstaffhourly,
    ownstaffsalary,
    hiredstaffsalary,
    operationcost,
    overheadcost,
    projectname,
  };
};

/**
 * Main function to get the "current month", "last month",
 * "last 6 months", "last 12 months", and "overall" reports.
 *
 * - Each category only shows top 7 performing projects by total.
 * - "Overall" report only shows projects where projectstatus = "Ongoing".
 *
 * Returns an object with each category containing 8 separate arrays.
 */
function getLast12MonthsRange() {
  const months = [];
  // Example: we go from earliestMonth = dayjs().subtract(11, "month") up to current month inclusive
  let current = dayjs().subtract(11, "month").startOf("month");
  const end = dayjs().endOf("month"); // this month's end

  while (current.isBefore(end) || current.isSame(end, "month")) {
    months.push(current.format("YYYY-MM"));
    current = current.add(1, "month");
  }
  return months;
}
function buildMonthToReportMap(reports) {
  const map = {};
  for (const rep of reports) {
    map[rep.date] = rep; // rep.date is "YYYY-MM"
  }
  return map;
}
async function getProjectsPerformanceReport() {
  try {
    // 1) Get all projects
    const allProjects = await projectHelpers.getAllproject();

    // Separate projects: Ongoing vs Completed (in last 12 months)
    const ongoingProjects = [];
    const recentlyCompletedProjects = [];
    for (const proj of allProjects) {
      if (proj.projectstatus === "Ongoing") {
        ongoingProjects.push(proj);
      } else if (
        proj.projectstatus === "Completed" &&
        isCompletedWithinLast12Months(proj.completedDate)
      ) {
        recentlyCompletedProjects.push(proj);
      }
    }

    // Combine our "in scope" projects
    const projectsInScope = [...ongoingProjects, ...recentlyCompletedProjects];

    // 2) Get all projectreport docs for the last 12 months
    const allReports = await reportHelpers.getAllReports();
    const last12MonthsRange = getLast12MonthsRange(); // array of month-strings from earliest to latest

    // Filter out projectreport docs that are not in our last12MonthsRange
    // If you store more than 12 months in the DB, this ensures we only keep the needed months
    const reportsLast12 = allReports.filter((r) =>
      last12MonthsRange.includes(r.date) // keep only if r.date is in last12MonthsRange
    );

    // Build a map: month -> projectreport doc
    const monthToReport = buildMonthToReportMap(reportsLast12);

    // 3) For each project, find the earliest month in the last 12 months that it appears in ANY doc
    //    We'll call that startMonth. If the project doesn't appear at all, no data is produced.
    //    Actually, if the user wants to treat the "first appearance" older than 12 months, you may need
    //    to fetch older reports or store the earliest known date from the DB. 
    //    For this example, we only consider the last 12 months of data.
    const projectNameToEarliestMonth = {};

    for (const month of last12MonthsRange) {
      const report = monthToReport[month];
      if (!report || !Array.isArray(report.projectimesheets)) continue;

      for (const sheet of report.projectimesheets) {
        // If this project's name is in our "in scope" set
        if (projectsInScope.find((p) => p.projectname === sheet.projectname)) {
          // If not set, or month is earlier, update it
          if (!projectNameToEarliestMonth[sheet.projectname]) {
            projectNameToEarliestMonth[sheet.projectname] = month;
          } else {
            // Compare if this month is earlier
            const currentEarliest = dayjs(
              projectNameToEarliestMonth[sheet.projectname],
              "YYYY-MM"
            );
            const candidate = dayjs(month, "YYYY-MM");
            if (candidate.isBefore(currentEarliest)) {
              projectNameToEarliestMonth[sheet.projectname] = month;
            }
          }
        }
      }
    }

    // 4) Build the final data structure for each project
    //    Key = projectname
    //    Value = { projectname, arrays..., total }
    const finalData = {};

    function initProjectAccumulator(projName) {
      finalData[projName] = {
        projectname: projName,
        ownlaboursalary: [],
        hiredlabourmsalary: [],
        hiredstaffhourly: [],
        ownstaffsalary: [],
        hiredstaffsalary: [],
        operationcost: [],
        overheadcost: [],
        date: [],
        total: 0,
      };
    }

    // 5) For each project in scope, figure out the "range of months" from its earliest appearance
    //    to the project’s completed date (if completed) or the last month in last12MonthsRange, whichever comes first.
    for (const proj of projectsInScope) {
      const { projectname, projectstatus, completedDate } = proj;

      // If the project never appeared in the last 12 months, skip it
      const startMonth = projectNameToEarliestMonth[projectname];
      if (!startMonth) {
        // Means we found no timesheets for it in any doc in the last 12 months
        continue;
      }

      // parse the earliest month from projectreport
      let current = dayjs(startMonth, "YYYY-MM");
      // parse the last month of the 12-month window
      const lastMonthInWindow = dayjs(
        last12MonthsRange[last12MonthsRange.length - 1],
        "YYYY-MM"
      );

      // figure out the endMonth
      // - if ongoing, the endMonth is lastMonthInWindow
      // - if completed, the endMonth is min(completedDate in YYYY-MM, lastMonthInWindow)
      let endMonth = lastMonthInWindow;
      if (projectstatus === "Completed" && completedDate) {
        const completionMonth = dayjs(completedDate).format("YYYY-MM");
        const completionMonthDayjs = dayjs(completionMonth, "YYYY-MM");
        if (completionMonthDayjs.isBefore(lastMonthInWindow)) {
          endMonth = completionMonthDayjs;
        }
      }

      // Ensure accumulator
      initProjectAccumulator(projectname);

      // Walk from current up to endMonth (inclusive)
      while (
        current.isBefore(endMonth, "month") ||
        current.isSame(endMonth, "month")
      ) {
        const monthStr = current.format("YYYY-MM");

        // Attempt to find a doc for that month
        const doc = monthToReport[monthStr];
        // If doc doesn't exist, all values = 0
        let ownlaboursalary = 0;
        let hiredlabourmsalary = 0;
        let hiredstaffhourly = 0;
        let ownstaffsalary = 0;
        let hiredstaffsalary = 0;
        let operationcost = 0;
        let overheadcost = 0;
        let total = 0;

        if (doc && Array.isArray(doc.projectimesheets)) {
          // See if there's a row for this project
          const sheet = doc.projectimesheets.find(
            (s) => s.projectname === projectname
          );
          if (sheet) {
            ownlaboursalary = sheet.ownlaboursalary || 0;
            hiredlabourmsalary = sheet.hiredlabourmsalary || 0;
            hiredstaffhourly = sheet.hiredstaffhourly || 0;
            ownstaffsalary = sheet.ownstaffsalary || 0;
            hiredstaffsalary = sheet.hiredstaffsalary || 0;
            operationcost = sheet.operationcost || 0;
            overheadcost = sheet.overheadcost || 0;
            total = sheet.total || 0;
          }
        }

        // push to arrays
        finalData[projectname].ownlaboursalary.push(ownlaboursalary);
        finalData[projectname].hiredlabourmsalary.push(hiredlabourmsalary);
        finalData[projectname].hiredstaffhourly.push(hiredstaffhourly);
        finalData[projectname].ownstaffsalary.push(ownstaffsalary);
        finalData[projectname].hiredstaffsalary.push(hiredstaffsalary);
        finalData[projectname].operationcost.push(operationcost);
        finalData[projectname].overheadcost.push(overheadcost);
        finalData[projectname].date.push(monthStr);
        finalData[projectname].total += total;

        // move to next month
        current = current.add(1, "month");
      }
    }

    // 6) Now we have finalData with each project’s arrays from earliest appearance to end-of-range,
    //    with missing months as 0.

    // Next step: rank them — Ongoing first by descending total, then Completed by descending total.
    const ongoingRanked = [];
    const completedRanked = [];

    for (const projName of Object.keys(finalData)) {
      const projectObj = finalData[projName];
      // figure out if it's ongoing or completed
      const realProject = projectsInScope.find((p) => p.projectname === projName);
      if (realProject?.projectstatus === "Ongoing") {
        ongoingRanked.push(projectObj);
      } else {
        // completed
        completedRanked.push(projectObj);
      }
    }

    ongoingRanked.sort((a, b) => b.total - a.total);
    completedRanked.sort((a, b) => b.total - a.total);

    // Combine up to 7
    let finalList = [];
    const maxSlots = 7;

    for (let i = 0; i < ongoingRanked.length; i++) {
      if (finalList.length >= maxSlots) break;
      finalList.push(ongoingRanked[i]);
    }
    if (finalList.length < maxSlots) {
      const needed = maxSlots - finalList.length;
      finalList = finalList.concat(completedRanked.slice(0, needed));
    }

    // 7) Build the final object keyed by projectname
    const resultObj = {};
    for (const projObj of finalList) {
      resultObj[projObj.projectname] = projObj;
    }

    // Done
    return resultObj;
  } catch (err) {
    console.error("Error in getProjectsPerformanceReport:", err);
    throw err;
  }
}
function isCompletedWithinLast12Months(projectCompletionDate) {
  const currentDate = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(currentDate.getFullYear() - 1);
  return new Date(projectCompletionDate) >= twelveMonthsAgo;
}

module.exports = {
  getProjectsPerformanceReport,
};
