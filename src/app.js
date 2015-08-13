var React = require('react');
var keyMirror = require('keymirror');

var MockData = require('./MockData');
var RebaseApp = require('./components/RebaseApp.react');
var TicketApi = require('./utils/TicketApi')

window.React = React; // export for http://fb.me/react-devtools

MockData.init();
TicketApi.getTicketData();

var _developerViews = [
    { name: 'Offered', icon: 'img/new-waiting-24px.svg'},
    { name: 'In Progress', icon: 'img/in-progress-24px.svg'},
    { name: 'Completed', icon: 'img/completed-24px.svg'},
]

var _managerViews = [
    { name: 'New/Waiting', icon: 'img/new-waiting-24px.svg'},
    { name: 'In Progress', icon: 'img/in-progress-24px.svg'},
    { name: 'Completed', icon: 'img/completed-24px.svg'},
]

var _views = {
    developer: _developerViews,
    manager: _managerViews
}

var _user = {
    name: 'Andrew Millspaugh',
    photo: 'img/andrew.png',
    roles: [
        { id: 4, type: 'developer' },
        { id: 8, type: 'manager', organization: 'rebase', project: 'api' }
    ],
}


React.render(<RebaseApp user={_user} views={_views} viewState={_viewState}/>, document.body);
