import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';
import WorkStatus from './WorkStatus.react';
import ProfilePicture from './ProfilePicture.react';

import { humanReadableTimeRemaining, humanReadableDate } from '../utils/date';
import { getContractTicket, getContractWork, getContractComments } from '../utils/getters';

import AuctionStatus from './AuctionStatus.react';

const Contract = (props) => (
    <ListElement
        icon={<ProfilePicture user={props.bid.contractor.user} />}
        subtitle={'Finish by ' + humanReadableDate(props.bid.auction.finish_work_by, false, true)}
        title={getContractTicket(props).title}
        prefix={ props.bid.contractor.user.name }
        info={<WorkStatus state={getContractWork(props).state} />} />
);

export default Contract;
