import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ReactSlider from 'react-slider';

import TalentGrid from './TalentGrid.react';
import ModalContainer from './ModalContainer.react';
import LoadingAnimation from './LoadingAnimation.react';

const HelpString = 'Setting a budget here puts a ceiling on what you will pay. ' +
    'Developers won\'t ever see this number. They submit a price that they\'re willing ' +
    'to do the work for. If that price is under your ceiling, you will pay the price they ' +
    'listed, plus a 10% fee to Rebase.';

export default class CreateAuctionModal extends Component {
    static propTypes = {
        create: PropTypes.func.isRequired,
        close: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { price: 800 };
    }

    render() {
        const { create, isLoading, close } = this.props;
        const guessRate = (skill) => 24.1 * Math.pow(skill, 2) - 50.2 * skill + 235;
        return (
            <ModalContainer close={close} help={HelpString}>
                <h3>Set your budget</h3>
                <h4>to see recommended developers</h4>
                <TalentGrid willAccept={(skill, days) => this.state.price > days * guessRate(skill)}/>
                <h3>{this.state.price + ' USD'}</h3>
                <ReactSlider className='reactSlider' min={50} max={6000} step={50} defaultValue={this.state.price} onChange={(value) => this.setState({ price: value })} />
                <button onClick={() => {create(this.state.price); close()}}>{ isLoading ? <LoadingAnimation /> : 'Submit Budget'}</button>
            </ModalContainer>
        );
    }
};
