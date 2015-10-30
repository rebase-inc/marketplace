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
        case ActionConstants.LOGOUT: return initialReview; break;
        default: return review; break;
    }
}
