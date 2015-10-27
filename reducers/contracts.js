import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialContracts = { items: [], isFetching: false };

export default function contracts(contracts = initialContracts, action) {
    switch (action.type) {
        case ActionConstants.GET_CONTRACTS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, contracts, { isFetching: true }); break;
                case SUCCESS:
                    return Object.assign({}, contracts, { isFetching: false, items: action.response.contracts }); break;
            }
        }
        default:
            return contracts;
    }
}
