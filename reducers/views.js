import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';

let ManagerViews = new Map([
    { name: 'New', icon: 'img/new-24px.svg', type: NEW },
    { name: 'Waiting', icon: 'img/waiting-24px.svg', type: OFFERED },
    { name: 'In Progress', icon: 'img/in-progress-24px.svg', type: IN_PROGRESS },
    { name: 'Closed', icon: 'img/completed-manager-24px.svg', type: COMPLETED },
].map(view => [ view.type, view ]));

let ContractorViews = new Map([
    { name: 'Offered', icon: 'img/offered-24px.svg', type: OFFERED },
    { name: 'In Progress', icon: 'img/in-progress-24px.svg', type: IN_PROGRESS },
    { name: 'Closed', icon: 'img/completed-24px.svg', type: COMPLETED },
].map(view => [ view.type, view ]));

export default function views(views = {items: [], isFetching: false }, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, views, { isFetching: true }); break;
                case SUCCESS:
                    let newViews;
                    switch (action.response.user.current_role.type) {
                        case 'manager': newViews = ManagerViews; break;
                        case 'contractor': newViews = ContractorViews; break;
                    }
                    return Object.assign({}, views, { isFetching: false }, { items: newViews }); break;
            }
        }
        default:
            return views;
    }
}
