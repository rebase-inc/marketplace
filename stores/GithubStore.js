var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

// Dispatcher
var Dispatcher = require('../dispatcher/RebaseAppDispatcher');

var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');

//Define initial data points

let _loading = false;
let _allAccounts = [];

let GithubStore = _.extend({}, EventEmitter.prototype, {
    getState: () => {
        return {
            loading: _loading,
            allAccounts: _allAccounts,
        }
    },
    emitChange: (actionType) => { GithubStore.emit('change', actionType); },
    addChangeListener: (callback) => GithubStore.on('change', callback),
    removeChangeListener: (callback) => GithubStore.removeListener('change', callback),
});

function clearStore() {
    _allAccounts = [];
}

function handleNewAccounts(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case RequestConstants.SUCCESS: {
            _loading = false;
            _allAccounts = action.response.github_accounts;
            break;
        }
        default: console.warn('Invalid status: ' + action.status); break;
    }
};

GithubStore.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.GET_GITHUB_ACCOUNTS: 
            handleNewAccounts(action); break;
        case ActionConstants.IMPORT_GITHUB_REPOS: _loading = false; break;
        case ActionConstants.LOGOUT: clearStore(); break;
        default: return true;
    }
    GithubStore.emitChange();
    return true;
});

module.exports = GithubStore;
