import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';

export default class ResumeWorkModal extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
        markWorkUnblocked: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { text: '' };
    }

    render() {
        const { close, role, markWorkUnblocked } = this.props;
        const isManager = role.type == 'manager';
        return (
            <ModalContainer close={close}>
                <h3>{ isManager ? 'Fixed the blocking issue?' : 'Not blocked anymore?' }</h3>
                <h4>{ isManager ? "Tell the developer how the issue was fixed" : "You'll be able to resume work on this task" }</h4>
                <textarea required ref='comment' onChange={(e) => this.setState({ text: e.target.value })} placeholder='Explain the fix'/>
                <button data-okay onClick={() => { markWorkUnblocked(this.state.text); close() }}>Remove Block</button>
            </ModalContainer>
        );
    }
};
