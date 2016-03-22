import React, { Component, PropTypes } from 'react';
import CloseIcon from './CloseIcon.react';

export default class ModalContainer extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        help: PropTypes.string,
        //loading: PropTypes.bool, // provide this so that the modal knows not to close if some action is happening
        //markedForClose: PropTypes.bool, // provide this so that modal can close on next update
    }

    constructor(props, context) {
        super(props, context);
        this.state = { showHelp: false };
    }

    render() {
        const { close, help, children } = this.props;
        return (
            <div id='modalView' onKeyPress={(e) => { (e.charCode == 27) ? this.props.close() : alert('SHIT') }} >
                <div id='modalDialog'>
                    <CloseIcon onClick={close} />
                    { !!help ? <HelpIcon onClick={() => this.setState({ showHelp: true })} /> : null }
                    { this.state.showHelp ? <h4>{ help }</h4> : children }
                    { this.state.showHelp ? <button className='small' data-notification onClick={() => this.setState({ showHelp: false })}>Hide Help</button> : null }
                </div>
            </div>
        );
    }
};

export class HelpIcon extends Component {
    render() {
        return (
            <svg onClick={this.props.onClick} className='helpIcon' viewBox="0 0 20 20">
                <g stroke="none" strokeWidth="1" fill="none">
                    <circle stroke="#A7B3C1" cx="10" cy="10" r="9"></circle>
                    <text fontFamily="Gotham Rounded" fontSize="12" fontWeight="260" fill="#A7B3C1">
                        <tspan x="10" y="14" textAnchor='middle'>?</tspan>
                    </text>
                </g>
            </svg>
        );
    }
}

