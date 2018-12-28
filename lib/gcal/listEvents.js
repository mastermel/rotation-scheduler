async function listEvents(api, args = {}) {
  return new Promise((resolve) => {
    const defaults = {
      calendarId: 'primary',
      maxResults: 10,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime"
    };
    api.events.list(
      {
        ...defaults,
        ...args,
      },
      (err, res) => {
        if (!err) {
          resolve(res.data.items);
        } else {
          console.log("The API returned an error: " + err);
        }

        resolve();
      }
    );
  });
}

module.exports = listEvents;
