var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    getTicketData: function() {
        var pendingAction = function() {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TICKET_DATA,
                status: RequestConstants.PENDING,
            });
        };
        var responseAction = function(response, status) {
            Dispatcher.handleRequestAction({
                type: ActionConstants.GET_TICKET_DATA,
                status: status,
                response: response
            });
        };
        Api.getTicketData(responseAction, pendingAction);
    },
    selectTicket: function(ticketID) {
        !ticketID ? console.warn('No ticket ID provided!') : null;
        Dispatcher.handleRequestAction({
            type: ActionConstants.SELECT_TICKET,
            ticketID: ticketID,
        });
    },
};
