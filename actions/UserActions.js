//var Dispatcher = require('../dispatcher/RebaseAppDispatcher');
//var ActionConstants = require('../constants/ActionConstants');
//var RequestConstants = require('../constants/RequestConstants');
//var Api = require('../utils/Api');
//var _ = require('underscore');

import fetch from 'isomorphic-fetch';

import ActionConstants from '../constants/ActionConstants';
import { ERROR, PENDING, SUCCESS } from '../constants/RequestConstants';

function handleStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

export function logout() {
    return function(dispatch) {
        dispatch({ type: ActionConstants.LOGOUT, status: PENDING });
        return fetch('/auth', { credentials: 'include'})
            .then(handleStatus)
            .then(response => response.json())
            .then(json => dispatch({ type: ActionConstants.LOGOUT, status: SUCCESS, response: json }))
            .catch(json => dispatch({ type: ActionConstants.LOGOUT, status: ERROR, response: json }));
    };
}

export function login(email, password) {
    return function(dispatch) {
        dispatch({ type: ActionConstants.LOGIN, status: PENDING });
        let data = { user: { email: email }, password: password, };
        return fetch('/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8'},
                body: JSON.stringify(data) })
            .then(handleStatus)
            .then(response => response.json())
            .then(json => dispatch({ type: ActionConstants.LOGIN, status: SUCCESS, response: json }))
            .catch(json => dispatch({ type: ActionConstants.LOGIN, status: ERROR, response: json }));
    };
}

export function selectView(viewType) {
    return {
        type: ActionConstants.SELECT_VIEW,
        response: { viewType },
        status: SUCCESS
    }
}

//module.exports = {
    ////login: function(email, password) {
        ////let actionType = ActionConstants.LOGIN;
        ////let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        ////let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        ////Api.login(email, password, responseAction, pendingAction);
    ////},
    //login: function addTodo(email) {
      //return {
        //type: ActionConstants.LOGIN,
        //user: { email: email },
      //};
    //},
    //logout: function() {
        //var responseAction = function(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.LOGOUT,
                //status: status,
                //response: response
            //});
        //};
        //var pendingAction = function(response) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.LOGOUT,
                //response: RequestConstants.PENDING,
            //});
        //};
        //Api.logout(responseAction, pendingAction);
    //},
    //authenticateGithub: function() {
        //function responseAction(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.AUTHENTICATE_GITHUB,
                //status: status,
                //response: response
            //});
        //};
        //function pendingAction() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.AUTHENTICATE_GITHUB,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.authenticateGithub(responseAction, pendingAction);
    //},
    //getUserDetail: function(userID) {
        //var actionType = ActionConstants.GET_USER_DETAIL;
        //let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        //let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        //Api.getUserDetail(userID, responseAction, pendingAction);
    //},
    //updateUserSettings: function(user) {
        //function responseHandler(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.UPDATE_USER_SETTINGS,
                //status: status,
                //response: response
            //});
        //};
        //function pendingHandler() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.UPDATE_USER_SETTINGS,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.updateUserSettings(user, responseHandler, pendingHandler);
    //},
    //updateProfilePhoto: function(file) {
        //function responseHandler(response, status) {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.UPDATE_PROFILE_PHOTO,
                //status: status,
                //response: response
            //});
        //};
        //function pendingHandler() {
            //Dispatcher.handleRequestAction({
                //type: ActionConstants.UPDATE_PROFILE_PHOTO,
                //status: RequestConstants.PENDING,
            //});
        //};
        //Api.updateProfilePhoto(file, responseHandler, pendingHandler);
    //},
    //selectRole: function(user, role_id) {
        //if (typeof(user) != 'object' || typeof(role_id) != 'number') {
            //throw 'Invalid types for user and role_id: ' + typeof(user) + ' and ' + typeof(role_id);
        //}
        //let actionType = ActionConstants.SELECT_ROLE;
        //let pendingAction = () => Dispatcher.handleRequestAction({ type: actionType, status: RequestConstants.PENDING });
        //let responseAction = (res, status) => Dispatcher.handleRequestAction({ type: actionType, status: status, response: res });
        //Api.updateUserSettings({ id: user.id, current_role: { id: role_id } }, responseAction, pendingAction);
    //},
//};



