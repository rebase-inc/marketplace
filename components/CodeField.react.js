import React, { Component, PropTypes } from 'react';

export default class CodeField extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }
    render() {
        const { name, value } = this.props;
        return (
            <div className='codeField'>
                {name}     
                <input onClick={e => e.target.select()} readOnly value={value || 'n/a'}/>
            </div>
        );
    }
};
