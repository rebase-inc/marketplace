import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, UNAUTHORIZED, ERROR } from '../constants/RequestConstants';

let initialUser = { email: null, isFetching: false, error: null };

export default function user(user = initialUser, action) {
    switch (action.type) {
        case ActionConstants.LOGIN:
        case ActionConstants.C2R_LOGIN:
        case ActionConstants.UPDATE_PROFILE:
        case ActionConstants.UPLOAD_PHOTO:
        case ActionConstants.SELECT_ROLE: {
            return handleNewUserData(action.status, user, action.response.user);
        }
        case ActionConstants.ADD_SSH_KEY: return handleNewSSHKey(action.status, user, action.response.ssh_key); break;
        case ActionConstants.LOGOUT: return initialUser; break; // we should probably handle pending and success cases
        default: return user; break;
    }
}

function handleNewUserData(requestStatus, oldUser, newUser) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldUser, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldUser, { isFetching: false, error: true }); break;
        case UNAUTHORIZED: return Object.assign({}, oldUser, { isFetching: false, error: 'Invalid credentials' }); break;
        case SUCCESS:
            const { id, email, current_role, name, photo, ssh_public_keys, github_accounts } = newUser;
            const newUserData = { id, email, name, photo, ssh_public_keys, current_role, github_accounts };
            return Object.assign({}, oldUser, { isFetching: false}, newUserData);
            break;
    }
}

function handleNewSSHKey(requestStatus, user, ssh_key) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, user, { isFetching: true }); break;
        case ERROR: return Object.assign({}, user, { isFetching: false }); break;
        case UNAUTHORIZED: return Object.assign({}, user, { error: 'Invalid credentials' }); break;
        case SUCCESS:
            const newKeys = user.ssh_public_keys.map(k => Object.assign({}, k));
            newKeys.push(ssh_key);
            return Object.assign({}, user, { ssh_public_keys: newKeys });
            break;
    }
}
