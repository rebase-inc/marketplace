import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Ribbon extends Component {
    static propTypes = {
        tech: PropTypes.string.isRequired,
        ranking: PropTypes.number.isRequired
    }

    render() {
        let { tech, ranking } = this.props;
        let modified_ranking = Math.ceil(100*ranking);
        return (
            <button className='ribbon'>{tech}:  Top {modified_ranking}%</button>
        );
    }
};
