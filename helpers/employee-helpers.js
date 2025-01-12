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
    
    

}

