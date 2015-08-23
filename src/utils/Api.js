var ActionConstants = require('../constants/ActionConstants');
var AuctionStore = require('../stores/AuctionStore');
var RequestConstants = require('../constants/ActionConstants');
var AppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var MockData = require('../MockData');
var _ = require('underscore');

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

function fakeAuctionPost(user, ticket, text, responseHandler) {
    // temp hack
    var auction = ticket.ticket_snapshots[0].bid_limit.ticket_set.auction;

    var ticketInd;
    for(var i=0; i<MockData._tickets.length; i++) {
        if (MockData._tickets[i].id == ticket.id) { ticketInd = i };
    }
    var _months = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var newComment = {
        user: user,
        date: _months[today.getMonth()] + ' ' + today.getDate(),
        text: text,
    }
    MockData._tickets = JSON.parse(JSON.stringify(MockData._tickets));
    MockData._tickets[ticketInd].ticket_snapshots[0].bid_limit.ticket_set.auction.comments.push(newComment);
    var auction = JSON.parse(JSON.stringify(MockData._tickets[ticketInd].ticket_snapshots[0].bid_limit.ticket_set.auction));
    var response = { status: 200, ok: true, data: auction }
    var error = {};
    setTimeout(function() { responseHandler(error, response); }, 800);
}

function fakeTicketPost(user, ticket, text, responseHandler) {
    var ticketInd;
    for(var i=0; i<MockData._tickets.length; i++) {
        if (MockData._tickets[i].id == ticket.id) { ticketInd = i };
    }
    var _months = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var newComment = {
        user: user,
        date: _months[today.getMonth()] + ' ' + today.getDate(),
        text: text,
    }
    MockData._tickets = JSON.parse(JSON.stringify(MockData._tickets));
    MockData._tickets[ticketInd].comments.push(newComment);
    var ticket = _.extend({}, MockData._tickets[ticketInd]);
    var response = { status: 200, ok: true, data: ticket }
    var error = {};
    setTimeout(function() { responseHandler(error, response); }, 800);
}

var _failedOneAuction = false;
function fakeAuctionBid(user, ticket, price, responseHandler) {
    // temp hack
    var auction = ticket.ticket_snapshots[0].bid_limit.ticket_set.auction;

    var ticketInd;
    for(var i=0; i<MockData._tickets.length; i++) {
        if (MockData._tickets[i].id == ticket.id) { ticketInd = i };
    }
    var auction = JSON.parse(JSON.stringify(auction));
    auction.bids = [];
    auction.bids.push({});
    auction.bids[0].price = price;
    var response;
    var error;

    // hack to make the user see what a failed auction looks like
    if (!_failedOneAuction) {
        _failedOneAuction = true;
        var tickets = JSON.parse(JSON.stringify(MockData._tickets));
        var removed = tickets.splice(ticketInd, 1);
        MockData._tickets = tickets;
        auction.state = 'waiting_for_bids';
        response = { status: 201, ok: true, data: auction };
        error = {};
    } else {
        auction.state = 'closed';
        response = { status: 201, ok: true, data: auction }
        error = {};
    }
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
        var url = makeUrl("/auctions/" + auction.id);
        var params = {text: text};
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        fakeAuctionPost(user, auction, text, responseFunction);
        //_pendingRequests[actionType] = get(url).end(
            //makeResponseFunc(actionType, params)
        //);
    },
    commentOnTicket: function(user, ticket, text, responseHandler, pendingHandler) {
        var url = makeUrl("/tickets" + ticket.id);
        var params = {text: text};
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        fakeTicketPost(user, ticket, text, responseFunction);
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
    },
    bidOnAuction: function(user, auction, price, responseHandler, pendingHandler) {
        var url = makeUrl("/auction/");
        var params = {};
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        fakeAuctionBid(user, auction, price, responseFunction);
        //_pendingRequests[actionType] = get(url).end(
            //makeResponseFunc(actionType, params)
        //);
    }
};


module.exports = Api;
