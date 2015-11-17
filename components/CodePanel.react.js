import React, { Component, PropTypes } from 'react';

class Item extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }
    render() {
        const { name, value } = this.props;
        return (
            <div>
                <span>{name}</span>
                {value || 'n/a'}
            </div>
        );
    }
};

export default class CodePanel extends Component {
    static propTypes = {
        clone: PropTypes.string.isRequired,
        deploy: PropTypes.string.isRequired,
        test: PropTypes.string.isRequired,
        readme: PropTypes.string.isRequired,
    }
    render() {
        const { clone, deploy, test, readme } = this.props;
        return (
            <div id='technicalInfo'>
                <Item name='Clone' value={clone} />
                <Item name='Deploy' value={deploy} />
                <Item name='Test' value={test} />
                <Item name='Readme' value={readme} />
            </div>
        );
    }
};
