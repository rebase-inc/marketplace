var _ = require('underscore');

var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Store = require('../utils/Store');

var _contractorData = {
    loading:        true,
    allContractors:    new Map(), // Map contractor.id => contractor
};

var ContractorStore = Store.newStore(function() {
    return _contractorData;
});

_.extend(ContractorStore, {
    update: function(contractors) {
        contractors.forEach(function(contractor, i, a) {
            _contractorData.allContractors.set(contractor.id, contractor);
        });
        ContractorStore.emitChange();
    }
});

function _intoMap(map, contractor) {
    return map.set(contractor.id, contractor);
};

function successGetContractors(action) {
    _contractorData.loading = false;
    _contractorData.allContractors = action.response.contractors.reduce(_intoMap, _contractorData.allContractors);
};

Store.registerDispatcher(
    ContractorStore,
    ActionConstants.GET_CONTRACTORS,
    successGetContractors,
    Store.defaultPendingAndErrorHandler.bind(_contractorData)
);

module.exports = ContractorStore;
