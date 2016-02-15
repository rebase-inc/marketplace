import Months from '../constants/Months';

export function humanReadableDate(isoDate, time=false, abbrev=false) {
    let date = new Date(isoDate);
    let month = Months[date.getMonth()];
    if (abbrev) { month = month.substr(0,3); }
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

export function timeRemaining(isoDate) {
    let expires = new Date(isoDate);
    let minutesRemaining = Math.max(0, (expires - new Date()) / (1000*60));
    let wholeDaysRemaining = Math.floor(minutesRemaining / (60*24));
    let wholeHoursRemaining = Math.floor((minutesRemaining % (60*24)) / 60);
    let wholeMinutesRemaining = Math.floor(minutesRemaining % 60);
    return [wholeDaysRemaining, wholeHoursRemaining, wholeMinutesRemaining];
}

export function humanReadableTimeRemaining(isoDate) {
    const [days, hours, minutes] = timeRemaining(isoDate);
    if (days > 1) {
        return days + ' days';
    } else if (hours > 1) {
        return (24 * days + hours) + ' hours';
    } else if (minutes > 1) {
        return (60 * hours + minutes) + ' minutes';
    } else {
        return 'expired';
    }
}

