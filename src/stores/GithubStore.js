var _ = require('underscore');

var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var ProjectResource = require('../stores/ProjectStore');

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
    emitChange: function(action_type) { this.emit('change', action_type); },
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
    GithubStore.emitChange(action.type);
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
            var _updated_repos = action.response.repos; // TODO update repository store once built
            var _updated_orgs = action.response.orgs; // TODO update organization store once built
            var _updated_projects = action.response.projects;
            ProjectResource.update(action.response.projects);
        }
    }
}

module.exports = GithubStore;
