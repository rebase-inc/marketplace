var ActionConstants = require('../constants/ActionConstants');
var RequestConstants = require('../constants/RequestConstants');

var Store = require('../utils/Store');

var _projectData = {
    loading: true,
    allProjects:   {},
};

var ProjectStore = Store.newStore(function() {
    return _projectData;
});

function successDeleteProject(action) {
    _projectData.loading = false;
    var [project] = action.args;
    if (_projectData.allProjects.hasOwnProperty(project.id)) {
        delete _projectData.allProjects[project.id];
    }
};

Store.registerDispatcher(
    ProjectStore,
    ActionConstants.DELETE_PROJECT,
    successDeleteProject,
    Store.defaultPendingAndErrorHandler.bind(_projectData)
);

module.exports = ProjectStore;
