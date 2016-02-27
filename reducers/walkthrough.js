import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';
import { MANAGER_WALKTHROUGH, CONTRACTOR_WALKTHROUGH } from '../constants/WalkthroughConstants';

const initialWalkthrough = { steps: [], current: null };

export default function walkthrough(walkthrough = initialWalkthrough, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, walkthrough, action.response.user ? action.response.user.current_role : null); break;
        case ActionConstants.NEXT_WALKTHROUGH_STEP: return nextStep(action.status, walkthrough); break;
        case ActionConstants.PREVIOUS_WALKTHROUGH_STEP: return previousStep(action.status, walkthrough); break;
        case ActionConstants.EXIT_WALKTHROUGH: return exit(); break;
        default: return walkthrough;
    }
}

function nextStep(status, walkthrough) {
    switch (status) {
        case PENDING: return walkthrough; break;
        case ERROR: return walkthrough; break;
        case SUCCESS:
            return { current: Math.min(walkthrough.steps.length - 1, walkthrough.current + 1), steps: walkthrough.steps };
            break;
    }
}

function previousStep(status, walkthrough) {
    switch (status) {
        case PENDING: return walkthrough; break;
        case ERROR: return walkthrough; break;
        case SUCCESS:
            return { current: Math.max(0, walkthrough.current - 1), steps: walkthrough.steps };
            break;
    }
}

function exit() {
    return initialWalkthrough;
}


function handleNewRole(status, walkthrough, role) {
    switch (status) {
        case PENDING: return walkthrough; break;
        case ERROR: return walkthrough; break;
        case SUCCESS:
            if (role.walkthrough_completed) {
                return initialWalkthrough;
            } else {
                return Object.assign({ current: 0 }, { steps: role.type == 'contractor' ? CONTRACTOR_WALKTHROUGH : MANAGER_WALKTHROUGH });
            }
    }
}
