const async = require('hbs/lib/async')
var db = require('../config/connection')
var objectId = require('mongodb').ObjectId
module.exports = {

    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection('adminlogin').findOne({ username: adminData.username })

            if (admin) {
         
                if (admin.password == adminData.password) {
                
                    response.admin = admin
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
    getadminDetails: () => {
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection('adminlogin').findOne({})
            resolve(admin)
        })
    },
    updateadmin: (adminId, adminDetails) => {

        return new Promise((resolve, reject) => {
            db.get().collection('adminlogin').updateOne({ _id: new objectId(adminId) }, {
                $set: {
                    username: adminDetails.username,
                    password: adminDetails.password
                }
            }).then((response) => {
                resolve()
            })
        })
    }

}