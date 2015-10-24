var ActionConstants = require('../constants/ActionConstants');
var Api = require('../utils/Api');
var Action = require('../utils/Action');

module.exports = {
    getManagers:    Action.create(ActionConstants.GET_MANAGERS,     Api.getManagers)
};
