var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');

var ContractActions = require('../actions/ContractActions');

var ResumeWorkModal = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentContract: React.PropTypes.object.isRequired,
        closeModal: React.PropTypes.func.isRequired,
    },
    markUnblocked: function() {
        var reason = ReactDOM.findDOMNode(this.refs.comment).value;
        if (!reason.length) { return; }
        ContractActions.markUnblocked(this.props.currentUser, this.props.currentContract, reason);
        this.props.closeModal();
    },
    render: function() {
        return (
            <ModalContainer>
                <div onClick={this.props.closeModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>Not blocked anymore?</h3>
                <h4>You'll be able to resume work on this task</h4>
                <textarea required ref='comment' placeholder='Please leave a comment describing why you are no longer blocked.'/>
                <button className='needsResolution' onClick={this.markUnblocked}>Remove Block</button>
            </ModalContainer>
        );
    }
});

module.exports = ResumeWorkModal;
