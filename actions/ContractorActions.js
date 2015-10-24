var ActionConstants = require('../constants/ActionConstants');
var Api = require('../utils/Api');
var Action = require('../utils/Action');

module.exports = {
    getContractors:    Action.create(ActionConstants.GET_CONTRACTORS,     Api.getContractors)
};
