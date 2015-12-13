import Immutable from 'immutable';

import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { COMPLETE } from '../constants/WorkStates';
import { getReviewTicket } from '../utils/getters';

const initialReviews = new Immutable.Record({ items: Immutable.OrderedMap(), isFetching: false })();

export default function reviews(reviews = initialReviews, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, reviews); break;
        case ActionConstants.GET_REVIEWS: return handleNewReviews(action.status, reviews, action.response.reviews); break;
        case ActionConstants.COMMENT_ON_REVIEW: return handleCommentOnReview(action.status, reviews, action.response.comment || action.response);
        case ActionConstants.ACCEPT_WORK: return makeNewReviewFromWork(action.status, reviews, action.response.work); break;
        case ActionConstants.MEDIATION_ANSWER: return makeNewReviewFromWork(action.status, reviews, action.response.work); break;
        case ActionConstants.LOGOUT: return initialReviews; break;
        default: return reviews; break;
    }
}

function handleNewReviews(requestStatus, reviews, newReviews) {
    switch (requestStatus) {
        case PENDING: return reviews.set('isFetching', true); break;
        case ERROR: return reviews.set('isFetching', false); break;
        case SUCCESS: return reviews.mergeDeep({ isFetching: false, items: newReviews.map(r => [r.id, r]) }); break;
    }
}

function makeNewReviewFromWork(requestStatus, reviews, work) {
    switch (requestStatus) {
        case PENDING: return reviews.set('isFetching', true); break;
        case ERROR: return reviews.set('isFetching', false); break;
        case SUCCESS:
            const review = Immutable.Map(work.review);
            const work = Immutable.Map(work).delete('review');
            return reviews.mergeIn(['items', review.get('id')], review).mergeIn(['items', review.get('id'), 'work'], work).set('isFetching', false);
    }
}


function handleCommentOnReview(requestStatus, reviews, comment) {
    // "auction" comments really go on the ticket...but that probably should be changed
    const reviewId = reviews.get('items').findKey(r => getReviewTicket(r.toJS()).id == comment.ticket.id);
    const commentKeyPath = ['items', reviewId, 'work', 'offer', 'ticket_snapshot', 'ticket', 'comments'];
    // we have no way of knowing the comment id yet, so we look it up by content. This sucks, I know...
    const commentIndex = reviews.getIn(commentKeyPath).findIndex(c => c.content == comment.content);
    switch (requestStatus) {
        case PENDING:
            comment = Immutable.Map(comment).set('isFetching', true);
            return reviews.updateIn(commentKeyPath, comments => comments.push(comment));
        case ERROR: return reviews.deleteIn(commentKeyPath.concat(commentIndex));
        case SUCCESS: return reviews.mergeIn(commentKeyPath.concat(commentIndex), comment, { isFetching: false });
    }
}

function handleNewRole(requestStatus, reviews) {
    switch (requestStatus) {
        case PENDING: return reviews.set('isFetching', true);
        case ERROR: return reviews.set('isFetching', false);
        case SUCCESS: return reviews;
    }
}
