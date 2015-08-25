var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var ViewConstants = require('../constants/ViewConstants');
var _ = require('underscore');

//Define initial data points
var _allContracts = [];
var _currentContract = null;

function persistContracts(data) {
    if (data) { _allContracts = data.contracts.map(labelContract); }
}

function persistCommentDetail(data) {
    data.comment.user = { first_name: 'Andrew', last_name: 'Millspaugh', photo: 'img/andrew.jpg' }; // hack because the api is missing data
    for(var i=0; i<_allContracts.length; i++) {
        var comments = _allContracts[i].bid.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket.comments;
        for ( var j=0; j < comments.length; j++) {
            if (comments[j].id == data.comment.id) { _allContracts[i].bid.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket.comments[j] = data.comment; }
        }
    }
}

function persistModifiedContract(contract) {
    for(var i=0; i<_allContracts.length; i++) {
        if (_allContracts[i].id == contract.id) {
            _allContracts[i] = _.extend({}, contract);
            if (_currentContract.id == contract.id) { _currentContract = contract }
        };
    }
}

function labelContract(contract) {
    if (!contract.bid.work_offers[0].review) {
        contract.type = ViewConstants.ticketTypes.IN_PROGRESS;
    }
    return contract
}

var ContractStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
        return {
            allContracts: _allContracts,
            currentContract: _currentContract,
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
        case ActionConstants.GET_CONTRACT_DATA:
            console.log('responding to contract data ', action.response);
            switch(action.response) {
                case RequestConstants.PENDING: break;
                default: persistContracts(action.response); break;
            } break;
        case ActionConstants.ADD_COMMENT_TO_CONTRACT:
            switch(action.response) {
                case RequestConstants.PENDING: break;
                default: persistModifiedContract(action.response.data); break;
            } break;
        case ActionConstants.GET_COMMENT_DETAIL:
            switch(action.response) {
                case RequestConstants.PENDING: break;
                default: persistCommentDetail(action.response); break;
            } break;
        default: return true;
    }

    // If action was responded to, emit change event
    ContractStore.emitChange();
    return true;
});

module.exports = ContractStore;
