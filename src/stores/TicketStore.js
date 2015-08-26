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

var TicketStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allTickets: _allTickets,
            currentTicket: _currentTicket,
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
Dispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {
        case ActionConstants.GET_TICKET_DATA:
            switch(action.response) {
                case RequestConstants.PENDING:
                    _loading = true;
                break;
                default:
                    _loading = false;
                    _allTickets = action.response.tickets.map(labelTicketType);
                break;
            } break;
        case ActionConstants.ADD_COMMENT_TO_TICKET:
            switch(action.response) {
                //case RequestConstants.PENDING: break;
                //default: persistNewComment(action.response); break;
            } break;
        case ActionConstants.BID_ON_AUCTION:
            switch(action.response) {
                //case RequestConstants.PENDING: markBidPending(action.response.data); break;
                //default: handleBidResponse(action.response.data); break;
            } break;
        case ActionConstants.GET_COMMENT_DETAIL:
            switch(action.response) {
                //case RequestConstants.PENDING: break;
                //default: persistCommentDetail(action.response); break;
            } break;
        default: return true;
    }

    // If action was responded to, emit change event
    TicketStore.emitChange();
    return true;
});

function labelTicketType(ticket) {
    if ( ticket.snapshots.every(snap => !snap.bid_limit || !snap.bid_limit.ticket_set.auction) ) {
        ticket.type = viewConstants.ViewTypes.NEW
    }
    return ticket;
    //} else if ( ticket.snapshots.every(snap => snap.bid_limit.ticket_set.auction.state == 'waiting_for_bids') ) {
        //ticket.type = ViewConstants.ticketTypes.OFFERED
    //} else if ( ticket.snapshots.every(snap => snap.bid_limit.ticket_set.auction.state == 'closed') &&
                //ticket.snapshots.every(snap => snap.bid_limit.ticket_set.auction.bids.filter(bid => !!bid.contract)
               //.every(bid => bid.work_offers.some(offer => !offer.work.review))) ) {
        //ticket.type = ViewConstants.ticketTypes.IN_PROGRESS;
   //} else {
       //ticket.type = ViewConstants.ticketTypes.COMPLETED;
   //}
}

module.exports = TicketStore;
