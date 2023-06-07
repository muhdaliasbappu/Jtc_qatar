var db = require('../config/connection')

module.exports = {
    addproject: (project, callback) => {
        console.log(project);
        db.get().collection('project').insertOne(employee).then((data) => {
            callback(true)
        })
    }

}