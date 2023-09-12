/**
 * url.js
 * A collection of functions for comparing URLs.
 * We'll be doing a lot of that when targetting links to send to the widget.
 */

const { URL } = require("url");

/**
 * Get a URL object from a string, if possible.
 * @param {string} input A string representation of the URL.
 * @returns {(URL|undefined)} A URL object, or undefined if parsing fails.
 */
const parse = (input) => {
  try {
    return input ? new URL(input) : undefined;
  } catch (e) {
    console.log("Could not parse URL", input);
    return undefined;
  }
};

/**
 * Prepare the URL's hostname for comparisons.
 * Removes things like "www.", etc.
 * @param {URL} pUrl A URL object.
 * @returns {string} A string representation of the URL's normalized hostname.
 */
const normalizeHost = (pUrl) => {
  return pUrl.hostname.replace(/^www\./, "");
};

/**
 * See if two URLs have matching hostnames.
 * @param {URL} pUrl1 A URL object for the first URL.
 * @param {URL} pUrl2 A URL object for the second URL.
 * @returns {boolean}
 */
const compareHosts = (pUrl1, pUrl2) => {
  return normalizeHost(pUrl1) === normalizeHost(pUrl2);
};

/**
 * Prepare the URL's pathname for comparisons.
 * Removes things like training slashes, etc.
 * @param {URL} pUrl A URL object.
 * @returns {string} A string representation of the URL's normalized pathname.
 */
const normalizePath = (pUrl) => {
  return pUrl.pathname.replace(/\/$/, "");
};

/**
 * See if two URLs have matching pathnames.
 * @param {URL} pUrl1 A URL object for the first URL.
 * @param {URL} pUrl2 A URL object for the second URL.
 * @returns {boolean}
 */
const comparePaths = (pUrl1, pUrl2) => {
  return normalizePath(pUrl1) === normalizePath(pUrl2);
};

const compare = (pUrl1, pUrl2) => {
  return compareHosts(pUrl1, pUrl2) && comparePaths(pUrl1, pUrl2);
};

/**
 * Check if two URLs match.
 * @param {string} url1 A string representation of the first URL.
 * @param {string} url2 A string representation of the second URL.
 * @returns {boolean}
 */
const match = (url1, url2) => {
  const pUrl1 = parse(url1);
  const pUrl2 = parse(url2);

  return pUrl1 && pUrl2 ? compare(pUrl1, pUrl2) : false;
};

/**
 * Check if hostnames for two URLs match.
 * @param {string} url1 A string representation of the first URL.
 * @param {string} url2 A string representation of the second URL.
 * @returns {boolean}
 */
const matchHosts = (url1, url2) => {
  const pUrl1 = parse(url1);
  const pUrl2 = parse(url2);

  return pUrl1 && pUrl2 ? compareHosts(pUrl1, pUrl2) : false;
};

/**
 * Check if paths for two URLs match.
 * @param {string} url1 A string representation of the first URL.
 * @param {string} url2 A string representation of the second URL.
 * @returns {boolean}
 */
const matchPaths = (url1, url2) => {
  const pUrl1 = parse(url1);
  const pUrl2 = parse(url2);

  return pUrl1 && pUrl2 ? comparePaths(pUrl1, pUrl2) : false;
};

/**
 * Checks if a URL is included in a list of other URLs.
 * @param {Array} urls An array of URL strings.
 * @param {string} queryUrl A string representation of the URL to check.
 * @returns {boolean}
 */
const findMatch = (urls, queryUrl) => {
  const pQueryUrl = parse(queryUrl);
  const pUrls = urls.map((u) => parse(u)).filter((pU) => pU !== undefined);

  return pQueryUrl ? pUrls.some((pUrl) => compare(pUrl, pQueryUrl)) : false;
};

exports.parse = parse;
exports.match = match;
exports.matchHosts = matchHosts;
exports.matchPaths = matchPaths;
exports.findMatch = findMatch;
