const readline = require("readline");

const selectCalendar = require('./selectCalendar');

async function getParams(api, baseParams) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const params = {
    ...baseParams,
  };

  if (!params.calendarId) {
    params.calendarId = await selectCalendar(api, rl);
  }

  // TODO: Ask the user for all the things we need

  rl.close();
  return params;
}

module.exports = getParams;
