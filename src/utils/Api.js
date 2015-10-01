var ActionConstants = require('../constants/ActionConstants');
var AuctionStore = require('../stores/AuctionStore');
var RequestConstants = require('../constants/RequestConstants');
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

function makeUrl(part) {
    return API_URL + part;
}

function ajax(method, url, data, responseHandler) {
    return $.ajax({
        type: method || 'GET',
        xhrFields: { withCredentials: true },
        url: url,
        data: JSON.stringify(data || undefined),
        contentType: 'application/json; charset=utf-8',
    }).done(jqXHR => responseHandler(jqXHR, RequestConstants.SUCCESS))
        .fail(function(jqXHR, textStatus, errorThrown) {
            switch (textStatus) {
                case 'timeout': responseHandler(jqXHR, RequestConstants.TIMEOUT); break;
                case 'error':   responseHandler(jqXHR, RequestConstants.ERROR); break;
                default:        responseHandler(jqXHR, RequestConstants.ERROR); break;
            }
        });
}

function fileUpload(url, formAttr, file, responseHandler) {
    var data = new FormData();
    data.append(formAttr, file);
    $.ajax({
        type: 'POST',
        xhrFields: { withCredentials: true },
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
    }).done(responseHandler).fail(function(jqXHR, textStatus, errorThrown) {
        switch (textStatus) {
            case 'timeout': responseHandler(jqXHR, RequestConstants.TIMEOUT); break;
            default:        responseHandler(jqXHR, RequestConstants.ERROR); break;
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
    logout: function(responseHandler, pendingHandler) {
        var url = makeUrl('/auth');
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    authenticateGithub: function(responseHandler, pendingHandler) {
        var url = makeUrl('/github/');
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getTalentData: function(auction, responseHandler, pendingHandler) {
        var url = makeUrl("/nominations");
        var params = {};
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getContractData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/contracts");
        var params = {};
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getReviewData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/reviews");
        var params = {};
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getAuctionData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/auctions");
        var params = {};
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getAuctionDetail: function(id, responseHandler, pendingHandler) {
        var url = makeUrl("/auctions/" + id);
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
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getCommentDetail: function(comment, responseHandler, pendingHandler) {
        var url = makeUrl("/comments/" + comment.id);
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getUserDetail: function(userID, responseHandler, pendingHandler) {
        var url = makeUrl("/users/" + userID);
        pendingHandler();
        ajax('GET', url, null, responseHandler);
    },
    getRepoData: function(responseHandler, pendingHandler) {
        var url = makeUrl("/github/user/repos");
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
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, data, responseHandler);
    },
    submitWork: function(user, contract, reason, responseHandler, pendingHandler) {
        var url = makeUrl('/works/' + contract.bid.work_offers[0].work.id + '/review');
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, { reason: reason }, responseHandler)
    },
    disputeWork: function(user, work, reason, responseHandler, pendingHandler) {
        var url = makeUrl('/works/' + work.id + '/mediate');
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, { reason: reason }, responseHandler)
    },
    markWorkComplete: function(user, work, comment, responseHandler, pendingHandler) {
        var url = makeUrl('/works/' + work.id + '/complete');
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, { comment: comment }, responseHandler)
    },
    markWorkBlocked: function(user, work, reason, responseHandler, pendingHandler) {
        var url = makeUrl('/works/' + work.id + '/halt');
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, { reason: reason }, responseHandler)
    },
    markWorkUnblocked: function(user, work, reason, responseHandler, pendingHandler) {
        var url = makeUrl('/works/' + work.id + '/resume');
        if (pendingHandler) { pendingHandler(); }
        ajax('POST', url, { reason: reason }, responseHandler)
    },
    markMediationFailed: function(role, mediation, responseHandler, pendingHandler) {
        var event_url = role.type == 'manager' ? '/client_answer_events' : '/dev_answer_events';
        var url = makeUrl('/mediation/' + mediation.id + event_url);
        if (pendingHandler) { pendingHandler(); }
        var data = role.type == 'manager' ? {'client_answer' : 'fail'} : {'dev_answer' : 'fail'};
        ajax('POST', url, data, responseHandler)
    },
    createAuction: function(ticket, max_price, responseHandler, pendingHandler) {
        var url = makeUrl('/auctions');
        pendingHandler();
        var data = {
            ticket_set: {
                bid_limits: [{ ticket_snapshot: { ticket: { id: ticket.id } }, price: max_price }]
            },
            term_sheet: { legalese: 'You must do this' },
            organization: ticket.project.organization,
        }
        ajax('POST', url, data, responseHandler);
    },
    approveNomination: function(nomination, responseHandler, pendingHandler) {
        var url = makeUrl('/nominations/' + nomination.contractor.id + '/' + nomination.ticket_set.id);
        if (pendingHandler) { pendingHandler(); }
        ajax('PUT', url, { auction: nomination.ticket_set.auction }, responseHandler)
    },
    updateProfilePhoto: function(file, responseHandler, pendingHandler) {
        var url = makeUrl('/uploads');
        if (pendingHandler) { pendingHandler(); }
        fileUpload(url, 'photo', file, responseHandler)
    },
    updateUserSettings: function(user, responseHandler, pendingHandler) {
        var url = makeUrl('/users/' + user.id);
        if (pendingHandler) { pendingHandler(); }
        ajax('PUT', url, user, responseHandler);
    },
};


module.exports = Api;
