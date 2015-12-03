import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SingleTicketView from './SingleTicketView.react';
import TicketList from './TicketList.react';
import SearchBar from './SearchBar.react';
import NothingHere from './NothingHere.react';
import PlusIcon from './PlusIcon.react';
import SortOptions from './SortOptions.react';

import * as TicketActions from '../actions/TicketActions';

const SortFunctions = new Map([
    ['newest', (a, b) => new Date(b.created) - new Date(a.created)],
    ['oldest', (a, b) => new Date(a.created) - new Date(b.created)],
    ['most comments', (a, b) => b.comments.length - a.comments.length],
    ['fewest comments', (a, b) => a.comments.length - b.comments.length],
]);

export default class TicketView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('newest') };

        // TODO: Look into autobinding. React-redux examples projects have it, but not sure what they use
        this.handleUserInput = this.handleUserInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    componentDidMount() {
        this.props.actions.getTickets()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getTickets()
        }
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { ticket, tickets, user, roles, actions } = this.props;
        // If there aren't any tickets to display and we're not in the process of finding any,
        // display the nothing here screen, with some actions to help the user get out of this state.
        if (!!ticket.id) {
            return <SingleTicketView
                    ticket={tickets.items.get(ticket.id)}
                    openNewAuctionModal={actions.openNewAuctionModal}
                    unselect={() => actions.selectTicket(null)}
                    submitComment={actions.commentOnTicket.bind(null, user, tickets.items.get(ticket.id))} // Do we really need the user object to comment on a ticket?!?
                    user={user} roles={roles} />;
        } else if (!tickets.items.size && !tickets.isFetching) {
            return (
                <NothingHere>
                    <h3>Your Tickets</h3>
                    <h4>If you have unassigned tickets, they'll appear here. Tickets can be created on Rebase or imported from GitHub</h4>
                    <div>
                        <button onClick={actions.openNewTicketModal}>Add New Ticket</button>
                        <button data-notification>Import Project</button>
                    </div>
                </NothingHere>
            );
        } else {
            return (
                <div className='contentView'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}>
                        {/*<PlusIcon onClick={actions.openNewTicketModal} text={'Add ticket'} />*/}
                        <SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={this.state.sort} />
                    </SearchBar>
                    <TicketList searchText={this.state.searchText} select={actions.selectTicket} sort={this.state.sort} tickets={[...tickets.items.values()]} loading={tickets.isFetching} />
                </div>
            );
        }

    }
};

let mapStateToProps = state => ({ tickets: state.tickets, ticket: state.ticket });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(TicketActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(TicketView);
