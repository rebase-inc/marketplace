import { dispatchedRequest } from '../utils/Api';
import ActionConstants from '../constants/ActionConstants';

const _roleToEvents = new Map([
    ['manager', 'client_answer'],
    ['contractor', 'dev_answer'],
]);

function roleToEvent(role) {
    if(_roleToEvents.has(role)) {
        return _roleToEvents.get(role);
    } else {
        throw 'Unsupported role in mediations: '+role;
    }
}

export function sendAnswer(role_type, mediation, answer, comment) {
    const url = '/mediations/' + mediation.id + '/'+roleToEvent(role_type);
    const data = {
        answer: answer,
        comment: comment
    };
    return dispatchedRequest('POST', url, ActionConstants.MEDIATION_ANSWER, data);
};
