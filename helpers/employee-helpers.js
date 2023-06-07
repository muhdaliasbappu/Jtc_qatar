var db = require('../config/connection')

module.exports = {
    addemployee: (employee, callback) => {
        console.log(employee);
        db.get().collection('employee').insertOne(employee).then((data) => {
            callback(true)
        })
    }

}