var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var _ = require('underscore');

//Define initial data points
var _availableAuctions = [];
var _currentAuction = null;

function persistAvailableAuctions(availableAuctions) {
    if (availableAuctions) { _availableAuctions = availableAuctions; }
}

function persistModifiedAuction(auction) {
    for(var i=0; i<_availableAuctions.length; i++) {
        if (_availableAuctions[i].id == auction.id) {
            _availableAuctions[i] = auction;
            if (_currentAuction.id == auction.id) { _currentAuction = auction }
        };
    }
}

var AuctionStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            availableAuctions: _availableAuctions,
            currentAuction: _currentAuction,
        };
    },
    select: function(id) {
        for(var i=0; i<_availableAuctions.length; i++) {
            if (_availableAuctions[i].id == id) { _currentAuction = _availableAuctions[i]; };
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
                default: persistAvailableAuctions(action.response.data); break;
            } break;
        case ActionConstants.ADD_COMMENT_TO_AUCTION:
            switch(action.response) {
                case RequestConstants.PENDING: console.log('Pending new comment!'); break;
                default: persistModifiedAuction(action.response.data); break;
            } break;
        default: return true;
    }
    
    // If action was responded to, emit change event
    AuctionStore.emitChange();
    return true;
});

module.exports = AuctionStore;
