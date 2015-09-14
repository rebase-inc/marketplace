var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var viewConstants = require('../constants/viewConstants');
var ReviewActions = require('../actions/ReviewActions');
var UserActions = require('../actions/UserActions');
var _ = require('underscore');

//Define initial data points
var _allTalent = [];
var _loading = false;
var _currentAuctionID = undefined;

var TalentStore = _.extend({}, EventEmitter.prototype, {
    getState: function(auctionID) {
        //if (auctionID != _currentAuctionID) {
            //_allTalent = [];
            //_loading = false;
            //_currentAuctionID = auctionID;
        //}
        return {
            allTalent: _allTalent,
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
        case null: _loading = false; console.warn('Undefined data!');
        default:
            _loading = false;
            _allTalent = data.nominations.sort((n1, n2) => n2.job_fit.score - n1.job_fit.score);
    }
}

module.exports = TalentStore;
