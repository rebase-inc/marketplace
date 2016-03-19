import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class Notes extends Component {
    static propTypes = {
        notes: PropTypes.array.isRequired,
    }

    render() {
        const { notes } = this.props;
        return (
            <ul id='notes'>
                { notes.map( (note, index) => <Note note={note} key={index} /> ) }
            </ul>
        );
    }
}

class Note extends Component {
    static propTypes = {
        note: PropTypes.string.isRequired,
    }

    render() {
        const { note } = this.props;
        return (
            <li id='note'>
                { note }
            </li>
        );
    }
}
