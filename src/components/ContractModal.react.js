var React = require('react');

var ContractModal = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            stateChangeSubmitted: false,
            missingInput: false,
        }
    },
    markBlocked: function() {
        var reason = ReactDOM.findDOMNode(this.refs.comment).value;
        this.setState({ missingInput: !reason.length });
        if (!reason.length) { return; }
        this.props.markBlocked(reason);
    },
    markUnblocked: function() {
        var reason = ReactDOM.findDOMNode(this.refs.comment).value;
        this.setState({ missingInput: !reason.length });
        if (!reason.length) { return; }
        this.props.markUnblocked(reason);
    },
    markComplete: function() {
        var reason = ReactDOM.findDOMNode(this.refs.comment).value;
        this.setState({ missingInput: !reason.length });
        this.props.markComplete(reason);
    },
    render: function() {
        switch (this.props.currentContract.work.state) {
            case 'markComplete':
                return (
                    <ModalContainer toggleModal={this.props.closeModal}>
                        <h3>All done?</h3>
                        <h4>The task will be sent to the client for approval.</h4>
                        <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Leave a short comment describing the work you did (optional)'/>
                        <button onClick={this.markComplete}>Submit Work</button>
                    </ModalContainer>
                );
                break;
            case 'markBlocked':
                return (
                    <ModalContainer toggleModal={this.props.closeModal}>
                        <h3>Blocked?</h3>
                        <h4>Let the client know you need something to continue</h4>
                        <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Please leave a comment describing why you are blocked.'/>
                        <button className='needsResolution' onClick={this.markBlocked}>Mark Blocked</button>
                    </ModalContainer>
                );
                break;
            case 'blocked':
                return (
                    <ModalContainer toggleModal={this.props.closeModal}>
                        <h3>Not blocked anymore?</h3>
                        <h4>You'll be able to resume work on this task</h4>
                        <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Please leave a comment describing why you are no longer blocked.'/>
                        <button className='needsResolution' onClick={this.markUnblocked}>Remove Block</button>
                    </ModalContainer>
                );
                break;
            case 'resolveMediation':
                return (
                    <ModalContainer toggleModal={this.props.closeModal}>
                        <h3>The client doesn't agree that you're finished with the work.</h3>
                        <h4>How do you want to resolve? You should discuss with the client before making a final decision.</h4>
                        <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Leave a comment explaining your decision'/>
                        <button className='needsResolution' onClick={this.giveUp}>Give up</button>
                        <button className='needsResolution' onClick={this.dispute}>Dispute</button>
                        <button className='needsResolution' onClick={this.returnToWork}>Fix client issue</button>
                    </ModalContainer>
                );
                break;
            default: console.warn('Unknown state ' , this.props.currentContract.work.state); break;
        }
    }
});

module.exports = ContractModal;
