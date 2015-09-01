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

var _shouldBeVisible = function(auction) {
    return (auction.state == 'created' || auction.state == 'waiting_for_bids') && !auction.bids.length
}

var AuctionStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allAuctions: _allAuctions.filter(_shouldBeVisible),
            currentAuction: _currentAuction,
            loading: _loading,
        };
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.SELECT_VIEW: _currentAuction = null; break;
        case ActionConstants.GET_AUCTION_DATA: handleNewAuctionData(action.response); break;
        case ActionConstants.SELECT_AUCTION: handleSelectedAuction(action.auctionID); break;
        case ActionConstants.ADD_COMMENT_TO_TICKET: handleNewComment(action.response); break;
        case ActionConstants.BID_ON_AUCTION: handleModifiedAuction(action.response); break;
        case ActionConstants.GET_COMMENT_DETAIL: handleCommentDetail(action.response); break;
        default: return true;
    }
    AuctionStore.emitChange();
    return true;
});

function addSyntheticProperties(auction) {
    Object.defineProperty(auction, 'ticket', {
        get: function() { return auction.ticket_set.bid_limits[0].ticket_snapshot.ticket; },
        set: function(ticket) { auction.ticket_set.bid_limits[0].ticket_snapshot.ticket = ticket; },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    return auction;
}

function handleNewAuctionData(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Undefined data!');
        default:
            _loading = false;
            _allAuctions = data.auctions;
            _allAuctions.forEach(auction => addSyntheticProperties(auction));
    }
}

function handleSelectedAuction(id) {
    _currentAuction = _allAuctions.filter(auction => auction.id == id)[0];
}

function handleNewComment(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allAuctions.forEach(auction => { if (auction.ticket.id == data.comment.ticket.id) { auction.ticket.comments.push(data.comment) } });
            break;
    }
}

function handleModifiedAuction(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allAuctions = _allAuctions.map(auction => auction.id == data.auction.id ? addSyntheticProperties(data.auction) : auction);
            _currentAuction = _currentAuction.id == data.auction.id ? addSyntheticProperties(data.auction) : _currentAuction;
            break;
    }
}

function handleCommentDetail(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allAuctions.forEach(auction => auction.ticket.comments.forEach(comment => { comment = comment.id == data.comment.id ? data.comment : comment }));
            break;
    }
}

module.exports = AuctionStore;
