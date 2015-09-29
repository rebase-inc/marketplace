var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var viewConstants = require('../constants/viewConstants');
var ReviewActions = require('../actions/ReviewActions');
var UserActions = require('../actions/UserActions');
var _ = require('underscore');

//Define initial data points
var _loading = true;
var _allAccounts = [];

var GithubStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allAccounts: _allAccounts,
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
        case ActionConstants.GET_GITHUB_ACCOUNTS: handleNewAccountData(action); break;
        case ActionConstants.IMPORT_GITHUB_REPOS: handleImportRepos(action); break;
        default: return true;
    }

    // If action was responded to, emit change event
    GithubStore.emitChange();
    return true;
});

function handleNewAccountData(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Undefined data!'); break;
        case undefined: _loading = false; console.warn('Undefined data!'); break;
        default: {
            _loading = false;
            _allAccounts = action.response.github_accounts;
        }

    }
}

function handleImportRepos(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Undefined data!'); break;
        case undefined: _loading = false; console.warn('Undefined data!'); break;
        default: {
            _loading = false;
        }

    }
}

module.exports = GithubStore;
