import React, { Component, PropTypes } from 'react';

import RcSlider from 'rc-slider';
import 'rc-slider/assets/index.css';

import ModalContainer from './ModalContainer.react';
import LoadingAnimation from './LoadingAnimation.react';
import CodeField from './CodeField.react';
import Slider from './Slider.react';
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
        sliderWidth: 240,
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            price: props.defaultPrice,
            duration: 1,
            // this is kind of a hack. I think this suggests that we really should using the app state to manage modals
            submitted: false,
        }
    }

    render() {
        const marks = {
            1: '1 hour',
            4: '',
            8: '1 day',
            16: '',
            24: '3 days',
            32: '',
            40: '5 days',
            48: '',
            56: '7 days',
        };

        const { role, duration, auction, bid, actions, minPrice, maxPrice, defaultPrice, sliderWidth, close } = this.props;
        const rate = 500;
        if (!auction.bids.find(b => b.contractor.id == role.id)) {
            return (
                <ModalContainer close={close}>
                    <h3>{'How long will it take you to finish this task?'}</h3>
                    <h4>{'Your current rate is ' + rate + 'USD/day'}</h4>
                    <RcSlider defaultValue={duration} onChange={(value) => this.setState({ duration: value })} min={1} max={56} marks={marks} step={null} />
                    <h3>{this.state.duration * rate / 8 + ' USD'}</h3>
                    <button onClick={() => { this.setState({submitted: true}); bid(this.state.duration * rate / 8)}}>
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
