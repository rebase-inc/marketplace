import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Slider from './Slider.react';
import ModalContainer from './ModalContainer.react';
import LoadingAnimation from './LoadingAnimation.react';

import { BellCurve } from '../utils/Graph';

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

        return (
            <ModalContainer close={close} help={HelpString}>
                <h3>Set your budget</h3>
                <h4>to see recommended developers</h4>
                <DevBellCurve width={300} min={100} max={2000} value={this.state.price} onChange={(value) => this.setState({ price: value })} />
                <button onClick={() => {create(this.state.price); close()}}>{ isLoading ? <LoadingAnimation /> : 'Submit Budget'}</button>
            </ModalContainer>
        );
    }
};

export class DevBellCurve extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
    }

    componentDidUpdate() {
        this._bellCurve.update(this.props.value);
    }

    componentDidMount() {
        var element = ReactDOM.findDOMNode(this);
        this._bellCurve = new BellCurve(element, {width: this.props.width - 20, min: this.props.min, max: this.props.max}, this.props.value);
    }

    render() {
        const { width, min, max, value, onChange } = this.props;
        return (
            <div className='devBellCurve'>
                <Slider width={width} min={min} max={max} value={value} onChange={onChange} />
                <h3>{value + ' USD'}</h3>
            </div>
        );
    }
}

