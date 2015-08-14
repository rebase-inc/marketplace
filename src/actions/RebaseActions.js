var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var ActionConstants = require('../constants/ActionConstants');

module.exports = {
    receiveNewTickets: function(newTickets) {
        RebaseAppDispatcher.handleAction({
            type: ActionConstants.RECEIVE_DATA,
            data: newTickets
        });
    },
    commentOnIssue: function(user, ticket, text) {
        RebaseAppDispatcher.handleAction({
            type: ActionConstants.NEW_COMMENT,
            user: user,
            ticket: ticket,
            text: text
        });
    }
};
