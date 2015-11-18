import React, { Component, PropTypes } from 'react';

export default class TicketTitle extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
    }
    render() {
        const { title } = this.props;
        return (
            <span>{title}</span>
        );
    }
};
