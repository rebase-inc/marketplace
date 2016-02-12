import React, { Component, PropTypes } from 'react';

// Redux imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// External imports
import Tooltip from 'rc-tooltip';

// Project Component Imports
import SingleTicketView from './SingleTicketView.react';
import WalkthroughStep from './WalkthroughStep.react';
import ListTitleBar from './ListTitleBar.react';
import SearchBar from './SearchBar.react';
import Ticket from './Ticket.react';

// Project Action Imports
import * as TicketActions from '../actions/TicketActions';
import * as WalkthroughActions from '../actions/WalkthroughActions';

// Project Constant Imports
import { CURRENT_VIEW } from '../constants/WalkthroughConstants';

// TODO: Handle ticket lifecycle with a higher order component
class TicketView extends Component {
    static propTypes = {
        searchText: PropTypes.string,
        updateSearchText: PropTypes.func,
        user: PropTypes.object.isRequired,
        tickets: PropTypes.array.isRequired,
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
        const { walkthrough, actions, searchText, updateSearchText, ticket, tickets, user, role } = this.props;
        return (
            <div className='mainView'>
                <Tooltip visible={walkthrough == CURRENT_VIEW} overlay={<TicketViewWalkthrough {...actions} last={true} />} placement='right'>
                    <div className='listView noselect'>
                        <ListTitleBar title={'All Tickets'}>
                            {/*<RebaseIcon />*/}
                        </ListTitleBar>
                        <div className='scrollable'>
                            <SearchBar searchText={searchText} onChange={updateSearchText} />
                            { tickets.map(t => <Ticket {...t} handleClick={actions.selectTicket.bind(null, t.id)} selected={t.id == ticket.id} />) }
                        </div>
                    </div>
                </Tooltip>
                { ticket ? <SingleTicketView ticket={ticket} actions={actions} role={role} user={user} /> : null }
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
    tickets: state.tickets.items.toList().toJS(),
    ticket: state.ticketID ? state.tickets.items.get(state.ticketID).toJS() : null,
    walkthrough: state.walkthrough.steps[state.walkthrough.current],
});
let mapDispatchToProps = dispatch => ({
    actions: Object.assign({},
               bindActionCreators(TicketActions, dispatch),
               bindActionCreators(WalkthroughActions, dispatch))
})
export default connect(mapStateToProps, mapDispatchToProps)(TicketView);
