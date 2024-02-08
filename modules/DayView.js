var salarycalc = require('../modules/salarycalc')
module.exports = {
    dayview: (date1) => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dateObj = new Date(date1);
      const dayIndex = dateObj.getDay();
      const formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()} ${daysOfWeek[dayIndex]}`;
      return formattedDate;
    },
 getMonthAndYear: (dateString)=> {

  const [year, month] = dateString.split("-");

  const monthNumber = parseInt(month, 10);

  // Validate that month is between 1 and 12
  
  if (monthNumber >= 1 && monthNumber <= 12) {
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const uppercaseMonth = monthNames[monthNumber - 1].toUpperCase();
    return `${uppercaseMonth} ${year}`;
  } else {
    
    return "Invalid date format";
  }
},
operationsum: async(date)=>{
  let total = 0
  let employeereport = await salarycalc.salarycalculate(date , 'Own Staff (Operations)')
  let employeereport2 = await salarycalc.salarycalculate(date , 'Hired Staff (Operations)')
for(let j = 0; j < employeereport.length; j++){
  total = total + employeereport[j].totalsalary
}
for(let i = 0; i < employeereport2.length; i++){
  total = total + employeereport2[i].totalsalary
}
return total;
},

  };
  
