import React, { Component, PropTypes } from 'react';

// Redux imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// External imports
import Tooltip from 'rc-tooltip';

// Project Component Imports
import ListTitleBar from './ListTitleBar.react';
import NewTicketIcon from './NewTicketIcon.react';
import NoTicketsView from './NoTicketsView.react';
import SingleTicketView from './SingleTicketView.react';
import SortIcon from './SortIcon.react';
import Ticket from './Ticket.react';
import TicketListView from './TicketListView.react';
import WalkthroughStep from './WalkthroughStep.react';

// Project Action Imports
import * as TicketActions from '../actions/TicketActions';
import * as WalkthroughActions from '../actions/WalkthroughActions';

// Project Constant Imports
import { CURRENT_VIEW } from '../constants/WalkthroughConstants';
import { NEWEST, OLDEST } from '../utils/sort';

// TODO: Handle ticket lifecycle with a higher order component
class TicketView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        tickets: PropTypes.array.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUpdate = this.componentWillUpdate.bind(this);
        this.state = { sort: NEWEST };
    }
    componentWillMount() {
        this.props.actions.getTickets()
        if (this.props.tickets.length && !this.props.ticket) {
            this.props.actions.selectTicket(this.props.tickets[0].id);
        }
    }
    componentWillUpdate(prevProps) {
        // If the role has changed, we want to make sure to get the new role's tickets
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getTickets()
        }

        // If a ticket hasn't been selected by the user, we'll select the first available
        // just so that we have something to render
        if (this.props.tickets.length && !this.props.ticket) {
            this.props.actions.selectTicket(this.props.tickets[0].id);
        }
    }
    render() {
        const { actions, role, loading, ticket, tickets, user, walkthrough } = this.props;
        if (!loading && !tickets.length) { return <NoTicketsView {...this.props} /> }
        return (
            <div className='mainView'>
                <Tooltip visible={walkthrough == CURRENT_VIEW} overlay={<TicketViewWalkthrough {...actions} role_id={role.id} last={true} />} placement='right'>
                    <div className='listView noselect'>
                        <ListTitleBar title={'All Tickets'}>
                            <SortIcon onClick={() => this.setState((s) => ({ sort: s.sort == NEWEST ? OLDEST : NEWEST }))}/>
                            <NewTicketIcon onClick={actions.openNewTicketModal} />
                        </ListTitleBar>
                        <TicketListView
                            selectedId={ticket ? ticket.id : 0}
                            role={role}
                            sort={this.state.sort}
                        />
                    </div>
                </Tooltip>
                <SingleTicketView ticket={ticket} actions={actions} role={role} user={user} />
            </div>
       );
    }
}

const TicketViewWalkthrough = (props) => (
    <WalkthroughStep {...props}
        title={'Your New Tickets'}
        description={'A list of all of the tickets in this project with information about their technology requirements.'} />
);

let mapStateToProps = state => ({
    loading: state.tickets.isFetching,
    tickets: state.tickets.items.toList().toJS(),
    ticket: state.ticketID ? state.tickets.items.get(state.ticketID).toJS() : null,
    viewIsFetching: state.view.isFetching,
    walkthrough: state.walkthrough.steps[state.walkthrough.current],
});
let mapDispatchToProps = dispatch => ({
    actions: Object.assign({},
               bindActionCreators(TicketActions, dispatch),
               bindActionCreators(WalkthroughActions, dispatch))
})
export default connect(mapStateToProps, mapDispatchToProps)(TicketView);
