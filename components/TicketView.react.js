import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';

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

// begging to be abstracted and reused for AuctionView, ContractView, ReviewView
export default class TicketView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        tickets: PropTypes.instanceOf(Immutable.Record).isRequired,
    }
    constructor(props, context) {
        super(props, context);

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
    render() {
        const { ticketID, tickets, user, role, actions } = this.props;
        // If there aren't any tickets to display and we're not in the process of finding any,
        // display the nothing here screen, with some actions to help the user get out of this state.
        if (ticketID) {
            return <SingleTicketView ticket={tickets.items.get(ticketID).toJS()} actions={actions} role={role} user={user} />
        } else if (!tickets.items.size && !tickets.isFetching) {
            return <NoTicketsHere openNewTicketModal={actions.openNewTicketModal} />;
        } else {
            return <TicketListView select={actions.selectTicket} tickets={tickets.items.toList().toJS()} loading={tickets.isFetching} />;
        }

    }
};

export class TicketListView extends Component {
    static propTypes = {
        select: PropTypes.func.isRequired,
        tickets: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('newest') };
    }
    render() {
        const { select, tickets, loading } = this.props;
        const { searchText, sort } = this.state;
        return (
            <div className='contentView'>
                <SearchBar searchText={searchText} onUserInput={(input) => this.setState({ searchText: input })}>
                    {/*<PlusIcon onClick={actions.openNewTicketModal} text={'Add ticket'} />*/}
                    <SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={sort} />
                </SearchBar>
                <TicketList searchText={searchText} select={select} sort={sort} tickets={tickets} loading={loading} />
            </div>
        );
    }

}

export class NoTicketsHere extends Component {
    static propTypes = { openNewTicketModal: PropTypes.func.isRequired }
    render() {
        return (
            <NothingHere>
                <h3>Your Tickets</h3>
                <h4>If you have unassigned tickets, they'll appear here. Tickets can be created on Rebase or imported from GitHub</h4>
                <div>
                    <button onClick={this.props.openNewTicketModal}>Add New Ticket</button>
                    <button data-notification>Import Project</button>
                </div>
            </NothingHere>

        );
    }
}

let mapStateToProps = state => ({ tickets: state.tickets, ticketID: state.ticketID });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(TicketActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(TicketView);
