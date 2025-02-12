const { ObjectId } = require('mongodb')
var db = require('../config/connection')
const { response } = require('../app')
var objectId = require('mongodb').ObjectId
module.exports = {
    addemployee: (employee, callback) => {

        db.get().collection('employee').insertOne(employee).then((data) => {
            callback(true)
        })
    },
    getAllemployee: () => {
        return new Promise(async (resolve, reject) => {
            let employee = await db.get().collection('employee').find().toArray()
           
            resolve(employee)
        })
    },
    getEmployeeDetails: (empId) => {

        return new Promise((resolve, reject) => {
            db.get().collection('employee').findOne({ _id: new ObjectId(empId) }).then((employee) => {
                resolve(employee)
            })
        })
    },
    getEmployeeDetailswithQID: (QID) => {

        return new Promise((resolve, reject) => {
            db.get().collection('employee').findOne({ qid: QID }).then((employee) => {
                resolve(employee)
            })
        })
    },
    
    updateEmployee: (empId, empDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection('employee').updateOne({ _id: new ObjectId(empId) }, {
                $set: {
                    Employeestatus: empDetails.Employeestatus,
                    Employeeasigned: empDetails.Employeeasigned,
                    employeeBank: empDetails.employeeBank,
                    employeeAccountN: empDetails.employeeAccountN
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    updateSalary: (empId, empDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection('employee').updateOne({ _id: new ObjectId(empId) }, {
                $set: {
                    employeeType: empDetails.employeeType,
                   sbasic: empDetails.sbasic,
                   sallowance: empDetails.sallowance,
                   sbonus: empDetails.sbonus,
                   srateph: empDetails.srateph,
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    deleteEmployee: (empId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('employee').deleteOne({ _id: new objectId(empId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getWorkingEmployeeCount: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const count = await db.get()
                    .collection('employee')
                    .countDocuments({ Employeestatus: "Working" }); // Filter by Employeestatus "Working"
                
                resolve(count); // Return the count
            } catch (error) {
                console.error("Error fetching working employee count:", error);
                reject(error); // Reject the promise if there’s an error
            }
        });
    },
    getEmployeeTypeCounts: async () => {
        try {
            const employeeTypes = [
                "Own Labour",
                "Own Staff (Operations)",
                "Own Staff (Projects)",
                "Hired Labour (Hourly)",
                "Hired Labour (Monthly)",
                "Hired Staff (Operations)",
                "Hired Staff (Projects)"
            ];
    
            const counts = await db.get()
                .collection('employee')
                .aggregate([
                    { $match: { Employeestatus: "Working" } },
                    { 
                        $group: { 
                            _id: "$employeeType", 
                            count: { $sum: 1 } 
                        } 
                    }
                ])
                .toArray();
    
            const countsMap = counts.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {});
    
            const result = employeeTypes.reduce((acc, type) => {
                acc[type] = countsMap[type] || 0;
                return acc;
            }, {});
    
            return result;
        } catch (error) {
            console.error("Error fetching employee type counts:", error);
            throw error;
        }
    },
    getEmployeesByType: async (employeeTypes) => {
        try {
            
    
            // If you only want active (e.g. "Working") employees, include "Employeestatus: 'Working'" in the $match.
            // For example:
            // { $match: { employeeType: { $in: employeeTypes }, Employeestatus: "Working" } }
    
            const employees = await db.get()
                .collection('employee')
                .aggregate([
                    { 
                        $match: { 
                            $and: [
                                { employeeType: { $in: employeeTypes } },
                                { Employeestatus: { $ne: "Dismissed" } }
                            ]
                        } 
                    }
                ])
                .toArray();
    
            return employees;
        } catch (error) {
            console.error("Error fetching employees by type:", error);
            throw error;
        }
    },
    addGroup: (group ) => {

        db.get().collection('employeeGroup').insertOne(group).then((data) => {
            
        })
    },
    getAllgroups: () => {
        return new Promise(async (resolve, reject) => {
            let groups = await db.get().collection('employeeGroup').find().toArray()
           
            resolve(groups)
        })
    },
    getGroupbyGroupName: (groupName) => {
        return new Promise((resolve, reject) => {
            db.get().collection('employeeGroup').findOne({ groupName: groupName }).then((group) => {
                resolve(group)
            })
        })
    },
    addEmployeeToGroup: (groupName, newEmployee) => {
        return new Promise((resolve, reject) => {
          db.get().collection('employeeGroup')
            .updateOne(
              { groupName: groupName },              // Query to find the correct group document
              { $push: { selectedEmployees: newEmployee } }  // Push new employee object into the array
            )
            .then(result => resolve(result))
            .catch(error => reject(error));
        });
      },
      getGroupDetailswithID: (groupID) => {
        return new Promise((resolve, reject) => {
            db.get().collection('employeeGroup').findOne({ _id: new ObjectId(groupID) }).then((group) => {
                resolve(group)
            })
        })
    },
      
   
      updateGroup: (groupId, groupedEmployees, groupName) => {
        return new Promise((resolve, reject) => {
          db.get().collection('employeeGroup')
            .updateOne(
              { _id: new ObjectId(groupId) },
              {
                $set: {
                  groupName: groupName,
                  selectedEmployees: groupedEmployees.selectedEmployees  // Set the array directly
                }
              }
            )
            .then(result => resolve(result))
            .catch(error => reject(error));
        });
      }
      
    
    

}
