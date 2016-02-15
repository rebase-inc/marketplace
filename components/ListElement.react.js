import React, { Component, PropTypes } from 'react';


export default class ListElement extends Component {
    static propTypes = {
        icon: PropTypes.element.isRequired,
        title: PropTypes.string.isRequired,
        extra: PropTypes.element,
        selected: PropTypes.bool,
        subtitle: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
        date: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
    }
    render() {
        const { icon, title, className, hidden, subtitle, date, expires, extra, handleClick, selected } = this.props;
        return (
            <div className={'listElement ' + (className || '')} onClick={handleClick} data-selected={selected || undefined}>
                <div className={'icon' + (hidden ? ' sliding' : '')} >
                    { icon }
                </div>
                <div className={'mainInfo' + (hidden ? ' sliding' : '')}>
                    { title }
                    { subtitle }
                </div>
                <div className={'extraInfo' + (hidden ? ' sliding' : '')}>
                    { date }
                    { extra }
                </div>
                { hidden ? <div className='hidden'>{hidden}</div> : null }
            </div>
        );
    }
};
