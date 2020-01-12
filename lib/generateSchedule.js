const moment = require('moment');
const createEvent = require('./gcal/createEvent');

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function generateSchedule(api, params) {
  return new Promise(async (resolve) => {
    let current = 0;
    const day = moment(params.start);
    const promises = [];
    const end = moment(params.end);
    const {
      assignees,
      assignment,
      intervalDays,
      onExisting,
      shouldSkipDate,
    } = params;

    while (day <= end) {
      if (shouldSkipDate && shouldSkipDate(day)) {
        day.add(intervalDays, 'days');
        continue;
      }

      const assignee = assignees[current]
      if (assignee) {
        promises.push(createEvent(api, {
          calendarId: params.calendarId,
          day,
          assignee,
          assignment,
          onExisting,
        }));
      }

      await snooze(1000);

      day.add(intervalDays, 'days');
      current = (current === assignees.length - 1) ? 0 : current + 1;
    }

    Promise.all(promises).then(resolve);
  });
}

module.exports = generateSchedule;
