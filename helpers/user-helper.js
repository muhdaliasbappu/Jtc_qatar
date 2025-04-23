var db = require('../config/connection')
const bcrypt = require("bcrypt");
const saltRounds = 10; // You can adjust the number of salt rounds as needed
const { ObjectId } = require('mongodb');

var objectId = require('mongodb').ObjectId
module.exports = {
    adduser: (user, callback) => {
        bcrypt.hash(user.passwords, saltRounds, (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                return callback(false);
            }
            user.passwords = hash;
            db.get().collection('user').insertOne(user)
                .then((data) => {
                    callback(true);
                })
                .catch((error) => {
                    console.error("Error inserting user:", error);
                    callback(false);
                });
        });
    },

    getAlluser: () => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection('user').find().toArray()
            resolve(user)
        })
    },
    uLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let user = await db.get().collection('user').findOne({ usernames: userData.usernames });
            if (user) {
                bcrypt.compare(userData.passwords, user.passwords, (err, result) => {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        return resolve({ status: false });
                    }
                    if (result) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false });
                    }
                });
            } else {
                resolve({ status: false });
            }
        });
    },
    
    getuserDetails: (userId) => {
        return new Promise((resolve, reject) => {
          db.get().collection('user')
            .findOne({ _id: new ObjectId(userId) })
            .then((user) => {
              if (user) {
                // Remove the password field before returning the user object
                delete user.passwords;
              }
              resolve(user);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    updateuser: (userId, userDetails) => {
        return new Promise(async (resolve, reject) => {
          try {
            // If a new password is provided, hash it first
            if (userDetails.passwords) {
              userDetails.passwords = await bcrypt.hash(userDetails.passwords, saltRounds);
            }
            
            // Update the user document with the new details
            let response = await db.get().collection('user').updateOne(
              { _id: new ObjectId(userId) },
              { $set: userDetails }
            );
            
            resolve(response);
          } catch (err) {
            reject(err);
          }
        });
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
    getTimesheet: (date, employeeId) => {
        return new Promise((resolve, reject) => {
           
           
                  db.get().collection('datasheet').find({
                $and: [
                    { datevalue:  date },
                    { employee_id: employeeId }
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
    },
    getDatabByMonthAndEmployee: ( month, employeeId) => {
        
        return new Promise((resolve, reject) => {
            const [year, monthNumber] = month.split('-');
            const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
            const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999); // Set to the end of the last day of the month
            db.get().collection('datasheet').find({
                $and: [
                    { date: { $gte: firstDayOfMonth } },
                    { date: { $lte: lastDayOfMonth } },
                    { employee_id: employeeId } // Adjust the field name based on your actual schema
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
     getDatabByMonthAndEmployeewithType: ( month, employeeId, employeeType) => {
        
        return new Promise((resolve, reject) => {
            const [year, monthNumber] = month.split('-');
            const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
            const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999); // Set to the end of the last day of the month
            db.get().collection('datasheet').find({
                $and: [
                    { date: { $gte: firstDayOfMonth } },
                    { date: { $lte: lastDayOfMonth } },
                    { employee_id: employeeId } ,
                    { employeeType: employeeType}
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

    gettimesheetbydate:(date)=>{
        return new Promise((resolve, reject) => {
           
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
        
            db.get().collection('datasheet').find({
                date: { $gte: date, $lte: endOfDay }
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

    getDatabByproject1: ( month, projectname , employeeType) => {
        
        return new Promise((resolve, reject) => {
            const [year, monthNumber] = month.split('-');
            const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
            const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999); // Set to the end of the last day of the month
            db.get().collection('datasheet').find({
                $and: [
                    { date: { $gte: firstDayOfMonth } },
                    { date: { $lte: lastDayOfMonth } },
                    { projectname1: projectname } ,
                    { employeeType: employeeType } ,
                    { todaystatus: 'Working'},
                    // Adjust the field name based on your actual schema
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
    getDatabByproject2: ( month, projectname , employeeType) => {
        
        return new Promise((resolve, reject) => {
            const [year, monthNumber] = month.split('-');
            const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
            const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999); // Set to the end of the last day of the month
            db.get().collection('datasheet').find({
                $and: [
                    { date: { $gte: firstDayOfMonth } },
                    { date: { $lte: lastDayOfMonth } },
                    { projectname2: projectname } ,
                    { employeeType: employeeType } ,
                    { todaystatus: 'Working'},
                    // Adjust the field name based on your actual schema
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
    }, getDatabByproject3: ( month, projectname , employeeType) => {
        
        return new Promise((resolve, reject) => {
            const [year, monthNumber] = month.split('-');
            const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
            const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999); // Set to the end of the last day of the month
            db.get().collection('datasheet').find({
                $and: [
                    { date: { $gte: firstDayOfMonth } },
                    { date: { $lte: lastDayOfMonth } },
                    { projectname3: projectname } ,
                    { employeeType: employeeType } ,
                    { todaystatus: 'Working'},
                    // Adjust the field name based on your actual schema
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
    }, getDatabByproject4: ( month, projectname , employeeType) => {
        
        return new Promise((resolve, reject) => {
            const [year, monthNumber] = month.split('-');
            const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
            const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999); // Set to the end of the last day of the month
            db.get().collection('datasheet').find({
                $and: [
                    { date: { $gte: firstDayOfMonth } },
                    { date: { $lte: lastDayOfMonth } },
                    { projectname4: projectname } ,
                    { employeeType: employeeType } ,
                    { todaystatus: 'Working'},
                    // Adjust the field name based on your actual schema
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
    }, getDatabByproject5: ( month, projectname , employeeType) => {
        
        return new Promise((resolve, reject) => {
            const [year, monthNumber] = month.split('-');
            const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
            const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999); // Set to the end of the last day of the month
            db.get().collection('datasheet').find({
                $and: [
                    { date: { $gte: firstDayOfMonth } },
                    { date: { $lte: lastDayOfMonth } },
                    { projectname5: projectname } ,
                    { employeeType: employeeType } ,
                    { todaystatus: 'Working'},
                    // Adjust the field name based on your actual schema
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
    updateWorkingHourForDate: (targetDate, newWorkingHour, callback) => {
        const startOfDay= new Date(targetDate);
        const endOfDay= new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
       
    
        db.get().collection('datasheet').updateMany(
            { date: { $gte: startOfDay, $lte: endOfDay } }, // Using $gte and $lte for a range covering the entire day
            { $set: { workinghour: newWorkingHour } },
            (err, result) => {
                if (err) {
                    console.error('Error updating datasheets:', err);
                    callback(false);
                } else {
                    // Log the update result for debugging
                    console.log('Update Result:', result);
    
                    console.log('Working hour updated for matching date:', result.modifiedCount);
                    callback(true);
                }
            }
        );
    },updateWorkingHourAndStatusForDate: (targetDate, newWorkingHour,  callback) => {
      
        const startOfDay = new Date(targetDate);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
    
        db.get().collection('datasheet').updateMany(
            {
                date: { $gte: startOfDay, $lte: endOfDay },
                todaystatus: "Unpaid Leave"
            },
            {
                $set: {
                    workinghour: newWorkingHour,
                    todaystatus: 'Paid Leave'
                }
            },
            (err, result) => {
                if (err) {
                    console.error('Error updating datasheets:', err);
                    callback(false);
                } 
            }
        );
    },
    
    getDatabByMonthofPaidLeave: (month, id , employeeType) => {
    return new Promise((resolve, reject) => {
        const [year, monthNumber] = month.split('-');
        const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
        const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999);
        console.log(employeeType,'1')
        

        db.get().collection('datasheet').find({
            $and: [
                {
                    $or: [
                        { 
                            $and: [
                                { date: { $gte: firstDayOfMonth } },
                                { date: { $lte: lastDayOfMonth } },
                                { employee_id: id },
                                { todaystatus: 'Paid Leave' },
                                { employeeType: employeeType }
                                
                            ]
                        },
                        { 
                            $and: [
                                { date: { $gte: firstDayOfMonth } },
                                { date: { $lte: lastDayOfMonth } },
                                { employee_id: id },
                                { workinghour: '0' },
                                { todaystatus: 'Working' },
                                { employeeType: employeeType },
                                { employeeType: { $nin: ['Own Staff (Projects)', 'Hired Staff (Projects)'] } }  // Condition for x not equal to y or z
                            ]
                        }
                    ]
                }
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
getLeaveAndVacationCount: (month, employeeId) => {
    return new Promise((resolve, reject) => {
        const [year, monthNumber] = month.split('-');
        const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
        const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999); // Set to the end of the last day of the month

        db.get().collection('datasheet').find({
            $and: [
                { date: { $gte: firstDayOfMonth } },
                { date: { $lte: lastDayOfMonth } },
                { employee_id: employeeId },
                { $or: [
                    { todaystatus: 'Unpaid Leave' },
                    { todaystatus: 'On Vacation' }
                ] }
            ]
        }).toArray()
        .then((response) => {
            const leaveCount = response.filter(entry => entry.todaystatus === 'Unpaid Leave').length;
            const vacationCount = response.filter(entry => entry.todaystatus === 'On Vacation').length;
            const totalCount = leaveCount + vacationCount;
            resolve(totalCount);
        })
        .catch((error) => {
            console.error('Error:', error);
            reject(error);
        });
    });
},
getDatabByMonthofPaidLeaveoperation: (month, id) => {
    return new Promise((resolve, reject) => {
        const [year, monthNumber] = month.split('-');
        const firstDayOfMonth = new Date(year, monthNumber - 1, 1);
        const lastDayOfMonth = new Date(year, monthNumber, 0, 23, 59, 59, 999);

        db.get().collection('datasheet').find({
            $and: [
                {
                    $or: [
                        { 
                            $and: [
                                { date: { $gte: firstDayOfMonth } },
                                { date: { $lte: lastDayOfMonth } },
                                { employee_id: id },
                                { todaystatus: 'Paid Leave' },
                                { employeeType: 'Own Staff (Operations)' }
                            ]
                        },
                        { 
                            $and: [
                                { date: { $gte: firstDayOfMonth } },
                                { date: { $lte: lastDayOfMonth } },
                                { employee_id: id },
                                { todaystatus: 'Paid Leave' },
                                { employeeType: 'Hired Staff (Operations)' }
                            ]
                        }
                    ]
                }
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
getDatabByMonthofPaidLeaveoperationdtd: (month, id) => {
    return new Promise((resolve, reject) => {
        
        const firstDayOfMonth = new Date(month.startDate);
        firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM
        
        const lastDayOfMonth = new Date(month.endDate);
        lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM

        db.get().collection('datasheet').find({
            $and: [
                {
                    $or: [
                        { 
                            $and: [
                                { date: { $gte: firstDayOfMonth } },
                                { date: { $lte: lastDayOfMonth } },
                                { employee_id: id },
                                { todaystatus: 'Paid Leave' },
                                { employeeType: 'Own Staff (Operations)' }
                            ]
                        },
                        { 
                            $and: [
                                { date: { $gte: firstDayOfMonth } },
                                { date: { $lte: lastDayOfMonth } },
                                { employee_id: id },
                                { todaystatus: 'Paid Leave' },
                                { employeeType: 'Hired Staff (Operations)' }
                            ]
                        }
                    ]
                }
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


gettimesheetbydatevalue: ( datevalue ) => {
        
    return new Promise((resolve, reject) => {
            db.get().collection('datasheet').find({
            $and: [
                { datevalue: datevalue } ,               
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
getDatabByproject1dtd: ( month, projectname , employeeType) => {
        
    return new Promise((resolve, reject) => {
        const firstDayOfMonth = new Date(month.date1);
        firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM
        
        const lastDayOfMonth = new Date(month.date2);
        lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM
        
        db.get().collection('datasheet').find({
            $and: [
                { date: { $gte: firstDayOfMonth } },
                { date: { $lte: lastDayOfMonth } },
                { projectname1: projectname } ,
                { employeeType: employeeType } ,
                { todaystatus: 'Working'},
                // Adjust the field name based on your actual schema
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
getDatabByproject2dtd: ( month, projectname , employeeType) => {
    
    return new Promise((resolve, reject) => {
        const firstDayOfMonth = new Date(month.date1);
firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM

const lastDayOfMonth = new Date(month.date2);
lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM

        db.get().collection('datasheet').find({
            $and: [
                { date: { $gte: firstDayOfMonth } },
                { date: { $lte: lastDayOfMonth } },
                { projectname2: projectname } ,
                { employeeType: employeeType } ,
                { todaystatus: 'Working'},
                // Adjust the field name based on your actual schema
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
}, getDatabByproject3dtd: ( month, projectname , employeeType) => {
    
    return new Promise((resolve, reject) => {
        const firstDayOfMonth = new Date(month.date1);
firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM

const lastDayOfMonth = new Date(month.date2);
lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM
  
        db.get().collection('datasheet').find({
            $and: [
                { date: { $gte: firstDayOfMonth } },
                { date: { $lte: lastDayOfMonth } },
                { projectname3: projectname } ,
                { employeeType: employeeType } ,
                { todaystatus: 'Working'},
                // Adjust the field name based on your actual schema
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
}, getDatabByproject4dtd: ( month, projectname , employeeType) => {
    
    return new Promise((resolve, reject) => {
        const firstDayOfMonth = new Date(month.date1);
firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM

const lastDayOfMonth = new Date(month.date2);
lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM

      db.get().collection('datasheet').find({
            $and: [
                { date: { $gte: firstDayOfMonth } },
                { date: { $lte: lastDayOfMonth } },
                { projectname4: projectname } ,
                { employeeType: employeeType } ,
                { todaystatus: 'Working'},
                // Adjust the field name based on your actual schema
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
}, getDatabByproject5dtd: ( month, projectname , employeeType) => {
    
    return new Promise((resolve, reject) => {
        const firstDayOfMonth = new Date(month.date1);
firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM

const lastDayOfMonth = new Date(month.date2);
lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM

        db.get().collection('datasheet').find({
            $and: [
                { date: { $gte: firstDayOfMonth } },
                { date: { $lte: lastDayOfMonth } },
                { projectname5: projectname } ,
                { employeeType: employeeType } ,
                { todaystatus: 'Working'},
                // Adjust the field name based on your actual schema
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

getDatabByMonthofPaidLeavedtd: (month, id , employeeType) => {

    return new Promise((resolve, reject) => {
        const firstDayOfMonth = new Date(month.startDate);
        firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM
        
        const lastDayOfMonth = new Date(month.endDate);
        lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM
       
        
        db.get().collection('datasheet').find({
            $and: [
                {
                    $or: [
                        { 
                            $and: [
                                { date: { $gte: firstDayOfMonth } },
                                { date: { $lte: lastDayOfMonth } },
                                { employee_id: id },
                                { todaystatus: 'Paid Leave' },
                                { employeeType: employeeType }
                                
                            ]
                        },
                        { 
                            $and: [
                                { date: { $gte: firstDayOfMonth } },
                                { date: { $lte: lastDayOfMonth } },
                                { employee_id: id },
                                { workinghour: '0' },
                                { todaystatus: 'Working' },
                                { employeeType: employeeType },
                                { employeeType: { $nin: ['Own Staff (Projects)', 'Hired Staff (Projects)'] } }  // Condition for x not equal to y or z
                            ]
                        }
                    ]
                }
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
getLeaveAndVacationCountdtd: (month, employeeId) => {
    return new Promise((resolve, reject) => {
        const firstDayOfMonth = new Date(month.startDate);
        firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM
        
        const lastDayOfMonth = new Date(month.endDate);
        lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM
        db.get().collection('datasheet').find({
            $and: [
                { date: { $gte: firstDayOfMonth } },
                { date: { $lte: lastDayOfMonth } },
                { employee_id: employeeId },
                { $or: [
                    { todaystatus: 'Unpaid Leave' },
                    { todaystatus: 'On Vacation' }
                ] }
            ]
        }).toArray()
        .then((response) => {
            const leaveCount = response.filter(entry => entry.todaystatus === 'Unpaid Leave').length;
            const vacationCount = response.filter(entry => entry.todaystatus === 'On Vacation').length;
            const totalCount = leaveCount + vacationCount;
            resolve(totalCount);
        })
        .catch((error) => {
            console.error('Error:', error);
            reject(error);
        });
    });
},
 getallworkingoperationdata : (month) => {
    return new Promise((resolve, reject) => {
        const firstDayOfMonth = new Date(month.startdate);
        firstDayOfMonth.setHours(0, 0, 0, 0); // Set time to 12:00 AM
        
        const lastDayOfMonth = new Date(month.enddate);
        lastDayOfMonth.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM
        
        db.get().collection('datasheet').find({
            $and: [
                { date: { $gte: firstDayOfMonth } },
                { date: { $lte: lastDayOfMonth } },
                { todaystatus: 'Working' },
                { employeeType: { $in: ['Own Staff (Operations)', 'Hired Staff (Operations)'] } }
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


 closeSalaryStatusForMonth :(yearMonth) => {
    return new Promise((resolve, reject) => {
        // Extract year and month from the input string 'YYYY-MM'
        const [year, month] = yearMonth.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1); // First day of the month
        const endDate = new Date(year, month, 1); // First day of the next month

        db.get()
            .collection('datasheet')
            .updateMany(
                { date: { $gte: startDate, $lt: endDate } }, // Filter documents within the month
                { $set: { salarystatus: 'close' } } // Set the field
            )
            .then((response) => {
                if (response.matchedCount === 0) {
                    return reject(new Error('No documents found for the specified month.'));
                }
                resolve(`Updated ${response.modifiedCount} documents to salarystatus: 'close'`);
            })
            .catch((err) => {
                reject(err);
            });
    });
},




    
}
