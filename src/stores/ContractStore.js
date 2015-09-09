var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var viewConstants = require('../constants/viewConstants');
var ReviewActions = require('../actions/ReviewActions');
var UserActions = require('../actions/UserActions');
var _ = require('underscore');

//Define initial data points
var _allContracts = [];
var _currentContract = null;
var _loading = false;

var _shouldBeVisible = function(contract) {
    return !contract.work.review && contract.work.state != 'complete'; // hack because the api doesnt automatically add reviews yet
}

var ContractStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allContracts: _allContracts.filter(_shouldBeVisible),
            currentContract: _currentContract,
            loadingContractData: _loading,
        };
    },
    select: function(contract) {
        if (!contract) { _currentContract = null; return; }
        for(var i=0; i<_allContracts.length; i++) {
            if (_allContracts[i].id == contract.id) { _currentContract = _allContracts[i]; };
        }
    },
    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
RebaseAppDispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.type) {
        case ActionConstants.SELECT_VIEW: _currentContract = null; break;
        case ActionConstants.GET_CONTRACT_DATA: handleNewContractData(action.response); break;
        case ActionConstants.SELECT_CONTRACT: handleSelectedContract(action.contractID); break;
        case ActionConstants.ADD_COMMENT_TO_TICKET: handleNewComment(action.response); break;
        case ActionConstants.GET_COMMENT_DETAIL: handleCommentDetail(action.response); break;
        case ActionConstants.MARK_WORK_COMPLETE: handleWorkDetail(action.response); break;
        case ActionConstants.MARK_CONTRACT_BLOCKED: handleWorkDetail(action.response); break;
        case ActionConstants.MARK_CONTRACT_UNBLOCKED: handleWorkDetail(action.response); break;
        default: return true;
    }

    // If action was responded to, emit change event
    ContractStore.emitChange();
    return true;
});


function handleNewContractData(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Undefined data!');
        default:
            _loading = false;
            _allContracts = data.contracts;
            _allContracts.forEach(contract => addSyntheticProperties(contract));
    }
}

function addSyntheticProperties(contract) {
    Object.defineProperty(contract, 'ticket', {
        get: function() { return contract.bid.work_offers[0].ticket_snapshot.ticket; },
        set: function(ticket) { contract.bid.work_offers[0].ticket_snapshot.ticket = ticket; },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    Object.defineProperty(contract, 'work', {
        get: function() { return contract.bid.work_offers[0].work; },
        set: function(work) { contract.bid.work_offers[0].work = work; },
        configurable: true, // a hack to let us repeatedly set the property so we don't have to be careful
    });
    return contract;
}

function handleSelectedContract(id) {
    _currentContract = _allContracts.filter(contract => contract.id == id)[0];
}

function handleNewComment(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allContracts.forEach(contract => { if (contract.ticket.id == data.comment.id) { contract.ticket.comments.push(data.comment) } });
            break;
    }
}

function handleCommentDetail(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allContracts.forEach(contract => contract.ticket.comments.forEach(comment => { comment = comment.id == data.comment.id ? data.comment : comment }));
            break;
    }
}

function handleWorkDetail(data) {
    switch (data) {
        case RequestConstants.PENDING: _loading = true; break;
        case RequestConstants.TIMEOUT: _loading = false; console.warn(data); break;
        case RequestConstants.ERROR: _loading = false; console.warn(data); break;
        case null: _loading = false; console.warn('Null data!');
        default:
            _loading = false;
            _allContracts.filter(contract => contract.work.id == data.work.id).forEach(contract => { contract.work = data.work; });
            _currentContract.work = _currentContract.work.id == data.work.id ? data.work : _currentContract.work;
            // this is to deal with the case where an auction transitions to another state
            if (!_shouldBeVisible(_currentContract)) {
                setTimeout(ReviewActions.selectReview.bind(null, _currentContract.work.review || null), 0); // || null to deal with fact that reviews arent being created properly yet
                setTimeout(UserActions.selectView.bind(null, viewConstants.ViewTypes.COMPLETED), 0);
            }
            break;
    }
}

module.exports = ContractStore;
