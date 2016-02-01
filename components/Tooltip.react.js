import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Tooltip extends Component {
    static propTypes = { }

    constructor(props, context) {
        super(props, context);
        this.state = { visible: true }
        this.target = ReactDOM.findDOMNode(
    }

    render() {
        const { visible } = this.state;
        return visible ? <div>{'I am a tooltip'}</div> : null;
    }
}
