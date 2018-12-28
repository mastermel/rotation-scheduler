const listEvents = require('./listEvents');

async function clearAllEvents(api, args = {}) {
  const events = await listEvents(api, {
    ...args,
    maxResults: 1000,
  });

  const promises = events.map((event) => {
    return new Promise((resolve) => {
      api.events.delete(
        {
          calendarId: args.calendarId,
          eventId: event.id,
        },
        (err, res) => {
          if (err) {
            console.log("The API returned an error: " + err);
          } else {
            console.log(`Deleted event '${event.id}'`);
          }
          resolve();
        }
      );
    });
  });

  return Promise.all(promises);
}

module.exports = clearAllEvents;
