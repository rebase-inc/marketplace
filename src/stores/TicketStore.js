var RebaseAppDispatcher = require('../dispatcher/RebaseAppDispatcher');
var EventEmitter = require('events').EventEmitter;
var RebaseConstants = require('../constants/RebaseConstants');
var _ = require('underscore');

//Define initial data points
var _tickets = {};
var _tickets = JSON.parse(localStorage.getItem('newTickets'));
var _selected = null;

// Method to load ticket data from mock API
function loadTicketData(data) { _tickets = data; }
function setSelected(index) { _selected = _tickets[index]; }
function newComment(text) { alert('new comment!: ' + text); }

var TicketStore = _.extend({}, EventEmitter.prototype, {

    getTickets: function() { return _tickets; },
    getSelected: function() { return _selected; },

    emitChange: function() { this.emit('change'); },
    addChangeListener: function(callback) { this.on('change', callback); },
    removeChangeListener: function(callback) { this.removeListener('change', callback); }
});

// Register callback with Dispatcher
RebaseAppDispatcher.register(function(payload) {
    var action = payload.action;
    var text;

    switch(action.actionType) {
        case RebaseConstants.RECEIVE_DATA: loadTicketData(action.data); break;
        case RebaseConstants.SELECT_TICKET: setSelected(action.data); break;
        case RebaseConstants.NEW_COMMENT: newComment(action.data); break;
        default: return true;
    }

    // If action was responded to, emit change event
    TicketStore.emitChange();
    return true;
});

module.exports = TicketStore;
