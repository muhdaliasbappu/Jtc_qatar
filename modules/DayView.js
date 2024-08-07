var salarycalc = require('../modules/salarycalc')
const moment = require('moment-timezone');
module.exports = {
    dayview: (date1) => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dateObj = new Date(date1);
      const dayIndex = dateObj.getDay();
      const formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()} ${daysOfWeek[dayIndex]}`;
      return formattedDate;
    },
     getCurrentDate: ()=> {
      const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
      ];
    
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = months[currentDate.getMonth()];
      const year = currentDate.getFullYear();
    
      const formattedDate = `${month} ${day}, ${year}`;
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
  let employeereport =  await salarycalc.salarycalculate(date , 'Own Staff (Operations)')
  let employeereport2 = await salarycalc.salarycalculate(date , 'Hired Staff (Operations)')
total = employeereport.sum+employeereport2.sum
return total;
},
countFridaysInMonth: (date) => {
  const dateParts = date.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);

  // Validate input
  if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
      throw new Error('Invalid input. Please provide a valid month (1-12) and year.');
  }

  // Get the number of days in the month
  const lastDay = new Date(year, month, 0).getDate();

  let fridayCount = 0;

  // Loop through each day in the month
  for (let day = 1; day <= lastDay; day++) {
      const currentDate = new Date(year, month - 1, day);
      // Check if the day is a Friday (day 5 in JavaScript's Date object)
      if (currentDate.getDay() === 5) {
          fridayCount++;
      }
  }
 let has31Days = null
  // Check if the month has 31 days
  if(lastDay === 31){
     has31Days = true
  }else{
     has31Days = false
  }
  

  return {
      fridayCount,
      has31Days
  };
},
countFridaysInMonthdtd: (date)=> {
  const parsedDate = new Date(date);
  const year = parsedDate.getUTCFullYear();
  const month = parsedDate.getUTCMonth() + 1; // getUTCMonth() is zero-based

  // Validate input
  if (isNaN(month) || month < 1 || month > 12 || isNaN(year)) {
      throw new Error('Invalid input. Please provide a valid month (1-12) and year.');
  }

  // Get the number of days in the month
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  let fridayCount = 0;

  // Loop through each day in the month
  for (let day = 1; day <= lastDay; day++) {
      const currentDate = new Date(Date.UTC(year, month - 1, day));
      // Check if the day is a Friday (day 5 in JavaScript's Date object)
      if (currentDate.getUTCDay() === 5) {
          fridayCount++;
      }
  }

  const has31Days = lastDay === 31;

  return {
      fridayCount,
      has31Days
  };
},

 getDateRanges: (startDate, endDate) =>{
  const start = moment.tz(startDate, 'UTC');
    const end = moment.tz(endDate, 'UTC');

    if (start.isAfter(end)) {
        throw new Error('Start date must be before end date');
    }

    const result = [];
    let current = start.clone();

    // If the start and end dates are in the same month, handle them separately
    if (start.isSame(end, 'month')) {
        result.push({
            startDate: current.startOf('day').toDate(),
            endDate: end.endOf('day').toDate()
        });
        return result;
    }

    // Add the first range
    const firstEndDate = current.clone().endOf('month');
    result.push({
        startDate: current.startOf('day').toDate(),
        endDate: firstEndDate.endOf('day').toDate()
    });

    // Add full month ranges
    current = firstEndDate.add(1, 'day').startOf('month');
    while (current.isBefore(end, 'month')) {
        const monthEndDate = current.clone().endOf('month');
        result.push({
            startDate: current.startOf('day').toDate(),
            endDate: monthEndDate.endOf('day').toDate()
        });
        current.add(1, 'month').startOf('month');
    }

    // Add the last range
    result.push({
        startDate: current.startOf('day').toDate(),
        endDate: end.endOf('day').toDate()
    });

    return result;
}







  };
