import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ListView from './ListView.react';
import { selectTicket } from '../actions/TicketActions';
import Ticket from './Ticket.react';
import { searchTickets } from '../utils/search';
import { getTicketTicket } from '../utils/getters';


export class TicketListView extends ListView {
    constructor(props, context) {
        super(props, context);
        this.getTicket = (ticket) => ticket;
        this.Item = Ticket;
    }
}

let mapStateToProps = function (state) {
    const _tickets = state.tickets.items.toList().toJS();
    return {
        items: _tickets,
        loading: state.tickets.isFetching,
        search: searchTickets(_tickets),
    };
}

let mapDispatchToProps = dispatch => ({ selectView: bindActionCreators(selectTicket, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(TicketListView);
