const fs = require('fs');
const path = require('path');
const employeHelpers = require('../helpers/employee-helpers');
const allsalaryreport = require('../modules/report');

const WPSemployeeData = async (searchdate) => {
    let employeeData = [];
    const employees = await employeHelpers.getAllemployee();

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
                String(0),                                     // Housing Allowance
                String(0),                                     // Food Allowance
                String(0),                                     // Transportation Allowance
                String(0),                                     // Over Time Allowance
                String(0),                                     // Deduction Reason Code
                String(thedata.deductionRC),                   // Deduction Reason Code
                String(0),                                     // Extra Field 1
                String(0)                                      // Extra Field 2
            ]);
        }
    }

    return employeeData;
};

const generateCSV = async () => {
    const header = [
        "Employer EID", "File Creation Date", "File Creation Time", "Payer EID", "Payer QID",
        "Payer Bank Short Name", "Payer IBAN", "Salary Year and Month", "Total Salaries",
        "Total Records", "SIF Version"
    ];
    const records = [
        ["10711301", "20240610", "1430", "10711301", "", "MAR", "QA02MAFR000000000009114716001", "202406", "75674", "28", "1"]
    ];
    const employeeHeader = [
        "Record Sequence", "Employee QID", "Employee Visa ID", "Employee Name", "Employee Bank Short Name",
        "Employee Account", "Salary Frequency", "Number of Working Days", "Net Salary", "Basic Salary",
        "Extra Hours", "Extra Income", "Deductions", "Payment Type", "Notes / Comments", "Housing Allowance",
        "Food Allowance", "Transportation Allowance", "Over Time Allowance", "Deduction Reason Code",
        "Extra Field 1", "Extra Field 2"
    ];

    const employeeDatas = await WPSemployeeData('2024-08'); // Fetch employee data dynamically

    const csvData = [
        header,
        ...records,
        employeeHeader,
        ...employeeDatas.map((row) => row) // No need to re-index; data is already indexed
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
