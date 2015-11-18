import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Slider from './Slider.react';
import ModalContainer from './ModalContainer.react';
import LoadingAnimation from './LoadingAnimation.react';

import { BellCurve } from '../utils/Graph';

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

    componentDidUpdate() {
        var element = ReactDOM.findDOMNode(this.refs.bellCurveGraph);
        this._bellCurve.update(this.state.price);
    }

    componentDidMount() {
        var element = ReactDOM.findDOMNode(this.refs.bellCurveGraph);
        this._bellCurve = new BellCurve(element, {width: 240, min: 100, max: 2000}, this.state.price);
    }

    render() {
        const width = 240;
        const { create, isLoading, close } = this.props;
        return (
            <ModalContainer close={close}>
                <h3>Set your budget</h3>
                <h4>to see recommended developers</h4>
                <div className='devBellCurve' ref='bellCurveGraph'>
                    <Slider width={width} min={100} max={2000} value={this.state.price} onChange={(value) => this.setState({ price: value })} />
                    <h3>{this.state.price + ' USD'}</h3>
                </div>
                <button onClick={() => {create(this.state.price); close()}}>{ isLoading ? <LoadingAnimation /> : 'Submit Budget'}</button>
            </ModalContainer>
        );
    }
};
