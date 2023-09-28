var db = require('../config/connection')
var objectId = require('mongodb').ObjectId
module.exports = {
    addproject: (project, callback) => {
        db.get().collection('project').insertOne(project).then((data) => {
            callback(true)
        })
    },
    getAllproject: () => {
        return new Promise(async (resolve, reject) => {
            let project = await db.get().collection('project').find().toArray()
            resolve(project)
        })
    },
    getProjectDetails: (proId) => {

        return new Promise((resolve, reject) => {
            db.get().collection('project').findOne({ _id: new objectId(proId) }).then((project) => {

                resolve(project)
            })
        })
    },
    updateProject: (proId, proDetails) => {

        return new Promise((resolve, reject) => {
            db.get().collection('project').updateOne({ _id: new objectId(proId) }, {
                $set: {
                    projectstatus: proDetails.projectstatus
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    deleteProject: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('project').deleteOne({ _id: new objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    }

}