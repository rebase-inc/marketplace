import Months from '../constants/Months';

export function humanReadableDate(isoDate) {
    let date = new Date(isoDate);
    return Months[date.getMonth()] + ' ' + date.getDate();
};
