module.exports = {

  projectreportlabour: (timesheet,reqproject)=>{
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
            let tempsal=0
            if( timesheet[i].workhour1 <= 8){
                tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/240
                tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
               
            }else{
                
                tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                tempsal=tempsal+(timesheet[i].workhour1-8)*timesheet[i].sbasic/240
                tempsal=tempsal+(timesheet[i].workhour1-8)*timesheet[i].sallowance/240
                tempsal=tempsal+(timesheet[i].workhour1-8)*timesheet[i].sbonus/240
               
            }       
            total=total+tempsal
        
        }else if(pcount === 2){
            let tempsal=0
            let tempoth=0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)
            if(timesheet[i].projectname1 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour1/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname2 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour2*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour2*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour2/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }
            total=total+tempsal
        }else if(pcount === 3){
            let tempsal=0
            let tempoth=0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)
            if(timesheet[i].projectname1 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour1/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname2 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour2*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour2*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour2/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname3 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour3*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour3*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour3/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }
            total=total+tempsal
        }else if(pcount === 4){
            let tempsal=0
            let tempoth=0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)+Number(timesheet[i].workhour4)
            if(timesheet[i].projectname1 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour1/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname2 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour2*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour2*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour2/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname3 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour3*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour3*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour3/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname4 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour4*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour4*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour4*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour4*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour4*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour4*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour4/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }
            total=total+tempsal
        }else if(pcount === 5){
            let tempsal=0
            let tempoth=0
            let workhourtotal = Number(timesheet[i].workhour1)+Number(timesheet[i].workhour2)+Number(timesheet[i].workhour3)+Number(timesheet[i].workhour4)+Number(timesheet[i].workhour5)
            if(timesheet[i].projectname1 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour1*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour1*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour1/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname2 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour2*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour2*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour2*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour2/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname3 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour3*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour3*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour3*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour3/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname4 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour4*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour4*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour4*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour4*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour4*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour4*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour4/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }else if(timesheet[i].projectname5 === reqproject){
                if(workhourtotal <= 8){
                    tempsal=timesheet[i].workhour5*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour5*timesheet[i].sallowance/24
                    tempsal=tempsal+timesheet[i].workhour5*timesheet[i].sbonus/240
                }else{
                    tempsal=timesheet[i].workhour5*timesheet[i].sbasic/240
                    tempsal=tempsal+timesheet[i].workhour5*timesheet[i].sallowance/240
                    tempsal=tempsal+timesheet[i].workhour5*timesheet[i].sbonus/240
                    tempoth=(timesheet[i].workhour5/8*(workhourtotal-8))
                    tempsal=tempsal+tempoth*timesheet[i].sbasic/240
                  
                }
            }
            total=total+tempsal
        }
    }
console.log(total)

  }



}