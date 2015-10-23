var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var LoadingAnimation = require('../components/LoadingAnimation.react');

var ModalContainer = require('../components/ModalContainer.react');

var UserActions = require('../actions/UserActions');


var DeleteProjectModal = React.createClass({
    _deleteProject: function() {
        UserActions.deleteManager(this.props.projectToDelete.id);
        this.props.toggleModal();
    },
    render: function() {
        return (
            <ModalContainer toggleModal={this.props.toggleModal}>
                <h3>Are you sure you want to delete this project?</h3>
                <button onClick={this._deleteProject}>Delete</button>
            </ModalContainer>
        );
    }
});

module.exports = DeleteProjectModal;
