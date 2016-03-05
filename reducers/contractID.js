import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR, UNAUTHORIZED } from '../constants/RequestConstants';
import { COMPLETE } from '../constants/WorkStates';

let initialContractID = null;

export default function contractID(contractID = initialContractID, action) {
    switch (action.type) {
        case ActionConstants.SELECT_CONTRACT: return action.response.contractId; break;
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, contractID); break;
        case ActionConstants.BID_ON_AUCTION: return handleBidOnAuction(action.status, contractID, action.response.auction); break;
        case ActionConstants.GET_CONTRACTS: return handleNewContracts(action.status, contractID, action.response.contracts); break;
        case ActionConstants.ACCEPT_WORK: return acceptWork(contractID, action);
        case ActionConstants.LOGOUT: return initialContractID; break;
        default: return contractID; break;
    }
}

function acceptWork(oldContractID, action) {
    switch (action.status) {
        case PENDING: return oldContractID; break;
        case ERROR: return oldContractID; break;
        case SUCCESS: return action.context.nextSelectedContractId;
    }
}

function handleNewContracts(requestStatus, contractID, contracts) {
    switch (requestStatus) {
        case PENDING: return contractID; break;
        case ERROR: return contractID; break;
        case SUCCESS:
            const newContract = contracts.find(c => c.bid.work_offers[0].work.state != COMPLETE);
            return !!newContract ? newContract.id : contractID;
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
