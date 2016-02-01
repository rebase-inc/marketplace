import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';
import { MANAGER_WALKTHROUGH, CONTRACTOR_WALKTHROUGH } from '../constants/WalkthroughConstants';

const initialWalkthrough = { steps: [], current: null };

export default function walkthrough(walkthrough = initialWalkthrough, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, walkthrough, action.response.user ? action.response.user.current_role : null); break;
        default: return walkthrough;
    }
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
