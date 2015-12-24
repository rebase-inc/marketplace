import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuctionActions from '../actions/AuctionActions';
import { NEW } from '../constants/ViewConstants';

import SingleAuctionView from './SingleAuctionView.react';
import AuctionListView from './AuctionListView.react';
import NothingHere from './NothingHere.react';

export default class AuctionView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    componentDidMount() {
        this.props.actions.getAuctions()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getAuctions()
        }
    }
    render() {
        const { auctionID, auctions, user, role, actions, selectView } = this.props;
        const auction = auctions.items.size ? (auctions.items.get(auctionID) || auctions.items.first()).toJS() : null;
        return (
            <div className='mainView'>
                <AuctionListView role={role} auction={auction} select={actions.selectAuction} selectView={selectView} auctions={auctions.items.toList().toJS()} loading={auctions.isFetching} />
                { auction ? <SingleAuctionView auction={auction} actions={actions} role={role} user={user} /> : null }
            </div>
        );
    }
}

let mapStateToProps = state => ({ auctions: state.auctions, auctionID: state.auctionID });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(AuctionActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(AuctionView);
