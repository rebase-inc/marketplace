import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Slider from './Slider.react';
import ModalContainer from './ModalContainer.react';

import { BellCurve } from '../utils/Graph';

export default class CreateAuctionModal extends Component {
    static propTypes = {
        ticket: PropTypes.object.isRequired,
        closeModal: PropTypes.func.isRequired,
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
        return (
            <ModalContainer close={this.props.closeModal}>
                <h3>Set your budget</h3>
                <h4>to see recommended developers</h4>
                <div className='devBellCurve' ref='bellCurveGraph'>
                    <Slider width={width} min={100} max={2000} value={this.state.price} onChange={(value) => this.setState({ price: value })} />
                    <h3>{this.state.price + ' USD'}</h3>
                </div>
                <button onClick={alert.bind(null, 'heyo')}>Submit Budget</button>
            </ModalContainer>
        );
    }
};
