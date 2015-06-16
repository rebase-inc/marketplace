
var AlveareApp = require('./components/AlveareApp.react');
var DemoData = require('./DemoData');
var React = require('react');
window.React = React; // export for http://fb.me/react-devtools

DemoData.init();

var newTickets = JSON.parse(localStorage.getItem('newTickets')); //hack while I get actual loading to work

React.render(<AlveareApp tickets={newTickets}/>, document.body);
