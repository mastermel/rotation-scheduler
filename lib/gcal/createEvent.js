const moment = require('moment');
const listEvents = require('./listEvents');

async function createEvent(api, args = {}) {
  const { calendarId, day, onExisting } = args;
  const date = day.format('YYYY-MM-DD');
  let { assignee, assignment } = args;

  // If there's a handler for existing assignment/assignee events then
  // check for events that contain either and use the callback to determine
  // what to create in response.
  if (onExisting) {
    let existing = null;
    let newEvent = { assignee, assignment };
    const existingDate = day.toISOString();
    do {
      existing = null;

      const existingEvents = await listEvents(api, {
        calendarId,
        timeMin: existingDate,
        timeMax: moment(existingDate).add(1, 'days').toISOString(),
      });

      if (existingEvents.length) {
        existing = existingEvents.find(e => {
          return e.summary.includes(newEvent.assignment) ||
            e.summary.includes(newEvent.assignee);
        });

        if (existing) {
          newEvent = onExisting(
            existing.summary,
            { assignee, assignment }
          );
        }
      }
    } while(existing && newEvent);

    // If the callback returned falsey, don't create an event
    if (!newEvent) return null;

    assignee = newEvent.assignee;
    assignment = newEvent.assignment;
  }

  return new Promise((resolve) => {
    api.events.insert(
      {
        calendarId,
        resource: {
          summary: `${assignment} - ${assignee}`,
          start: { date },
          end: { date },
        }
      },
      (err, res) => {
        if (!err) {
          console.log(`Created: ${date} - ${assignment} - ${assignee}`)
          resolve(res.data.item);
        } else {
          console.log("The API returned an error: " + err);
        }

        resolve();
      }
    );
  });
}

module.exports = createEvent;
