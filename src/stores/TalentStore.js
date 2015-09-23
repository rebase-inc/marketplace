var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var viewConstants = require('../constants/viewConstants');
var ReviewActions = require('../actions/ReviewActions');
var UserActions = require('../actions/UserActions');
var _ = require('underscore');

//Define initial data points
var _allNominations = [];
var _loading = false;
var _auctionID = null;

var TalentStore = _.extend({}, EventEmitter.prototype, {
    getState: function(auctionID) {
        if (auctionID != _auctionID) {
            _allNominations = [];
            _loading = false;
            _auctionID = auctionID;
        }
        return {
            allTalent: _allNominations,
            loading: _loading,
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
        case ActionConstants.GET_AUCTION_DETAIL: handleNewAuctionData(action); break;
        case ActionConstants.APPROVE_NOMINATION: handleModifiedNomination(action); break;
        default: return true;
    }

    // If action was responded to, emit change event
    TalentStore.emitChange();
    return true;
});

function sort_nominations(n1, n2) {
    if (n1.job_fit) {
        if (n2.job_fit) {
            return n1.job_fit.score - n2.job_fit.score;
        }
        return -1;
    } else {
        if (n2.job_fit) {
            return 1;
        }
        return 0;
    }
    throw 'Unreachable path in sort_nominations';
}

function handleNewAuctionData(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Undefined data!'); break;
        case undefined: _loading = false; console.warn('Undefined data!'); break;
        default:
            _loading = false;
            _allNominations = action.response.auction.ticket_set.nominations.sort(sort_nominations);
    }
}

function handleModifiedNomination(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Null data!'); break;
        default:
            _loading = false;
            var modified_nomination = action.response.nomination
            _allNominations = _allNominations.map(n => n.contractor.id == modified_nomination.contractor.id && n.ticket_set.id == modified_nomination.ticket_set.id ? modified_nomination : n);
            break;
    }
}

module.exports = TalentStore;
