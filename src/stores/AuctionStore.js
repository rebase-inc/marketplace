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
        case ActionConstants.GET_AUCTION_DATA:
            switch(action.response) {
                case RequestConstants.PENDING:
                    _loading = true;
                break;
                default:
                    _loading = false;
                    _allAuctions = action.response.auctions.map(labelAuctionType);
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
        case ActionConstants.ADD_COMMENT_TO_AUCTION:
            switch(action.response) {
                //case RequestConstants.PENDING: break;
                //default: persistModifiedAuction(action.response.data); break;
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
    AuctionStore.emitChange();
    return true;
});

function labelAuctionType(auction) {
    if (auction.state == 'waiting_for_bids' || auction.state == 'created') {
        auction.type = viewConstants.ViewTypes.OFFERED;
    }
    return auction
}

module.exports = AuctionStore;
