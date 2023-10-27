module.exports = {
    dayview: (date1) => {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dateObj = new Date(date1);
      const dayIndex = dateObj.getDay();
      const formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()} ${daysOfWeek[dayIndex]}`;
      return formattedDate;
    }
  };
  