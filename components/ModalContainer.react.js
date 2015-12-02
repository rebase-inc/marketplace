import React, { Component, PropTypes } from 'react';

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
            <div id='modalView'>
                <div id='modalDialog'>
                    <CloseIcon onClick={close} />
                    { !!help.length ? <HelpIcon onClick={() => this.setState({ showHelp: true })} /> : null }
                    { this.state.showHelp ? <h4>{ help }</h4> : children }
                    { this.state.showHelp ? <button className='small' data-notification onClick={() => this.setState({ showHelp: false })}>Hide Help</button> : null }
                </div>
            </div>
        );
    }
};

export class CloseIcon extends Component {
    render() {
        return (
            <svg onClick={this.props.onClick} className='closeIcon' viewBox="0 0 20 20">
                <g stroke="none" strokeWidth="1" fill="#A7B3C1">
                    <path d="M4.38537143,16.3783784 C4.38537143,16.7027027 4.66370145,17 4.99769747,17 C5.24819449,17 5.4151925,16.8648649 5.58219051,16.6756757 L10.4251329,10.7567568 L15.2959082,16.7297297 C15.4350732,16.8918919 15.6020712,17 15.8525682,17 C16.2143973,17 16.5205603,16.7297297 16.5205603,16.3783784 C16.5205603,16.1891892 16.4370613,16.0540541 16.3257293,15.9189189 L11.3157889,9.83783784 L16.1308983,4.05405405 C16.2422303,3.91891892 16.2978963,3.78378378 16.2978963,3.62162162 C16.2978963,3.2972973 16.0195663,3 15.6855702,3 C15.4350732,3 15.2680752,3.13513514 15.1010772,3.32432432 L10.4807989,8.94594595 L5.83268753,3.27027027 C5.69352252,3.10810811 5.52652451,3 5.27602749,3 C4.91419847,3 4.60803544,3.27027027 4.60803544,3.62162162 C4.60803544,3.81081081 4.69153445,3.94594595 4.80286646,4.08108108 L9.5901428,9.86486486 L4.55236944,15.9459459 C4.44103743,16.0810811 4.38537143,16.2162162 4.38537143,16.3783784 L4.38537143,16.3783784 Z" />
                </g>
            </svg>
        );
    }
}

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

