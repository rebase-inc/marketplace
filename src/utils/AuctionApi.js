var RebaseActions = require('../actions/RebaseActions');

module.exports = {
    // Load mock product data from localStorage into ProductStore via Action
    getAvailableAuctions: function() {
        // simulate retrieving data from a database
        var availableAuctions = JSON.parse(localStorage.getItem('fakeAuctions'));
        setTimeout(function() { RebaseActions.receiveAvailableAuctions(availableAuctions);}, 800);
    }

};
