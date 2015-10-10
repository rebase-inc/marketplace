var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');

var ContractActions = require('../actions/ContractActions');

var HaltWorkModal = React.createClass({
    propTypes: {
        closeModal: React.PropTypes.func.isRequired,
        currentContract: React.PropTypes.object.isRequired,
    },
    markBlocked: function() {
        var reason = ReactDOM.findDOMNode(this.refs.comment).value;
        if (!reason.length) { return; }
        ContractActions.markWorkBlocked(this.props.currentUser, this.props.currentContract.work, reason);
        this.props.closeModal();
    },
    render: function() {
        return (
            <ModalContainer toggleModal={this.props.closeModal}>
                <h3>Blocked?</h3>
                <h4>Let the client know you need something to continue</h4>
                <textarea required ref='comment' placeholder='Please leave a comment describing why you are blocked.'/>
                <button className='needsResolution' onClick={this.markBlocked}>Mark Blocked</button>
            </ModalContainer>
        );
    }
});

module.exports = HaltWorkModal;
