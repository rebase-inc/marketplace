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
        this.state = { text: '' }
    }

    render() {
        return (
            <ModalContainer toggleModal={this.props.closeModal}>
                <h3>Dispute Developer Work</h3>
                <textarea required ref='comment' placeholder="Leave a comment explaining why the work isn't yet complete."/>
                <button className='warning' onClick={() => { disputeWork(this.state.text); close(); }}>Dispute</button>
            </ModalContainer>
        );
    }
};

