import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';

export default function view(view = { isFetching: false, type: OFFERED }, action) {
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
                    return Object.assign({}, view, { isFetching: false }, newView);
                    break;
            }
        }
        case ActionConstants.SELECT_VIEW: {
            switch (action.status) {
                case PENDING: return Object.assign({}, view, { isFetching: true }); break;
                case SUCCESS:
                    if (![NEW, OFFERED, IN_PROGRESS, COMPLETED].includes(action.response.viewType)) {
                        console.warn('Invalid view type: ', action.response.viewType);
                        return view;
                    }
                    return Object.assign({}, view, { isFetching: false }, { type: action.response.viewType });
                    break;
            }
        }
        default:
            return view;
    }
}
