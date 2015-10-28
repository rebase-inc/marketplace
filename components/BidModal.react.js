import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';
import Slider from './Slider.react';

export default class BidModal extends Component {
    static propTypes = {
        bid: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        minPrice: PropTypes.number,
        maxPrice: PropTypes.number,
        defaultPrice: PropTypes.number,
        closeModal: PropTypes.func.isRequired,
    }

    static defaultProps = {
        minPrice: 100,
        maxPrice: 2000,
        defaultPrice: 800,
        sliderWidth: 240,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { price: props.defaultPrice }
    }

    render() {
        const { bid, isLoading, minPrice, maxPrice, defaultPrice, sliderWidth, closeModal } = this.props;
        return (
            <ModalContainer closeModal={closeModal}>
                <h3>Choose your price</h3>
                <h4>to work on this task</h4>
                <Slider width={sliderWidth} min={minPrice} max={maxPrice} step={20} value={this.state.price} onChange={(price) => this.setState({ price: price})} />
                <h3>{this.state.price + ' USD'}</h3>
                <button onClick={() => bid(this.state.price)}>Submit Bid</button>
            </ModalContainer>
        );
        //} else if (this.props.currentAuction.state == 'waiting_for_bids') {
            //var remainingTickets = AuctionStore.getState().allAuctions.filter(function(auction) { return auction.type == viewConstants.ViewTypes.OFFERED; });
            //return (
                //<ModalContainer toggleModal={this.props.toggleModal}>
                    //<h3>Your bid was not accepted.</h3>
                    //<h4>{'But there are ' + remainingTickets.length + ' more tasks waiting for you!'}</h4>
                    //<button onClick={this.returnToAuctions}>Show tasks</button>
                //</ModalContainer>
            //);
        //} else if (this.props.currentAuction.state == 'ended') {
            //return (
                //<ModalContainer toggleModal={this.props.toggleModal}>
                    //<h3>Your bid was accepted!</h3>
                    //<h4>Get started by cloning and running the tests</h4>
                    //<div className='infoOrInput cloneInstructions'> $ git clone git@github.com:airpool/ios <br/> $ cd api && python deploy.py && python tests/run.py </div>
                    //<button onClick={this.showContract}>Show task</button>
                //</ModalContainer>
            //);
        //} else { console.log(this.props.currentAuction); throw 'wtf'; }
    }
};
