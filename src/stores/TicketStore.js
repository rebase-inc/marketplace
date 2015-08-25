var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var ViewConstants = require('../constants/ViewConstants');
var keyMirror = require('keymirror');
var _ = require('underscore');

//Define initial data points

function persistModifiedTicket(ticket) {
    for(var i=0; i<_allTickets.length; i++) {
        if (_allTickets[i].id == ticket.id) {
            _allTickets[i] = labelTicket(JSON.parse(JSON.stringify(ticket)));
            if (_currentTicket.id == ticket.id) { _currentTicket = _allTickets[i]; }
        };
    }
}

function persistCommentDetail(data) {
    data.comment.user = { first_name: 'Andrew', last_name: 'Millspaugh', photo: 'img/andrew.jpg' }; // hack because the api is missing data
    for(var i=0; i<_allTickets.length; i++) {
        var ticket = _allTickets[i];
        for ( var j=0; j < ticket.comments.length; j++) {
            if (ticket.comments[j].id == data.comment.id) {
                _allTickets[i].comments[j] = data.comment;
                if (_currentTicket.id == _allTickets[i].id) { _currentTicket = _allTickets[i]; }
            }
        }
    }
}

function persistNewComment(data) {
    data.comment.user = { first_name: 'Andrew', last_name: 'Millspaugh', photo: 'img/andrew.jpg' }; // hack because the api is missing data
    for(var i=0; i<_allTickets.length; i++) {
        if (_allTickets[i].id == data.comment.ticket.id) {
            _allTickets[i].comments.push(data.comment);
        }
    }
}


function newComment(user, ticket, text) {
    var ticketInd;
    for(var i=0; i<_allTickets.length; i++) {
        if (_allTickets[i].id == ticket.id) { ticketInd = i };
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

    _allTickets[ticketInd].comments.push(newComment);
}

function markBidPending(auction) {
    _bidPending = true;
}

function handleBidResponse(auction) {
    _bidPending = false;
    var ticket = JSON.parse(JSON.stringify(_currentTicket));
    ticket.snapshots[0].bid_limit.ticket_set.auction = auction;
    persistModifiedTicket(ticket);
}

function isNewTicket(ticket) {
    return ticket.snapshots.every(snap => !snap.bid_limit || !snap.bid_limit.ticket_set.auction);
}

function isOfferedTicket(ticket) {
    return ticket.snapshots.every(snap => snap.bid_limit.ticket_set.auction.state == 'waiting_for_bids');
}

function isInProgressTicket(ticket) {
    return (
        ticket.snapshots.every(snap => snap.bid_limit.ticket_set.auction.state == 'closed') &&
        ticket.snapshots
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

function persistTickets(data) {
    _loading = false;
    _allTickets = data.tickets.map(labelTicket);
}

function markLoading(tickets) {
    _loading = true;
}

var _role = null;
var _allTickets = [];
var _currentTicket = null;
var _loading = false;
var _bidPending = false;

var TicketStore = _.extend({}, EventEmitter.prototype, {
    initialize: function(role) {
        _role = role;
        _allTickets = null;
    },
    getDetailedCurrent: function() {
        return _currentTicket;
    },
    getState: function(role) {
        return {
            allTickets: _allTickets,
            currentTicket: _currentTicket,
            loading: _loading,
            bidPending: _bidPending,
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
                default: persistTickets(action.response); break;
            } break;
        case ActionConstants.ADD_COMMENT_TO_TICKET:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending new comment!'); break;
                default: persistNewComment(action.response); break;
            } break;
        case ActionConstants.BID_ON_AUCTION:
            switch(action.response) {
                case RequestConstants.PENDING: markBidPending(action.response.data); break;
                default: handleBidResponse(action.response.data); break;
            } break;
        case ActionConstants.GET_COMMENT_DETAIL:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending comment detail!'); break;
                default: persistCommentDetail(action.response); break;
            } break;
        default: return true;
    }

    // If action was responded to, emit change event
    TicketStore.emitChange();
    return true;
});

module.exports = TicketStore;
