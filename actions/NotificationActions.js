import ActionConstants from '../constants/ActionConstants';

import { SUCCESS } from '../constants/RequestConstants';

export function clearNotification() {
    return {
        type: ActionConstants.CLEAR_NOTIFICATION,
        response: { },
        status: SUCCESS
    }
}

// This should only be used if the thing that is happening
// does not have an underlying action.
export function makeNotification(text) {
    return {
        type: ActionConstants.MAKE_NOTIFICATION,
        response: { text },
        status: SUCCESS
    }
}
