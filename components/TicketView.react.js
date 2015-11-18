import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SingleTicketView from './SingleTicketView.react';
import TicketList from './TicketList.react';
import SearchBar from './SearchBar.react';
import NothingHere from './NothingHere.react';
import PlusIcon from './PlusIcon.react';

import * as TicketActions from '../actions/TicketActions';

export default class TicketView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '' };

        // TODO: Look into autobinding. React-redux examples projects have it, but not sure what they use
        this.handleUserInput = this.handleUserInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        this.props.actions.getTickets()
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { ticket, tickets, user, roles, actions } = this.props;
        // If there aren't any tickets to display and we're not in the process of finding any,
        // display the nothing here screen, with some actions to help the user get out of this state.
        if (!tickets.items.size && !tickets.isFetching) {
            return (
                <NothingHere>
                    <h3>In order to get some work done, you first need some tasks</h3>
                    <button>Import Another Project</button>
                    <span>OR</span>
                    <button className='notification' onClick={actions.openNewTicketModal}>Add a Task</button>
                </NothingHere>
            );
        }
        if (!!ticket.id) {
            return <SingleTicketView
                    ticket={tickets.items.get(ticket.id)}
                    openNewAuctionModal={actions.openNewAuctionModal}
                    unselect={() => actions.selectTicket(null)}
                    submitComment={actions.commentOnTicket.bind(null, user, tickets.items.get(ticket.id))} // Do we really need the user object to comment on a ticket?!?
                    user={user} roles={roles} />;
        } else {
            return (
                <div className='contentView'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}>
                        <PlusIcon onClick={actions.openNewTicketModal} text={'Add ticket'} />
                    </SearchBar>
                    <TicketList select={actions.selectTicket} tickets={Array.from(tickets.items.values())} />
                </div>
            );
        }

    }
};

let mapStateToProps = state => ({ tickets: state.tickets, ticket: state.ticket });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(TicketActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(TicketView);
