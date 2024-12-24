var db = require('../config/connection')
var userHelpers = require("../helpers/user-helper");
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
    },
    projecttimesheet: async(month , project , employeetype) => {
        let projectimesheet = await userHelpers.getDatabByproject1(month , project , employeetype);
        projectimesheet.push(...await userHelpers.getDatabByproject2(month , project , employeetype))
        projectimesheet.push(...await userHelpers.getDatabByproject3(month , project , employeetype))
        projectimesheet.push(...await userHelpers.getDatabByproject4(month , project , employeetype))
        projectimesheet.push(...await userHelpers.getDatabByproject5(month , project , employeetype))
        return projectimesheet;
    },
    projecttimesheetdtd: async(month , project , employeetype) => {
    
        let projectimesheet = await userHelpers.getDatabByproject1dtd(month , project , employeetype);
        projectimesheet.push(...await userHelpers.getDatabByproject2dtd(month , project , employeetype))
        projectimesheet.push(...await userHelpers.getDatabByproject3dtd(month , project , employeetype))
        projectimesheet.push(...await userHelpers.getDatabByproject4dtd(month , project , employeetype))
        projectimesheet.push(...await userHelpers.getDatabByproject5dtd(month , project , employeetype))
        return projectimesheet;
    },
    getOngoingProjectCount: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const count = await db.get()
                    .collection('project')
                    .countDocuments({ projectstatus: "Ongoing" }); // Filter by projectstatus "Ongoing"
                
                resolve(count); // Return the count
            } catch (error) {
                console.error("Error fetching ongoing project count:", error);
                reject(error); // Reject the promise if there’s an error
            }
        });
    }
    

}

