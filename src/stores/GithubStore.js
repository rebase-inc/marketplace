var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

// Dispatcher
var Dispatcher = require('../dispatcher/RebaseAppDispatcher');

var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');

//Define initial data points

let _loading = false;
let _allAccounts = [];
let _allImportableRepos = new Map();

let GithubStore = _.extend({}, EventEmitter.prototype, {
    getState: () => {
        return {
            loading: _loading,
            allAccounts: _allAccounts,
            allImportableRepos: _allImportableRepos
        }
    },
    emitChange: (actionType) => { console.log('before emit change'); GithubStore.emit('change', actionType); console.log('after emit change'); },
    addChangeListener: (callback) => GithubStore.on('change', callback),
    removeChangeListener: (callback) => GithubStore.removeListener('change', callback),
});

function clearStore() {
    _allAccounts = [];
    _allImportableRepos = new Map();
}

function handleNewAccounts(action) {
    console.log('responding to handle new accounts with status: ', action.status);
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case RequestConstants.SUCCESS:
            _loading = false;
            _allAccounts = action.response.github_accounts; break;
        default: console.warn('Invalid status: ' + action.status); break;
    }
};

function handleImportableRepos(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case RequestConstants.SUCCESS:
            _loading = false;
            let [account_id] = action.args;
            _allImportableRepos.set(account_id, action.response.repos);
            break;
        default: console.warn('Invalid status: ' + action.status); break;
    }
};

GithubStore.dispatchToken = Dispatcher.register(function(payload) {
    console.log('github store responding to action: ', payload.action.type);
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.GET_GITHUB_ACCOUNTS: 
            handleNewAccounts(action); break;
        case ActionConstants.GET_IMPORTABLE_GITHUB_REPOS: handleImportableRepos(action); break;
        case ActionConstants.IMPORT_GITHUB_REPOS: _loading = false; break;
        case ActionConstants.LOGOUT: clearStore(); break;
        default: console.log('no action to respond to'); return true;
    }
    GithubStore.emitChange();
    console.log('end of github store dispatcher callback');
    return true;
});

console.log(GithubStore.dispatchToken);

module.exports = GithubStore;
