import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialReview = { id: null, isFetching: false };

export default function review(review = initialReview, action) {
    switch (action.type) {
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
        case ActionConstants.ACCEPT_WORK: {
            switch (action.status) {
                case PENDING: return Object.assign({}, review, { isFetching: true }); break;
                case ERROR: return Object.assign({}, review, { isFetching: false }); break;
                case SUCCESS: return { isFetching: false, id: action.response.work.review.id }; break;
            }
        }
        case ActionConstants.LOGOUT: return initialReview; break;
        default: return review; break;
    }
}
