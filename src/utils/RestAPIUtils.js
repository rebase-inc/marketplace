module.exports = {

    getAllMessages: function() {
        // simulate retrieving data from a database
        var newTickets = JSON.parse(localStorage.getItem('newTickets'));

        // simulate success callback
        RestAPIActionCreators.receiveAllNewTickets(rawMessages);
    }
};
