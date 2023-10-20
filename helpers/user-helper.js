var db = require('../config/connection')
var objectId = require('mongodb').ObjectId
module.exports = {
    adduser: (user, callback) => {
        db.get().collection('user').insertOne(user).then((data) => {
            callback(true)
        })
    },
    getAlluser: () => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection('user').find().toArray()
            resolve(user)
        })
    },
    uLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection('user').findOne({ usernames: userData.usernames })
            if (user) {
                if (user.passwords == userData.passwords) {
                    response.user = user
                    response.status = true
                    resolve(response)
                } else {
                    resolve({
                        status: false
                    })
                }
            }
            else {
                resolve({ status: false })
            }
        })
    },
    getuserDetails: (userId) => {

        return new Promise((resolve, reject) => {
            db.get().collection('user').findOne({ _id: new objectId(userId) }).then((user) => {
                resolve(user)
            })
        })
    },
    updateuser: (userId, userDetails) => {

        return new Promise((resolve, reject) => {
            db.get().collection('user').updateOne({ _id: new objectId(userId) }, {
                $set: {
                    usernames: userDetails.usernames,
                    passwords: userDetails.passwords
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    deleteuser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('user').deleteOne({ _id: new objectId(userId) }).then((response) => {
                resolve(response)
            })
        })
    },
    addDatasheet: (datasheet, callback) => {
        if (datasheet._id) {
            delete datasheet._id;
        }
        db.get().collection('datasheet').insertOne(datasheet).then((data) => {
            callback(true)
        })
    },
    getDatasheet: () => {
        return new Promise(async (resolve, reject) => {
            let datasheet = await db.get().collection('datasheet').find().toArray()
            resolve(datasheet)
        })
    },
    getDatasheetDetails: (dataId) => {

        return new Promise((resolve, reject) => {
            db.get().collection('datasheet').findOne({ _id: new objectId(dataId) }).then((datasheet) => {

                resolve(datasheet)
            })
        })
    }, updateDatasheet: (dataId, datasheetDetails) => {

        return new Promise((resolve, reject) => {
            db.get().collection('datasheet').updateOne({ _id: new objectId(dataId) }, {
                $set: {
                    todaystatus: datasheetDetails.todaystatus,
                    projectname1: datasheetDetails.projectname1,
                    workhour1: datasheetDetails.workhour1,
                    projectname2: datasheetDetails.projectname2,
                    workhour2: datasheetDetails.workhour2,
                    projectname3: datasheetDetails.projectname3,
                    workhour3: datasheetDetails.workhour3,
                    projectname4: datasheetDetails.projectname4,
                    workhour4: datasheetDetails.workhour4,
                    projectname5: datasheetDetails.projectname5,
                    workhour5: datasheetDetails.workhour5
                }
            }).then((response) => {
                resolve()
            })
        })
    },
   
    getdatabdate: (startDate, endDate) => {
        return new Promise((resolve, reject) => {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            endDateObj.setHours(23, 59, 59, 999); // Set to the end of the day
    
            db.get().collection('datasheet').find({
                $and: [
                    { date: { $gte: startDateObj } },
                    { date: { $lte: endDateObj } }
                ]
            }).toArray()
            .then((response) => {
               
                resolve(response);
            })
            .catch((error) => {
                console.error('Error:', error);
                reject(error);
            });
        });
    },
    updateDatasheetsalary: (dataId, datasheetDetails) => {

        return new Promise((resolve, reject) => {
            db.get().collection('datasheet').updateOne({ _id: new objectId(dataId) }, {
                $set: {
                    todaystatus: datasheetDetails.todaystatus,
                    projectname1: datasheetDetails.projectname1,
                    workhour1: datasheetDetails.workhour1,
                    projectname2: datasheetDetails.projectname2,
                    workhour2: datasheetDetails.workhour2,
                    projectname3: datasheetDetails.projectname3,
                    workhour3: datasheetDetails.workhour3,
                    projectname4: datasheetDetails.projectname4,
                    workhour4: datasheetDetails.workhour4,
                    projectname5: datasheetDetails.projectname5,
                    workhour5: datasheetDetails.workhour5
                }
            }).then((response) => {
                resolve()
            })
        })
    },
    deleteTimesheet: (objId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('datasheet').deleteOne({ _id: new objectId(objId) }).then((response) => {
                resolve(response)
            })
        })
    }

    
}

