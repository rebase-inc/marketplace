import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialReviews = { items: [], isFetching: false };

export default function reviews(reviews = initialReviews, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, reviews, action.response.user); break;
        case ActionConstants.GET_REVIEWS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, reviews, { isFetching: true }); break;
                case SUCCESS:
                    const newReviews = new Map(action.response.reviews.map(r => [r.id, addSyntheticProperties(r)]));
                    return { isFetching: false, items: newReviews };
            }
        }
        case ActionConstants.COMMENT_ON_REVIEW: {
            // on pending, the comment is not nested in a comment object, but it is on response (success)
            // hence the weird or statement for the last argument in the below function
            return handleCommentOnReview(action.status, reviews, action.response.comment || action.response);
            break;
        }
        case ActionConstants.LOGOUT: return initialReviews; break;
        default: return reviews; break;
    }
}

function handleCommentOnReview(requestStatus, reviews, comment) {
    const oldReviews = Array.from(reviews.items.values());
    let modifiedReview = oldReviews.find(r => r.work.offer.ticket_snapshot.ticket.id == comment.ticket.id);
    switch (requestStatus) {
        case PENDING: modifiedReview = Object.assign({}, modifiedReview, {isFetching: true}); break;
        case ERROR: modifiedReview = Object.assign({}, modifiedReview, {isFetching: false}); break;
        case SUCCESS:
            modifiedReview = addSyntheticProperties(Object.assign({}, modifiedReview, {isFetching: false}));
            modifiedReview.ticket.comments.push(comment);
        break;
    }
    const newReviews = oldReviews.map(r => r.id == modifiedReview.id ? modifiedReview : r);
    return { isFetching: false, items: new Map(newReviews.map(r => [r.id, addSyntheticProperties(r)])) }
}

function handleNewRole(requestStatus, oldReviews, user) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldReviews, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldReviews, { isFetching: false }); break;
        case SUCCESS: return initialReviews; break;
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
