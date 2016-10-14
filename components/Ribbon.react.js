import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const table = [
    ["_overall", "Overall"],
    [".__language__",          "/Language"],
    [".__standard_library__",  "/Standard Library"],
    [".__third_party__.",       "/"],
    [".__third_party__",       "/3rd Party"]
];


function replace(str) {
    return table.reduce( (before, sub) => before.replace(sub[0], sub[1]), str);
}

export default class Ribbon extends Component {

    static propTypes = {
        tech: PropTypes.string.isRequired,
        ranking: PropTypes.number.isRequired
    }

    render() {
        let { tech, ranking } = this.props;
        let modified_tech = replace(tech);
        let modified_ranking = Math.ceil(100*ranking);
        return (
            <button className='ribbon'>{modified_tech}:  Top {modified_ranking}%</button>
        );
    }
};
