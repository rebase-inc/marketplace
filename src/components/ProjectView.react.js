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
        ProjectActions.deleteProject(projectToDelete);
    },
    _makeProjectElement: function(organization, project) {
        var deleteSpan = this.props.currentRole.project.id != project.id ? (<span className='projDelete' onClick={this._toggleDeleteModal.bind(null, project)} >{'Delete Project?'}</span>) : (<span className='projDelete'/>);
                    
        return (
            <div className='project' key={project.id}>
                <Icons.ProjectGraph />
                <div className='projectDetails'>
                    <span className='orgName'>{organization.name}</span>
                    <span className='projName'>{project.name}</span>
                    {deleteSpan}
                </div>
            </div>
        );
    },
    _toggleAddModal: function() {
        this.setState({ addModalOpen: !this.state.addModalOpen });
    },
    _toggleDeleteModal: function(project) {
        this.setState(_.extend(this.state, {
            deleteModalOpen: !this.state.deleteModalOpen,
            projectToDelete: !this.state.deleteModalOpen ? project : null
        }));
    },
    _addToProjects(project, project_id, _) {
        this.projects.push(this.component._makeProjectElement(project.organization, project));
    },
    render: function() {
        var projects = [];
        this.state.projectResource.allProjects.forEach(function(project) {
            projects.push(this._makeProjectElement(project.organization, project));
        }, this);
        return (
            <div className='projectView'>
                { this.state.addModalOpen ? <ImportProjectModal
                    toggleModal={this._toggleAddModal}
                    importedProjects={this.state.projectResource.allProjects}
                    {...this.props}
                /> : null }
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
