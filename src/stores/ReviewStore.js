var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var ViewConstants = require('../constants/ViewConstants');
var _ = require('underscore');

//Define initial data points
var _allReviews = [];
var _currentReview = null;
var _loadingReviewData = false;

var ReviewStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allReviews: _allReviews,
            currentReview: _currentReview,
            loadingReviewData: _loadingReviewData,
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
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.SELECT_VIEW: _currentReview = null; break;
        case ActionConstants.GET_REVIEW_DATA:
            switch(action.response) {
                case RequestConstants.PENDING:
                    _loadingReviewData = true;
                    break;
                default:
                    _allReviews = action.response.reviews;
                    _loadingReviewData = false;
                    break;
            } break;
        case ActionConstants.SELECT_REVIEW:
            if (!action.reviewID) { _currentReview = null; }
            else {
                var found = false;
                for(var i=0; i<_allReviews.length; i++) {
                    if (_allReviews[i].id == action.reviewID) { _currentReview = _allReviews[i]; found=true; };
                }
                if (!found) { console.warn('Unknown or invalid review ID provided to select review action! : ', action.reviewID); }
            }
            break;
        case ActionConstants.ADD_COMMENT_TO_REVIEW:
            switch(action.response) {
                case RequestConstants.PENDING: break;
                default: persistModifiedReview(action.response.data); break;
            } break;
        case ActionConstants.GET_COMMENT_DETAIL:
            switch(action.response) {
                case RequestConstants.PENDING: break;
                default: persistCommentDetail(action.response); break;
            } break;
        default: return true;
    }

    // If action was responded to, emit change event
    ReviewStore.emitChange();
    return true;
});

function persistCommentDetail(data) {
    //data.comment.user = { first_name: 'Andrew', last_name: 'Millspaugh', photo: 'img/andrew.jpg' }; // hack because the api is missing data
    for(var i=0; i<_allReviews.length; i++) {
        var comments = _allReviews[i].work.offer.ticket_snapshot.ticket;
        for ( var j=0; j < comments.length; j++) {
            if (comments[j].id == data.comment.id) { _allReviews[i].work.offer.ticket_snapshot.ticket = data.comment; }
        }
    }
}

function persistModifiedReview(review) {
    for(var i=0; i<_allReviews.length; i++) {
        if (_allReviews[i].id == review.id) {
            _allReviews[i] = _.extend({}, review);
            if (_currentReview.id == review.id) { _currentReview = review }
        };
    }
}

module.exports = ReviewStore;
