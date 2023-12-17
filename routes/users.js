var express = require('express');

const bodyParser = require('body-parser');

var router = express.Router();
var employeHelpers = require('../helpers/employee-helpers')
var projectHelpers = require('../helpers/project-helpers')
var userHelpers = require('../helpers/user-helper');
var expiringTimeliest = require('../modules/cron');
var DayView = require('../modules/DayView')

const { all } = require('../app');
const async = require('hbs/lib/async');
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const cron = require('node-cron')
const schedule = require('node-schedule');
process.env.TZ = 'Asia/Qatar';
const pdf = require('html-pdf');
const puppeteer = require('puppeteer');
cron.schedule('55 23 * * *',() => {
  var dateObj2 = new Date();
  dateObj2.setDate(dateObj2.getDate() - 2);
  if(dateObj2.getDay() === 5){
 expiringTimeliest.cronfriday()
  }else{
    expiringTimeliest.cronnotfriday()
  }
})


function getthedate() {
  var dateObj1 = new Date();
  dateObj1.setDate(dateObj1.getDate() - 1);

  var date1 = dateObj1.getFullYear() + '-' + (dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();
  var dateObj2 = new Date();
  dateObj2.setDate(dateObj2.getDate() - 2);

  var date2 = dateObj2.getFullYear() + '-' + (dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();
  const dates = [{ date1, date2 }]

  return dates;
}





router.get('/', function (req, res, next) {
  res.render('./users/user-login');
});
router.get('/employeelist', function (req, res) {
  if (req.session.users) {
        var dateObj1 = new Date();
        dateObj1.setDate(dateObj1.getDate() - 1);
        var date1 = dateObj1.getFullYear() + '-' + (dateObj1.getMonth() + 1) + '-' + dateObj1.getDate();
        let datess = []
        datess.date1 = date1
        var days = DayView.dayview(date1)
        datess.days = days

    employeHelpers.getAllemployee().then(function (employees) {
      var activeEmployees = [];
      for (let i = 0; i < employees.length; i++) {
        if (employees[i].Employeestatus === 'Working') {
          if (employees[i].Employeeasigned === req.session.usernames) {
          activeEmployees.push(employees[i]);

          }
        }
      }
      projectHelpers.getAllproject().then((projects) => {
        var activeProjects = [];
        for (let j = 0; j < projects.length; j++) {
          if (projects[j].projectstatus === 'Ongoing') {
            activeProjects.push(projects[j]);

          }
        }
        
        res.render('./users/employee-list', {

          user: true, employees: JSON.stringify(activeEmployees), activeProjects, datess
        });
      })

    });
  }
})

router.get('/employeelist2', function (req, res) {
  if (req.session.users) {

    employeHelpers.getAllemployee().then(function (employees) {
      var activeEmployees = [];
      for (let i = 0; i < employees.length; i++) {
        if (employees[i].Employeestatus === 'Working') {
          if (employees[i].Employeeasigned === req.session.usernames) {
            activeEmployees.push(employees[i]);
          }
        }
      }
      projectHelpers.getAllproject().then((projects) => {
        var activeProjects = [];
        for (let j = 0; j < projects.length; j++) {
          if (projects[j].projectstatus === 'Ongoing') {
            activeProjects.push(projects[j]);

          }
        }
        var dateObj2 = new Date();
        dateObj2.setDate(dateObj2.getDate() - 2);
        var date2 = dateObj2.getFullYear() + '-' + (dateObj2.getMonth() + 1) + '-' + dateObj2.getDate();
        let datess = []
        datess.date2 = date2
        var days = DayView.dayview(date2)
        datess.days = days
        res.render('./users/employee-list2', {

          user: true, employees: JSON.stringify(activeEmployees), activeProjects, datess
        });
      })

    }); 
  }
})
router.get('/printdatasheet', async (req, res) => {
  try {
    const employeedatasheet = await userHelpers.getDatasheet();
    const alloweddatasheet1 = [];
    const activeEmployees1 = [];
    const lastdates = getthedate();

    const employees = await employeHelpers.getAllemployee();
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].Employeeasigned === req.session.usernames) {
        activeEmployees1.push(employees[i]);
      }
    }

    for (let z = 0; z < employeedatasheet.length; z++) {
      if (employeedatasheet[z].datevalue === lastdates[0].date1) {
        for (let x = 0; x < activeEmployees1.length; x++) {
          if (activeEmployees1[x]._id.toString() === employeedatasheet[z].employee_id) {
            alloweddatasheet1.push(employeedatasheet[z]);
          }
        }
      }
    }

    for (let t = 0; t < alloweddatasheet1.length; t++) {
      alloweddatasheet1[t].index = t + 1;
    }

    const dates = lastdates.map(date => DayView.dayview(date));

    res.render('template', { alloweddatasheet1, dates }, (err, html) => {
      if (err) {
        return res.status(500).send(err);
      }

      (async () => {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Timesheet.pdf"');
        res.send(pdfBuffer);

        await browser.close();
      })();
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/printdatasheet2', (req, res) => {

  userHelpers.getDatasheet().then(function (employeedatasheet) {
     
    let alloweddatasheet1 = []
      var activeEmployees1 = [];
      let lastdates = getthedate() 

      employeHelpers.getAllemployee().then(function (employees) {
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].Employeeasigned === req.session.usernames) {
            activeEmployees1.push(employees[i]);
          }
        }

        for (let z = 0; z < employeedatasheet.length; z++) {
           if (employeedatasheet[z].datevalue === lastdates[0].date2) {
            for(let x=0; x < activeEmployees1.length; x++){
              if(activeEmployees1[x]._id.toString() === employeedatasheet[z].employee_id){
                alloweddatasheet1.push(employeedatasheet[z]);
               
              } 
            }
          }
        }

   
        for(let t=0; t<alloweddatasheet1.length; t++){
          alloweddatasheet1[t].index = t+1
        }

     
    
      alloweddatasheet1.date = DayView.dayview(lastdates[0].date2) ;
    
    res.render('template',  {alloweddatasheet1}, (err, html) => {
        if (err) {
            return res.status(500).send(err);
        }

        const options = {
            format: 'Letter',
        };

        pdf.create(html, options).toStream((err, stream) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="Timesheet.pdf"');
            stream.pipe(res);
        });
    });
  });
});
});


router.post('/', (req, res) => {
  userHelpers.uLogin(req.body).then((response) => {
    if (response.status) {

      req.session.users = response.user
      req.session.usernames = response.user.usernames

      req.session.users = true
      res.redirect('/employeelist');

    } else {
      res.redirect('/')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})





//Time sheet upload
router.post('/users/employee-list/', async (req, res) => {

   
    let semployee = await employeHelpers.getEmployeeDetails(req.body.employee_id);
console.log(req.body)


  var datasheet = req.body
  var datevalue = req.body.datevalue
  let datess = getthedate()

  if (datevalue === datess[0].date1) {
    var dateObj11 = new Date();
    dateObj11.setDate(dateObj11.getDate() - 1);
    datasheet.date = dateObj11;
  } else if (datevalue === datess[0].date2) {
    var dateObj22 = new Date();
    dateObj22.setDate(dateObj22.getDate() - 2);
    datasheet.date = dateObj22;
  } else {
    return 0;
  }
datasheet.employeeType = semployee.employeeType;
if(semployee.employeeType === 'Hired Labour (Hourly)'){
  datasheet.sbasic = '';
datasheet.sallowance = '';
datasheet.sbonus = ''; 
datasheet.srateph = semployee.srateph;
}else{
datasheet.sbasic = semployee.sbasic;
datasheet.sallowance = semployee.sallowance;
datasheet.sbonus = semployee.sbonus;
datasheet.srateph = '';
}

userHelpers.getDatasheet().then(function (edatasheet) {
  
  if (!edatasheet.length) {
    userHelpers.addDatasheet(datasheet, (result) => {

    })
  } else {
    let count = 0;
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let datec = 0;
    for (let i = 0; i < edatasheet.length; i++) {
     
      if (edatasheet[i].date.getFullYear() === datasheet.date.getFullYear()) {
        if (edatasheet[i].date.getMonth() === datasheet.date.getMonth()) {
          if (edatasheet[i].date.getDate() === datasheet.date.getDate()) {
            datec++;
            if (edatasheet[i].employee_id === datasheet.employee_id) {
              
              break;
            } else {

              count++;
            }
          }

          else {
            count1++;
            if (count1 === edatasheet.length) {
              userHelpers.addDatasheet(datasheet, (result) => {

              })
              break;
            }
          }
        } else {
          count2++;
          if (count2 === edatasheet.length) {
            userHelpers.addDatasheet(datasheet, (result) => {

            })
            break;
          }
        }
      } else {
        count3++;
        if (count3 === edatasheet.length) {
          userHelpers.addDatasheet(datasheet, (result) => {

          })
          break;
        }
      }
    }
    if (count === datec) {
      userHelpers.addDatasheet(datasheet, (result) => {

      })

    }
  }
})

});

router.get('/employee-data', function (req, res, next) {

  if (req.session.users) {
    userHelpers.getDatasheet().then(function (employeedatasheet) {
     
      let alloweddatasheet1 = []
      var activeEmployees1 = [];
      let lastdates = getthedate() 

      employeHelpers.getAllemployee().then(function (employees) {
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].Employeeasigned === req.session.usernames) {
            activeEmployees1.push(employees[i]);
          }
        }

        for (let z = 0; z < employeedatasheet.length; z++) {
           if (employeedatasheet[z].datevalue === lastdates[0].date1) {
            for(let x=0; x < activeEmployees1.length; x++){
              if(activeEmployees1[x]._id.toString() === employeedatasheet[z].employee_id){
                alloweddatasheet1.push(employeedatasheet[z]);
               
              } 
            }
          }
        }

   
        for(let t=0; t<alloweddatasheet1.length; t++){
          alloweddatasheet1[t].index = t+1
        }

     
    
      alloweddatasheet1.date = DayView.dayview(lastdates[0].date1) ;
      

        res.render('./users/datasheet' , { user: true,  alloweddatasheet1 });
      });
    });
  }
});



router.get('/employee-data2', function (req, res, next) {

  if (req.session.users) {
    userHelpers.getDatasheet().then(function (employeedatasheet) {
     
      let alloweddatasheet2 = []
      var activeEmployees1 = [];
      let lastdates = getthedate() 

      employeHelpers.getAllemployee().then(function (employees) {
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].Employeeasigned === req.session.usernames) {
            activeEmployees1.push(employees[i]);
          }
        }

        for (let z = 0; z < employeedatasheet.length; z++) {
           if (employeedatasheet[z].datevalue === lastdates[0].date2) {
            for(let x=0; x < activeEmployees1.length; x++){
              if(activeEmployees1[x]._id.toString() === employeedatasheet[z].employee_id){
                alloweddatasheet2.push(employeedatasheet[z]);
               
              } 
            }
          }
        }

   
        for(let t=0; t<alloweddatasheet2.length; t++){
          alloweddatasheet2[t].index = t+1
        }

     
    
      alloweddatasheet2.date = DayView.dayview(lastdates[0].date2) ;
      

        res.render('./users/datasheet2' , { user: true,  alloweddatasheet2 });
      });
    });
  }
});

router.get('/edit-datasheet/:id', async (req, res) => {

  let edatasheet = await userHelpers.getDatasheetDetails(req.params.id)
  var activeProjects = [];
  projectHelpers.getAllproject().then((projects) => {
    for (let j = 0; j < projects.length; j++) {
      if (projects[j].projectstatus === 'Ongoing') {
      
        activeProjects.push(projects[j]);
        
      }
    }
  })
  res.render('./users/edit-datasheet', { user: true, edatasheet, activeProjects })
})
router.post('/edit-datasheet/:id', (req, res) => {

  userHelpers.updateDatasheet(req.params.id, req.body).then(() => {
    res.redirect('/employee-data')
  })
})

module.exports = router;

