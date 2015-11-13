import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class LargePlusIcon extends Component {
    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = { width: 25 };
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.refs.text);
        console.log(' node width is ', node.offsetWidth);
        this.setState({ width: node.offsetWidth });
    }

    render() {
        const { text } = this.props;
        const { width } = this.state;
        return (
            <svg onClick={this.props.onClick} className='largePlusIcon' height='60px' width={ width + 'px' } viewBox={'0 0 ' + width + ' 50'}>
                <g fill="#D5DBE3" transform={'translate(' + (width/2 - 12.5) + ', 0)'}>
                    <path d="M24.0386,8.0295 L16.5386,8.0155 L16.5526,0.5155 C16.5536,0.3825 16.5006,0.2555 16.4066,0.1615 C16.3136,0.0675 16.1856,0.0145 16.0536,0.0145 L9.0316,0.0075 L9.0306,0.0075 C8.8986,0.0075 8.7716,0.0605 8.6776,0.1545 C8.5836,0.2475 8.5306,0.3745 8.5306,0.5075 L8.5306,8.0075 L1.0306,8.0075 C0.7546,8.0075 0.5306,8.2315 0.5306,8.5075 L0.5306,15.5075 C0.5306,15.7845 0.7546,16.0075 1.0306,16.0075 L8.5306,16.0075 L8.5306,23.5075 C8.5306,23.7845 8.7546,24.0075 9.0306,24.0075 L16.0306,24.0075 C16.3066,24.0075 16.5306,23.7845 16.5306,23.5075 L16.5306,16.0075 L24.0306,16.0075 C24.3066,16.0075 24.5306,15.7845 24.5306,15.5085 L24.5376,8.5305 C24.5376,8.2545 24.3146,8.0305 24.0386,8.0295"></path>
                </g>
                <text ref='text' transform={'translate(' + width/2 +', 40)'} textAnchor='middle' opacity='0.5'>{text}</text>
            </svg>
        );
    }
};
