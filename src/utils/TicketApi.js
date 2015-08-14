var RebaseActions = require('../actions/RebaseActions');

module.exports = {
    // Load mock product data from localStorage into ProductStore via Action
    getTicketData: function() {
        // simulate retrieving data from a database
        var newTickets = JSON.parse(localStorage.getItem('newTickets'));
        RebaseActions.receiveNewTickets(newTickets);
    }

};
