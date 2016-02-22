import React, { Component, PropTypes } from 'react';

export default class ListTitleBar extends Component {
    render() {
        const children = React.Children.toArray(this.props.children);
        return (
            <div className='listTitleBar'>
                <div className='tool'>{ children[0] }</div>
                <span className='title'>{this.props.title}</span>
                <div className='tool'>{ children[1] }</div>
            </div> 
        );
    }
}
