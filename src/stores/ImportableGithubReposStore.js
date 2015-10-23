var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

// Dispatcher
var Dispatcher = require('../dispatcher/RebaseAppDispatcher');

var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');

//Define initial data points

let _loading = false;
let _allImportableRepos = new Map();

let ImportableGithubRepos = _.extend({}, EventEmitter.prototype, {
    getState: () => {
        return {
            loading: _loading,
            allImportableRepos: _allImportableRepos
        }
    },
    emitChange: (actionType) => { ImportableGithubRepos.emit('change', actionType);  },
    addChangeListener: (callback) => ImportableGithubRepos.on('change', callback),
    removeChangeListener: (callback) => ImportableGithubRepos.removeListener('change', callback),
});

function clearStore() {
    _allImportableRepos = new Map();
}

function handleImportableRepos(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case RequestConstants.SUCCESS:
            _loading = false;
            _allImportableRepos.set(action.account_id, action.response.repos);
            break;
        default: console.warn('Invalid status: ' + action.status); break;
    }
};

ImportableGithubRepos.dispatchToken = Dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.GET_IMPORTABLE_GITHUB_REPOS: handleImportableRepos(action); break;
        case ActionConstants.LOGOUT: clearStore(); break;
        default:  return true;
    }
    ImportableGithubRepos.emitChange();
    return true;
});

module.exports = ImportableGithubRepos;
