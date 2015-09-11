var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    markFailed: function(user, mediation, reason) {
        function responseAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.ANSWER_MEDIATION_FAILED,
                response: response
            });
        };
        function pendingAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.ANSWER_MEDIATION_FAILED,
                response: RequestConstants.PENDING,
            });
        };
        Api.markMediationFailed(user, mediation, reason, responseAction, pendingAction);
    },
};
