var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var ViewConstants = require('../constants/ViewConstants');
var keyMirror = require('keymirror');
var _ = require('underscore');

//Define initial data points
var _tickets = [];
var _currentTicket = null;

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

function isNewTicket(ticket) {
    return ticket.ticket_snapshots.every(snap => !snap.bid_limit.ticket_set.auction);
}

function isOfferedTicket(ticket) {
    return ticket.ticket_snapshots.every(snap => snap.bid_limit.ticket_set.auction.state == 'waiting_for_bids');
}

function isInProgressTicket(ticket) {
    return (
        ticket.ticket_snapshots.every(snap => snap.bid_limit.ticket_set.auction.state == 'closed') &&
        ticket.ticket_snapshots
            .every(snap => snap.bid_limit.ticket_set.auction.bids.filter(bid => !!bid.contract)
                   .every(bid => bid.work_offers.some(offer => !offer.work.review)))
    );
}

function labelTicket(ticket) {
    if ( isNewTicket(ticket) ) { ticket.type = ViewConstants.ticketTypes.NEW }
    else if ( isOfferedTicket(ticket) ) { ticket.type = ViewConstants.ticketTypes.OFFERED }
    else if ( isInProgressTicket(ticket) ) { ticket.type = ViewConstants.ticketTypes.IN_PROGRESS }
    else { ticket.type = ViewConstants.ticketTypes.COMPLETED } // really should actually check, but this just for mock data for now
    return ticket;
}

function persistTickets(tickets) {
    _loading = false;
    _allTickets = tickets.map(labelTicket);
}

function markLoading(tickets) {
    _loading = true;
}

var _role = null;
var _allTickets = [];
var _currentTicket = null;
var _loading = false;

var TicketStore = _.extend({}, EventEmitter.prototype, {
    initialize: function(role) {
        _role = role;
        _allTickets = null;
    },
    getState: function(role) {
        return {
            allTickets: _allTickets,
            currentTicket: _currentTicket,
            loading: _loading,
        }
    },
    select: function(ticket) {
        if (!ticket) { _currentTicket = null; }
        else {
            for(var i=0; i<_allTickets.length; i++) {
                if (_allTickets[i].id == ticket.id) { _currentTicket = _allTickets[i]; };
            }
        }
        this.emitChange();
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
                case RequestConstants.PENDING: markLoading(); break;
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
