import React, { Component, PropTypes } from 'react';


export default class ListElement extends Component {
    static propTypes = {
        icon: PropTypes.element.isRequired,
        title: PropTypes.string.isRequired,
        extra: PropTypes.element,
        selected: PropTypes.bool,
        subtitle: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
    }
    render() {
        const { icon, title, subtitle, date, expires, extra, handleClick, selected } = this.props;
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
                    <span>{ date }</span>
                    { extra }
                </div>
            </div>
        );
    }
};
