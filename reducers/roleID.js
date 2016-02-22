import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR, UNAUTHORIZED } from '../constants/RequestConstants';

let initialRoleID = null;

export default function roleID(roleID = initialRoleID, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return setID(action.status, roleID, action.response.user ? action.response.user.current_role.id : null); break;
        case ActionConstants.IMPORT_GITHUB_REPOS: return setID(action.status, roleID, action.response.roles ? action.response.roles[0].id : null); break;
        case ActionConstants.LOGOUT: return initialRoleID; break;
        default: return roleID; break;
    }
}

function setID(status, roleID, newRoleID) {
    switch (status) {
        case PENDING: return roleID; break;
        case ERROR: return roleID; break;
        case UNAUTHORIZED: return roleID; break;
        case SUCCESS: return newRoleID; break;
    }
}
