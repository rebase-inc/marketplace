import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';

export function getContracts() {
    return dispatchedRequest('GET', '/contracts', ActionConstants.GET_CONTRACTS);
}

export function selectContract(contractId) {
    return {
        type: ActionConstants.SELECT_CONTRACT,
        response: { contractId: contractId },
        status: SUCCESS
    }
}

export function submitWork(work, comment) {
    const url = '/works/' + work.id + '/review';
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.SUBMIT_WORK, data);
}

export function disputeWork(work, comment) {
    const url = '/works/' + work.id + '/mediate';
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.DISPUTE_WORK, data);
}

export function acceptWork(work, comment) {
    const url = '/works/' + work.id + '/complete';
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.ACCEPT_WORK, data);
}

export function markWorkBlocked(work, comment) {
    const url = '/works/' + work.id + '/halt';
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.MARK_WORK_BLOCKED, data);
}

export function markWorkUnblocked(work, comment) {
    const url = '/works/' + work.id + '/resume';
    const data = { reason: comment, work: work };
    return dispatchedRequest('POST', url, ActionConstants.MARK_WORK_UNBLOCKED, data);
}
