var React = require('react');
var ReactDOM = require('react-dom');

var ModalContainer = require('../components/ModalContainer.react');

var AuctionActions = require('../actions/AuctionActions');
var ContractActions = require('../actions/ContractActions');
var UserActions = require('../actions/UserActions');

var AuctionStore = require('../stores/AuctionStore');

var viewConstants = require('../constants/viewConstants');

var BidModal = React.createClass({
    getInitialState: () => ({ minimum_price: 80, maximum_price: 1800, price: 800, priceSubmitted: false }),
    handleKeyPress: function(event) {
        if (event.charCode == 13) {
            this.setState({ price: ReactDOM.findDOMNode(this.refs.price).value });
        }
    },
    bidOnAuction: function() {
        AuctionActions.bidOnAuction(this.props.currentUser, this.props.currentAuction, this.state.price);
        this.setState({ priceSubmitted: true });
    },
    returnToAuctions: function() {
        AuctionActions.selectAuction(null);
        this.props.toggleModal();
    },
    showContract: function() {
        setTimeout(UserActions.selectView.bind(null, viewConstants.ViewTypes.IN_PROGRESS), 0);
        setTimeout(ContractActions.selectContract.bind(null, this.props.currentAuction.contract.id), 0);
        this.props.toggleModal();
    },
    setPrice: function(event) {
        this.setState({ price: event.target.valueAsNumber });
    },
    getDefaultProps: function() {
        return { width: 240, height: 50, margin: 18 }
    },
    render: function() {
        if (!this.state.priceSubmitted || this.props.loading) {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>Choose your price</h3>
                    <h4>to work on this task</h4>
                    <input style={{width: this.props.width + 'px', margin: '10px'}} defaultValue={this.state.price} type='range' min={this.state.minimum_price} max={this.state.maximum_price} step={20} onChange={this.setPrice} />
                    <h3>{this.state.price + ' USD'}</h3>
                    <button onClick={this.bidOnAuction}>Submit Bid</button>
                </ModalContainer>
            );
        } else if (this.props.currentAuction.state == 'waiting_for_bids') {
            var remainingTickets = AuctionStore.getState().allAuctions.filter(function(auction) { return auction.type == viewConstants.ViewTypes.OFFERED; });
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>Your bid was not accepted.</h3>
                    <h4>{'But there are ' + remainingTickets.length + ' more tasks waiting for you!'}</h4>
                    <button onClick={this.returnToAuctions}>Show tasks</button>
                </ModalContainer>
            );
        } else if (this.props.currentAuction.state == 'ended') {
            return (
                <ModalContainer toggleModal={this.props.toggleModal}>
                    <h3>Your bid was accepted!</h3>
                    <h4>Get started by cloning and running the tests</h4>
                    <div className='infoOrInput cloneInstructions'> $ git clone git@github.com:airpool/ios <br/> $ cd api && python deploy.py && python tests/run.py </div>
                    <button onClick={this.showContract}>Show task</button>
                </ModalContainer>
            );
        } else { console.log(this.props.currentAuction); throw 'wtf'; }
    }
});

module.exports = BidModal;
