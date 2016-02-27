import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';

export function nextStep() {
    return {
        type: ActionConstants.NEXT_WALKTHROUGH_STEP,
        response: null,
        status: SUCCESS
    }
}

export function previousStep() {
    return {
        type: ActionConstants.PREVIOUS_WALKTHROUGH_STEP,
        response: null,
        status: SUCCESS
    }
}


export function exit(role_id) {
    const data = { walkthrough_completed: true };
    const url = '/roles/' + role_id;
    return dispatchedRequest('PUT', url, ActionConstants.EXIT_WALKTHROUGH, data);
}
