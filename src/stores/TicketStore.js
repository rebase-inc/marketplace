var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var _ = require('underscore');

//Define initial data points
var _tickets = [];
var _currentTicket = null;

function persistTickets(tickets) {
    if (tickets) { _tickets = tickets; }
}

function persistModifiedTicket(ticket) {
    for(var i=0; i<_tickets.length; i++) {
        if (_tickets[i].id == ticket.id) {
            _tickets[i] = _.extend({}, ticket);
            if (_currentTicket.id == ticket.id) { _currentTicket = ticket }
        };
    }
}

function newComment(user, ticket, text) {
    //var ticketInd = _tickets.findIndex(function(ind, el) { return el.id === ticketId });
    var ticketInd;
    for(var i=0; i<_tickets.length; i++) {
        if (_tickets[i].id == ticket.id) { ticketInd = i };
    }

    var _months = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();

    // hack until I actually bother creating a real comment
    var newComment = {
        user: user,
        date: _months[today.getMonth()] + ' ' + today.getDate(),
        text: text,
    }

    _tickets[ticketInd].comments.push(newComment);
}

var TicketStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            tickets: _tickets,
            currentTicket: _currentTicket,
        };
    },
    select: function(ticket) {
        if (!ticket) { _currentTicket = null; return; }
        for(var i=0; i<_tickets.length; i++) {
            if (_tickets[i].id == ticket.id) { _currentTicket = _tickets[i]; };
        }
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
RebaseAppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {
        case ActionConstants.GET_TICKET_DATA:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending!'); break;
                default: persistTickets(action.response.data); break;
            } break;
        case ActionConstants.ADD_COMMENT_TO_TICKET:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending new comment!'); break;
                default: persistModifiedTicket(action.response.data); break;
            } break;
        default: return true;
    }


    // If action was responded to, emit change event
    TicketStore.emitChange();
    return true;
});

module.exports = TicketStore;
