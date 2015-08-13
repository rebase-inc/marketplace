var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var RebaseConstants = require('../constants/RebaseConstants');

module.exports = {
    receiveNewTickets: function(newTickets) {
        RebaseAppDispatcher.handleAction({
            type: RebaseConstants.RECEIVE_DATA,
            data: newTickets
        });
    },
    commentOnIssue: function(ticketId, text) {
        RebaseAppDispatcher.handleAction({
            type: RebaseConstants.NEW_COMMENT,
            ticketId: ticketId,
            text: text
        });
    }
};
