var keyMirror = require('keymirror');

var ViewsByRole = {
    developer: [
        { id: 0, name: 'Offered', icon: 'img/new-waiting-24px.svg'},
        { id: 1, name: 'In Progress', icon: 'img/in-progress-24px.svg'},
        { id: 2, name: 'Completed', icon: 'img/completed-24px.svg'},
    ],
    manager: [    
        { id: 0, role: 'manager', name: 'New/Waiting', icon: 'img/new-waiting-24px.svg'},
        { id: 1, role: 'manager', name: 'In Progress', icon: 'img/in-progress-24px.svg'},
        { id: 2, role: 'manager', name: 'Completed', icon: 'img/completed-24px.svg'},
    ],
}

module.exports = { ViewsByRole: ViewsByRole }