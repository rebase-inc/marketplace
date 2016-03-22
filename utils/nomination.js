
export function isUnapproved(auction, nomination) {
    return (auction.approved_talents.every(t => t.contractor.id != nomination.contractor.id));
}

export function isWaitingForResponse(auction, nomination) {
    let contractor_id = nomination.contractor.id;
    let ticket_set_id = nomination.ticket_set.id;
    let _nomination = auction.ticket_set.nominations.find((n) => (n.contractor.id==contractor_id) && (n.ticket_set.id==ticket_set_id));
    return !!_nomination && _nomination.isFetching;
}

export function isRejected(auction, nomination) {
    return (auction.bids.some(bid => bid.contractor.id == nomination.contractor.id && bid.contract));
}
