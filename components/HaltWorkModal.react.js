import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';

export default class SubmitWorkModal extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        markWorkBlocked: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { text: '' };
    }

    render() {
        const { close, markWorkBlocked } = this.props;
        return (
            <ModalContainer close={close}>
                <h3>Blocked?</h3>
                <h4>Let the client know you need something to continue</h4>
                <textarea required ref='comment' onChange={(e) => this.setState({ text: e.target.value })} placeholder='Please leave a comment describing why you are blocked.'/>
                <button className='needsResolution' onClick={() => { markWorkBlocked(this.state.text); close() }}>Mark Blocked</button>
            </ModalContainer>
        );
    }
};
