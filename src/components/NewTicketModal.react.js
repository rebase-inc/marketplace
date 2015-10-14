var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');
var Icons = require('../components/Icons.react');

var GithubActions = require('../actions/GithubActions');

var GithubStore = require('../stores/GithubStore');

var viewConstants = require('../constants/viewConstants');
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var ImportProjectModal = React.createClass({
    propTypes: {
        organization: React.PropTypes.object.isRequired,
    },
    getInitialState: () => ({ githubSync: true }),
    toggleGithubSync: function() {
        this.setState({ githubSync: !this.state.githubSync });
    },
    _createTicket: () => {
        let title = ReactDOM.findDOMNode(this.refs.ticketTitle).value;
        let project = this.props.organization.projects[0];
        if (this.state.githubSync) {
            TicketActions.createGithubTicket(project, title);
        } else {
            TicketActions.createInternalTicket(project, title);
        }
    },
    render: function() {
        return (
            <ModalContainer>
                <div onClick={this.props.toggleModal} id='modalClose'>
                    <img src='img/modal-close.svg'/>
                </div>
                <h3>Create New Ticket</h3>
                <h4>{`${this.props.organization.projects[0].name} (${this.props.organization.name})`}</h4>
                <Icons.Checkbox toggle={this.toggleGithubSync} checked={this.state.githubSync} label='Sync with GitHub'/>
                <textarea required ref='ticketTitle' placeholder="Give your ticket a title" />
                <button>Create Ticket</button>
            </ModalContainer>
        );
    }
});

module.exports = ImportProjectModal;
