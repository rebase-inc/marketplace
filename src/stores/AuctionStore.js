var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var _ = require('underscore');

//Define initial data points
var _availableAuctions = [];

function loadAvailableAuctions(availableAuctions) {
    _availableAuctions = availableAuctions;
}

function newComment(user, auction, text) {

    // hack until I actually bother creating a real comment
    var auctionInd;
    for(var i=0; i<_availableAuctions.length; i++) {
        if (_availableAuctions[i].id == auction.id) { auctionInd = i };
    }

    var _months = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();

    var newComment = {
        user: user,
        date: _months[today.getMonth()] + ' ' + today.getDate(),
        text: text,
    }

    _availableAuctions[auctionInd].ticket_set.bid_limits[0].ticket_snapshot.ticket.comments.push(newComment);
}

var AuctionStore = _.extend({}, EventEmitter.prototype, {
    getAvailableAuctions: function() { return _availableAuctions; },

    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
RebaseAppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.type) {
        case ActionConstants.GET_AVAILABLE_AUCTIONS: loadAvailableAuctions(action.availableAuctions); break;
        case ActionConstants.ADD_COMMENT_TO_AUCTION: newComment(action.user, action.auction, action.text); break;
        default: return true;
    }

    // If action was responded to, emit change event
    AuctionStore.emitChange();
    return true;
});

module.exports = AuctionStore;
