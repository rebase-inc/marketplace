var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getAccounts: function() {
        function responseHandler(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_GITHUB_ACCOUNTS,
                status: status,
                response: response,
            });
        };
        function pendingHandler() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_GITHUB_ACCOUNTS,
                status: RequestConstants.PENDING,
            });
        };
        Api.getGithubAccounts(responseHandler, pendingHandler);
    },
    getImportableRepos: function(account_id) {
        function responseHandler(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_IMPORTABLE_GITHUB_REPOS,
                status: status,
                response: response,
                account_id: account_id
            });
        };
        function pendingHandler() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_IMPORTABLE_GITHUB_REPOS,
                status: RequestConstants.PENDING,
            });
        };
        Api.getImportableGithubRepos(account_id, responseHandler, pendingHandler);
    },
    importRepos: function(selectedRepos) {
        function responseHandler(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.IMPORT_GITHUB_REPOS,
                status: status,
                response: response,
                selectedRepos: selectedRepos
            });
        };
        function pendingHandler() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.IMPORT_GITHUB_REPOS,
                status: RequestConstants.PENDING,
            });
        };
        Api.importGithubRepos(selectedRepos, responseHandler, pendingHandler);
    },
};
