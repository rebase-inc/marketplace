import ActionConstants from '../constants/ActionConstants';

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

export function exit() {
    return {
        type: ActionConstants.EXIT_WALKTHROUGH,
        response: null,
        status: SUCCESS
    }
}
