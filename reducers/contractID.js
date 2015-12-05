import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialContractID = null;

export default function contractID(contractID = initialContractID, action) {
    switch (action.type) {
        case ActionConstants.SELECT_CONTRACT: return action.response.contractId; break;
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, contract); break;
        case ActionConstants.BID_ON_AUCTION: return handleBidOnAuction(action.status, contractID, action.response.auction); break;
        case ActionConstants.SELECT_VIEW: return initialContractID; break;
        case ActionConstants.LOGOUT: return initialContractID; break;
        default: return contractID; break;
    }
}

function handleBidOnAuction(requestStatus, oldContractID, auction) {
    switch (requestStatus) {
        case PENDING: return oldContractID; break;
        case ERROR: return oldContractID; break;
        case SUCCESS:
            const winningBid = auction.bids.find(bid => bid.contract);
            return winningBid ? winningBid.contract.id : oldContractID;
    }
}

function handleNewRole(requestStatus, oldContractID) {
    switch (requestStatus) {
        case PENDING: return oldContractID; break;
        case ERROR: return oldContractID; break;
        case SUCCESS: return initialContractID; break;
    }
}
