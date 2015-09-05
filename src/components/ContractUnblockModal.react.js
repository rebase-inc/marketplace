var React = require('react');

var ContractModal = React.createClass({
    getInitialState: function() {
        return { text: '', missingInput: false, }
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
            return (
                <ModalContainer>
                    <div onClick={this.props.closeModal} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    <h3>Not blocked anymore?</h3>
                    <h4>You'll be able to resume work on this task</h4>
                    <textarea className={this.state.missingInput ? 'error' : null} ref='comment' placeholder='Please leave a comment describing why you are no longer blocked.'/>
                    <button className='needsResolution' onClick={this.markUnblocked}>Remove Block</button>
                </ModalContainer>
            );
        }
    }
});

module.exports = ContractModal;
