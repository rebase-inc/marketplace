import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';
import RatingStars from './RatingStars.react';

export default class AcceptWorkModal extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        acceptWork: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { rating: 0, text: '' }
    }

    render() {
        const { close, acceptWork } = this.props;
        return (
            <ModalContainer close={close}>
                <h3>Rate Developer Work</h3>
                <RatingStars rating={this.state.rating/2} setRating={(rating) => this.setState({ rating: 2 * rating })} dynamic={true} labeled={true} />
                <textarea required onChange={(e) => this.setState({ text: e.target.value })} ref='comment' placeholder="Leave a short review of the developer's work (optional)"/>
                <button onClick={() => { acceptWork(this.state.text, this.state.rating); close(); }}>Accept Work</button>
            </ModalContainer>
        );
    }
};
