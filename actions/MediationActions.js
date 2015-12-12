import { dispatchedRequest } from '../utils/Api';
import ActionConstants from '../constants/ActionConstants';

export function sendAnswer(role_type, mediation, answer, comment) {
    const url = '/mediations/' + mediation.id + '/'+ (role_type == 'manager' ? 'client_answer' : 'dev_answer'); 
    const data = {
        answer: answer,
        comment: comment
    };
    return dispatchedRequest('POST', url, ActionConstants.MEDIATION_ANSWER, data);
};
