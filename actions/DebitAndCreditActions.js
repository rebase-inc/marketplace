import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';

export function getDebits() {
    return (dispatch, getState) => (!!getState().debits.isFetching) ? Promise.resolve() : dispatch(dispatchedRequest('GET', '/debits', ActionConstants.GET_DEBITS));
}

export function getCredits() {
    return (dispatch, getState) => (!!getState().credits.isFetching) ? Promise.resolve() : dispatch(dispatchedRequest('GET', '/credits', ActionConstants.GET_CREDITS));
}
