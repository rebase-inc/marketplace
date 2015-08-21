var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/ActionConstants');
var AppDispatcher = require('../dispatcher/RebaseAppDispatcher');

var API_URL = '/api/v2';
var TIMEOUT = 10000;

//var _pendingRequests = {};

//function abortPendingRequests(key) {
    //if (_pendingRequests[key]) {
        //_pendingRequests[key]._callback = function(){};
        //_pendingRequests[key].abort();
        //_pendingRequests[key] = null;
    //}
//}

//function token() {
    //return UserStore.getState().token;
//}

function makeUrl(part) {
    return API_URL + part;
}

// return successful response, else return request Constants
function makeResponseFunc(responseHandler) {
    if (!responseHandler) { throw 'No response handler provided!' }
    return function (err, response) {
        if (err && err.timeout === TIMEOUT) {
            responseHandler(RequestConstants.TIMEOUT);
        } else if (response.status === 400) {
            responseHandler(RequestConstants.NOT_LOGGED_IN);
        } else if (!response.ok) {
            responseHandler(RequestConstants.ERROR);
        } else {
            responseHandler(response);
        }
    };
}

// a get request with an authtoken param
function get(url) {
    return request
        .get(url)
        .timeout(TIMEOUT)
        .query({authtoken: token()});
}

function fakeAuctionGet(responseHandler) {
    // simulate retrieving data from a database
    var availableAuctions = JSON.parse(localStorage.getItem('fakeAuctions'));
    var response = { status: 200, ok: true, data: availableAuctions }
    var error = {};
    setTimeout(function() { responseHandler(error, response); }, 800);
}

function fakeTicketGet(responseHandler) {
    // simulate retrieving data from a database
    var tickets = JSON.parse(localStorage.getItem('fakeTickets'));
    var response = { status: 200, ok: true, data: tickets }
    var error = {};
    setTimeout(function() { responseHandler(error, response); }, 800);
}

// This looks like an anti-DRY situation...Maybe the action creators
// could just call Api.getData(url, params, responseHandler, pendingHandling)
var Api = {
    getAuctionData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/auctions");
        var params = {};
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        fakeAuctionGet(responseFunction);
        //_pendingRequests[actionType] = get(url).end(
            //makeResponseFunc(actionType, params)
        //);
    },
    getTicketData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/tickets");
        var params = {};
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        fakeTicketGet(responseFunction);
        //_pendingRequests[actionType] = get(url).end(
            //makeResponseFunc(actionType, params)
        //);
    }
};


module.exports = Api;
