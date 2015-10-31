var React = require('react');
var ReactDOM = require('react-dom');
var keyMirror = require('keymirror');

var ModalContainer = require('../components/ModalContainer.react');
var RatingStars = require('../components/RatingStars.react');

var ContractActions = require('../actions/ContractActions');
var MediationActions = require('../actions/MediationActions');

var ModalStates = keyMirror({ NEW: null, GIVE_UP: null, BACK_TO_WORK: null, COMPLETE: null });

// TODO: Overhaul
var ResolveMediationModal = React.createClass({
    getInitialState: function() {
        return {
            view: ModalStates.NEW,
            text: '',
        }
    },
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    handleInput: function() {
        this.setState({ text: ReactDOM.findDOMNode(this.refs.comment).value });
    },
    markFailed: function() {
        MediationActions.answerFailed(this.props.currentRole, this.props.currentContract.work.mediation[0]);
    },
    markPartial: function() {
        MediationActions.answerPartiallyComplete(this.props.currentRole, this.props.currentContract.work.mediation[0]);
    },
    markComplete: function() {
        MediationActions.answerComplete(this.props.currentRole, this.props.currentContract.work.mediation[0]);
    },
    changeModalView: function(state) {
        this.setState({ view: state });
    },
    render: function() {
        switch (this.state.view) {
            case ModalStates.NEW:
                return (
                    <ModalContainer toggleModal={this.props.closeModal}>
                        <h3>How should the developer continue?</h3>
                        <textarea required ref='comment' placeholder="Leave a comment explaining your decision." value={this.state.text} onChange={this.handleInput}/>
                        <button className='warning' onClick={this.changeModalView.bind(null, ModalStates.GIVE_UP)}>Give Up</button>
                        <button className='needsResolution' onClick={this.changeModalView.bind(null, ModalStates.BACK_TO_WORK)}>Back to work</button>
                        <button onClick={this.changeModalView.bind(null, ModalStates.COMPLETE)}>Call it good</button>
                    </ModalContainer>
                );
                break;
            case ModalStates.GIVE_UP:
                return (
                    <ModalContainer toggleModal={this.props.closeModal}>
                        <h3>Mark the developer's work failed?</h3>
                        <h4>If agreed upon, the developer will not be paid.</h4>
                        <textarea required ref='comment' placeholder="Leave a comment explaining why you don't think it's worth continuing." value={this.state.text} onChange={this.handleInput}/>
                        <button className='warning' onClick={this.markFailed}>Mark Work Failed</button>
                        <h5 onClick={this.changeModalView.bind(null, ModalStates.NEW)}>Oops. Go back.</h5>
                    </ModalContainer>
                );
                break;
            case ModalStates.BACK_TO_WORK:
                return (
                    <ModalContainer toggleModal={this.props.closeModal}>
                        <h3>Have the developer go back to work?</h3>
                        <h4>If agreed upon, the developer will continue to work on the task.</h4>
                        <textarea required ref='comment' placeholder="Leave a comment explaining your decision." value={this.state.text} onChange={this.handleInput}/>
                        <button className='needsResolution' onClick={this.markPartial}>Go back to work</button>
                        <h5 onClick={this.changeModalView.bind(null, ModalStates.NEW)}>Oops. Go back.</h5>
                    </ModalContainer>
                );
                break;
            case ModalStates.COMPLETE:
                return (
                    <ModalContainer toggleModal={this.props.closeModal}>
                        <h3>Mark the work finished?</h3>
                        <h4>The work will immediately be marked complete.</h4>
                        <textarea required ref='comment' placeholder="Leave a comment explaining what changed your mind." value={this.state.text} onChange={this.handleInput}/>
                        <button onClick={this.markComplete}>Mark Complete</button>
                        <h5 onClick={this.changeModalView.bind(null, ModalStates.NEW)}>Oops. Go back.</h5>
                    </ModalContainer>
                );
                break;
            default: throw 'INVALID MODAL STATE'; break;
        }
    }
});

module.exports = ResolveMediationModal;
