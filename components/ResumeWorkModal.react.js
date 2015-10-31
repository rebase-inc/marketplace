import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';

export default class ResumeWorkModal extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        markWorkUnblocked: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { text: '' };
    }

    render() {
        const { close, markWorkUnblocked } = this.props;
        return (
            <ModalContainer close={close}>
                <h3>Not blocked anymore?</h3>
                <h4>You'll be able to resume work on this task</h4>
                <textarea required ref='comment' onChange={(e) => this.setState({ text: e.target.value })} placeholder='Please leave a comment describing why you are no longer blocked.'/>
                <button className='needsResolution' onClick={() => { markWorkUnblocked(this.state.text); close() }}>Remove Block</button>
            </ModalContainer>
        );
    }
};
