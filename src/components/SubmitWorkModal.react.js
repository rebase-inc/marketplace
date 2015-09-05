var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');

var ContractActions = require('../actions/ContractActions');

var ContractModal = React.createClass({
    markComplete: function() {
        var reason = ReactDOM.findDOMNode(this.refs.comment).value;
        ContractActions.markComplete(this.props.currentUser, this.props.currentContract, reason);
        this.props.closeModal();
    },
    render: function() {
        return (
            <ModalContainer>
                <div onClick={this.props.closeModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>All done?</h3>
                <h4>The task will be sent to the client for approval.</h4>
                <textarea required ref='comment' placeholder='Leave a short comment describing the work you did (optional)'/>
                <button onClick={this.markComplete}>Submit Work</button>
            </ModalContainer>
        );
    }
});

module.exports = ContractModal;
