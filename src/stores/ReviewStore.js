var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var ViewConstants = require('../constants/ViewConstants');
var _ = require('underscore');

//Define initial data points
var _allReviews = [];
var _currentReview = null;
var _loading = false;

function clearStore() {
    _allReviews = [];
    _currentReview = null;
}

var _shouldBeVisible = function(review) {
    return review.work.state == 'complete'; // hack because the api is creating unnecessary reviews
}

var ReviewStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allReviews: _allReviews.filter(_shouldBeVisible),
            currentReview: _currentReview,
            loading: _loading,
        };
    },
    select: function(review) {
        if (!review) { _currentReview = null; return; }
        for(var i=0; i<_allReviews.length; i++) {
            if (_allReviews[i].id == review.id) { _currentReview = _allReviews[i]; };
        }
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
RebaseAppDispatcher.register(function(payload) {
    console.log('review store responding to action: ', payload.action.type);
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.SELECT_VIEW: _currentReview = null; break;
        case ActionConstants.GET_REVIEW_DATA: handleNewReviewData(action); break;
        case ActionConstants.SELECT_REVIEW: handleSelectedReview(action.reviewID); break;
        case ActionConstants.ADD_COMMENT_TO_TICKET: handleNewComment(action); break;
        case ActionConstants.GET_COMMENT_DETAIL: handleCommentDetail(action); break;
        case ActionConstants.LOGOUT: clearStore(); break;
        default: return true;
    }

    // If action was responded to, emit change event
    ReviewStore.emitChange();
    return true;
});

function handleNewReviewData(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Undefined data!');
        default:
            _loading = false;
            _allReviews = action.response.reviews;
            _allReviews.forEach(review => addSyntheticProperties(review));
    }
}

function addSyntheticProperties(review) {
    Object.defineProperty(review, 'ticket', {
        get: function() { return review.work.offer.ticket_snapshot.ticket; },
        set: function(ticket) { review.work.offer.ticket_snapshot.ticket = ticket; },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    return review;
}

function handleSelectedReview(id) {
    _currentReview = _allReviews.filter(review => review.id == id)[0];
}

function handleNewComment(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allReviews.forEach(review => { if (review.ticket.id == data.comment.ticket.id) { review.ticket.comments.push(data.comment) } });
            break;
    }
}

function handleCommentDetail(action) {
    switch (action.status) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(action.response); break;
        case RequestConstants.ERROR: _loading = false; console.warn(action.response); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            var detailed_comment = action.response.comment
            _allReviews.forEach(review => review.ticket.comments.forEach(comment => { comment = comment.id == detailed_comment.id ? detailed_comment : comment }));
            break;
    }
}

module.exports = ReviewStore;
