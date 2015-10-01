// External
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');

// Components
var ImportProjectModal = require('../components/ImportProjectModal.react');
var DeleteProjectModal = require('../components/DeleteProjectModal.react');

// Stores
var ProjectResource = require('../stores/ProjectStore');

// Actions
var UserActions = require('../actions/UserActions');
var ProjectActions = require('../actions/ProjectActions');

// Icons
var Icons = require('../components/Icons.react');

// Utils
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var ProfileView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return {
            addModalOpen: false,
            deleteModalOpen: false,
            projectResource: ProjectResource.getState(),
        };
    },
    updateProfileSettings: function() {
        var user = {
            id: this.props.currentUser.id,
            first_name: ReactDOM.findDOMNode(this.refs.first_name).value,
            last_name: ReactDOM.findDOMNode(this.refs.last_name).value,
            email: ReactDOM.findDOMNode(this.refs.email).value,
        }
        UserActions.updateUserSettings(user);
    },
    componentWillMount: function() {
        ProjectActions.getProjects();
    },
    componentDidMount: function() {
        ProjectResource.addChangeListener(this._onChange);
        handleScrollShadows(this.refs.projectList);
        var node = ReactDOM.findDOMNode(this.refs.projectList);
        node.addEventListener('scroll', handleScrollShadows.bind(null, this.refs.projectList), false);
    },
    componentWillUnmount: function() {
        ProjectResource.removeChangeListener(this._onChange);
    },
    componentDidUpdate: function() {
        handleScrollShadows(this.refs.projectList);
    },
    _onChange: function() {
        this.setState(_.extend(this.state, { projectResource: ProjectResource.getState() }));
    },
    _deleteProject: function(projectToDelete) {
        var { project, index } = projectToDelete;
        ProjectActions.deleteProject(project, index);
    },
    _makeProjectElement: function(organization, project, index) {
        return (
            <div className='project'>
                <Icons.ProjectGraph />
                <div className='projectDetails'>
                    <span className='orgName'>{organization.name}</span>
                    <span className='projName'>{project.name}</span>
                    <span className='projDelete' onClick={this._toggleDeleteModal.bind(null, project, index)} >{'Delete Project?'}</span>
                </div>
            </div>
        );
    },
    _toggleAddModal: function() {
        this.setState({ addModalOpen: !this.state.addModalOpen });
    },
    _toggleDeleteModal: function(project, index) {
        this.setState(_.extend(this.state, {
            deleteModalOpen: !this.state.deleteModalOpen,
            projectToDelete: !this.state.deleteModalOpen ? { project: project, index: index } : null
        }));
    },
    _intoProjects(projects, project, index, __) {
        projects.push(this._makeProjectElement(project.organization, project, index));
        return projects;
    },
    render: function() {
        var projects = [];
        this.state.projectResource.allProjects.reduce(this._intoProjects, projects);
        return (
            <div className='projectView'>
                { this.state.addModalOpen ? <ImportProjectModal toggleModal={this._toggleAddModal} {...this.props} /> : null }
                { this.state.deleteModalOpen ? <DeleteProjectModal
                    toggleModal={this._toggleDeleteModal}
                    projectToDelete={this.state.projectToDelete}
                    deleteProject={this._deleteProject}
                    {...this.props}
                /> : null }
                <div className='projectInfo'>
                    <div ref='projectList' className='projectList'>
                        { projects }
                    </div>
                    <Icons.AddNewProject onClick={this._toggleAddModal} />
                </div>
            </div>
        );
    }
});

module.exports = ProfileView;
