var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var _ = require('underscore');

//Define initial data points
var _tickets = [];

// Method to load ticket data from mock API
function loadNewTicketData(newTickets) {
    _tickets = newTickets;
}

function newComment(ticketId, text) {
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

    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
RebaseAppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {
        case ActionConstants.RECEIVE_DATA: loadNewTicketData(action.data); break;
        case ActionConstants.NEW_COMMENT: newComment(action.ticketId, action.text); break;
        default: return true;
    }

    // If action was responded to, emit change event
    TicketStore.emitChange();
    return true;
});

module.exports = TicketStore;
