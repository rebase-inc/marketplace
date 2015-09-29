// External
var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('underscore');

// Components
var ImportProjectModal = require('../components/ImportProjectModal.react');

// Stores
var UserStore = require('../stores/UserStore');

// Actions
var UserActions = require('../actions/UserActions');

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
        return { modalOpen: false };
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
    componentDidMount: function() {
        handleScrollShadows(this.refs.projectList);
        var node = ReactDOM.findDOMNode(this.refs.projectList);
        node.addEventListener('scroll', handleScrollShadows.bind(null, this.refs.projectList), false);
    },
    componentDidUpdate: function() {
        handleScrollShadows(this.refs.projectList);
    },
    _makeProjectElement: function(organization, project) {
        return (
            <div className='project'>
                <Icons.ProjectGraph />
                <div className='projectDetails'>
                    <span className='orgName'>{organization.name}</span>
                    <span className='projName'>{project.name}</span>
                    <span className='projDelete'>{'Delete Project?'}</span>
                </div>
            </div>
        );
    },
    toggleModal: function() {
        this.setState({ modalOpen: !this.state.modalOpen });
    },
    render: function() {
        var projects = [];
        // temp hack until we make managers own projects, instead of organizations
        var role;
        var project;
        this.props.currentUser.roles.forEach(role => role.organization.projects.forEach(project => projects.push(this._makeProjectElement(role.organization, project))));
        projects.push(this._makeProjectElement({name: 'rebase'}, {name: 'api'}));
        projects.push(this._makeProjectElement({name: 'rebase'}, {name: 'react-app'}));
        projects.push(this._makeProjectElement({name: 'rebase'}, {name: 'models'}));
        return (
            <div className='projectView'>
                { this.state.modalOpen ? <ImportProjectModal toggleModal={this.toggleModal} {...this.props} /> : null }
                <div className='projectInfo'>
                    <div ref='projectList' className='projectList'>
                        { projects }
                    </div>
                    <Icons.AddNewProject onClick={this.toggleModal} />
                </div>
            </div>
        );
    }
});

//<button onClick={window.open.bind(null, '/github/', '_blank')}>Authenticate GitHub</button>
module.exports = ProfileView;
