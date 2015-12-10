import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';

export default class AddSSHKeyModal extends Component {
    static propTypes = { }

    constructor(props, context) {
        super(props, context);
        this.state = { key: '', title: '' }
    }

    render() {
        // The fact that we manually call close after submitting the work is a hack.
        // Instead, we should be looking at the isFetching field of the work on the contract.
        // That will matter for error handling (e.g., a submit work action fails)
        const { close, addSSHKey } = this.props;
        const { key, title } = this.state;
        return (
            <ModalContainer close={close}>
                <h3>Add New SSH Key</h3>
                <input type='text' placeholder='Give your key a title (optional)' value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} />
                <textarea required value={this.state.key} onChange={(e) => this.setState({ key: e.target.value })} ref='comment' placeholder='Paste public key here'/>
                <button onClick={() => addSSHKey(key, title)}>Add Key</button>
            </ModalContainer>
        );
    }
};
