var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var RebaseConstants = require('../constants/RebaseConstants');

module.exports = {
    receiveAllNewTickets: function(newTickets) {
        ChatAppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_NEW_TICKETS,
            newTickets: newTickets
        });
    }
};
