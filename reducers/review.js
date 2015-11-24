import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialReview = { id: null, isFetching: false };

export default function review(review = initialReview, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, review); break;
        case ActionConstants.SELECT_REVIEW: {
            switch (action.status) {
                case SUCCESS:
                    return { isFetching: false, id: action.response.reviewId }
            }
        }
        case ActionConstants.SELECT_VIEW: {
            switch (action.status) {
                case SUCCESS: return initialReview; break;
            }
        }
        case ActionConstants.LOGOUT: return initialReview; break;
        default: return review; break;
    }
}

function handleNewRole(requestStatus, oldReview) {
    switch (requestStatus) {
        case PENDING: return oldReview; break;
        case ERROR: return oldReview; break;
        case SUCCESS: return initialReview; break;
    }
}
