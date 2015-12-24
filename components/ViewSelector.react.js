import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class ViewSelector extends Component {
    static propTypes = {
        view: PropTypes.object.isRequired,
        views: PropTypes.array.isRequired,
        selectView: PropTypes.func.isRequired,
    }
    render() {
        const { view, views, selectView } = this.props;
        return (
            <div id='viewList'>
                { views.map(v => <div data-selected={view.type == v.type || undefined} onClick={selectView.bind(null, v.type)}>{v.name}</div>) }
            </div>
        );
    }
}

