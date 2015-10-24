import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialUser = { email: null, isFetching: false };

export default function user(user = initialUser, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, user, { isFetching: true }); break;
                case SUCCESS:
                    const { id, email, current_role, first_name, last_name, photo } = action.response.user;
                    // sanitize the user data towards the end of keeping a clean and relatively
                    // flat local store. There might be a nicer way to do this with es6+
                    const newUser = {
                        id: id,
                        email: email,
                        first_name: first_name,
                        last_name: last_name,
                        photo: photo,
                        current_role: { id: current_role.id },
                    }
                    return Object.assign({}, user, { isFetching: false}, newUser); break;
            }
        }
        default:
            return user;
    }
}
