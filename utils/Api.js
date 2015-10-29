import fetch from 'isomorphic-fetch';

import ActionConstants from '../constants/ActionConstants';
import { ERROR, PENDING, SUCCESS } from '../constants/RequestConstants';

const BASE_URL = 'http://localhost:5000';

function handleStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        console.warn('fetch error: ' + response.statusText);
        return Promise.reject(new Error(response.statusText))
    }
}

export function dispatchedRequest(method, url, actionType, data) {
    return function(dispatch) {
        dispatch({ type: actionType, status: PENDING });
        return fetch(BASE_URL + url, {
                method: method,
                credentials: 'include', // CORS Hack
                headers: { 'Content-Type': 'application/json; charset=utf-8'},
                body: JSON.stringify(data || undefined) })
            .then(handleStatus)
            .then(response => response.json())
            .then(json => dispatch({ type: actionType, status: SUCCESS, response: json }))
            .catch(error => dispatch({ type: actionType, status: ERROR, response: error }));
    };
}

