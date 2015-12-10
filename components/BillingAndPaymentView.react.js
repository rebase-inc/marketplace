import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreditListView from './CreditListView.react';
import DebitListView from './DebitListView.react';

import * as DebitAndCreditActions from '../actions/DebitAndCreditActions';

export default class BillingAndPaymentView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        selectView: PropTypes.func.isRequired
    }
    constructor(props, context) {
        super(props, context);

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    componentDidMount() {
        if (this.props.role.type == 'contractor') {
            this.props.actions.getCredits()
        } else {
            this.props.actions.getDebits()
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            if (role.type == 'contractor') {
                this.props.actions.getCredits()
            } else {
                this.props.actions.getDebits()
            }
        }
    }
    render() {
        const { debits, credits, user, role, actions } = this.props;
        if (role.type=='contractor') {
            return <CreditListView credits={credits.items.toList().toJS()} loading={credits.isFetching} selectView={this.props.selectView}/>
        } else {
            return <DebitListView debits={debits.items.toList().toJS()} loading={debits.isFetching} selectView={this.props.selectView}/>;
        }

    }
};

let mapStateToProps = state => ({ debits: state.debits, credits: state.credits });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(DebitAndCreditActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(BillingAndPaymentView);
