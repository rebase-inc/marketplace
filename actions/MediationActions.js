var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    answerFailed: function(role, mediation) {
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
        Api.markMediationFailed(role, mediation, responseAction, pendingAction);
    },
};
