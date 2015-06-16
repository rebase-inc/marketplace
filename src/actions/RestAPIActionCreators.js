var AlveareAppDispatcher = require('../dispatcher/AlveareAppDispatcher');
var AlveareConstants = require('../constants/AlveareConstants');

module.exports = {
    receiveAllNewTickets: function(newTickets) {
        ChatAppDispatcher.dispatch({
            type: ActionTypes.RECEIVE_NEW_TICKETS,
            newTickets: newTickets
        });
    }
};
