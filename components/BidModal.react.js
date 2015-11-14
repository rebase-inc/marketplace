import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';
import LoadingAnimation from './LoadingAnimation.react';
import Slider from './Slider.react';

export default class BidModal extends Component {
    static propTypes = {
        bid: PropTypes.func.isRequired,
        auction: PropTypes.object.isRequired, // this is kind of a hack...I think it would be solved by better modal management
        isLoading: PropTypes.bool.isRequired,
        minPrice: PropTypes.number,
        maxPrice: PropTypes.number,
        defaultPrice: PropTypes.number,
        close: PropTypes.func.isRequired,
        selectAuctionView: PropTypes.func.isRequired,
        selectContract: PropTypes.func.isRequired,
        selectAuction: PropTypes.func.isRequired,
    }

    static defaultProps = {
        minPrice: 100,
        maxPrice: 2000,
        defaultPrice: 800,
        sliderWidth: 240,
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            price: props.defaultPrice,
            // this is kind of a hack. I think this suggests that we really should using the app state to manage modals
            submitted: false,
        }
    }

    render() {
        const { auction, bid, isLoading, minPrice, maxPrice, defaultPrice, sliderWidth, close } = this.props;
        console.log('auction:', auction);
        if (!this.state.submitted || isLoading) {
            return (
                <ModalContainer close={close}>
                    <h3>Choose your price</h3>
                    <h4>to work on this task</h4>
                    <Slider width={sliderWidth} min={minPrice} max={maxPrice} step={20} value={this.state.price} onChange={(price) => this.setState({ price: price})} />
                    <h3>{this.state.price + ' USD'}</h3>
                    <button onClick={() => { this.setState({submitted: true}); bid(this.state.price)}}>
                        { isLoading ? <LoadingAnimation /> : 'Submit Bid' }
                    </button>
                </ModalContainer>
            );
        } else if (auction.state == 'waiting_for_bids') {
            return (
                <ModalContainer close={close}>
                    <h3>Your bid was not accepted.</h3>
                    <h4>{'But there are other tasks waiting for you!'}</h4>
                    <button onClick={() => { selectAuction(null); selectAuctionView(); }}>Show tasks</button>
                </ModalContainer>
            );
        } else {
            // TODO: Get clone instructions from auction object
            console.log('Auction:', auction);
            return (
                <ModalContainer close={close}>
                    <h3>Your bid was accepted!</h3>
                    <h4>Get started by cloning and running the tests</h4>
                    <div className='infoOrInput cloneInstructions'>
                        ERROR HERE
                        $ {auction.clone}<br/>
                        $ cd api && python deploy.py && python tests/run.py
                    </div>
                    <button onClick={() => selectContract(auction.bids[0].contract.id)}>Show task</button>
                </ModalContainer>
            );
        }
    }
};
