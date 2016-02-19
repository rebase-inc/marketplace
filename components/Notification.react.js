import React, { Component } from 'react';

export default class Notification extends Component {
    constructor(props, context) {
        super(props, context);
        this._timer = setInterval(this.props.clear, 3000);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }
    componentWillUnmount() {
        clearInterval(this._timer);
    }
    render() {
        const { text } = this.props;
        return (
            <div className='notification'>
                <div className='text'>
                    {text}
                </div>
            </div>
        );
    }
}
