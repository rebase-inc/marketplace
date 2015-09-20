var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getRepoData: function() {
        function responseAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_GITHUB_REPOS,
                response: response
            });
        };
        function pendingAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_GITHUB_REPOS,
                response: RequestConstants.PENDING,
            });
        };
        Api.getRepoData(responseAction, pendingAction);
    },
};
