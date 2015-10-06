var _ = require('underscore');

var Store = require('../utils/Store');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var ProjectResource = require('../stores/ProjectStore');
var UserStore = require('../stores/UserStore');

//Define initial data points
var _githubData = {
    loading:        true,
    allAccounts:    [],
}

var GithubStore = Store.newStore(function() {
    return _githubData;
});

function successGetAccounts(action) {
    _githubData.loading = false;
    _githubData.allAccounts = action.response.github_accounts;
};

Store.registerDispatcher(
    GithubStore,
    ActionConstants.GET_GITHUB_ACCOUNTS,
    successGetAccounts,
    Store.defaultPendingAndErrorHandler.bind(_githubData)
);

function successImportRepos(action) {
    _githubData.loading = false;
    var _updated_repos = action.response.repos; // TODO update repository store once built
    var _updated_orgs = action.response.orgs; // TODO update organization store once built
    var _updated_projects = action.response.projects;
    ProjectResource.update(action.response.projects);
    UserStore.addProjectRoles(action.response.projects);
};

Store.registerDispatcher(
    GithubStore,
    ActionConstants.IMPORT_GITHUB_REPOS,
    successImportRepos,
    Store.defaultPendingAndErrorHandler.bind(_githubData)
);

module.exports = GithubStore;
