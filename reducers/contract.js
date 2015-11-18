import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialContract = { id: null, isFetching: false };

export default function contract(contract = initialContract, action) {
    switch (action.type) {
        case ActionConstants.SELECT_CONTRACT: {
            switch (action.status) {
                case SUCCESS:
                    return { isFetching: false, id: action.response.contractId }
            }
        }
        case ActionConstants.BID_ON_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, contract, { isFetching: true }); break;
                case ERROR: return Object.assign({}, contract, { isFetching: false }); break;
                case SUCCESS:
                    return { isFetching: false, id: action.response.auction.bids[0].contract.id };
                    break;
            }
        }
        case ActionConstants.CREATE_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, contract, { isFetching: true }); break;
                case ERROR: return Object.assign({}, contract, { isFetching: false }); break;
                case SUCCESS:
                    return initialContract;
                    break;
            }
        }
        case ActionConstants.SELECT_VIEW: {
            switch (action.status) {
                case SUCCESS: return initialContract; break;
            }
        }
        case ActionConstants.LOGOUT: return initialContract; break;
        default: return contract; break;
    }
}
