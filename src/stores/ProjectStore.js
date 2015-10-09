var _ = require('underscore');

var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');
var Store = require('../utils/Store');

var _projectData = {
    loading:        true,
    allProjects:    new Map(), // Map project.id => project
};

var ProjectStore = Store.newStore(function() {
    return _projectData;
});

_.extend(ProjectStore, {
    update: function(projects) {
        projects.forEach(function(project, i, a) {
            _projectData.allProjects.set(project.id, project);
        });
        ProjectStore.emitChange();
    }
});

function successDeleteProject(action) {
    _projectData.loading = false;
    var [project] = action.args;
    _projectData.allProjects.delete(project.id);
};

Store.registerDispatcher(
    ProjectStore,
    ActionConstants.DELETE_PROJECT,
    successDeleteProject,
    Store.defaultPendingAndErrorHandler.bind(_projectData)
);

function _intoMap(map, project) {
    return map.set(project.id, project);
};

function successGetProjects(action) {
    _projectData.loading = false;
    _projectData.allProjects.clear();
    _projectData.allProjects = action.response.projects.reduce(_intoMap, _projectData.allProjects);
};

Store.registerDispatcher(
    ProjectStore,
    ActionConstants.GET_PROJECTS,
    successGetProjects,
    Store.defaultPendingAndErrorHandler.bind(_projectData)
);

module.exports = ProjectStore;
