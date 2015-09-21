var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getTalentData: function(auction) {
        function responseAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TALENT_DATA,
                response: response
            });
        };
        function pendingAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TALENT_DATA,
                response: RequestConstants.PENDING,
            });
        };
        Api.getTalentData(auction, responseAction, pendingAction);
    },
    approveNomination: function(nomination) {
        function responseAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.APPROVE_NOMINATION,
                response: response
            });
        };
        function pendingAction(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.APPROVE_NOMINATION,
                response: RequestConstants.PENDING,
            });
        };
        Api.approveNomination(nomination, responseAction, pendingAction);
    },
};