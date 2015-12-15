import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { COMPLETE } from '../constants/WorkStates';

let initialReviewID = null;

export default function reviewID(reviewID = initialReviewID, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return removeID(action.status, reviewID); break;
        case ActionConstants.SELECT_REVIEW: return setID(action.status, reviewID, action.response.reviewId); break;
        case ActionConstants.GET_REVIEWS: return handleNewReviews(action.status, reviewID, action.response.reviews); break;
        case ActionConstants.ACCEPT_WORK: return setID(action.status, reviewID, (action.response.work.review || {}).id); break;
        case ActionConstants.MEDIATION_WORK: return setID(action.status, reviewID, (action.response.work.review || {}).id); break;
        case ActionConstants.LOGOUT: return initialReviewID; break;
        default: return reviewID; break;
    }
}

function removeID(requestStatus, oldReviewID) {
    switch (requestStatus) {
        case PENDING: return oldReviewID; break;
        case ERROR: return oldReviewID; break;
        case SUCCESS: return initialReviewID; break;
    }
}

function setID(requestStatus, oldReviewID, reviewID) {
    switch (requestStatus) {
        case PENDING: return oldReviewID; break;
        case ERROR: return oldReviewID; break;
        case SUCCESS: return reviewID; break;
    }
}

function handleNewReviews(requestStatus, reviewID, reviews) {
    switch (requestStatus) {
        case PENDING: return reviewID; break;
        case ERROR: return reviewID; break;
        case SUCCESS:
            return reviews.find(r => r).id;
    }
}

