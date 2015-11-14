import React, { Component, PropTypes } from 'react';

const MonthNames = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default class ReviewDetails extends Component {
    static propTypes = {
        review: PropTypes.object.isRequired,
        hidden: PropTypes.bool.isRequired,
    }
    render() {
        const { review, hidden } = this.props;
        console.log('review:', review);
        let creationString = (date) => { return 'Created ' + MonthNames[date.getMonth()] + ' ' + date.getDate(); }(new Date(review.ticket.created));
        creationString += (review.ticket.descriminator == 'github_ticket') ? ' on Github' : ' on Rebase';
        let user = review.work.offer.contractor.user
        let name = user.first_name+' '+user.last_name
        let contractorString = 'Assigned to '+name
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <div id='mainInfo'>
                    <span>{ticket.title}</span>
                    <span>{creationString}</span>
                    <span>{contractorString}</span>
                    <button className='notification'>Close issue</button>
                </div>
                <div id='technicalInfo'>
                    <div>
                        <span>Clone</span>
                        <span>{review.work.clone || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Deploy</span>
                        <span>{review.ticket.project.deploy || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Test</span>
                        <span>{review.ticket.project.test || 'n/a'}</span>
                    </div>
                    <div>
                        <span>Readme</span>
                        <span>{review.ticket.project.readme || 'n/a'}</span>
                    </div>
                </div>
            </div>
        );
    }
};
