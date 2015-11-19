import Months from '../constants/Months';

export default function humanReadableDate(isoDate) {
    let date = new Date(isoDate);
    return Months[date.getMonth()] + ' ' + date.getDate();
};
