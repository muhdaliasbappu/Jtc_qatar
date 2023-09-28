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
                    Employeeasigned: empDetails.Employeeasigned
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
    }

}