import ActionConstants from '../constants/ActionConstants';

import { SUCCESS } from '../constants/RequestConstants';

export function clearNotification(viewType) {
    return {
        type: ActionConstants.CLEAR_NOTIFICATION,
        response: { },
        status: SUCCESS
    }
}

