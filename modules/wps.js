const fs = require('fs');
const path = require('path');
const employeHelpers = require('../helpers/employee-helpers');
const allsalaryreport = require('../modules/report');

const WPSemployeeData = async (searchdate,selectedgroup) => {
    let employeeData = [];
    let employees = [];
    let overallT = 0
    let Tselected = 0
    let selectedEmployees = await employeHelpers.getGroupbyGroupName(selectedgroup)
    for(let i = 0; i<selectedEmployees.selectedEmployees.length; i++){
      let semployee = await employeHelpers.getEmployeeDetails(selectedEmployees.selectedEmployees[i].id);
      employees.push(semployee)
      Tselected++
    }
    
    for (let i = 0; i < 3; i++) {
        let thedata;

        if (employees[i].employeeType === 'Own Labour') {
            thedata = await allsalaryreport.salaryreportlabourWPS(searchdate, employees[i]._id.toString());
        } else if (
            employees[i].employeeType === 'Own Staff (Operations)' || 
            employees[i].employeeType === 'Own Staff (Projects)'
        ) {
            thedata = await allsalaryreport.salaryreportOperationsWPS(searchdate, employees[i]._id.toString());
        }
        overallT = overallT + thedata.totalsalary

        if (thedata) {
            employeeData.push([
                String(i + 1),                                  // Record Sequence
                String(employees[i].qid),                      // Employee QID
                '',                                             // Employee Visa ID
                String(employees[i].surname + ' ' + employees[i].givenName), // Employee Name
                String(employees[i].employeeBank),             // Employee Bank Short Name
                String(employees[i].employeeAccountN),         // Employee Account
                'M',                                            // Salary Frequency
                String(thedata.workdays),                      // Number of Working Days
                String(thedata.totalsalary),                   // Net Salary
                String(thedata.basicsalary),                   // Basic Salary
                String(thedata.othours),                       // Extra Hours
                String(thedata.extraincome),                   // Extra Income
                String(thedata.deduction),                     // Deductions
                String(thedata.paymentType),                   // Payment Type
                String(0),                                     // Notes/Comments
                String(0),                                     // Housing Allowance
                String(0),                                     // Food Allowance
                String(0),                                     // Transportation Allowance
                String(0),                                     // Over Time Allowance
                String(thedata.deductionRC),                   // Deduction Reason Code
                String(0),                                     // Extra Field 1
                String(0)                                      // Extra Field 2
            ]);
        }
    }
      return { employeeData, overallT, Tselected };

};

const generateCSV = async (searchdate,selectedgroup) => {
    

    const header = [
        "Employer EID", "File Creation Date", "File Creation Time", "Payer EID", "Payer QID",
        "Payer Bank Short Name", "Payer IBAN", "Salary Year and Month", "Total Salaries",
        "Total Records", "SIF Version"
    ];
    const now = new Date();

  // Extract date parts
  const year = now.getFullYear();
  // getMonth() returns 0-11, so add 1 and pad with '0' if needed
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // Extract time parts
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  let [syear, smonth] = searchdate.split('-');
  
  // Ensure the month is 2 digits (e.g., "08" instead of "8")
  smonth = smonth.padStart(2, '0');
  
  // Concatenate year and month

  const { employeeData, overallT, Tselected } = await WPSemployeeData(searchdate, selectedgroup);

   
    const records = [
        ["10711301", `${year}${month}${day}`, `${hours}${minutes}`, "10711301", "", "MAR", "QA02MAFR000000000009114716001", `${syear+smonth}`,`${overallT}` , `${Tselected}`, "1"]
    ];
    const employeeHeader = [
        "Record Sequence", "Employee QID", "Employee Visa ID", "Employee Name", "Employee Bank Short Name",
        "Employee Account", "Salary Frequency", "Number of Working Days", "Net Salary", "Basic Salary",
        "Extra Hours", "Extra Income", "Deductions", "Payment Type", "Notes / Comments", "Housing Allowance",
        "Food Allowance", "Transportation Allowance", "Over Time Allowance", "Deduction Reason Code",
        "Extra Field 1", "Extra Field 2"
    ];

    


    const csvData = [
        header,
        ...records,
        employeeHeader,
        ...employeeData.map((row) => row) // No need to re-index; data is already indexed
    ]
        .map(row => row.join(',')) // Join each row with commas
        .join('\n'); // Join all rows with newlines

    // Define the file path to save the CSV
    const dirPath = path.join(__dirname, 'public');
    const filePath = path.join(dirPath, 'salaries.csv');

    // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // Create directory recursively if it doesn't exist
    }

    // Write the CSV to the file system
    fs.writeFileSync(filePath, csvData, 'utf8');

    console.log(`Generated CSV file at: ${filePath}`); // Log the correct file path
    return filePath;
};


module.exports = {
    generateCSV,
    WPSemployeeData
};
