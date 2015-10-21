var Action = require('../utils/Action');
var ActionConstants = require('../constants/ActionConstants');
var Api = require('../utils/Api');

module.exports = {
    getAccounts:        Action.create(ActionConstants.GET_GITHUB_ACCOUNTS,          Api.getGithubAccounts),
    getImportableRepos: Action.create(ActionConstants.GET_IMPORTABLE_GITHUB_REPOS,  Api.getImportableGithubRepos),
    importRepos:        Action.create(ActionConstants.IMPORT_GITHUB_REPOS,          Api.importGithubRepos),
};
