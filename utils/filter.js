import { BLOCKED, IN_REVIEW, IN_PROGRESS } from '../constants/WorkStates';

// This could probably be combined into a single filter factory function that 
// just takes the work state, but I'm not sure that it matters either way
export const BLOCKED_AUCTION = (a, b) => (b.bid.work_offers[0] == BLOCKED);
export const IN_REVIEW_AUCTION = (a, b) => (b.bid.work_offers[0] == IN_REVIEW);
export const IN_PROGRESS_AUCTION = (a, b) => (b.bid.work_offers[0] == IN_PROGRESS);
