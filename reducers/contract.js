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
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, contract); break;
        case ActionConstants.BID_ON_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, contract, { isFetching: true }); break;
                case ERROR: return Object.assign({}, contract, { isFetching: false }); break;
                case SUCCESS: {
                    let winningBid = action.response.auction.bids.find(bid => bid.contract);
                    if(winningBid !== undefined) {
                        return { isFetching: false, id: winningBid.contract.id };
                    } else {
                        // this bid was not successful
                        return contract;
                    }
                }
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
        case ActionConstants.MEDIATION_ANSWER: return contract;
        case ActionConstants.LOGOUT: return initialContract; break;
        default: return contract; break;
    }
}

function handleNewRole(requestStatus, oldContract) {
    switch (requestStatus) {
        case PENDING: return oldContract; break;
        case ERROR: return oldContract; break;
        case SUCCESS: return initialContract; break;
    }
}
