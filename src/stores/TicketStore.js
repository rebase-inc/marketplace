var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var RebaseConstants = require('../constants/RebaseConstants');
var _ = require('underscore');

//Define initial data points
var _tickets = {};
var _tickets = JSON.parse(localStorage.getItem('newTickets'));
var _selected = null;

// Method to load ticket data from mock API
function loadNewTicketData(newTickets) {
    return true;
    _tickets = newTickets;
}

function newComment(ticketId, text) {
    console.log('we got a new comment on #' + ticketId + '!: ' + text);
    console.log(_tickets);
    //var ticketInd = _tickets.findIndex(function(ind, el) { return el.id === ticketId });

    var ticketInd;
    for(var i=0; i<_tickets.length; i++) {
        if (_tickets[i].id == ticketId) { ticketInd = i };
    }

    // hack until I actually bother creating a real comment
    var newComment = {
        name: 'Andrew Millspaugh',
        date: 'June 20',
        text: text,
    }

    _tickets[ticketInd].comments.push(newComment);
}

var TicketStore = _.extend({}, EventEmitter.prototype, {
    getTickets: function() { return _tickets; },
    getSelected: function() { return _selected; },

    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
RebaseAppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {
        case RebaseConstants.RECEIVE_DATA: loadNewTicketData(action.data); break;
        case RebaseConstants.SELECT_TICKET: setSelected(action.data); break;
        case RebaseConstants.NEW_COMMENT: newComment(action.ticketId, action.text); break;
        default: return true;
    }

    // If action was responded to, emit change event
    TicketStore.emitChange();
    return true;
});

module.exports = TicketStore;
