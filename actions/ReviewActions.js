import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';

export function getReviews() {
    return dispatchedRequest('GET', '/reviews', ActionConstants.GET_REVIEWS);
}

export function selectReview(reviewId) {
    return {
        type: ActionConstants.SELECT_REVIEW,
        response: { reviewId: reviewId },
        status: SUCCESS
    }
}

