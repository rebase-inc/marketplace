import React, { Component, PropTypes } from 'react';

import DropdownMenu from './DropdownMenu.react';

export default class SortOptions extends Component {
    static propTypes = {
        options: PropTypes.instanceOf(Map).isRequired,
    }

    render() {
        const { options, select, sort } = this.props;
        return (
            <div className='sortOptions noselect' onMouseLeave={this.props.onMouseLeave}>
                <DropdownMenu>
                    { [...options].map((option, i) => <div key={i} className='option' data-selected={sort == option[1]} onClick={select.bind(null, option[1])}>{ option[0] }</div>) }
                </DropdownMenu>
            </div>
        );
    }
}

