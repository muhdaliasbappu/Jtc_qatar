var operationsum = require('../modules/DayView')
var salarycalc = require('../modules/salarycalc')
var DayView =  require('./DayView')
module.exports = {


  projectreportlabour: (timesheet,reqproject)=>{
    let total= 0
    let ot = 0 
    for(let i=0; i<timesheet.length; i++){
        if(timesheet[i].workinghour === '0'){
            let tempot = 0
            if(timesheet[i].projectname1 === reqproject){
                tempot = timesheet[i].workhour1 * timesheet[i].sbasic/240
            }else if(timesheet[i].projectname2 === reqproject){
                tempot = timesheet[i].workhour2 * timesheet[i].sbasic/240
            }else if(timesheet[i].projectname3 === reqproject){
                tempot = timesheet[i].workhour3 * timesheet[i].sbasic/240
            }else if(timesheet[i].projectname4 === reqproject){
                tempot = timesheet[i].workhour4 * timesheet[i].sbasic/240
            }else if(timesheet[i].projectname5 === reqproject){
                tempot = timesheet[i].workhour5 * timesheet[i].sbasic/240
            }
            total = total + tempot
            ot = ot + tempot
            
        }else{     
        let pcount=0
        if(timesheet[i].projectname1){
            pcount++
            if(timesheet[i].projectname2){
                pcount++
                if(timesheet[i].projectname3){
                    pcount++
                    if(timesheet[i].projectname4){
                        pcount++
                        if(timesheet[i].projectname5){
                            pcount++
                            
                        }
                    }
                }
            }
        }
        if(pcount === 1){
            let tempsal = 0
            let tempot = 0
            let tempothr = 0
            
            if(Number(timesheet[i].workhour1) > Number(timesheet[i].workinghour) ){
                tempothr = timesheet[i].workhour1 - timesheet[i].workinghour
                tempot = tempothr * timesheet[i].sbasic/240
                tempsal = timesheet[i].sbasic/30 + timesheet[i].sallowance/30 + timesheet[i].sbonus/30 + tempot               
            }else{
                tempsal = timesheet[i].sbasic/30 + timesheet[i].sallowance/30 + timesheet[i].sbonus/30               
            }       
            total = total + tempsal
            ot = ot + tempot        
        }else if(pcount === 2){
            let tempsal = 0
            let tempot = 0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)
            
            if(timesheet[i].projectname1 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30
                }else{                   
                    tempot = timesheet[i].workhour1/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240 
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30 + tempot                 
                }
            }else if(timesheet[i].projectname2 === reqproject){                
                if(workhourtotal <= Number(timesheet[i].workinghour)){                   
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour2/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
                }
            }
            total = total + tempsal
            ot = ot + tempot  
        }else if(pcount === 3){
            let tempsal = 0
            let tempot = 0
            let tempothr = 0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)
            if(timesheet[i].projectname1 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30
                }else{                   
                    tempot = timesheet[i].workhour1/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240 
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30 + tempot                 
                }
            }else if(timesheet[i].projectname2 === reqproject){                
                if(workhourtotal <= Number(timesheet[i].workinghour)){                   
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour2/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
                }
            }else if(timesheet[i].projectname3 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour3/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
               }
            }
            total = total + tempsal
            ot = ot + tempot  
        }else if(pcount === 4){
            let tempsal = 0
            let tempot = 0
            let tempothr = 0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)+Number(timesheet[i].workhour4)
            if(timesheet[i].projectname1 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30
                }else{                   
                    tempot = timesheet[i].workhour1/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240 
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30 + tempot                 
                }
            }else if(timesheet[i].projectname2 === reqproject){                
                if(workhourtotal <= Number(timesheet[i].workinghour)){                   
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour2/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
                }
            }else if(timesheet[i].projectname3 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour3/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
               }
            }else if(timesheet[i].projectname4 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour4/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour4/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour4/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
               }
            }
            total = total + tempsal
            ot = ot + tempot  
        }else if(pcount === 5){
            let tempsal = 0
            let tempot = 0
            let tempothr = 0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)+Number(timesheet[i].workhour4)+Number(timesheet[i].workhour5)
            if(timesheet[i].projectname1 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30
                }else{                   
                    tempot = timesheet[i].workhour1/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240 
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30 + tempot                 
                }
            }else if(timesheet[i].projectname2 === reqproject){                
                if(workhourtotal <= Number(timesheet[i].workinghour)){                   
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour2/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
                }
            }else if(timesheet[i].projectname3 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour3/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
               }
            }else if(timesheet[i].projectname4 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour4/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour4/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour4/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
               }
            }else if(timesheet[i].projectname5 === reqproject){
                if(workhourtotal <= Number(timesheet[i].workinghour)){
                    tempsal = timesheet[i].workhour5/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour5/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour5/workhourtotal*timesheet[i].sbonus/30
                }else{
                    tempot = timesheet[i].workhour5/workhourtotal*(workhourtotal-timesheet[i].workinghour)*timesheet[i].sbasic/240                       
                    tempsal = timesheet[i].workhour5/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour5/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour5/workhourtotal*timesheet[i].sbonus/30 + tempot                                               
               }
            }
            total = total + tempsal
            ot = ot + tempot  
      
        }
    }
}

let report = {}
report.totalsalary = Math.round(total)
report.otsalary = Math.round(ot)
return report;

  },

  projectreportstaff: (timesheet,reqproject)=>{
    let total= 0
    for(let i=0; i<timesheet.length; i++){
           
        let pcount=0
        if(timesheet[i].projectname1){
            pcount++
            if(timesheet[i].projectname2){
                pcount++
                if(timesheet[i].projectname3){
                    pcount++
                    if(timesheet[i].projectname4){
                        pcount++
                        if(timesheet[i].projectname5){
                            pcount++
                            
                        }
                    }
                }
            }
        }
        if(pcount === 1){
            
            let tempsal = 0                       
                tempsal = timesheet[i].sbasic/30 + timesheet[i].sallowance/30 + timesheet[i].sbonus/30                           
            total = total + tempsal
                  
        }else if(pcount === 2){
            let tempsal = 0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)           
            if(timesheet[i].projectname1 === reqproject){
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30

            }else if(timesheet[i].projectname2 === reqproject){                             
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30              
            }
            total = total + tempsal

        }else if(pcount === 3){
            let tempsal = 0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)
            if(timesheet[i].projectname1 === reqproject){
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30           
            }else if(timesheet[i].projectname2 === reqproject){                               
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30            
            }else if(timesheet[i].projectname3 === reqproject){
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30      
            }
            total = total + tempsal
        }else if(pcount === 4){
            let tempsal = 0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)+Number(timesheet[i].workhour4)
            if(timesheet[i].projectname1 === reqproject){
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30
            }else if(timesheet[i].projectname2 === reqproject){                                 
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30
            }else if(timesheet[i].projectname3 === reqproject){
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30
            }else if(timesheet[i].projectname4 === reqproject){
                    tempsal = timesheet[i].workhour4/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sbonus/30
            }
            total = total + tempsal
        }else if(pcount === 5){
            let tempsal = 0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)+Number(timesheet[i].workhour4)+Number(timesheet[i].workhour5)
            if(timesheet[i].projectname1 === reqproject){
                    tempsal = timesheet[i].workhour1/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour1/workhourtotal*timesheet[i].sbonus/30
            }else if(timesheet[i].projectname2 === reqproject){                                 
                    tempsal = timesheet[i].workhour2/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour2/workhourtotal*timesheet[i].sbonus/30
            }else if(timesheet[i].projectname3 === reqproject){
                    tempsal = timesheet[i].workhour3/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour3/workhourtotal*timesheet[i].sbonus/30
            }else if(timesheet[i].projectname4 === reqproject){
                    tempsal = timesheet[i].workhour4/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour4/workhourtotal*timesheet[i].sbonus/30
            }else if(timesheet[i].projectname5 === reqproject){
                    tempsal = timesheet[i].workhour5/workhourtotal*timesheet[i].sbasic/30 + timesheet[i].workhour5/workhourtotal*timesheet[i].sallowance/30 + timesheet[i].workhour5/workhourtotal*timesheet[i].sbonus/30
            }
            total = total + tempsal
     
        }
    
}
let report = {}
report.totalsalary = Math.round(total)
return report;

  },
  projectreporthourly: (timesheet,reqproject)=>{
    let total= 0
    for(let i=0; i<timesheet.length; i++){       
            let tempot = 0

            if(timesheet[i].projectname1 === reqproject){
                tempot = timesheet[i].workhour1 * timesheet[i].srateph
            }else if(timesheet[i].projectname2 === reqproject){
                tempot = timesheet[i].workhour2 * timesheet[i].srateph
            }else if(timesheet[i].projectname3 === reqproject){
                tempot = timesheet[i].workhour3 * timesheet[i].srateph
            }else if(timesheet[i].projectname4 === reqproject){
                tempot = timesheet[i].workhour4 * timesheet[i].srateph
            }else if(timesheet[i].projectname5 === reqproject){
                tempot = timesheet[i].workhour5 * timesheet[i].srateph
            }

            total = total + tempot
        }

        let report = {}
        report.totalsalary = Math.round(total)
    return report;
    },
    projectoperations: async (projectimesheets , date) => {
        let mdetails= DayView.countFridaysInMonth(date)
        let temptotalcosts = [];
        let totalsum = 0
        
        let paidleavecostoperations = await salarycalc.operationpaidleavecost(date, mdetails )
      let paidleavecost = await salarycalc.paidleavecost(date, mdetails , 'Own Labour' )
       paidleavecost += await salarycalc.paidleavecost(date, mdetails , 'Hired Labour (Monthly)' )
       paidleavecost += await salarycalc.paidleavecost(date, mdetails , 'Own Staff (Projects)' )
      paidleavecost += await salarycalc.paidleavecost(date, mdetails , 'Hired Staff (Projects)' )      
      paidleavecost += paidleavecostoperations
 let operationssum = await operationsum.operationsum(date) - paidleavecostoperations
    
        for (let i = 0; i < projectimesheets.length; i++) {
            let temptotalcost = 0;
            temptotalcost += projectimesheets[i].ownlaboursalary || 0;
            temptotalcost += projectimesheets[i].hiredlabourmsalary || 0;
            temptotalcost += projectimesheets[i].ownstaffsalary || 0;
            temptotalcost += projectimesheets[i].hiredstaffsalary || 0;
            temptotalcost += projectimesheets[i].hiredstaffhourly || 0;
            totalsum = totalsum + temptotalcost
        }
        for (let j = 0; j < projectimesheets.length; j++) {
            tempobj = {}
            let tempcost = 0
            let temppaid = 0
            let tempperc = 0 
            let temptotalcost = 0;
            temptotalcost += projectimesheets[j].ownlaboursalary || 0;
            temptotalcost += projectimesheets[j].hiredlabourmsalary || 0;
            temptotalcost += projectimesheets[j].ownstaffsalary || 0;
            temptotalcost += projectimesheets[j].hiredstaffsalary || 0;
            temptotalcost += projectimesheets[j].hiredstaffhourly || 0;
            tempcost = temptotalcost/totalsum*operationssum 
            temppaid = temptotalcost/totalsum*paidleavecost 
            tempperc = temptotalcost/totalsum*100
            tempobj.total = Math.round(temptotalcost + tempcost + temppaid ) 
            tempobj.percentage =  Math.round((tempperc + Number.EPSILON) * 100) / 100
            tempobj.overheadcost = Math.round(temppaid)
            tempobj.operationcost = Math.round(tempcost)          
            temptotalcosts.push(tempobj)
        }
        
        return temptotalcosts

    
        
    },
    sumemployeetype: (projectimesheets) => {
        let sumemployeetype = {};
        sumemployeetype.totalownlaboursalary = 0
        sumemployeetype.totalhiredlabourmsalary = 0
        sumemployeetype.totalhiredstaffhourly = 0
        sumemployeetype.totalownstaffsalary = 0
        sumemployeetype.totalhiredstaffsalary = 0
        sumemployeetype.totaloperationcost = 0
        sumemployeetype.totaloverheadcost = 0
    
        
        for (let i = 0; i < projectimesheets.length; i++) {
            
            if(projectimesheets[i].ownlaboursalary)
            sumemployeetype.totalownlaboursalary += Number(projectimesheets[i].ownlaboursalary);
            if(projectimesheets[i].hiredlabourmsalary)
            sumemployeetype.totalhiredlabourmsalary += Number(projectimesheets[i].hiredlabourmsalary);
            if(projectimesheets[i].ownstaffsalary)
            sumemployeetype.totalownstaffsalary += Number(projectimesheets[i].ownstaffsalary);
            if(projectimesheets[i].hiredstaffsalary)
            sumemployeetype.totalhiredstaffsalary += Number(projectimesheets[i].hiredstaffsalary);
            if(projectimesheets[i].hiredstaffhourly)
            sumemployeetype.totalhiredstaffhourly += Number(projectimesheets[i].hiredstaffhourly);
            if(projectimesheets[i].operationcost)
            sumemployeetype.totaloperationcost += Number(projectimesheets[i].operationcost);
            if(projectimesheets[i].overheadcost)
            sumemployeetype.totaloverheadcost += Number(projectimesheets[i].overheadcost);
     }
       
        sumemployeetype.total = 
        sumemployeetype.totalownlaboursalary +
        sumemployeetype.totalhiredlabourmsalary +
        sumemployeetype.totalhiredstaffhourly +
        sumemployeetype.totalownstaffsalary +
        sumemployeetype.totalhiredstaffsalary +  
        sumemployeetype.totaloperationcost +
        sumemployeetype.totaloverheadcost 
        return sumemployeetype
    
        
    }
    



}
