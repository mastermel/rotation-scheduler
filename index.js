const { google } = require("googleapis");

const {
  loadAccess,
  listEvents,
  getParams,
  generateSchedule,
  clearAllEvents,
  nthDayOfMonth,
} = require('./lib/index');

const PARENTS = 'Parents';
const MEL = 'Mel';
const JOHN = 'John';
const BACHELORS = 'Bachelors';

const onExistingNonMainItem = (existingName, { assignee, assignment }) => {
  // If this person is on the main dish this day
  if (existingName.includes('Main')) {
    // Assign the parents to this item
    return { assignment, assignee: PARENTS };
  }

  // Don't create an event
  return null;
}

const DEFAULT_PARAMS = {
  calendarId: '2u93jkvftsvcah95tu42fpr1os@group.calendar.google.com',
  start: '2018-12-30',
  end: '2019-12-29',
  intervalDays: 7,
  onExisting: () => {
    // Don't create another event
    return null; 
  },
  shouldSkipDate: (day) => {
    const thirdSunday = nthDayOfMonth(day, day.day(), 3);
    return day.date() === thirdSunday.date();
  },
};

const MAIN_PARAMS = {
  ...DEFAULT_PARAMS,
  assignment: "Main",
  assignees: [
    MEL,
    PARENTS,
    PARENTS,
    PARENTS,
    JOHN,
    PARENTS,
    PARENTS,
    PARENTS,
    BACHELORS,
    PARENTS,
    PARENTS,
    PARENTS,
  ],
};

const BREAD_PARAMS = {
  ...DEFAULT_PARAMS,
  assignment: "Bread",
  assignees: [
    MEL,
    JOHN,
    BACHELORS,
  ],
  onExisting: onExistingNonMainItem,
};

const VEGGIES_PARAMS = {
  ...DEFAULT_PARAMS,
  assignment: "Veggies",
  assignees: [
    JOHN,
    BACHELORS,
    MEL,
  ],
  onExisting: onExistingNonMainItem,
};

const DRINKS_PARAMS = {
  ...DEFAULT_PARAMS,
  assignment: "Drinks/Dessert",
  assignees: [
    BACHELORS,
    MEL,
    JOHN,
  ],
  onExisting: onExistingNonMainItem,
};

// Get access and go!
loadAccess(auth => {
  const api = google.calendar({ version: "v3", auth });

  getParams(api, DRINKS_PARAMS).then(params => {
    try {
      console.log(params)

      if (false) {
        console.log('Clearing all existing events')
        clearAllEvents(api, params);
        return;
      }

      generateSchedule(api, params).then(() => {
        listEvents(api, {
          maxResults: 40,
          calendarId: params.calendarId,
        }).then(events => {
          if (events.length) {
            console.log(`Showing ${events.length} upcoming events:`)
            events.map((event, i) => {
              const start = event.start.dateTime || event.start.date;
              console.log(`${start} - ${event.summary}`);
            });
          } else {
            console.log("No events found on this calendar.");
          }

          process.exit();
        });
      });
    } catch(e) {
      console.log(`Encountered error: ${e}`)
      process.exit(1);
    }
  });
});

