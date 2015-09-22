var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var viewConstants = require('../constants/viewConstants');
var ReviewActions = require('../actions/ReviewActions');
var UserActions = require('../actions/UserActions');
var _ = require('underscore');

//Define initial data points
var _loading = false;
var _allRepos = [];

var TalentStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allRepos: _allRepos,
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
        case ActionConstants.GET_GITHUB_REPOS: handleNewRepoData(action); break;
        default: return true;
    }

    // If action was responded to, emit change event
    TalentStore.emitChange();
    return true;
});

function handleNewRepoData(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Undefined data!'); break;
        case undefined: _loading = false; console.warn('Undefined data!'); break;
        default:
            _loading = false;
            _allRepos = action.response.repos;
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
