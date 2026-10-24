/**
 * How many sample jobs show at first, and how many more each "View more"
 * reveals. Its own module: the server list and the client board both read it,
 * and a value exported from a "use client" module reaches a server component
 * as a reference, not a value.
 */
export const JOBS_PAGE = 6;
