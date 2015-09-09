var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');
var RatingStars = require('../components/RatingStars.react');

var ContractActions = require('../actions/ContractActions');

var CompleteWorkModal = React.createClass({
    getInitialState: function() {
        return { rating: 0, text: '' }
    },
    markComplete: function() {
        var reason = ReactDOM.findDOMNode(this.refs.comment).value;
        ContractActions.markWorkComplete(this.props.currentUser, this.props.currentContract.work, reason);
        this.props.closeModal();
    },
    setRating: function(rating) {
        this.setState({ rating: rating });
    },
    render: function() {
        return (
            <ModalContainer>
                <div onClick={this.props.closeModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>Rate Developer Work</h3>
                <RatingStars rating={this.state.rating} setRating={this.setRating} labeled={true} />
                <textarea required ref='comment' placeholder="Leave a short review of the developer's work (optional)"/>
                <button onClick={this.markComplete}>Submit Work</button>
            </ModalContainer>
        );
    }
});

module.exports = CompleteWorkModal;
