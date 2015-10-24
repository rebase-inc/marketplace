import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialUser = { email: null, isFetching: false };

export default function user(user = initialUser, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, user, { isFetching: true }); break;
                case SUCCESS:
                    // sanitize the user data for the purpose of keeping a clean and relatively flat local store
                    const { id, email, current_role, first_name, last_name, photo } = action.response.user;
                    const newUser = { id, email, first_name, last_name, photo, current_role: {id: current_role.id} };
                    return Object.assign({}, user, { isFetching: false}, newUser); break;
            }
        }
        default:
            return user;
    }
}
