const async = require('hbs/lib/async')
var db = require('../config/connection')
var objectId = require('mongodb').ObjectId
const { ObjectId } = require("mongodb");


  // Loop through the network interfaces and extract non-internal MAC addresses
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (const addrInfo of addresses) {
      // Only consider non-internal (i.e., external) interfaces
      if (!addrInfo.internal && addrInfo.mac && addrInfo.mac !== '00:00:00:00:00:00') {
        macAddresses.push(addrInfo.mac);
      }
    }
  }
  
  return macAddresses;
};

module.exports = {


 
  

    const logEntry = {
      Timestamp: dateStr,
      Message,
      type,
      systemDetails  // Append system details here
    };
  
    // Return a Promise that resolves to the result of insertOne
    return db.get()
      .collection('logger')
      .insertOne(logEntry);
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
    addlogsalary: (req,Message, type, sdetails) => {
        const date = new Date(); // Example: Sat Jan 04 2025 10:29:22 GMT+0300 (Arabian Standard Time)
        const dateStr = date.toString().split(' GMT')[0];
        

        const fstoreObj = {
          Timestamp: dateStr,
          Message: Message,
          type: type,
          isSalary: true,
          old: sdetails[0],
          new: sdetails[1],
          systemDetails:systemDetails 

        };
    
        // Return a Promise that resolves to the result of insertOne
        return db.get()
          .collection('logger')
          .insertOne(fstoreObj);
      },
      addlogtimesheet: (req,Message, type, forstoring) => {
        const date = new Date(); // Example: Sat Jan 04 2025 10:29:22 GMT+0300 (Arabian Standard Time)
        const dateStr = date.toString().split(' GMT')[0];

        const fstoreObj = {
          Timestamp: dateStr,
          Message: Message,
          type: type,
          isTimesheet: true,
          old: forstoring[0],
          new: forstoring[1],
          systemDetails:systemDetails 
        };
    
        // Return a Promise that resolves to the result of insertOne
        return db.get()
          .collection('logger')
          .insertOne(fstoreObj);
      }




}
