import React, { Component, PropTypes } from 'react';

const MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class ContractDetails extends Component {
    static propTypes = {
        contract: PropTypes.object.isRequired,
        hidden: PropTypes.bool.isRequired,
    }
    render() {
        const { contract, hidden } = this.props;
        console.log('Contract:', contract);
        let creationString = (date) => { return 'Created ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(contract.ticket.created));
        creationString += (contract.ticket.descriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    <span>{contract.ticket.title}</span>
                    <span>{creationString}</span>
                    <button className='notification'>Close issue</button>
                </div>
                <div id='technicalInfo'>
                    <div>
                        <span>Clone</span>
                        <span>{contract.work.clone || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Deploy</span>
                        <span>{contract.ticket.project.deploy || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Test</span>
                        <span>{contract.ticket.project.test || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Readme</span>
                        <span>{contract.ticket.project.readme || 'n/a'}</span>
                    </div>
                </div>
            </div>
        );
    }
};
