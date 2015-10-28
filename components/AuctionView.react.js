import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuctionActions from '../actions/AuctionActions';

import SearchBar from './SearchBar.react';
import AuctionList from './AuctionList.react';
import SingleAuctionView from './SingleAuctionView.react';
import NothingHere from './NothingHere.react';

export default class AuctionView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '' };

        // TODO: Look into autobinding. React-redux examples projects have it, but not sure what they use
        this.findTalent = this.findTalent.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        this.props.actions.getAuctions()
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    findTalent(auctionID) {
        //if (!!auctionID) {  TicketActions.selectAuction(auctionID); }
        //this.setState({ viewingTalent: true });
    }
    render() {
        const { auction, auctions, user, roles, actions } = this.props;
        if (!auctions.items.size && !auctions.isFetching) {
            return (
                <NothingHere>
                    <h3>You don't have any offered tickets</h3>
                    { roles.items.get(user.current_role.id).type == 'manager' ?  <button>View New Tickets</button> : null }
                </NothingHere>
            );
        }

        if (!!auction.id) {
            return <SingleAuctionView
                auction={auctions.items.get(auction.id)}
                unselect={() => actions.selectAuction(null)}
                approveNomination={actions.approveNomination.bind(null, auctions.items.get(auction.id))}
                user={user} roles={roles}/>;
        } else {
            return (
                <div className='auctionView'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput} />
                    <AuctionList select={actions.selectAuction} user={user} roles={roles} auctions={Array.from(auctions.items.values())} />
                </div>
            );
        }
    }
};

let mapStateToProps = state => ({ auctions: state.auctions, auction: state.auction });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(AuctionActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(AuctionView);
