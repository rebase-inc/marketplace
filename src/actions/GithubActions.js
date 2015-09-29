var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getAccounts: function() {
        function responseAction(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_GITHUB_ACCOUNTS,
                status: status,
                response: response
            });
        };
        function pendingAction() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_GITHUB_ACCOUNTS,
                status: RequestConstants.PENDING,
            });
        };
        Api.getGithubAccounts(responseAction, pendingAction);
    },
    importRepos: function(selectedRepos) {
        function responseAction(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.IMPORT_GITHUB_REPOS,
                status: status,
                response: response
            });
        };
        function pendingAction() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.IMPORT_GITHUB_REPOS,
                status: RequestConstants.PENDING,
            });
        };
        Api.importGithubRepos(selectedRepos, responseAction, pendingAction);
    }
};
