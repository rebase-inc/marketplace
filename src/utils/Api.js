var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/ActionConstants');
var AppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var MockData = require('../MockData');

var API_URL = '/api/v2';
var TIMEOUT = 10000;

var _pendingRequests = {};

function abortPendingRequests(key) {
    if (_pendingRequests[key]) {
        _pendingRequests[key]._callback = function(){};
        _pendingRequests[key].abort();
        _pendingRequests[key] = null;
    }
}

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

function fakeAuctionPost(user, auction, text, responseHandler) {
    var auctionInd;
    for(var i=0; i<MockData._auctions.length; i++) {
        if (MockData._auctions[i].id == auction.id) { auctionInd = i };
    }
    var _months = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var newComment = {
        user: user,
        date: _months[today.getMonth()] + ' ' + today.getDate(),
        text: text,
    }
    MockData._auctions[auctionInd].ticket_set.bid_limits[0].ticket_snapshot.ticket.comments.push(newComment);
    MockData.saveToDisk();
    var auction = MockData._auctions[auctionInd];
    var response = { status: 200, ok: true, data: auction }
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
    commentOnAuction: function(user, auction, text, responseHandler, pendingHandler) {
        var url = makeUrl("/auctions");
        var params = {text: text};
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        fakeAuctionPost(user, auction, text, responseFunction);
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
