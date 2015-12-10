import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class SSHKeyTag extends Component {
    constructor(props, context) {
        super(props, context);
        console.log(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = { width: 150 };
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.refs.text);
        this.setState({ width: node.offsetWidth + 45 });
    }

    render() {
        let { ssh_key, onClick } = this.props;
        let { width } = this.state;
        return (
            <svg className='sshKeyTag' onClick={onClick} height='30px' width={ width + 'px' }>
                <rect fill='#5D7591' height='30px' width='100%' rx='4px' ry='4px'/>
                <g stroke="none" fill="#F5F7FA" transform='translate(5,5)'>
                    <path d="M4.82464,13.20504 C5.70704,13.20504 6.42464,13.92264 6.42464,14.80504 C6.42464,15.68744 5.70704,16.40504 4.82464,16.40504 C3.94224,16.40504 3.22464,15.68744 3.22464,14.80504 C3.22464,13.92264 3.94224,13.20504 4.82464,13.20504 M6.42464,19.20504 C9.73264,19.20504 12.42464,16.51384 12.42464,13.20504 C12.42464,12.33704 12.24144,11.50104 11.88064,10.71464 L14.19024,8.40504 L15.62464,8.40504 L15.62464,6.97064 L15.79024,6.80504 L17.22464,6.80504 L17.22464,5.37064 L17.39024,5.20504 L18.82464,5.20504 L18.82464,3.77064 L19.62464,2.97064 L19.62464,0.00504 L16.65904,0.00504 L8.91504,7.74904 C8.12864,7.38824 7.29264,7.20504 6.42464,7.20504 C3.11664,7.20504 0.42464,9.89704 0.42464,13.20504 C0.42464,16.51384 3.11664,19.20504 6.42464,19.20504"></path>
                </g>
                <text ref='text' transform='translate(35, 20)' fill='#F5F7FA'>{ssh_key.title || ssh_key.fingerprint}</text>
            </svg>
        );
    }
};
