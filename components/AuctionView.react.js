import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuctionActions from '../actions/AuctionActions';
import * as NotificationActions from '../actions/NotificationActions';
import { NEW } from '../constants/ViewConstants';
import { NEWEST, OLDEST } from '../utils/sort';

import Auction from './Auction.react';
import AuctionListView from './AuctionListView.react';
import ListTitleBar from './ListTitleBar.react';
import NoAuctionsView from './NoAuctionsView.react';
import SingleAuctionView from './SingleAuctionView.react';
import SortIcon from './SortIcon.react';

export default class AuctionView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.state = { sort: NEWEST };
    }
    componentDidMount() {
        this.props.actions.getAuctions()
    }
    componentDidUpdate(prevProps) {
        // If the role has changed, we want to make sure to get the new role's auctions
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getAuctions()
        }
    }
    render() {
        const { actions, auction, auctions, role, user } = this.props;
        if (!auctions.length) { return <NoAuctionsView {...this.props} /> }
        return (
            <div className='mainView'>
                <div className='listView noselect'>
                    <ListTitleBar title={'All Offered Work'}>
                        <SortIcon onClick={() => this.setState((s) => ({ sort: s.sort == NEWEST ? OLDEST : NEWEST }))}/>
                    </ListTitleBar>
                    <AuctionListView
                        selectedId={auction ? auction.id : 0}
                        role={role}
                        sort={this.state.sort}
                    />
                </div>
                <SingleAuctionView auction={auction} actions={actions} role={role} user={user} />
            </div>
        );
    }
}

let mapStateToProps = state => ({
    auctions: state.auctions.items.toList().toJS(),
    auction: state.auctions.items.get(state.auctionID) ? state.auctions.items.get(state.auctionID).toJS() : null,
});
let mapDispatchToProps = dispatch => ({
    actions: Object.assign({},
               bindActionCreators(AuctionActions, dispatch),
               bindActionCreators(NotificationActions, dispatch))
})
export default connect(mapStateToProps, mapDispatchToProps)(AuctionView);
