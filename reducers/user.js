import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, UNAUTHORIZED, ERROR } from '../constants/RequestConstants';

let initialUser = { email: null, isFetching: false, error: null };

export default function user(user = initialUser, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: return handleNewUserData(action.status, user, action.response.user); break;
        case ActionConstants.UPDATE_PROFILE: return handleNewUserData(action.status, user, action.response.user); break;
        case ActionConstants.SELECT_ROLE: return handleNewUserData(action.status, user, action.response.user); break;
        case ActionConstants.LOGOUT: return initialUser; break; // we should probably handle pending and success cases
        default: return user; break;
    }
}

function handleNewUserData(requestStatus, oldUser, newUser) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldUser, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldUser, { isFetching: false }); break;
        case UNAUTHORIZED: return Object.assign({}, oldUser, { error: 'Invalid credentials' }); break;
        case SUCCESS:
            const { id, email, current_role, first_name, last_name, photo } = newUser;
            const newUserData = { id, email, first_name, last_name, photo, current_role: {id: current_role.id} };
            return Object.assign({}, oldUser, { isFetching: false}, newUserData);
            break;
    }
}
