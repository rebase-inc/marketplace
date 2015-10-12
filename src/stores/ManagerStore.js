var _ = require('underscore');

var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Store = require('../utils/Store');

var _managerData = {
    loading:                    true,
    allManagers:                new Map(), // Map manager.id => manager
};

var ManagerStore = Store.newStore(() => _managerData);

ManagerStore = _.extend(ManagerStore, {
    update: function(managers) {
        managers.forEach(function(manager, i, a) {
            _managerData.allManagers.set(manager.id, manager);
        });
        ManagerStore.emitChange();
    },
    add: function(managers) {
        managers.forEach( mgr => _managerData.allManagers.set(mgr.id, mgr) );
        this.emitChange();
    },
});

function _intoMap(map, manager) {
    return map.set(manager.id, manager);
};

function successGetManagers(action) {
    _managerData.loading = false;
    _managerData.allManagers = action.response.managers.reduce(_intoMap, _managerData.allManagers);
};

Store.registerDispatcher(
    ManagerStore,
    ActionConstants.GET_MANAGERS,
    successGetManagers,
    Store.defaultPendingAndErrorHandler.bind(_managerData)
);

Store.registerDispatcher(
    ManagerStore,
    ActionConstants.LOGIN_AS_MANAGER,
    successGetManagers,
    Store.defaultPendingAndErrorHandler.bind(_managerData)
);

Store.registerDispatcher(
    ManagerStore,
    ActionConstants.GET_USER_DETAIL_AS_MANAGER,
    successGetManagers,
    Store.defaultPendingAndErrorHandler.bind(_managerData)
);

module.exports = ManagerStore;
