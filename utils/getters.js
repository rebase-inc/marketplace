export const getAuctionTicket = (auction) => auction.ticket_set.bid_limits[0].ticket_snapshot.ticket;
export const getAuctionContract = (auction) => (auction.bids.find(bid => bid.contract) || {}).contract;
export const getAuctionWork = (auction) => (auction.bids.find(bid => bid.contract) || {work_offers: [{}]}).work_offers[0].work;
export const getAuctionNominations = (auction) => auction.ticket_set.nominations;

export const getContractTicket = (contract) => contract.bid.work_offers[0].ticket_snapshot.ticket;
export const getContractWork = (contract) => contract.bid.work_offers[0].work;
export const getContractComments = (contract) => {
    const comments = getContractTicket(contract).comments.concat(contract.bid.work_offers[0].work.comments);
    contract.bid.work_offers[0].work.mediations.forEach((m) => comment.push(m.comments));
    return comments.sort((c1, c2) => new Date(c1.created) - new Date(c2.created));
}
