// For tickets
export const NEWEST = (a, b) => new Date(b.created) - new Date(a.created) || a.title.localeCompare(b.title);
export const OLDEST = (a, b) => new Date(a.created) - new Date(b.created) || a.title.localeCompare(b.title);
export const COMMENTS = (a, b) => (b.comments.length - a.comments.length) || new Date(b.created) - new Date(a.created) || a.title.localeCompare(b.title);

// For auctions
export const ENDS_SOON = (a, b) => new Date(a.bid.auction.finish_work_by) - new Date(b.bid.auction.finish_work_by);
export const TIME_LEFT = (a, b) => new Date(b.bid.auction.finish_work_by) - new Date(a.bid.auction.finish_work_by);

