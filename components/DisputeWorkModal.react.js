import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ModalContainer from './ModalContainer.react';
import RatingStars from './RatingStars.react';

export default class DisputeWorkModal extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        disputeWork: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { text: '' }
    }

    handleInput() {
        this.setState({ text: ReactDOM.findDOMNode(this.refs.comment).value });
    }

    render() {
        const { close, disputeWork } = this.props;
        return (
            <ModalContainer close={close}>
                <h3>Dispute Developer Work</h3>
                <textarea
                    required
                    ref='comment'
                    placeholder="Leave a comment explaining why the work isn't yet complete."
                    value={this.state.text}
                    onChange={this.handleInput.bind(this)}
                />
                <button className='warning' onClick={() => { disputeWork(this.state.text); close(); }}>Dispute</button>
            </ModalContainer>
        );
    }
};

