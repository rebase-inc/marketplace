import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuctionActions from '../actions/AuctionActions';
import { NEW } from '../constants/ViewConstants';
import { NEWEST, OLDEST } from '../utils/sort';

import SingleAuctionView from './SingleAuctionView.react';
import SortIcon from './SortIcon.react';
import SearchBar from './SearchBar.react';
import ListTitleBar from './ListTitleBar.react';
import NoAuctionsView from './NoAuctionsView.react';
import Auction from './Auction.react';

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

        // If an auction hasn't been selected by the user, we'll select the first available
        // just so that we have something to render
        if (this.props.auctions.length && !this.props.auction) {
            this.props.actions.selectAuction(this.props.auctions[0].id);
        }
    }
    render() {
        const { auction, auctions, searchText, updateSearchText, user, role, actions, selectView } = this.props;
        if (!auctions.length) { return <NoAuctionsView {...this.props} /> }
        return (
            <div className='mainView'>
                <div className='listView noselect'>
                    <ListTitleBar title={'All Offered Work'}>
                        <SortIcon onClick={() => this.setState((s) => ({ sort: s.sort == NEWEST ? OLDEST : NEWEST }))}/>
                    </ListTitleBar>
                    <div className='scrollable'>
                        <SearchBar searchText={searchText} onChange={updateSearchText} />
                        { auctions.sort(this.state.sort).map(a => <Auction {...a} role={role} handleClick={actions.selectAuction.bind(null, a.id)} selected={a.id == auction.id} />) }
                    </div>
                </div>
                { auction ? <SingleAuctionView auction={auction} actions={actions} role={role} user={user} /> : null }
            </div>
        );
    }
}

let mapStateToProps = state => ({
    auctions: state.auctions.items.toList().toJS(),
    auction: state.auctionID ? state.auctions.items.get(state.auctionID).toJS() : null,
});
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(AuctionActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(AuctionView);
