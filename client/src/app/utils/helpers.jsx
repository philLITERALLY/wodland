import moment from 'moment';

const pluralise = (value, single, plural) => {
  let returnStr = '';
  switch (value) {
    case 0:
      break;
    case 1:
      returnStr = `${value} ${single}`;
      break;
    default:
      returnStr = `${value} ${plural}`;
      break;
  }
  return returnStr;
};

export const secondsToString = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 3600 % 60);

  const hoursString = pluralise(hours, 'hour ', 'hours ');
  const minsString = pluralise(mins, 'min ', 'mins ');
  const secsString = pluralise(secs, 'sec', 'secs');
  return hoursString + minsString + secsString;
};

export const weekYearToDateFormat = (week, year) => moment(`${year}`).week(week).startOf('isoweek').format('DD/MM/YYYY');
