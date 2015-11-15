import React, { Component, PropTypes } from 'react';

export default class DropdownMenu extends Component {
    render() {
        return (
            <div className='dropdownMenu'>
                <div className='arrowUp' />
                { this.props.children }
            </div>
        );
    }
}

