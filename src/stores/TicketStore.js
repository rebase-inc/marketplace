// external
var _ = require('underscore');
var keyMirror = require('keymirror');
var EventEmitter = require('events').EventEmitter;

// dispatcher
var Dispatcher = require('../dispatcher/RebaseAppDispatcher');

// constants
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var viewConstants = require('../constants/viewConstants');

var _allTickets = [];
var _currentTicket = null;
var _loading = false;

function _shouldBeVisible(ticket) {
    return !ticket.snapshots.some(snap => !!snap.bid_limit.ticket_set.auction)
}

var TicketStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allTickets: _allTickets.filter(_shouldBeVisible),
            currentTicket: _currentTicket,
            loading: _loading,
        }
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {
        case ActionConstants.SELECT_VIEW: _currentTicket = null; break;
        case ActionConstants.SELECT_TICKET: handleSelectedTicket(action.ticketID); break;
        case ActionConstants.GET_TICKET_DATA: handleNewTicketData(action); break;
        case ActionConstants.ADD_COMMENT_TO_TICKET: handleNewComment(action.response); break;
        case ActionConstants.GET_COMMENT_DETAIL: handleCommentDetail(action); break;
        default: return true;
    }

    // If action was responded to, emit change event
    TicketStore.emitChange();
    return true;
});

function handleSelectedTicket(id) {
    _currentTicket = _allTickets.filter(ticket => ticket.id == id)[0];
}

function handleNewTicketData(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Undefined data!'); break;
        default:
            _loading = false;
            _allTickets = action.response.tickets;
    }
}

function handleNewComment(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allTickets.forEach(ticket => { if (ticket.id == data.comment.ticket.id) { ticket.comments.push(data.comment) } });
            break;
    }
}

function handleCommentDetail(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            var detailed_comment = action.response.comment;
            _allTickets.forEach(ticket => ticket.comments.forEach(comment => { comment = comment.id == detailed_comment.id ? detailed_comment : comment }));
            break;
    }
}

module.exports = TicketStore;
