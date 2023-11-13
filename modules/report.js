

module.exports = {

allsalaryreport: (timesheet)=>{
    return new Promise((resolve, reject) => {
var workday = 0
let othours = 0
let report = {}
let otsalary = 0
let basicsalary =0
let allowance = 0
let bonus = 0
for(i=0;i<timesheet.length;i++){
    const dd = new Date(timesheet[i].datevalue);
    let day = dd.getDay();
    let date = dd.getDate();
    if(timesheet[i].todaystatus === 'Working'){
        workday++;
       
        let tempot = 0;
        let tempwhto = 0;
        let tempwh = 0;
        let tempotsal = 0 ;
        let tempbasic = 0 ; 
        let tempallow = 0;
        let tempbonus = 0;
        if(day === 5){
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

            if(tempwhto > 8){
                tempot = tempwhto-8;
                othours = othours+tempot
                tempotsal = tempot*timesheet[i].sbasic/240;
                tempbasic = 8*timesheet[i].sbasic/240;
                tempallow = 8*timesheet[i].sallowance/240;
                tempbonus = 8*timesheet[i].sbonus/240;
                basicsalary = basicsalary+tempbasic;
                allowance = allowance+tempallow;
                bonus = bonus+tempbonus;
                otsalary = otsalary+tempot
            }else{
                tempotsal = tempot*timesheet[i].sbasic/240;
                tempbasic = tempwhto*timesheet[i].sbasic/240;
                tempallow = tempwhto*timesheet[i].sallowance/240;
                tempbonus = tempwhto*timesheet[i].sbonus/240;
                basicsalary = basicsalary+tempbasic;
                allowance = allowance+tempallow;
                bonus = bonus+tempbonus;
                otsalary = otsalary+tempot
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
    }else if(timesheet[i].todaystatus === 'Paid Leave'){
                basicsalary = basicsalary+8*timesheet[i].sbasic/240;
                allowance = allowance+8*timesheet[i].sallowance/240;
                bonus = bonus+8*timesheet[i].sbonus/240;
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
    }else if(timesheet[i].todaystatus === 'UnPaid Leave'){
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

report.basic = basicsalary
report.allowance = allowance
report.bonus = bonus
report.otsalary = otsalary
report.workdays = workday
report.othours = othours
report.totalsalary = basicsalary+allowance+bonus+otsalary
resolve(report)
})

}


}
