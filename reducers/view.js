import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';

export default function views(view = {}, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, view, { isFetching: true }); break;
                case SUCCESS:
                    let newView = {};
                    switch (action.response.user.current_role.type) {
                        case 'manager': newView.type = NEW; break;
                        case 'contractor': newView.type = OFFERED; break;
                    }
                    return Object.assign({}, view, { isFetching: false }, newView); break;
            }
        }
        default:
            return views;
    }
}
