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
var _currentAuctionID = undefined;

var TalentStore = _.extend({}, EventEmitter.prototype, {
    getState: function(auctionID) {
        //if (auctionID != _currentAuctionID) {
            //_allNominations = [];
            //_loading = false;
            //_currentAuctionID = auctionID;
        //}
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
        case ActionConstants.GET_TALENT_DATA: handleNewTalentData(action.response); break;
        case ActionConstants.APPROVE_NOMINATION: handleModifiedNomination(action.response); break;
        default: return true;
    }

    // If action was responded to, emit change event
    TalentStore.emitChange();
    return true;
});

function handleNewTalentData(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Undefined data!'); break;
        default:
            _loading = false;
            _allNominations = data.nominations.sort((n1, n2) => n2.job_fit.score - n1.job_fit.score);
    }
}

function handleModifiedNomination(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!'); break;
        default:
            _loading = false;
            _allNominations = _allNominations.map(n => n.contractor.id == data.nomination.contractor.id && n.ticket_set.id == data.nomination.ticket_set.id ? data.nomination : n);
            break;
    }
}

module.exports = TalentStore;
