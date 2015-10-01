var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var viewConstants = require('../constants/viewConstants');
var ReviewActions = require('../actions/ReviewActions');
var UserActions = require('../actions/UserActions');
var _ = require('underscore');

//Define initial data points
var _allNominations = {};
var _loading = false;

var TalentStore = _.extend({}, EventEmitter.prototype, {
    getState: function(auctionID) {
        if (!auctionID) {
            throw 'No auction id provided!'
        }
        return {
            allTalent: _allNominations[auctionID] || [],
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
        case ActionConstants.SELECT_AUCTION: TalentStore.getState(-1); break;
        default: return true;
    }

    // If action was responded to, emit change event
    TalentStore.emitChange();
    return true;
});

function sort_nominations(n1, n2) {
    switch (!!n1.job_fit) {
        case true: !!n2.job_fit ? (n1.job_fit.score - n2.job_fit.score) : -1; break;
        case false: !!n2.job_fit ? 1 : 0; break;
    }
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
            _allNominations[action.response.auction.id] = action.response.auction.ticket_set.nominations.sort(sort_nominations);
    }
}

function handleModifiedNomination(action) {
    switch (action.status) {
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case RequestConstants.PENDING: 
            _loading = true; 
            let contractor = action.response.nomination.contractor;
            let auction = action.response.nomination.ticket_set.auction;
            _allNominations[auction.id].filter(nom => nom.contractor.id == contractor.id)[0].loading = true;
            break;
        case RequestConstants.SUCCESS:
            _loading = false;
            var modified_nomination = action.response.nomination
            let auctionID = action.response.nomination.auction.id;
            _allNominations[auctionID] = _allNominations[auctionID].map(n => n.contractor.id == modified_nomination.contractor.id && n.ticket_set.id == modified_nomination.ticket_set.id ? modified_nomination : n);
            break;
        default: throw 'Invalid action state!'; break;
    }
}

module.exports = TalentStore;
