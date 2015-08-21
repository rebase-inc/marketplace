var React = require('react');
var keyMirror = require('keymirror');

var MockData = require('./MockData');
var RebaseApp = require('./components/RebaseApp.react');
var TicketApi = require('./utils/TicketApi')

window.React = React; // export for http://fb.me/react-devtools

MockData.init();

var _user = {
    first_name: 'Andrew',
    last_name: 'Millspaugh',
    photo: 'img/andrew.jpg',
    roles: [
        { id: 4, type: 'developer' },
        { id: 8, type: 'manager', organization: 'rebase', project: 'api' },
        { id: 9, type: 'manager', organization: 'rebase', project: 'react-app' },
        { id: 23, type: 'manager', organization: 'rebase', project: 'marketing' },
    ]
}

React.render(<RebaseApp user={_user} />, document.body);
