// For tickets
export const NEWEST = (a, b) => new Date(b.created) - new Date(a.created) || a.title.localeCompare(b.title);
export const OLDEST = (a, b) => new Date(a.created) - new Date(b.created) || a.title.localeCompare(b.title);
export const COMMENTS = (a, b) => (b.comments.length - a.comments.length) || new Date(b.created) - new Date(a.created) || a.title.localeCompare(b.title);

// For auctions
export const ENDS_SOON = (a, b) => new Date(a.bid.auction.finish_work_by) - new Date(b.bid.auction.finish_work_by);
export const TIME_LEFT = (a, b) => new Date(b.bid.auction.finish_work_by) - new Date(a.bid.auction.finish_work_by);

// For reviews
export const NEWEST_REVIEWS = (a, b) => new Date(b.created) - new Date(a.created);
export const OLDEST_REVIEWS = (a, b) => new Date(a.created) - new Date(b.created);
export const GOOD_REVIEWS = (a, b) => parseInt(a.rating) - parseInt(b.rating);
export const BAD_REVIEW = (a, b) => parseInt(b.rating) - parseInt(a.rating);

