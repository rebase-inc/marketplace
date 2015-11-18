import React, { Component, PropTypes } from 'react';
import CodePanel from './CodePanel.react';

export default class DetailsPanel extends Component {
    static propTypes = {
        hidden: PropTypes.bool.isRequired,
        clone: PropTypes.string.isRequired,
        deploy: PropTypes.string.isRequired,
        test: PropTypes.string.isRequired,
        readme: PropTypes.string.isRequired,
    }
    render() {
        const { hidden, clone, deploy, test, readme } = this.props;
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    {this.props.children}
                </div>
                <CodePanel clone={clone} deploy={deploy} test={test} readme={readme} />
            </div>
        );
    }
};
