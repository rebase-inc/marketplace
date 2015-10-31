var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');
var Icons = require('../components/Icons.react');

var TicketActions = require('../actions/TicketActions');

var viewConstants = require('../constants/viewConstants');
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

class ImportProjectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { githubSync: true };
        this.toggleGithubSync = this.toggleGithubSync.bind(this);
        this._createTicket = this._createTicket.bind(this);
    }
    toggleGithubSync() {
        this.setState({ githubSync: !this.state.githubSync });
    }
    _createTicket() {
        let title = ReactDOM.findDOMNode(this.refs.ticketTitle).value;
        if (this.state.githubSync) {
            TicketActions.createGithubTicket(this.props.project, title);
        } else {
            TicketActions.createInternalTicket(this.props.project, title);
        }
    }
    render() {
        return (
            <ModalContainer toggleModal={this.props.toggleModal}>
                <h3>Create New Ticket</h3>
                <h4>{`${this.props.project.name} (${this.props.project.organization.name})`}</h4>
                <Icons.Checkbox toggle={this.toggleGithubSync} checked={this.state.githubSync} label='Sync with GitHub'/>
                <textarea required ref='ticketTitle' placeholder="Give your ticket a title" />
                <button onClick={this._createTicket}>Create Ticket</button>
            </ModalContainer>
        );
    }
}

module.exports = ImportProjectModal;
