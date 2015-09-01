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

var _allAuctions = [];
var _currentAuction = null;
var _bidPending = false;
var _loading = false;

var AuctionStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allAuctions: _allAuctions,
            currentAuction: _currentAuction,
            bidPending: _bidPending,
            loadingAuctionData: _loading,
        };
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.SELECT_VIEW: _currentAuction = null; break;
        case ActionConstants.GET_AUCTION_DATA:
            switch(action.response) {
                case RequestConstants.PENDING:
                    _loading = true;
                break;
                default:
                    _allAuctions = action.response.auctions.map(labelAuctionType);
                    _loading = false;
                break;
            } break;
        case ActionConstants.SELECT_AUCTION:
            if (!action.auctionID) { _currentAuction = null; }
            else {
                var found = false;
                for(var i=0; i<_allAuctions.length; i++) {
                    if (_allAuctions[i].id == action.auctionID) { _currentAuction = _allAuctions[i]; found=true; };
                }
                if (!found) { console.warn('Unknown or invalid auction ID provided to select auction action! : ', action.auctionID); }
            }
            break;
        case ActionConstants.ADD_COMMENT_TO_TICKET:
            switch(action.response) {
                case RequestConstants.PENDING: break;
                default: persistNewComment(action.response); break;
            } break;
        case ActionConstants.BID_ON_AUCTION:
            switch(action.response) {
                case RequestConstants.PENDING: _bidPending = true; break;
                case RequestConstants.ERROR: console.log('error!'); break;
                default:
                    _bidPending = false;
                    action.response.auction.type = viewConstants.ViewTypes.TO_BE_DELETED; //no matter what happens, we dont want this in the auction view anymore
                    persistModifiedAuction(action.response);
                    break;
            } break;
        case ActionConstants.GET_COMMENT_DETAIL:
            switch(action.response) {
                case RequestConstants.PENDING: break;
                default: persistCommentDetail(action.response); break;
            } break;
        default: return true;
    }

    // If action was responded to, emit change event
    AuctionStore.emitChange();
    return true;
});

function persistCommentDetail(data) {
    //data.comment.user = { first_name: 'Andrew', last_name: 'Millspaugh', photo: 'img/andrew.jpg' }; // hack because the api is missing data
    for(var i=0; i<_allAuctions.length; i++) {
        var comments = _allAuctions[i].ticket_set.bid_limits[0].ticket_snapshot.ticket.comments;
        for ( var j=0; j < comments.length; j++) {
            if (comments[j].id == data.comment.id) { _allAuctions[i].ticket_set.bid_limits[0].ticket_snapshot.ticket.comments[j] = data.comment; }
        }
    }
}

function persistModifiedAuction(data) {
    var found = false;
    for(var i=0; i<_allAuctions.length; i++) {
        if (data.auction.id == _allAuctions[i].id) {
            _allAuctions[i] = data.auction;
            if (_currentAuction.id == data.auction.id) { _currentAuction = data.auction; }
            found = true;
        }
    }
    if (!found) { console.warn('Unknown or invalid auction provided to persistModifiedAuction! : ', data.auction); }
}

function persistNewComment(data) {
    for(var i=0; i<_allAuctions.length; i++) {
        var ticket = _allAuctions[i].ticket_set.bid_limits[0].ticket_snapshot.ticket;
        if (ticket.id == data.comment.ticket.id) {
            _allAuctions[i].ticket_set.bid_limits[0].ticket_snapshot.ticket.comments.push(data.comment);
        }
    }
}

function labelAuctionType(auction) {
    if (auction.state == 'waiting_for_bids' || auction.state == 'created') {
        var isContractor = false; // obviously we need to get the real info here
        if (!auction.bids.length || isContractor) {
            auction.type = viewConstants.ViewTypes.OFFERED;
        } else {
            auction.type = viewConstants.ViewTypes.TO_BE_DELETED;
        }
    }
    return auction
}

module.exports = AuctionStore;
