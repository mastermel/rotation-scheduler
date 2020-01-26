const { google } = require("googleapis");
const moment = require('moment');

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
  start: '2020-02-02',
  end: '2021-12-30',
  intervalDays: 7,
  onExisting: () => {
    // Don't create another event
    return null; 
  },
  shouldSkipDate: (day) => {
    const secondSunday = nthDayOfMonth(day, day.day(), 2),
      fourthSunday = nthDayOfMonth(day, day.day(), 4);

    return day.date() !== secondSunday.date() &&
      day.date() !== fourthSunday.date();
  },
};

const MAIN_PARAMS = {
  ...DEFAULT_PARAMS,
  assignment: "Main",
  assignees: [
    PARENTS,
    BACHELORS,
    PARENTS,
    MEL,
    PARENTS,
    JOHN,
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
        clearAllEvents(api,
          {
            ...params,
            timeMin: moment(params.start).toISOString(),
          }
        );
        return;
      }

      generateSchedule(api, params).then(() => {
        process.exit();
      });
    } catch(e) {
      console.log(`Encountered error: ${e}`)
      process.exit(1);
    }
  });
});

