
var RebaseApp = require('./components/RebaseApp.react');
var DemoData = require('./DemoData');
var React = require('react');
var keyMirror = require('keymirror');
window.React = React; // export for http://fb.me/react-devtools

DemoData.init();

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


var appState = {
    user: {
        name: 'Andrew Millspaugh',
        photo: 'img/andrew.png',
        roles: [
            { id: 4, type: 'developer' },
            { id: 8, type: 'manager', organization: 'rebase', project: 'api' }
        ],
    },
    viewState: {
        currentRole: 0,
        currentView: 0,
    }
};

React.render(<RebaseApp appState={appState} views={_views}/>, document.body);
