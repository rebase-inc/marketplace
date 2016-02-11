import React, { Component, PropTypes } from 'react';

import { humanReadableDate } from '../utils/date';
import { Comment } from './Icons.react';

export default class ListElement extends Component {
    static propTypes = {
        date: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
        title: PropTypes.string.isRequired,
        comments: PropTypes.array.isRequired,
        selected: PropTypes.bool,
        subtitle: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
    }
    render() {
        const { icon, title, subtitle, date, comments, handleClick, selected } = this.props;
        return (
            <div className='listElement' onClick={handleClick} data-selected={selected || undefined}>
                <div className='icon'>
                    { icon }
                </div>
                <div className='mainInfo'>
                    { title }
                    { subtitle }
                </div>
                <div className='extraInfo'>
                    <span>{ humanReadableDate(date, false, true) }</span>
                    <div>
                        <Comment />
                        <span>{comments.length}</span>
                    </div>
                </div>
            </div>
        );
    }
};
