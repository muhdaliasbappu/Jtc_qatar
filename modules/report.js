
const { report } = require("../app");
var userHelpers = require("../helpers/user-helper");
function getDaysInMonth(dateString) {
    // Parse the input date string
    const dateObject = new Date(dateString);
  
    // Get the year and month from the date
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth();
  
    // Use the same approach to find the last day of the month
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    return lastDay;
  }

module.exports = {

salaryreportlabour: (timesheet)=>{
    return new Promise((resolve, reject) => {
let workday =0;
let leave = 0
let paidL = 0
let othours =0;
let report = {}
let otsalary = 0
let basicsalary =0
let allowance = 0
let bonus = 0
let dd
let totalhours= 0
  

for(let i=0;i<timesheet.length;i++){
    
    dd = new Date(timesheet[i].datevalue);
    let date = dd.getDate();
    let day = dd.getDay();
    if(timesheet[i].todaystatus === 'Working'){
        workday++;
        let tempot = 0;
        let tempwhto = 0;
        let tempotsal = 0 ;
        
        if(timesheet[i].workinghour === 0){
            
            tempwhto =
            Number(timesheet[i].workhour1) +
            Number(timesheet[i].workhour2) +
            Number(timesheet[i].workhour3) +
            Number(timesheet[i].workhour4) +
            Number(timesheet[i].workhour5);
            totalhours=totalhours+tempwhto
            tempotsal = tempwhto*timesheet[i].sbasic/240;          
            othours = othours+tempwhto
            otsalary = otsalary+tempotsal  

        }else {
            tempwhto =
            Number(timesheet[i].workhour1) +
            Number(timesheet[i].workhour2) +
            Number(timesheet[i].workhour3) +
            Number(timesheet[i].workhour4) +
            Number(timesheet[i].workhour5);
            totalhours=totalhours+tempwhto

            if(tempwhto > timesheet[i].workinghour){
                tempot = tempwhto-timesheet[i].workinghour;
                othours = othours+tempot
                tempotsal = tempot*timesheet[i].sbasic/240;         
                otsalary = otsalary+tempotsal
                tempwhto = tempwhto-timesheet[i].workinghour;
            }else{
               
                tempwhto = tempwhto-tempwhto
            }
        }
        switch (date){
            case 1:
                report.d1wh = tempwhto;
                break;
            case 2:
                report.d2wh = tempwhto;
                break; 
            case 3:
                report.d3wh = tempwhto;
                break;
                case 4:
                    report.d4wh = tempwhto;
                    break;
                case 5:
                    report.d5wh = tempwhto;
                    break;
                case 6:
                    report.d6wh = tempwhto;
                    break;
                case 7:
                    report.d7wh = tempwhto;
                    break;
                case 8:
                    report.d8wh = tempwhto;
                    break;
                case 9:
                    report.d9wh = tempwhto;
                    break;
                case 10:
                    report.d10wh = tempwhto;
                    break;      
                    case 11:
                        report.d11wh = tempwhto;
                        break;
                    case 12:
                        report.d12wh = tempwhto;
                        break; 
                    case 13:
                        report.d13wh = tempwhto;
                        break;
                        case 14:
                            report.d14wh = tempwhto;
                            break;
                        case 15:
                            report.d15wh = tempwhto;
                            break;
                        case 16:
                            report.d16wh = tempwhto;
                            break;
                        case 17:
                            report.d17wh = tempwhto;
                            break;
                        case 18:
                            report.d18wh = tempwhto;
                            break;
                        case 19:
                            report.d19wh = tempwhto;
                            break;
                        case 20:
                            report.d20wh = tempwhto;
                            break; 
                            case 21:
                                report.d21wh = tempwhto;
                                break;
                            case 22:
                                report.d22wh = tempwhto;
                                break; 
                            case 23:
                                report.d23wh = tempwhto;
                                break;
                                case 24:
                                    report.d24wh = tempwhto;
                                    break;
                                case 25:
                                    report.d25wh = tempwhto;
                                    break;
                                case 26:
                                    report.d26wh = tempwhto;
                                    break;
                                case 27:
                                    report.d27wh = tempwhto;
                                    break;
                                case 28:
                                    report.d28wh = tempwhto;
                                    break;
                                case 29:
                                    report.d29wh = tempwhto;
                                    break;
                                case 30:
                                    report.d30wh = tempwhto;
                                    break;          
                                    case 31:
                                        report.d31wh = tempwhto;
                                        break;                     
                
        }
    }
    else if(timesheet[i].todaystatus === 'Paid Leave'){
        paidL++;
                if(day === 5){
                    switch (date){
                        case 1:
                            report.d1wh = 'F';
                            break;
                        case 2:
                            report.d2wh = 'F';
                            break; 
                        case 3:
                            report.d3wh = 'F';
                            break;
                            case 4:
                                report.d4wh ='F';
                                break;
                            case 5:
                                report.d5wh = 'F';
                                break;
                            case 6:
                                report.d6wh = 'F';
                                break;
                            case 7:
                                report.d7wh = 'F';
                                break;
                            case 8:
                                report.d8wh = 'F';
                                break;
                            case 9:
                                report.d9wh = 'F';
                                break;
                            case 10:
                                report.d10wh = 'F';
                                break;      
                                case 11:
                                    report.d11wh = 'F';
                                    break;
                                case 12:
                                    report.d12wh = 'F';
                                    break; 
                                case 13:
                                    report.d13wh = 'F';
                                    break;
                                    case 14:
                                        report.d14wh = 'F';
                                        break;
                                    case 15:
                                        report.d15wh = 'F';
                                        break;
                                    case 16:
                                        report.d16wh = 'F'
                                        break;
                                    case 17:
                                        report.d17wh = 'F';
                                        break;
                                    case 18:
                                        report.d18wh = 'F';
                                        break;
                                    case 19:
                                        report.d19wh = 'F';
                                        break;
                                    case 20:
                                        report.d20wh = 'F';
                                        break; 
                                        case 21:
                                            report.d21wh = 'F';
                                            break;
                                        case 22:
                                            report.d22wh = 'F';
                                            break; 
                                        case 23:
                                            report.d23wh ='F';
                                            break;
                                            case 24:
                                                report.d24wh = 'F';
                                                break;
                                            case 25:
                                                report.d25wh = 'F';
                                                break;
                                            case 26:
                                                report.d26wh = 'F';
                                                break;
                                            case 27:
                                                report.d27wh = 'F';
                                                break;
                                            case 28:
                                                report.d28wh = 'F';
                                                break;
                                            case 29:
                                                report.d29wh = 'F';
                                                break;
                                            case 30:
                                                report.d30wh = 'F';
                                                break;    
                                                case 31:
                                                    report.d31wh = 'F';
                                                    break;                               
                            
                    }
    

                }else{
                switch (date){
                    case 1:
                        report.d1wh = 'P';
                        break;
                    case 2:
                        report.d2wh = 'P';
                        break; 
                    case 3:
                        report.d3wh = 'P';
                        break;
                        case 4:
                            report.d4wh ='P';
                            break;
                        case 5:
                            report.d5wh = 'P';
                            break;
                        case 6:
                            report.d6wh = 'P';
                            break;
                        case 7:
                            report.d7wh = 'P';
                            break;
                        case 8:
                            report.d8wh = 'P';
                            break;
                        case 9:
                            report.d9wh = 'P';
                            break;
                        case 10:
                            report.d10wh = 'P';
                            break;      
                            case 11:
                                report.d11wh = 'P';
                                break;
                            case 12:
                                report.d12wh = 'P';
                                break; 
                            case 13:
                                report.d13wh = 'P';
                                break;
                                case 14:
                                    report.d14wh = 'P';
                                    break;
                                case 15:
                                    report.d15wh = 'P';
                                    break;
                                case 16:
                                    report.d16wh = 'P'
                                    break;
                                case 17:
                                    report.d17wh = 'P';
                                    break;
                                case 18:
                                    report.d18wh = 'P';
                                    break;
                                case 19:
                                    report.d19wh = 'P';
                                    break;
                                case 20:
                                    report.d20wh = 'P';
                                    break; 
                                    case 21:
                                        report.d21wh = 'P';
                                        break;
                                    case 22:
                                        report.d22wh = 'P';
                                        break; 
                                    case 23:
                                        report.d23wh ='P';
                                        break;
                                        case 24:
                                            report.d24wh = 'P';
                                            break;
                                        case 25:
                                            report.d25wh = 'P';
                                            break;
                                        case 26:
                                            report.d26wh = 'P';
                                            break;
                                        case 27:
                                            report.d27wh = 'P';
                                            break;
                                        case 28:
                                            report.d28wh = 'P';
                                            break;
                                        case 29:
                                            report.d29wh = 'P';
                                            break;
                                        case 30:
                                            report.d30wh = 'P';
                                            break;   
                                            case 31:
                                            report.d31wh = 'P';
                                            break;           
                                                              
                        
                }
            
            }
  }else if(timesheet[i].todaystatus === 'Unpaid Leave'){
    leave++
        switch (date){
            case 1:
                report.d1wh = 'L';
                break;
            case 2:
                report.d2wh = 'L';
                break; 
            case 3:
                report.d3wh = 'L';
                break;
                case 4:
                    report.d4wh ='L';
                    break;
                case 5:
                    report.d5wh = 'L';
                    break;
                case 6:
                    report.d6wh = 'L';
                    break;
                case 7:
                    report.d7wh = 'L';
                    break;
                case 8:
                    report.d8wh = 'L';
                    break;
                case 9:
                    report.d9wh = 'L';
                    break;
                case 10:
                    report.d10wh = 'L';
                    break;      
                    case 11:
                        report.d11wh = 'L';
                        break;
                    case 12:
                        report.d12wh = 'L';
                        break; 
                    case 13:
                        report.d13wh = 'L';
                        break;
                        case 14:
                            report.d14wh = 'L';
                            break;
                        case 15:
                            report.d15wh = 'L';
                            break;
                        case 16:
                            report.d16wh = 'L';
                            break;
                        case 17:
                            report.d17wh = 'L';
                            break;
                        case 18:
                            report.d18wh = 'L';
                            break;
                        case 19:
                            report.d19wh = 'L';
                            break;
                        case 20:
                            report.d20wh = 'L';
                            break; 
                            case 21:
                                report.d21wh = 'L';
                                break;
                            case 22:
                                report.d22wh = 'L';
                                break; 
                            case 23:
                                report.d23wh ='L';
                                break;
                                case 24:
                                    report.d24wh = 'L';
                                    break;
                                case 25:
                                    report.d25wh = 'L';
                                    break;
                                case 26:
                                    report.d26wh = 'L';
                                    break;
                                case 27:
                                    report.d27wh = 'L';
                                    break;
                                case 28:
                                    report.d28wh = 'L';
                                    break;
                                case 29:
                                    report.d29wh = 'L';
                                    break;
                                case 30:
                                    report.d30wh = 'L';
                                    break;          
                                    case 31:
                                        report.d31wh = 'L';
                                        break;                     
                
        }

    }else if(timesheet[i].todaystatus === 'On Vacation'){
       leave++
        switch (date){
            case 1:
                report.d1wh = 'V';
                break;
            case 2:
                report.d2wh =  'V';
                break; 
            case 3:
                report.d3wh =  'V';
                break;
                case 4:
                    report.d4wh = 'V';
                    break;
                case 5:
                    report.d5wh = 'V';
                    break;
                case 6:
                    report.d6wh =  'V';
                    break;
                case 7:
                    report.d7wh =  'V';
                    break;
                case 8:
                    report.d8wh = "V";
                    break;
                case 9:
                    report.d9wh = "V";
                    break;
                case 10:
                    report.d10wh =  'V';
                    break;      
                    case 11:
                        report.d11wh = 'V';
                        break;
                    case 12:
                        report.d12wh =  'V';
                        break; 
                    case 13:
                        report.d13wh =  'V';
                        break;
                        case 14:
                            report.d14wh =  'V';
                            break;
                        case 15:
                            report.d15wh = 'V';
                            break;
                        case 16:
                            report.d16wh =  'V';
                            break;
                        case 17:
                            report.d17wh =  'V';
                            break;
                        case 18:
                            report.d18wh = 'V';
                            break;
                        case 19:
                            report.d19wh =  'V';
                            break;
                        case 20:
                            report.d20wh =  'V';
                            break; 
                            case 21:
                                report.d21wh = 'V';
                                break;
                            case 22:
                                report.d22wh =  'V';
                                break; 
                            case 23:
                                report.d23wh = 'V';
                                break;
                                case 24:
                                    report.d24wh = 'V';
                                    break;
                                case 25:
                                    report.d25wh = 'V';
                                    break;
                                case 26:
                                    report.d26wh =  'V';
                                    break;
                                case 27:
                                    report.d27wh =  'V';
                                    break;
                                case 28:
                                    report.d28wh =  'V';
                                    break;
                                case 29:
                                    report.d29wh =  'V';
                                    break;
                                case 30:
                                    report.d30wh =  'V';
                                    break;          
                                    case 31:
                                        report.d31wh = 'V';
                                        break;                     
                
        }
    }
    
}
let month = getDaysInMonth(dd);
let tempwd = 0;

// Handle special February cases:
if (month === 29 && workday === 29) {
  report.workdays = 29;
  tempwd = 30;
}
else if (month === 28 && workday === 28) {
  report.workdays = 28;
  tempwd = 30;
}
else {
  // For months >= 30, default to workday
  tempwd = workday;

  // If it's a 31-day month:
  if (month === 31) {
    // If the employee's workday is literally 31, force final = 30
    if (month === 31) {
        // If the employee's workday is literally 31, force final = 30
        if (workday+paidL === 31) {
          tempwd = 30;
        }else{
            if(leave > paidL || leave + paidL + workday !== 31) {
                tempwd= workday+paidL
            }else if (paidL > 0){
                paidL=paidL-1
                tempwd=workday+paidL
            }
        } 
        // otherwise, keep tempwd = workday
      }
    // otherwise, keep tempwd = workday
  }

  report.workdays = tempwd;
}


// finalWorkdays now matches your scenario-based requirements
report.totalhours = totalhours
basicsalary = tempwd*timesheet[0].sbasic/30
allowance = tempwd*timesheet[0].sallowance/30
bonus = tempwd*timesheet[0].sbonus/30
report.basic = Math.round(basicsalary)
report.allowance =  Math.round(allowance)
report.bonus = Math.round(bonus)
report.otsalary =  Math.round(otsalary)
report.othours = othours
report.totalsalary =  Math.round(basicsalary+allowance+bonus+otsalary)
resolve(report)
})

},
salaryreportlabourhourly: (timesheet)=>{
    return new Promise((resolve, reject) => {
    let workday=0;
    let totalsalary =  0;
    let totalhours = 0
    let report = { }
    for(i=0;i<timesheet.length;i++){
        const dd = new Date(timesheet[i].datevalue);
        let date = dd.getDate();
        if(timesheet[i].todaystatus === 'Working'){
            let tempwhto = 0
            workday++;
            tempwhto =
            Number(timesheet[i].workhour1) +
            Number(timesheet[i].workhour2) +
            Number(timesheet[i].workhour3) +
            Number(timesheet[i].workhour4) +
            Number(timesheet[i].workhour5);
            totalhours=totalhours+tempwhto
            totalsalary = totalsalary + tempwhto*timesheet[i].srateph
            switch (date){
                case 1:
                    report.d1wh = tempwhto;
                    break;
                case 2:
                    report.d2wh = tempwhto;
                    break; 
                case 3:
                    report.d3wh = tempwhto;
                    break;
                    case 4:
                        report.d4wh = tempwhto;
                        break;
                    case 5:
                        report.d5wh = tempwhto;
                        break;
                    case 6:
                        report.d6wh = tempwhto;
                        break;
                    case 7:
                        report.d7wh = tempwhto;
                        break;
                    case 8:
                        report.d8wh = tempwhto;
                        break;
                    case 9:
                        report.d9wh = tempwhto;
                        break;
                    case 10:
                        report.d10wh = tempwhto;
                        break;      
                        case 11:
                            report.d11wh = tempwhto;
                            break;
                        case 12:
                            report.d12wh = tempwhto;
                            break; 
                        case 13:
                            report.d13wh = tempwhto;
                            break;
                            case 14:
                                report.d14wh = tempwhto;
                                break;
                            case 15:
                                report.d15wh = tempwhto;
                                break;
                            case 16:
                                report.d16wh = tempwhto;
                                break;
                            case 17:
                                report.d17wh = tempwhto;
                                break;
                            case 18:
                                report.d18wh = tempwhto;
                                break;
                            case 19:
                                report.d19wh = tempwhto;
                                break;
                            case 20:
                                report.d20wh = tempwhto;
                                break; 
                                case 21:
                                    report.d21wh = tempwhto;
                                    break;
                                case 22:
                                    report.d22wh = tempwhto;
                                    break; 
                                case 23:
                                    report.d23wh = tempwhto;
                                    break;
                                    case 24:
                                        report.d24wh = tempwhto;
                                        break;
                                    case 25:
                                        report.d25wh = tempwhto;
                                        break;
                                    case 26:
                                        report.d26wh = tempwhto;
                                        break;
                                    case 27:
                                        report.d27wh = tempwhto;
                                        break;
                                    case 28:
                                        report.d28wh = tempwhto;
                                        break;
                                    case 29:
                                        report.d29wh = tempwhto;
                                        break;
                                    case 30:
                                        report.d30wh = tempwhto;
                                        break;          
                                        case 31:
                                            report.d31wh = tempwhto;
                                            break;                     
                    
            }
        }else if(timesheet[i].todaystatus === 'Unpaid Leave'){
            switch (date){
                case 1:
                    report.d1wh = 'L';
                    break;
                case 2:
                    report.d2wh = 'L';
                    break; 
                case 3:
                    report.d3wh = 'L';
                    break;
                    case 4:
                        report.d4wh ='L';
                        break;
                    case 5:
                        report.d5wh = 'L';
                        break;
                    case 6:
                        report.d6wh = 'L';
                        break;
                    case 7:
                        report.d7wh = 'L';
                        break;
                    case 8:
                        report.d8wh = 'L';
                        break;
                    case 9:
                        report.d9wh = 'L';
                        break;
                    case 10:
                        report.d10wh = 'L';
                        break;      
                        case 11:
                            report.d11wh = 'L';
                            break;
                        case 12:
                            report.d12wh = 'L';
                            break; 
                        case 13:
                            report.d13wh = 'L';
                            break;
                            case 14:
                                report.d14wh = 'L';
                                break;
                            case 15:
                                report.d15wh = 'L';
                                break;
                            case 16:
                                report.d16wh = 'L';
                                break;
                            case 17:
                                report.d17wh = 'L';
                                break;
                            case 18:
                                report.d18wh = 'L';
                                break;
                            case 19:
                                report.d19wh = 'L';
                                break;
                            case 20:
                                report.d20wh = 'L';
                                break; 
                                case 21:
                                    report.d21wh = 'L';
                                    break;
                                case 22:
                                    report.d22wh = 'L';
                                    break; 
                                case 23:
                                    report.d23wh ='L';
                                    break;
                                    case 24:
                                        report.d24wh = 'L';
                                        break;
                                    case 25:
                                        report.d25wh = 'L';
                                        break;
                                    case 26:
                                        report.d26wh = 'L';
                                        break;
                                    case 27:
                                        report.d27wh = 'L';
                                        break;
                                    case 28:
                                        report.d28wh = 'L';
                                        break;
                                    case 29:
                                        report.d29wh = 'L';
                                        break;
                                    case 30:
                                        report.d30wh = 'L';
                                        break;          
                                        case 31:
                                            report.d31wh = 'L';
                                            break;                     
                    
            }
    
        }else if(timesheet[i].todaystatus === 'On Vacation'){
            switch (date){
                case 1:
                    report.d1wh = 'V';
                    break;
                case 2:
                    report.d2wh =  'V';
                    break; 
                case 3:
                    report.d3wh =  'V';
                    break;
                    case 4:
                        report.d4wh = 'V';
                        break;
                    case 5:
                        report.d5wh = 'V';
                        break;
                    case 6:
                        report.d6wh =  'V';
                        break;
                    case 7:
                        report.d7wh =  'V';
                        break;
                    case 8:
                        report.d8wh = "V";
                        break;
                    case 9:
                        report.d9wh = "V";
                        break;
                    case 10:
                        report.d10wh =  'V';
                        break;      
                        case 11:
                            report.d11wh = 'V';
                            break;
                        case 12:
                            report.d12wh =  'V';
                            break; 
                        case 13:
                            report.d13wh =  'V';
                            break;
                            case 14:
                                report.d14wh =  'V';
                                break;
                            case 15:
                                report.d15wh = 'V';
                                break;
                            case 16:
                                report.d16wh =  'V';
                                break;
                            case 17:
                                report.d17wh =  'V';
                                break;
                            case 18:
                                report.d18wh = 'V';
                                break;
                            case 19:
                                report.d19wh =  'V';
                                break;
                            case 20:
                                report.d20wh =  'V';
                                break; 
                                case 21:
                                    report.d21wh = 'V';
                                    break;
                                case 22:
                                    report.d22wh =  'V';
                                    break; 
                                case 23:
                                    report.d23wh = 'V';
                                    break;
                                    case 24:
                                        report.d24wh = 'V';
                                        break;
                                    case 25:
                                        report.d25wh = 'V';
                                        break;
                                    case 26:
                                        report.d26wh =  'V';
                                        break;
                                    case 27:
                                        report.d27wh =  'V';
                                        break;
                                    case 28:
                                        report.d28wh =  'V';
                                        break;
                                    case 29:
                                        report.d29wh =  'V';
                                        break;
                                    case 30:
                                        report.d30wh =  'V';
                                        break;          
                                        case 31:
                                            report.d31wh = 'V';
                                            break;                     
                    
            }
        }


    }
    report.totalhours = totalhours
    report.workdays = workday
    report.totalsalary =totalsalary
   
    resolve(report)
})
},

salaryreportoperations: (timesheet)=>{
    return new Promise((resolve, reject) => {
var workday = 0
let leave = 0
let paidL = 0
let othours = 0
let report = {}
let otsalary = 0
let basicsalary =0
let allowance = 0
let bonus = 0
let monlen = 0
let dd

for(i=0;i<timesheet.length;i++){
  dd = new Date(timesheet[i].datevalue);
    let day = dd.getDay();
    let date = dd.getDate();
    if(day === 5){
        monlen++
    }
    if(timesheet[i].todaystatus === 'Working'){
        workday++;
      
        switch (date){
            case 1:
                report.d1wh = 'W';
                break;
            case 2:
                report.d2wh = 'W';
                break; 
            case 3:
                report.d3wh = 'W';
                break;
                case 4:
                    report.d4wh = 'W';
                    break;
                case 5:
                    report.d5wh = 'W';
                    break;
                case 6:
                    report.d6wh = 'W';
                    break;
                case 7:
                    report.d7wh = 'W';
                    break;
                case 8:
                    report.d8wh = 'W';
                    break;
                case 9:
                    report.d9wh = 'W';
                    break;
                case 10:
                    report.d10wh = 'W';
                    break;      
                    case 11:
                        report.d11wh = 'W';
                        break;
                    case 12:
                        report.d12wh = 'W';
                        break; 
                    case 13:
                        report.d13wh = 'W';
                        break;
                        case 14:
                            report.d14wh = 'W';
                            break;
                        case 15:
                            report.d15wh = 'W';
                            break;
                        case 16:
                            report.d16wh = 'W';
                            break;
                        case 17:
                            report.d17wh = 'W';
                            break;
                        case 18:
                            report.d18wh = 'W';
                            break;
                        case 19:
                            report.d19wh = 'W';
                            break;
                        case 20:
                            report.d20wh = 'W';
                            break; 
                            case 21:
                                report.d21wh = 'W';
                                break;
                            case 22:
                                report.d22wh = 'W';
                                break; 
                            case 23:
                                report.d23wh = 'W';
                                break;
                                case 24:
                                    report.d24wh = 'W';
                                    break;
                                case 25:
                                    report.d25wh = 'W';
                                    break;
                                case 26:
                                    report.d26wh = 'W';
                                    break;
                                case 27:
                                    report.d27wh = 'W';
                                    break;
                                case 28:
                                    report.d28wh = 'W';
                                    break;
                                case 29:
                                    report.d29wh ='W';
                                    break;
                                case 30:
                                    report.d30wh = 'W';
                                    break;          
                                    case 31:
                                        report.d31wh = 'W';
                                        break;                     
                
        }
    }else if(timesheet[i].todaystatus === 'Paid Leave'){
        paidL++;
       
                if(day === 5){
                    switch (date){
                        case 1:
                            report.d1wh = 'F';
                            break;
                        case 2:
                            report.d2wh = 'F';
                            break; 
                        case 3:
                            report.d3wh = 'F';
                            break;
                            case 4:
                                report.d4wh ='F';
                                break;
                            case 5:
                                report.d5wh = 'F';
                                break;
                            case 6:
                                report.d6wh = 'F';
                                break;
                            case 7:
                                report.d7wh = 'F';
                                break;
                            case 8:
                                report.d8wh = 'F';
                                break;
                            case 9:
                                report.d9wh = 'F';
                                break;
                            case 10:
                                report.d10wh = 'F';
                                break;      
                                case 11:
                                    report.d11wh = 'F';
                                    break;
                                case 12:
                                    report.d12wh = 'F';
                                    break; 
                                case 13:
                                    report.d13wh = 'F';
                                    break;
                                    case 14:
                                        report.d14wh = 'F';
                                        break;
                                    case 15:
                                        report.d15wh = 'F';
                                        break;
                                    case 16:
                                        report.d16wh = 'F'
                                        break;
                                    case 17:
                                        report.d17wh = 'F';
                                        break;
                                    case 18:
                                        report.d18wh = 'F';
                                        break;
                                    case 19:
                                        report.d19wh = 'F';
                                        break;
                                    case 20:
                                        report.d20wh = 'F';
                                        break; 
                                        case 21:
                                            report.d21wh = 'F';
                                            break;
                                        case 22:
                                            report.d22wh = 'F';
                                            break; 
                                        case 23:
                                            report.d23wh ='F';
                                            break;
                                            case 24:
                                                report.d24wh = 'F';
                                                break;
                                            case 25:
                                                report.d25wh = 'F';
                                                break;
                                            case 26:
                                                report.d26wh = 'F';
                                                break;
                                            case 27:
                                                report.d27wh = 'F';
                                                break;
                                            case 28:
                                                report.d28wh = 'F';
                                                break;
                                            case 29:
                                                report.d29wh = 'F';
                                                break;
                                            case 30:
                                                report.d30wh = 'F';
                                                break;    
                                                case 31:
                                                report.d31wh = 'F';
                                                break;                             
                                                     
                            
                    }
    

                }else{
                
                switch (date){
                    case 1:
                        report.d1wh = 'P';
                        break;
                    case 2:
                        report.d2wh = 'P';
                        break; 
                    case 3:
                        report.d3wh = 'P';
                        break;
                        case 4:
                            report.d4wh ='P';
                            break;
                        case 5:
                            report.d5wh = 'P';
                            break;
                        case 6:
                            report.d6wh = 'P';
                            break;
                        case 7:
                            report.d7wh = 'P';
                            break;
                        case 8:
                            report.d8wh = 'P';
                            break;
                        case 9:
                            report.d9wh = 'P';
                            break;
                        case 10:
                            report.d10wh = 'P';
                            break;      
                            case 11:
                                report.d11wh = 'P';
                                break;
                            case 12:
                                report.d12wh = 'P';
                                break; 
                            case 13:
                                report.d13wh = 'P';
                                break;
                                case 14:
                                    report.d14wh = 'P';
                                    break;
                                case 15:
                                    report.d15wh = 'P';
                                    break;
                                case 16:
                                    report.d16wh = 'P'
                                    break;
                                case 17:
                                    report.d17wh = 'P';
                                    break;
                                case 18:
                                    report.d18wh = 'P';
                                    break;
                                case 19:
                                    report.d19wh = 'P';
                                    break;
                                case 20:
                                    report.d20wh = 'P';
                                    break; 
                                    case 21:
                                        report.d21wh = 'P';
                                        break;
                                    case 22:
                                        report.d22wh = 'P';
                                        break; 
                                    case 23:
                                        report.d23wh ='P';
                                        break;
                                        case 24:
                                            report.d24wh = 'P';
                                            break;
                                        case 25:
                                            report.d25wh = 'P';
                                            break;
                                        case 26:
                                            report.d26wh = 'P';
                                            break;
                                        case 27:
                                            report.d27wh = 'P';
                                            break;
                                        case 28:
                                            report.d28wh = 'P';
                                            break;
                                        case 29:
                                            report.d29wh = 'P';
                                            break;
                                        case 30:
                                            report.d30wh = 'P';
                                            break;          
                                            case 31:
                                            report.d31wh = 'P';
                                            break;  
                                                              
                        
                }
            
            }
  }else if(timesheet[i].todaystatus === 'Unpaid Leave'){
    leave++
        switch (date){
            case 1:
                report.d1wh = 'L';
                break;
            case 2:
                report.d2wh = 'L';
                break; 
            case 3:
                report.d3wh = 'L';
                break;
                case 4:
                    report.d4wh ='L';
                    break;
                case 5:
                    report.d5wh = 'L';
                    break;
                case 6:
                    report.d6wh = 'L';
                    break;
                case 7:
                    report.d7wh = 'L';
                    break;
                case 8:
                    report.d8wh = 'L';
                    break;
                case 9:
                    report.d9wh = 'L';
                    break;
                case 10:
                    report.d10wh = 'L';
                    break;      
                    case 11:
                        report.d11wh = 'L';
                        break;
                    case 12:
                        report.d12wh = 'L';
                        break; 
                    case 13:
                        report.d13wh = 'L';
                        break;
                        case 14:
                            report.d14wh = 'L';
                            break;
                        case 15:
                            report.d15wh = 'L';
                            break;
                        case 16:
                            report.d16wh = 'L';
                            break;
                        case 17:
                            report.d17wh = 'L';
                            break;
                        case 18:
                            report.d18wh = 'L';
                            break;
                        case 19:
                            report.d19wh = 'L';
                            break;
                        case 20:
                            report.d20wh = 'L';
                            break; 
                            case 21:
                                report.d21wh = 'L';
                                break;
                            case 22:
                                report.d22wh = 'L';
                                break; 
                            case 23:
                                report.d23wh ='L';
                                break;
                                case 24:
                                    report.d24wh = 'L';
                                    break;
                                case 25:
                                    report.d25wh = 'L';
                                    break;
                                case 26:
                                    report.d26wh = 'L';
                                    break;
                                case 27:
                                    report.d27wh = 'L';
                                    break;
                                case 28:
                                    report.d28wh = 'L';
                                    break;
                                case 29:
                                    report.d29wh = 'L';
                                    break;
                                case 30:
                                    report.d30wh = 'L';
                                    break;          
                                    case 31:
                                        report.d31wh = 'L';
                                        break;                     
                
        }

    }else if(timesheet[i].todaystatus === 'On Vacation'){
        leave++
        switch (date){
            case 1:
                report.d1wh = 'V';
                break;
            case 2:
                report.d2wh =  'V';
                break; 
            case 3:
                report.d3wh =  'V';
                break;
                case 4:
                    report.d4wh = 'V';
                    break;
                case 5:
                    report.d5wh = 'V';
                    break;
                case 6:
                    report.d6wh =  'V';
                    break;
                case 7:
                    report.d7wh =  'V';
                    break;
                case 8:
                    report.d8wh = "V";
                    break;
                case 9:
                    report.d9wh = "V";
                    break;
                case 10:
                    report.d10wh =  'V';
                    break;      
                    case 11:
                        report.d11wh = 'V';
                        break;
                    case 12:
                        report.d12wh =  'V';
                        break; 
                    case 13:
                        report.d13wh =  'V';
                        break;
                        case 14:
                            report.d14wh =  'V';
                            break;
                        case 15:
                            report.d15wh = 'V';
                            break;
                        case 16:
                            report.d16wh =  'V';
                            break;
                        case 17:
                            report.d17wh =  'V';
                            break;
                        case 18:
                            report.d18wh = 'V';
                            break;
                        case 19:
                            report.d19wh =  'V';
                            break;
                        case 20:
                            report.d20wh =  'V';
                            break; 
                            case 21:
                                report.d21wh = 'V';
                                break;
                            case 22:
                                report.d22wh =  'V';
                                break; 
                            case 23:
                                report.d23wh = 'V';
                                break;
                                case 24:
                                    report.d24wh = 'V';
                                    break;
                                case 25:
                                    report.d25wh = 'V';
                                    break;
                                case 26:
                                    report.d26wh =  'V';
                                    break;
                                case 27:
                                    report.d27wh =  'V';
                                    break;
                                case 28:
                                    report.d28wh =  'V';
                                    break;
                                case 29:
                                    report.d29wh =  'V';
                                    break;
                                case 30:
                                    report.d30wh =  'V';
                                    break;          
                                    case 31:
                                        report.d31wh = 'V';
                                        break;                     
                
        }
    }
}
let month = getDaysInMonth(dd);
let tempwd = 0;

// Handle special February cases:
if (month === 29 && workday+paidL === 29) {
  report.workdays = 29;
  tempwd = 30;
}
else if (month === 28 && workday+paidL === 28) {
  report.workdays = 28;
  tempwd = 30;
}
else {
  // For months >= 30, default to workday
  tempwd = workday+paidL;

  // If it's a 31-day month:
  if (month === 31) {
    // If the employee's workday is literally 31, force final = 30
    if (workday+paidL === 31) {
      tempwd = 30;
    }else{
        if(leave > paidL || leave + paidL + workday !== 31) {
            tempwd= workday+paidL
        }else if (paidL > 0){
            paidL=paidL-1
            tempwd=workday+paidL
        }
    } 
    // otherwise, keep tempwd = workday
  }

  report.workdays = tempwd;
}


basicsalary = tempwd*timesheet[0].sbasic/30
allowance = tempwd*timesheet[0].sallowance/30
bonus = tempwd*timesheet[0].sbonus/30
report.basic = Math.round(basicsalary)
report.allowance =  Math.round(allowance)
report.bonus = Math.round(bonus)
report.otsalary =  Math.round(otsalary)

report.othours = othours
report.totalsalary =  Math.round(basicsalary+allowance+bonus+otsalary)
resolve(report)
})

},

salaryreportlabourWPS: (searchdate,EmployeeID)=>{
    return new Promise(async (resolve, reject) => {
 var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate,EmployeeID);  
 
let workday =0;
let leave = 0
let paidL = 0
let othours =0;
let report = {}
let otsalary = 0
let basicsalary =0
let allowance = 0
let bonus = 0
let dd

  

for(i=0;i<timesheet.length;i++){
    
    dd = new Date(timesheet[i].datevalue);
    let date = dd.getDate();
    let day = dd.getDay();
    if(timesheet[i].todaystatus === 'Working'){
        workday++;
        let tempot = 0;
        let tempwhto = 0;
        let tempotsal = 0 ;
        
        if(timesheet[i].workinghour === 0){
            
            tempwhto =
            Number(timesheet[i].workhour1) +
            Number(timesheet[i].workhour2) +
            Number(timesheet[i].workhour3) +
            Number(timesheet[i].workhour4) +
            Number(timesheet[i].workhour5);
            tempotsal = tempwhto*timesheet[i].sbasic/240;          
            othours = othours+tempwhto
            otsalary = otsalary+tempotsal         
        }else {
            tempwhto =
            Number(timesheet[i].workhour1) +
            Number(timesheet[i].workhour2) +
            Number(timesheet[i].workhour3) +
            Number(timesheet[i].workhour4) +
            Number(timesheet[i].workhour5);

            if(tempwhto > timesheet[i].workinghour){
                tempot = tempwhto-timesheet[i].workinghour;
                othours = othours+tempot
                tempotsal = tempot*timesheet[i].sbasic/240;         
                otsalary = otsalary+tempotsal
                tempwhto = tempwhto-timesheet[i].workinghour;
            }else{
               
                tempwhto = tempwhto-tempwhto
            }
        }
       
    }
    else if(timesheet[i].todaystatus === 'Paid Leave'){
        paidL++;
             
  }else if(timesheet[i].todaystatus === 'Unpaid Leave'){
    leave++
     

    }else if(timesheet[i].todaystatus === 'On Vacation'){
       leave++
      
    }
    
}
let month = getDaysInMonth(dd);
let tempwd = 0;

// Handle special February cases:
if (month === 29 && workday === 29) {
  report.workdays = 29;
  tempwd = 30;
}
else if (month === 28 && workday === 28) {
  report.workdays = 28;
  tempwd = 30;
}
else {
  // For months >= 30, default to workday
  tempwd = workday;

  // If it's a 31-day month:
  if (month === 31) {
    // If the employee's workday is literally 31, force final = 30
    if (month === 31) {
        // If the employee's workday is literally 31, force final = 30
        if (workday+paidL === 31) {
          tempwd = 30;
        }else{
            if(leave > paidL || leave + paidL + workday !== 31) {
                tempwd= workday+paidL
            }else if (paidL > 0){
                paidL=paidL-1
                tempwd=workday+paidL
            }
        } 
        // otherwise, keep tempwd = workday
      }
    // otherwise, keep tempwd = workday
  }

  report.workdays = tempwd;
}


// finalWorkdays now matches your scenario-based requirements

basicsalary = tempwd*timesheet[0].sbasic/30
allowance = tempwd*timesheet[0].sallowance/30
bonus = tempwd*timesheet[0].sbonus/30
report.basicsalary = Math.round(timesheet[0].sbasic)
report.extraincome =  Math.round(otsalary+allowance+bonus)
report.othours = othours
report.totalsalary =  Math.round(basicsalary+allowance+bonus+otsalary)
report.deduction = Math.round(timesheet[0].sbasic-basicsalary+timesheet[0].sallowance-allowance+timesheet[0].sbonus-bonus)
if(leave === month){
    report.paymentType= 'VACATION' 
}else{
    report.paymentType= 'Monthly Salary and allowance' 
}
if(report.deduction>0){
    report.deductionRC = '4'
}else{
    report.deductionRC = '0'
}
resolve(report)
})
if(report.deduction>0){
    report.deductionRC = '0'
}

},

salaryreportOperationsWPS: (searchdate,EmployeeID)=>{
    return new Promise(async (resolve, reject) => {
 var timesheet = await userHelpers.getDatabByMonthAndEmployee(searchdate,EmployeeID);  
let workday =0;
let leave = 0
let paidL = 0
let othours =0;
let report = {}
let otsalary = 0
let basicsalary =0
let allowance = 0
let bonus = 0
let dd

  

for(i=0;i<timesheet.length;i++){
    
    dd = new Date(timesheet[i].datevalue);
    let date = dd.getDate();
    let day = dd.getDay();
    if(timesheet[i].todaystatus === 'Working'){
        workday++;
 
       
    }
    else if(timesheet[i].todaystatus === 'Paid Leave'){
        paidL++;
             
  }else if(timesheet[i].todaystatus === 'Unpaid Leave'){
    leave++
     

    }else if(timesheet[i].todaystatus === 'On Vacation'){
       leave++
      
    }
    
}
let month = getDaysInMonth(dd);
let tempwd = 0;

// Handle special February cases:
if (month === 29 && workday === 29) {
  report.workdays = 29;
  tempwd = 30;
}
else if (month === 28 && workday === 28) {
  report.workdays = 28;
  tempwd = 30;
}
else {
  // For months >= 30, default to workday
  tempwd = workday;

  // If it's a 31-day month:
  if (month === 31) {
    // If the employee's workday is literally 31, force final = 30
    if (month === 31) {
        // If the employee's workday is literally 31, force final = 30
        if (workday+paidL === 31) {
          tempwd = 30;
        }else{
            if(leave > paidL || leave + paidL + workday !== 31) {
                tempwd= workday+paidL
            }else if (paidL > 0){
                paidL=paidL-1
                tempwd=workday+paidL
            }
        } 
        // otherwise, keep tempwd = workday
      }
    // otherwise, keep tempwd = workday
  }

  report.workdays = tempwd;
}


// finalWorkdays now matches your scenario-based requirements

basicsalary = tempwd*timesheet[0].sbasic/30
allowance = tempwd*timesheet[0].sallowance/30
bonus = tempwd*timesheet[0].sbonus/30
report.basicsalary = Math.round(timesheet[0].sbasic)
report.extraincome =  Math.round(otsalary+allowance+bonus)
report.othours = othours
report.totalsalary =  Math.round(basicsalary+allowance+bonus+otsalary)
report.deduction = Math.round(timesheet[0].sbasic-basicsalary+timesheet[0].sallowance-allowance+timesheet[0].sbonus-bonus)
if(leave === month){
    report.paymentType= 'VACATION' 
}else{
    report.paymentType= 'Monthly Salary and allowance' 
}
if(report.deduction > 0){
    report.deductionRC = 4
}else
{
    report.deductionRC = 0
}
resolve(report)
})

},




}


