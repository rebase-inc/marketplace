var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

// Dispatcher
var Dispatcher = require('../dispatcher/RebaseAppDispatcher');

var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');

//Define initial data points

let _loading = false;
let _allAccounts = [];
let _allRepos = [];

let GithubStore = _.extend({}, EventEmitter.prototype, {
    getState: () => {
        console.log('returning get state with loading' , _loading);
        return { loading: _loading, allAccounts: _allAccounts, allRepos: _allRepos }
    },
    emitChange: (actionType) => GithubStore.emit('change', actionType),
    addChangeListener: (callback) => GithubStore.on('change', callback),
    removeChangeListener: (callback) => GithubStore.removeListener('change', callback),
});

function clearStore() {
    _allAccounts = [];
    _allRepos = [];
}

function handleNewAccounts(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case RequestConstants.SUCCESS:
            _loading = false;
            _allAccounts = action.response.github_accounts;
            _allRepos = [];
            for ( let account of _allAccounts ) {
                for ( let organization of account.orgs ) {
                    for ( let project of organization.org.projects ) {
                        _allRepos.push(project.code_repository);
                    }
                }
            }
            break;
        default: console.warn('Invalid status: ' + action.status); break;
    }
    console.log('set loading to ', _loading);
};

GithubStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.GET_GITHUB_ACCOUNTS: handleNewAccounts(action); break;
        case ActionConstants.IMPORT_GITHUB_REPOS: _loading = false; break;
        case ActionConstants.LOGOUT: clearStore(); break;
        default: return true;
    }
    // If action was responded to, emit change event
    console.log('emitting change');
    GithubStore.emitChange();
    return true;
});

module.exports = GithubStore;
