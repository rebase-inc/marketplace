import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';
import { Checkbox } from './Icons.react';

export default class NewTicketModal extends Component {
    static propTypes = {
        createGithubTicket: PropTypes.func.isRequired,
        createInternalTicket: PropTypes.func.isRequired,
        close: PropTypes.func.isRequired,
        project: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.state = { syncWithGithub: false };
        this.toggleGithubSync = this.toggleGithubSync.bind(this);
        this.createTicket = this.createTicket.bind(this);
    }
    toggleGithubSync() {
        this.setState({ syncWithGithub: !this.state.syncWithGithub });
    }
    createTicket() {
        const title = ReactDOM.findDOMNode(this.refs.title).value;
        const comment = ReactDOM.findDOMNode(this.refs.comment).value;
        if (this.state.syncWithGithub) {
            this.props.createGithubTicket(this.props.project, title);
        } else {
            this.props.createInternalTicket(title, comment);
        }
        this.props.close(); // hack. TODO: Use the markAsClosed functionality like in ImportProjectModal
    }
    render() {
        const { close, project } = this.props;
        return (
            <ModalContainer close={close}>
                <h3>{'Create New Task'}</h3>
                <h4>{`${project.name} (${project.organization.name})`}</h4>
                {/*<Checkbox toggle={this.toggleGithubSync} checked={this.state.syncWithGithub} label='Sync with GitHub'/>*/}
                <input type='text' required ref='title' placeholder='Title' />
                <textarea required ref='comment' placeholder='Leave a comment' />
                <button onClick={this.createTicket}>Create Task</button>
            </ModalContainer>
        );
    }
}
