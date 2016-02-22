export const getAuctionTicket = (auction) => auction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
export const getAuctionContract = (auction) => (auction.bids.find(bid => bid.contract) || {}).contract;
export const getAuctionWork = (auction) => (auction.bids.find(bid => bid.contract) || {work_offers: [{}]}).work_offers[0].work;
export const getAuctionNominations = (auction) => auction.ticket_set.nominations;

export const getContractTicket = (contract) => contract.bid.work_offers[0].ticket_snapshot.ticket;
export const getContractWork = (contract) => contract.bid.work_offers[0].work;
export const getContractProject = (contract) => contract.bid.work_offers[0].ticket_snapshot.ticket.project;
export const getContractOrganization = (contract) => contract.bid.work_offers[0].ticket_snapshot.ticket.project.organization;
export const getContractComments = (contract) => {
    const comments = getContractTicket(contract).comments.concat(contract.bid.work_offers[0].work.comments);
    contract.bid.work_offers[0].work.mediations.forEach((m) => Array.prototype.push.apply(comments, m.comments));
    contract.bid.work_offers[0].work.blockages.forEach((b) => Array.prototype.push.apply(comments, b.comments));
    return comments.sort((c1, c2) => new Date(c1.created) - new Date(c2.created));
}

export const getReviewTicket = (review) => review.work.offer.ticket_snapshot.ticket;
export const getReviewComments = (review) => {
    const comments = getReviewTicket(review).comments.concat(review.work.comments);
    review.work.mediations.forEach((m) => Array.prototype.push.apply(comments, m.comments));
    review.work.blockages.forEach((b) => Array.prototype.push.apply(comments, b.comments));
    return comments.concat(review.comments).sort((c1, c2) => new Date(c1.created) - new Date(c2.created));
}
