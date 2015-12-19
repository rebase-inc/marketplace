import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR, UNAUTHORIZED } from '../constants/RequestConstants';

let initialRoleID = null;

export default function roleID(roleID = initialRoleID, action) {
    switch (action.type) {
        case ActionConstants.SELECT_ROLE: return setID(action.status, roleID, action.response.user); break;
        default: return roleID; break;
    }
}
function setID(status, roleID, user) {
    switch (status) {
        case PENDING: return roleID; break; 
        case ERROR: return roleID; break; 
        case UNAUTHORIZED: return roleID; break; 
        case SUCCESS: return user.current_role.id; break;
    }
}
