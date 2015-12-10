import React, { Component, PropTypes } from 'react';

export default class SortOptions extends Component {
    static propTypes = {
        options: PropTypes.instanceOf(Map).isRequired,
    }

    render() {
        const { options, select, sort } = this.props;
        return (
            <div className='sortOptions noselect'>
                <span></span>
                { [...options].map((option, i) => <span key={i} className={sort == option[1] ? 'selected' : ''} onClick={select.bind(null, option[1])}>{ option[0] }</span>) }
            </div>
        );
    }
}

