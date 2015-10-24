var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Api = require('../utils/Api');

module.exports = {
    createInternalTicket: function(project, title) {
        let actionType = ActionConstants.CREATE_INTERNAL_TICKET;
        let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        let pendingAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        Api.createInternalTicket(project, title, responseAction, pendingAction);
    },
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
