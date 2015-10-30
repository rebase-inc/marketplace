import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';

export default class SubmitWorkModal extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        submitWork: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { rating: 0, text: '' }
    }

    render() {
        const { close, submitWork } = this.props;
        // The fact that we manually call close after submitting the work is a hack.
        // Instead, we should be looking at the isFetching field of the work on the contract.
        // That will matter for error handling (e.g., a submit work action fails)
        return (
            <ModalContainer close={close}>
                <h3>All done?</h3>
                <h4>The task will be sent to the client for approval.</h4>
                <textarea required onChange={(e) => this.setState({ text: e.target.value })} ref='comment' placeholder='Leave a short comment describing the work you did (optional)'/>
                <button onClick={() => { submitWork(this.state.text); close() }}>Submit Work</button>
            </ModalContainer>
        );
    }
};
