var ActionConstants = require('../constants/ActionConstants');
var AuctionStore = require('../stores/AuctionStore');
var RequestConstants = require('../constants/ActionConstants');
var AppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var MockData = require('../MockData');
var _ = require('underscore');

var API_URL = 'http://localhost:5000';
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
        } else if (response.status === 401) {
            responseHandler(RequestConstants.NOT_LOGGED_IN);
        } else if (!response.ok) {
            responseHandler(RequestConstants.ERROR);
        } else {
            responseHandler(response);
        }
    };
}

function ajax(method, url, data, responseHandler) {
    $.ajax({
        type: method || 'GET',
        xhrFields: { withCredentials: true },
        url: url,
        data: JSON.stringify(data) || '',
        contentType: 'application/json; charset=utf-8',
    }).done(responseHandler).fail(function(requestObj, textStatus) {
            console.log('we failed with this info: ', requestObj, textStatus);
            switch (textStatus) {
                case 'error': responseHandler(RequestConstants.ERROR); break;
                case 'timeout' : responseHandler(RequestConstants.TIMEOUT); break;
                default: responseHandler(RequestConstants.ERROR); break
            }
        });
}

// This looks like an anti-DRY situation...Maybe the action creators
// could just call Api.getData(url, params, responseHandler, pendingHandling)
var Api = {
    login: function(email, password, responseHandler, pendingHandler) {
        var url = makeUrl('/auth');
        var data = { user: { email: email }, password: password, };
        pendingHandler();
        ajax('POST', url, data, responseHandler);
    },
    getContractData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/contracts");
        var params = {};
        var responseFunction = makeResponseFunc(responseHandler);
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getReviewData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/reviews");
        var params = {};
        var responseFunction = makeResponseFunc(responseHandler);
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getAuctionData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/auctions");
        var params = {};
        var responseFunction = makeResponseFunc(responseHandler);
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    commentOnTicket: function(user, ticket, text, responseHandler, pendingHandler) {
        var url = makeUrl("/comments");
        var data = {ticket: ticket, content: text};
        pendingHandler();
        ajax('POST', url, data, responseHandler);
    },
    getTicketData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/tickets");
        var params = {};
        var responseFunction = makeResponseFunc(responseHandler);
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getCommentDetail: function(comment, responseHandler, pendingHandler) {
        var url = makeUrl("/comments/" + comment.id);
        var responseFunction = makeResponseFunc(responseHandler);
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getUserDetail: function(userID, responseHandler, pendingHandler) {
        var url = makeUrl("/users/" + userID);
        var responseFunction = makeResponseFunc(responseHandler);
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    bidOnAuction: function(user, auction, price, responseHandler, pendingHandler) {
        var url = makeUrl("/auctions/" + auction.id + '/bid_events');
        var data = {
            bid: {
                work_offers: [{
                    price: price,
                    ticket_snapshot: { id: auction.ticket_set.bid_limits[0].ticket_snapshot.id },
                    contractor: { id: user.roles.filter(r => r.type == 'contractor')[0].id },
                }],
                contractor: { id: user.roles.filter(r => r.type == 'contractor')[0].id },
                auction: { id: auction.id },
            }
        };
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, data, responseHandler);
    },
    markContractComplete: function(user, contract, reason, responseHandler, pendingHandler) {
        var url = makeUrl('/work/' + contract.bid.work_offers[0].work.id + '/review_events');
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, null, responseHandler)
    },
    markContractBlocked: function(user, contract, reason, responseHandler, pendingHandler) {
        var url = makeUrl('/work/' + contract.bid.work_offers[0].work.id + '/halt_events');
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, { reason: reason }, responseHandler)
    },
    markContractUnblocked: function(user, contract, reason, responseHandler, pendingHandler) {
        var url = makeUrl('/work/' + contract.bid.work_offers[0].work.id + '/resume_events');
        var responseFunction = makeResponseFunc(responseHandler);
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, { reason: reason }, responseHandler)
    },
};


module.exports = Api;
