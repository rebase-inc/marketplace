var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');

var Store = require('../utils/Store');

var _projectData = {
    loading:        true,
    allProjects:    [],
};

var ProjectStore = Store.newStore(function() {
    return _projectData;
});

function successDeleteProject(action) {
    _projectData.loading = false;
    var [project, index] = action.args;
    _projectData.allProjects.splice(index, 1);
};

Store.registerDispatcher(
    ProjectStore,
    ActionConstants.DELETE_PROJECT,
    successDeleteProject,
    Store.defaultPendingAndErrorHandler.bind(_projectData)
);

function successGetProjects(action) {
    _projectData.loading = false;
    _projectData.allProjects = action.response.projects;
};

Store.registerDispatcher(
    ProjectStore,
    ActionConstants.GET_PROJECTS,
    successGetProjects,
    Store.defaultPendingAndErrorHandler.bind(_projectData)
);

module.exports = ProjectStore;
