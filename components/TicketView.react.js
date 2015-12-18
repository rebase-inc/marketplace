import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SingleTicketView from './SingleTicketView.react';
import TicketListView from './TicketListView.react';

import * as TicketActions from '../actions/TicketActions';

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
        const ticket = tickets.items.size ? (tickets.items.get(ticketID) || tickets.items.first()).toJS() : null;
        return (
            <div className='mainView'>
                <TicketListView select={actions.selectTicket} ticket={ticket} tickets={tickets.items.toList().toJS()} loading={tickets.isFetching} />
                { ticket ? <SingleTicketView ticket={tickets.items.get(ticketID).toJS()} actions={actions} role={role} user={user} /> : null }
            </div>
        );
    }
};

let mapStateToProps = state => ({ tickets: state.tickets, ticketID: state.ticketID });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(TicketActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(TicketView);
