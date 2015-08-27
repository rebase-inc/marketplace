var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getTicketData: function() {
        var pendingAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TICKET_DATA,
                response: RequestConstants.PENDING,
            });
        };
        var responseAction = function(response) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TICKET_DATA,
                response: response
            });
        };
        Api.getTicketData(responseAction, pendingAction);
    },
};
