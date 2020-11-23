import moment from 'moment';

const plural = (value, single, plural) => {
    let returnStr = '';
    switch(value) {
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
}

export const secondsToString = (seconds) => {    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
    const secs = Math.floor(seconds % 3600 % 60);
    
    const hoursString = plural(hours, 'hour ', 'hours ');
    const minsString = plural(mins, 'min ', 'mins ');
    const secsString = plural(secs, 'sec', 'secs');
    return hoursString + minsString + secsString;
}

export const weekYearToDateFormat = (week, year) => {
    return moment(`${year}`).week(week).startOf('isoweek').format('DD/MM/YYYY');
}