import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ListView from './ListView.react';
import { selectAuction } from '../actions/AuctionActions';
import Auction from './Auction.react';
import { searchAuctions } from '../utils/search';
import { getAuctionTicket } from '../utils/getters';


export class AuctionListView extends ListView {
    constructor(props, context) {
        super(props, context);
        this.getTicket = getAuctionTicket;
        this.Item = Auction;
    }
}

let mapStateToProps = function (state) {
    const _auctions = state.auctions.items.toList().toJS();
    return {
        items: _auctions,
        loading: state.auctions.isFetching,
        search: searchAuctions(_auctions),
    };
}

let mapDispatchToProps = dispatch => ({ selectView: bindActionCreators(selectAuction, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(AuctionListView);
