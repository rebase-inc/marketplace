var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var _ = require('underscore');

//Define initial data points
var _allAuctions = [];
var _currentAuction = null;
var _bidPending = false;

function persistAuctionData(data) {
    if (data) { _allAuctions = data.auctions; }
}

function persistCommentDetail(data) {
    data.comment.user = { first_name: 'Andrew', last_name: 'Millspaugh', photo: 'img/andrew.jpg' }; // hack because the api is missing data
    for(var i=0; i<_allAuctions.length; i++) {
        var comments = _allAuctions[i].ticket_set.bid_limits[0].ticket_snapshot.ticket.comments;
        for ( var j=0; j < comments.length; j++) {
            if (comments[j].id == data.comment.id) { _allAuctions[i].ticket_set.bid_limits[0].ticket_snapshot.ticket.comments[j] = data.comment; }
        }
    }
}

function persistModifiedAuction(auction) {
    for(var i=0; i<_allAuctions.length; i++) {
        if (_allAuctions[i].id == auction.id) {
            _allAuctions[i] = _.extend({}, auction);
            if (_currentAuction.id == auction.id) { _currentAuction = auction }
        };
    }
}

function handleBidResponse(auction) {
    _bidPending = false;
    persistModifiedAuction(auction);
}

function markBidPending(auction) {
    _bidPending = true;
}

var AuctionStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allAuctions: _allAuctions,
            currentAuction: _currentAuction,
            bidPending: _bidPending,
        };
    },
    select: function(auction) {
        if (!auction) { _currentAuction = null; return; }
        for(var i=0; i<_allAuctions.length; i++) {
            if (_allAuctions[i].id == auction.id) { _currentAuction = _allAuctions[i]; };
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
        case ActionConstants.GET_AUCTION_DATA:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending!'); break;
                default: persistAuctionData(action.response); break;
            } break;
        case ActionConstants.ADD_COMMENT_TO_AUCTION:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending new comment!'); break;
                default: persistModifiedAuction(action.response.data); break;
            } break;
        case ActionConstants.BID_ON_AUCTION:
            switch(action.response) {
                case RequestConstants.PENDING: markBidPending(action.response.data); break;
                default: handleBidResponse(action.response.data); break;
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

module.exports = AuctionStore;
