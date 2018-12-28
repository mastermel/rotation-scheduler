const { loadAccess } = require('./gcal/authorize');
const getParams = require('./cli/getParams');
const listEvents = require('./gcal/listEvents');
const generateSchedule = require('./generateSchedule');
const clearAllEvents = require('./gcal/clearAllEvents');
const nthDayOfMonth = require('./nthDayOfMonth');


module.exports = {
  loadAccess,
  listEvents,
  getParams,
  generateSchedule,
  clearAllEvents,
  nthDayOfMonth,
};
