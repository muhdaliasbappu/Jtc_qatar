const { ObjectId } = require('mongodb')
var db = require('../config/connection')
const { response } = require('../app')
var objectId = require('mongodb').ObjectId

module.exports = {
    closemonthlysalaryreportforcron: () => {
        // For example, "2024-07" if today's July 2024
        const dateStr = new Date().toISOString().slice(0, 7);
    
        const fstoreObj = {
          date: dateStr,
          salarystatus: 'open',
          
        };
    
        // Return a Promise that resolves to the result of insertOne
        return db.get()
          .collection('monthlysalaryreport')
          .insertOne(fstoreObj);
      },
      updateMonthlySalaryReport: (searchDate, fstoreObj) => {
        return db.get()
          .collection('monthlysalaryreport')
          .updateOne(
            { date: searchDate, salarystatus: 'open' }, // Only update if currently open
            { $set: { ...fstoreObj, salarystatus: 'close', closeddataandtime: new Date() } }, // Include createdAt here
          );
      },
      
      createMonthlySalaryReportsForYear: async (year = 2024) => {
        const docs = [];
        for (let month = 1; month <= 12; month++) {
          const mm = String(month).padStart(2, '0'); // e.g. 01, 02, ... 12
          const dateStr = `${year}-${mm}`;
    
          docs.push({
            date: dateStr,
            salarystatus: 'open',
          });
        }
    
        // Insert all monthly documents for the year
        const result = await db.get()
       .collection('monthlysalaryreport')
       //   .collection('projectreport')
          .insertMany(docs);
    
        console.log(`Inserted ${result.insertedCount} monthly salary reports for ${year}`);
        return result;
      },
      getSalaryStatusByDate: async (dateStr) => {
        // Find the document matching the given date
        const doc = await db.get()
          .collection('monthlysalaryreport')
          .findOne({ date: dateStr })
    
        // If doc exists, return the salarystatus field
        // If not found, return null or a default value (e.g. 'unknown')
        return doc ? doc.salarystatus : null;
      },
     monthlyprojectreportforcron: () => {
        // For example, "2024-07" if today's July 2024
        const dateStr = new Date().toISOString().slice(0, 7);
    
        const fstoreObj = {
          date: dateStr,
          salarystatus: 'open',
          
        };
    
        // Return a Promise that resolves to the result of insertOne
        return db.get()
          .collection('projectreport')
          .insertOne(fstoreObj);
      },
      addProjectReportDataIfOpen: async (searchdate, projectimesheets, sumemployeetype) => {
        try {
          const filter = { 
            date: searchdate,
            salarystatus: { $ne: 'close' } // Only match documents where salarystatus is not 'close'
          };
    
          const update = {
            $set: {
              projectimesheets: projectimesheets,
              sumemployeetype: sumemployeetype
            }
          };
    
          const options = { returnOriginal: false };
    
          const result = await db.get()
            .collection('projectreport')
            .updateOne(filter, update, options);
    
          if (result.matchedCount === 0) {
            throw new Error(`No open project report found for date: ${searchdate}`);
          }
    
          console.log(`Project report for date ${searchdate} updated successfully.`);
          return result;
        } catch (error) {
          console.error('Error updating projectreport:', error);
          throw error; // Propagate the error to be handled by the caller
        }
      },
      getProjectReportByDate: async (searchdate) => {
        try {
          const report = await db.get()
            .collection('projectreport')
            .findOne({ date: searchdate });
          return report;
        } catch (error) {
          console.error('Error fetching project report:', error);
          throw error;
        }
      },
      addProjectReportDataToClose: async (searchdate, projectimesheets, sumemployeetype) => {
        try {
          const filter = { 
            date: searchdate,
            salarystatus: { $ne: 'close' } // Only match documents where salarystatus is not 'close'
          };
    
          const update = {
            $set: {
              projectimesheets: projectimesheets,
              sumemployeetype: sumemployeetype,
              salarystatus: 'close'
            }
          };
    
          const options = { returnOriginal: false };
    
          const result = await db.get()
            .collection('projectreport')
            .updateOne(filter, update, options);
    
          if (result.matchedCount === 0) {
            throw new Error(`No open project report found for date: ${searchdate}`);
          }
    
          console.log(`Project report for date ${searchdate} updated successfully.`);
          return result;
        } catch (error) {
          console.error('Error updating projectreport:', error);
          throw error; // Propagate the error to be handled by the caller
        }
      },
    
  }
  

