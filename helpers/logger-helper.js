const async = require('hbs/lib/async')
var db = require('../config/connection')
var objectId = require('mongodb').ObjectId
const { ObjectId } = require("mongodb");
 


module.exports = {
    addlog: (Message, type) => {
        const date = new Date(); // Example: Sat Jan 04 2025 10:29:22 GMT+0300 (Arabian Standard Time)
        const dateStr = date.toString().split(' GMT')[0];
        const fstoreObj = {
          Timestamp: dateStr,
          Message: Message,
          type: type
        };
    
        // Return a Promise that resolves to the result of insertOne
        return db.get()
          .collection('logger')
          .insertOne(fstoreObj);
      },
      getAllLog: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const logs = await db.get().collection('logger')
                    .find()
                    .sort({ timestamp: -1 }) // Sort by timestamp descending
                    .toArray();
                resolve(logs);
            } catch (error) {
                reject(error);
            }
        });
    },
    addlogsalary: (Message, type, sdetails) => {
        const date = new Date(); // Example: Sat Jan 04 2025 10:29:22 GMT+0300 (Arabian Standard Time)
        const dateStr = date.toString().split(' GMT')[0];
        const fstoreObj = {
          Timestamp: dateStr,
          Message: Message,
          type: type,
          isSalary: true,
          old: sdetails[0],
          new: sdetails[1]
        };
    
        // Return a Promise that resolves to the result of insertOne
        return db.get()
          .collection('logger')
          .insertOne(fstoreObj);
      },
      addlogtimesheet: (Message, type, forstoring) => {
        const date = new Date(); // Example: Sat Jan 04 2025 10:29:22 GMT+0300 (Arabian Standard Time)
        const dateStr = date.toString().split(' GMT')[0];
        const fstoreObj = {
          Timestamp: dateStr,
          Message: Message,
          type: type,
          isTimesheet: true,
          old: forstoring[0],
          new: forstoring[1]
        };
    
        // Return a Promise that resolves to the result of insertOne
        return db.get()
          .collection('logger')
          .insertOne(fstoreObj);
      }




}
