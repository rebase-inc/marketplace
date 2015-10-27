// External
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');
var keyMirror = require('keymirror');

// Components
var ImportProjectModal = require('../components/ImportProjectModal.react');
var DeleteProjectModal = require('../components/DeleteProjectModal.react');

// Stores

// Actions
var UserActions = require('../actions/UserActions');

// Icons
var Icons = require('../components/Icons.react');

// Utils
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var ModalTypes = keyMirror({ ADD_PROJECT: null, DELETE_PROJECT: null, CLOSED: null });

var ProfileView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: () => ({ modalType: ModalTypes.CLOSED, selectedProject: null }),
    updateProfileSettings: function() {
        let user = {
            id: this.props.currentUser.id,
            first_name: ReactDOM.findDOMNode(this.refs.first_name).value,
            last_name: ReactDOM.findDOMNode(this.refs.last_name).value,
            email: ReactDOM.findDOMNode(this.refs.email).value,
        }
        UserActions.updateUserSettings(user);
    },
    componentDidMount: function() {
        handleScrollShadows(this.refs.projectList);
        var node = ReactDOM.findDOMNode(this.refs.projectList);
        node.addEventListener('scroll', handleScrollShadows.bind(null, this.refs.projectList), false);
    },
    componentDidUpdate: function() {
        handleScrollShadows(this.refs.projectList);
    },
    openDeleteProjectModal: function(roleToDelete) {
        this.setState({ modalType: ModalTypes.DELETE_PROJECT, selectedProject: roleToDelete });
    },
    openAddProjectModal: function(projectToDelete) {
        this.setState({ modalType: ModalTypes.ADD_PROJECT, selectedProject: null });
    },
    _makeProjectElement: function(role) {
        if (role.type == 'manager') {
            return (
                <div className='project' key={role.id}>
                    <Icons.ProjectGraph />
                    <div className='projectDetails'>
                        <span className='orgName'>{role.project.organization.name}</span>
                        <span className='projName'>{role.project.name}</span>
                        <span className='projDelete' onClick={this.openDeleteProjectModal.bind(null, role)}>Delete Project?</span>
                    </div>
                </div>
            );
        }
    },
    render: function() {
        let modal;
        switch (this.state.modalType) {
            case ModalTypes.ADD_PROJECT:
                modal = <ImportProjectModal toggleModal={() => this.setState({ modalType: ModalTypes.CLOSED })} {...this.props}/>;
                break;
            case ModalTypes.DELETE_PROJECT:
                modal = <DeleteProjectModal projectToDelete={this.state.selectedProject} toggleModal={() => this.setState({ modalType: ModalTypes.CLOSED })} />;
                break;
            case ModalTypes.CLOSED:
                modal = null;
                break;
        }
        return (
            <div className='projectView'>
                { modal }
                <div className='projectInfo'>
                    <div ref='projectList' className='projectList'>
                        { this.props.currentUser.roles.map(this._makeProjectElement) }
                    </div>
                    <Icons.AddNewProject onClick={this.openAddProjectModal} />
                </div>
            </div>
        );
    }
});

module.exports = ProfileView;
