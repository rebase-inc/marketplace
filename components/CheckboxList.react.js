import React, { Component, PropTypes } from 'react';

import { Checkbox } from './Icons.react';

export default class CheckboxList extends Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        fieldsToDisplay: PropTypes.array.isRequired,
        onSubmit: PropTypes.func.isRequired,
        buttonText: PropTypes.string.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { selected: new Set() };
        this.toggleItem = this.toggleItem.bind(this);
    }

    toggleItem(item) {
        switch (this.state.selected.has(item)) {
            case true: this.setState((state) => state.selected.delete(item)); break;
            case false: this.setState((state) => state.selected.add(item)); break;
        }
    }

    render() {
        const { items, fieldsToDisplay, onSubmit, buttonText } = this.props;
        const { selected } = this.state;
        return (
            <div className='checkboxList'>
                <table>
                    { items.map(i => <CheckboxItem item={i} fieldsToDisplay={fieldsToDisplay} toggle={this.toggleItem.bind(null, i)} selected={selected.has(i)} />) }
                </table>
                <button onClick={() => onSubmit(selected)}>{buttonText}</button>
            </div>
        );
    }
}

export class CheckboxItem extends Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        repo: PropTypes.object.isRequired,
        toggle: PropTypes.func.isRequired,
    }

    render() {
        const { selected, toggle, item, fieldsToDisplay } = this.props;
        return (
            <tr className='checkboxItem'>
                <td className='checkbox'>
                    <Checkbox checked={selected} toggle={toggle} />
                </td>
                { fieldsToDisplay.map(f => <td>{item[f]}</td>) }
            </tr>
        );
    }
}
