import Months from '../constants/Months';

export function humanReadableDate(isoDate, time=true) {
    let date = new Date(isoDate);
    let month = Months[date.getMonth()];
    let day = date.getDate();
    let hours = date.getHours() % 12 || 12;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let ampm = date.getHours() < 12 ? 'AM' : 'PM';
    return month + ' ' + day + (time ? ' at ' + hours + ':' + minutes + ampm : '');
};
