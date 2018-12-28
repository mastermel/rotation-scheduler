const moment = require('moment');

function nthDayOfMonth(startDate, dayOfWeek, weekNumber){
  // Start of the month of the given startDate
  var myMonth = moment(startDate).startOf('month');

  // dayOfWeek of the first week of the month
  var firstDayOfWeek = myMonth.clone().weekday(dayOfWeek);

  // Check if first firstDayOfWeek is in the given month
  if( firstDayOfWeek.month() != myMonth.month() ){
      weekNumber++;
  }

  // Return result
  return firstDayOfWeek.add(weekNumber-1, 'weeks');
}

module.exports = nthDayOfMonth;
