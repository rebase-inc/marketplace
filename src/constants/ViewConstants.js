var keyMirror = require('keymirror');

var ticketTypes = keyMirror({ NEW: null, OFFERED: null, IN_PROGRESS: null, COMPLETED: null });

var ViewsByRole = {
    developer: [
        { id: 0, type: ticketTypes.OFFERED, name: 'Offered', icon: 'img/offered-24px.svg'},
        { id: 1, type: ticketTypes.IN_PROGRESS, name: 'In Progress', icon: 'img/in-progress-24px.svg'},
        { id: 2, type: ticketTypes.COMPLETED, name: 'Completed', icon: 'img/completed-24px.svg'},
    ],
    manager: [
        { id: 0, type: ticketTypes.NEW, role: 'manager', name: 'New', icon: 'img/new-24px.svg'},
        { id: 0, type: ticketTypes.OFFERED, role: 'manager', name: 'Waiting', icon: 'img/waiting-24px.svg'},
        { id: 1, type: ticketTypes.IN_PROGRESS, role: 'manager', name: 'In Progress', icon: 'img/in-progress-24px.svg'},
        { id: 2, type: ticketTypes.COMPLETED, role: 'manager', name: 'Completed', icon: 'img/completed-24px.svg'},
    ],
}


module.exports = {
    ViewsByRole: ViewsByRole,
    ticketTypes: ticketTypes,
}
