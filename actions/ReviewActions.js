import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';

export function getReviews() {
    return (dispatch, getState) => (!!getState().reviews.isFetching) ? Promise.resolve() : dispatch(dispatchedRequest('GET', '/reviews', ActionConstants.GET_REVIEWS));
}

export function selectReview(reviewId) {
    return {
        type: ActionConstants.SELECT_REVIEW,
        response: { reviewId: reviewId },
        status: SUCCESS
    }
}


// this is intentionally duplicated because as far as react is concerned it is a different
// action than commenting on a ticket, contract, review, etc.
export function commentOnReview(user, review, text) {
    const data = {
        user: { id: user.id }, // We need this for now, until the api is fixed
        ticket: {id: review.ticket.id},
        content: text
    };
    return dispatchedRequest('POST', '/comments', ActionConstants.COMMENT_ON_REVIEW, data);
}
