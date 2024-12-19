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
      
   
      getSalaryStatusByDate: async (dateStr) => {
        // Find the document matching the given date
        const doc = await db.get()
          .collection('monthlysalaryreport')
          .findOne({ date: dateStr })
    
        // If doc exists, return the salarystatus field
        // If not found, return null or a default value (e.g. 'unknown')
        return doc ? doc.salarystatus : null;
      },
      
  }
  

