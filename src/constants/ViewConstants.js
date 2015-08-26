var keyMirror = require('keymirror');

var VIEW_TYPES = keyMirror({ NEW: null, OFFERED: null, IN_PROGRESS: null, COMPLETED: null });

var CONTRACTOR_VIEWS = {}
var MANAGER_VIEWS = {}

CONTRACTOR_VIEWS[VIEW_TYPES.OFFERED] = { name: 'Offered', icon: 'img/offered-24px.svg', type: VIEW_TYPES.OFFERED }
CONTRACTOR_VIEWS[VIEW_TYPES.IN_PROGRESS] = { name: 'In Progress', icon: 'img/in-progress-24px.svg', type: VIEW_TYPES.IN_PROGRESS },
CONTRACTOR_VIEWS[VIEW_TYPES.COMPLETED] = {name: 'Completed', icon: 'img/completed-24px.svg', type: VIEW_TYPES.COMPLETED },

MANAGER_VIEWS[VIEW_TYPES.NEW] = { name: 'New', icon: 'img/new-24px.svg', type: VIEW_TYPES.NEW },
MANAGER_VIEWS[VIEW_TYPES.OFFERED] = { name: 'Waiting', icon: 'img/waiting-24px.svg', type: VIEW_TYPES.OFFERED },
MANAGER_VIEWS[VIEW_TYPES.IN_PROGRESS] = { name: 'In Progress', icon: 'img/in-progress-24px.svg', type: VIEW_TYPES.IN_PROGRESS },
MANAGER_VIEWS[VIEW_TYPES.COMPLETED] = { name: 'Completed', icon: 'img/completed-24px.svg', type: VIEW_TYPES.COMPLETED },

module.exports = {
    ViewTypes: VIEW_TYPES,
    ContractorViews: CONTRACTOR_VIEWS,
    ManagerViews: MANAGER_VIEWS,
}
