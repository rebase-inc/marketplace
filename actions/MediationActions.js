import { dispatchedRequest } from '../utils/Api';
import ActionConstants from '../constants/ActionConstants';

function clientAnswer(mediation, answer) {
    const url = '/mediations/' + mediation.id + '/client_answer';
    const data = { client_answer: answer };
    return dispatchedRequest('POST', url, ActionConstants.CLIENT_ANSWER, data);
}

function devAnswer(mediation, answer) {
    const url = '/mediations/' + mediation.id + '/dev_answer';
    const data = { dev_answer: answer };
    return dispatchedRequest('POST', url, ActionConstants.DEV_ANSWER, data);
}

export function sendAnswer(role_type, mediation, answer) {
    switch (role_type) {
        case 'manager': return clientAnswer(mediation, answer);
        case 'contractor': return devAnswer(mediation, answer);
        default: throw 'Unsupported role in mediations';
    }
};
