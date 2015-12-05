import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';
import LoadingAnimation from './LoadingAnimation.react';
import CodeField from './CodeField.react';
import Slider from './Slider.react';
import { OFFERED } from '../constants/ViewConstants';
import { humanReadableDate } from '../utils/date';
import { getAuctionWork, getAuctionTicket } from '../utils/getters';

class CloneInstructions extends Component {
    static propTypes = {
        clone: PropTypes.string.isRequired,
        deploy: PropTypes.string.isRequired,
        test: PropTypes.string.isRequired,
    }

    render() {
        const { clone, deploy, test } = this.props;
        let dir=clone.substring(clone.lastIndexOf('/') + 1);
        return (
            <div className='cloneInstructions'>
                <CodeField name='Clone' value={clone} />
                <CodeField name='Deploy' value={deploy} />
                <CodeField name='Test' value={test} />
            </div>
        );
    }
};

export default class BidModal extends Component {
    static propTypes = {
        bid: PropTypes.func.isRequired,
        auction: PropTypes.object.isRequired,
        minPrice: PropTypes.number,
        maxPrice: PropTypes.number,
        defaultPrice: PropTypes.number,
        close: PropTypes.func.isRequired,
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
        const { role, auction, bid, actions, isLoading, minPrice, maxPrice, defaultPrice, sliderWidth, close } = this.props;
        if (!auction.bids.find(b => b.contractor.id == role.id)) {
            return (
                <ModalContainer close={close}>
                    <h3>Name your price to start working</h3>
                    <h4>{'Must be finished by ' + humanReadableDate(auction.finish_work_by)}</h4>
                    <Slider width={sliderWidth} min={minPrice} max={maxPrice} step={20} value={this.state.price} onChange={(price) => this.setState({ price: price})} />
                    <h3>{this.state.price + ' USD'}</h3>
                    <button onClick={() => { this.setState({submitted: true}); bid(this.state.price)}}>
                        { auction.isFetching ? <LoadingAnimation /> : 'Submit Bid' }
                    </button>
                </ModalContainer>
            );
        } else if (!auction.bids.find(b => b.contractor.id == role.id).contract) {
            return (
                <ModalContainer close={close}>
                    <h3>Your bid was not accepted.</h3>
                    <h4>{'But there are other tasks waiting for you!'}</h4>
                    <button onClick={() => { close(); actions.selectAuction(null); }}>Show tasks</button>
                </ModalContainer>
            );
        } else {
            const work = getAuctionWork(auction);
            const ticket = getAuctionTicket(auction);
            return (
                <ModalContainer close={close}>
                    <h3>Your bid was accepted!</h3>
                    <h4>Get started by cloning and running the tests</h4>
                    <CloneInstructions clone={work.clone} deploy={ticket.project.deploy} test={ticket.project.test} />
                    <button onClick={close}>Show task</button>
                </ModalContainer>
            );
        }
    }
};
