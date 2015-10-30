import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialReviews = { items: [], isFetching: false };

export default function reviews(reviews = initialReviews, action) {
    switch (action.type) {
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
            return reviews;
            return handleCommentOnReview(action.status, reviews, action.response.comment || action.response);
            break;
        }
        case ActionConstants.LOGOUT: return initialReviews; break;
        default: return reviews; break;
    }
}

function handleCommentOnReview(requestStatus, reviews, comment) {
    throw 'not yet implemented';
    const oldReviews = Array.from(reviews.items.values());
    let modifiedReview = oldReviews.find(t => t.id == comment.ticket.id);
    switch (requestStatus) {
        case PENDING: modifiedReview = Object.assign({}, modifiedReview, {isFetching: true}); break;
        case ERROR: modifiedReview = Object.assign({}, modifiedReview, {isFetching: false}); break;
        case SUCCESS:
            modifiedReview.comments.push(comment);
            modifiedReview = Object.assign({}, modifiedReview, {isFetching: false});
        break;
    }
    const newReviews = oldReviews.map(t => t.id == modifiedReview.id ? modifiedReview : t);
    return { isFetching: false, items: new Map(newReviews.map(t => [t.id, t])) }
}

function addSyntheticProperties(review) {
    Object.defineProperty(review, 'ticket', {
        get: function() { return review.work.offer.ticket_snapshot.ticket; },
        set: function(ticket) { review.work.offer.ticket_snapshot.ticket = ticket; },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    return review;
}
