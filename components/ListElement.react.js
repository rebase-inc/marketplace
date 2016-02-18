import React, { Component, PropTypes } from 'react';


export default class ListElement extends Component {
    static propTypes = {
        icon: PropTypes.element.isRequired,
        title: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]).isRequired,
        prefix: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]).isRequired,
        extra: PropTypes.element,
        selected: PropTypes.bool,
        subtitle: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
        info: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
    }
    render() {
        const { icon, prefix, title, className, hidden, subtitle, info, expires, extra, handleClick, selected } = this.props;
        return (
            <div className={'listElement ' + (className || '')} onClick={handleClick} data-selected={selected || undefined}>
                <div className={'icon' + (hidden ? ' sliding' : '')}>
                    { icon }
                </div>
                <div className={'content' + (hidden ? ' sliding' : '')}>
                    <div className='row'>
                        <div className='prefix'>{ prefix }</div>
                        <div className='info'>{ info }</div>
                    </div>
                    <div className='row'>
                        <div className='title'>{ title }</div>
                    </div>
                    <div className='row'>
                        <div className='subtitle'>{ subtitle }</div>
                    </div>
                </div>
                { hidden ? <div className='hidden'>{hidden}</div> : null }
            </div>
        );
    }
};
