module.exports = {

  projectreportlabour: (timesheet,reqproject)=>{
    let total= 0
    let ot = 0 
    for(let i=0; i<timesheet.length; i++){
        if(timesheet[i].workinghour === 0){
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
report.employee
report.totalsalary = total
report.otsalary = ot
return report;

  }



}
