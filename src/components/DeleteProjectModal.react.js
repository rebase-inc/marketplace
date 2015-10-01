var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var LoadingAnimation = require('../components/LoadingAnimation.react');

var ModalContainer = require('../components/ModalContainer.react');

var ProjectActions = require('../actions/ProjectActions');


var DeleteProjectModal = React.createClass({
    _deleteProject: function() {
        this.props.deleteProject(this.props.projectToDelete);
        this.props.toggleModal();
    },
    render: function() {
        return (
            <ModalContainer>
                <h3>Are you sure you want to delete this project?</h3>
                <div onClick={this.props.toggleModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <button onClick={this._deleteProject}>Delete</button>
            </ModalContainer>
        );
    }
});

module.exports = DeleteProjectModal;
