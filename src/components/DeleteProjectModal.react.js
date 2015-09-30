var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var LoadingAnimation = require('../components/LoadingAnimation.react');

var ModalContainer = require('../components/ModalContainer.react');

var ProjectActions = require('../actions/ProjectActions');

var ProjectStore = require('../stores/ProjectStore');

var DeleteProjectModal = React.createClass({
    getInitialState: function() {
        return _.extend({projectsToImport: {}}, ProjectStore.getState());
    },
    componentWillMount: function() {
    },
    componentDidMount: function() {
        ProjectStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ProjectStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(ProjectStore.getState());
    },
    _deleteProject() {
        ProjectActions.deleteProject(this.props.project);
        this.props.toggleModal();
    },
    render: function() {
        return (
            <ModalContainer>
                <h3>Are you sure you want to delete this project?</h3>
                <div onClick={this.props.toggleModal} id='modalClose'>Cancel</div>
                <button onClick={this._deleteProject}>Delete</button>
            </ModalContainer>
        );
    }
});

module.exports = DeleteProjectModal;
