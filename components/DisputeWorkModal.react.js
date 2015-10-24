var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');
var RatingStars = require('../components/RatingStars.react');

var ContractActions = require('../actions/ContractActions');

var DisputeWorkModal = React.createClass({
    getInitialState: function() {
        return { rating: 0, text: '' }
    },
    disputeCompletion: function() {
        var reason = ReactDOM.findDOMNode(this.refs.comment).value;
        ContractActions.disputeWork(this.props.currentUser, this.props.currentContract.work, reason);
        this.props.closeModal();
    },
    render: function() {
        return (
            <ModalContainer toggleModal={this.props.closeModal}>
                <h3>Dispute Developer Work</h3>
                <textarea required ref='comment' placeholder="Leave a comment explaining why the work isn't yet complete."/>
                <button className='warning' onClick={this.disputeCompletion}>Dispute</button>
            </ModalContainer>
        );
    }
});

module.exports = DisputeWorkModal;
