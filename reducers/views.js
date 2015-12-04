import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';

let ManagerViews = new Map([
    { name: 'Tickets', type: NEW },
    { name: 'Auctions', type: OFFERED },
    { name: 'Work', type: IN_PROGRESS },
    { name: 'Completed', type: COMPLETED },
].map(view => [ view.type, view ]));

let ContractorViews = new Map([
    { name: 'Offers', type: OFFERED },
    { name: 'Work', type: IN_PROGRESS },
    { name: 'Reviews', type: COMPLETED },
].map(view => [ view.type, view ]));

const initialViews = {items: [], isFetching: false };

export default function views(views = initialViews, action) {
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
                    return Object.assign({}, { isFetching: false }, { items: newViews }); break;
            }
        }
        case ActionConstants.LOGOUT: return initialViews; break;
        default: return views; break;
    }
}
