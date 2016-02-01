import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class WalkthroughPopup extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
    }

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { visible } = this.props;
        return (
            <div className='walkthroughPopupContainer'>
                { this.props.children }
                <div className='walkthroughPopup'>{'I am a tooltip'}</div>
            </div>
        );
    }
}
