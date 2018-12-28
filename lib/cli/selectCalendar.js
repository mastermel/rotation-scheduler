async function selectCalendar(api, rl) {
  return new Promise((resolve) => {
    api.calendarList.list(
      {
        minAccessRole: "writer",
      },
      (err, res) => {
        if (err) {
          console.log(`The API returned an error: ${err}`);
          resolve(null);
        }

        const calendars = res.data.items;
        if (calendars.length) {
          for (let i = 0; i < calendars.length; i++) {
            console.log(`[${i}] ${calendars[i].summary}`);
          }

          rl.question(
            `Which calendar do you want to use (0..${calendars.length - 1}): `,
            number => {
              if (calendars[number]) {
                resolve(calendars[number].id);
              }
            }
          );
        } else {
          console.log("Could not find any calendars you have write access to.");
          resolve(null);
        }
      }
    );
  });
}

module.exports = selectCalendar;
