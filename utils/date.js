import Months from '../constants/Months';

export function humanReadableDate(isoDate, time=false) {
    let date = new Date(isoDate);
    let month = Months[date.getMonth()];
    let day = date.getDate();
    let hours = date.getHours() % 12 || 12;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let ampm = date.getHours() < 12 ? 'AM' : 'PM';
    if (day == new Date().getDate() && time) {
        return hours + ':' + minutes + ampm;
    } else {
        return month + ' ' + day + (time ? ' at ' + hours + ':' + minutes + ampm : '');
    }
};

export function compareCommentsByDateAscending(commentA, commentB) {
    return new Date(commentA.created) - new Date(commentB.created);
};
