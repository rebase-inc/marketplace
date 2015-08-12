var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var RebaseConstants = require('../constants/RebaseConstants');

module.exports = {
    receiveNewTickets: function(newTickets) {
        RebaseAppDispatcher.handleAction({
            type: RebaseConstants.RECEIVE_DATA,
            newTickets: newTickets
        });
    },
    commentOnIssue: function(commentText) {
        RebaseAppDispatcher.handleAction({
            type: RebaseConstants.NEW_COMMENT,
            commentText: commentText
        });
    }
};
