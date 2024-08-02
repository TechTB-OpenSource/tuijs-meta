import { checkIsObject, checkIsArray } from 'ttbjs';

/**
 * @typedef {Object} MetaDataTag - A single meta tag data set.
 * @property {string} key - The key of a single meta tag attribute.
 * @property {string} value - The value of a single meta tag attribute.
 * @property {Object<string, string>} [attributes] - A list of attribute pairs for a single meta tag. No expectation for number of pairs.
 */

/**
 * @typedef {MetaDataTag[]} MetaDataArray - A list of meta tag data set objects for a single route or site.
 */

/**
 * @typedef {Object} SiteRouteData - The site or route data object.
 * @property {string} title - The site or route title.
 * @property {MetaDataArray} meta - The meta data for the site or route.
 */

/**
 * Updates the document head with the provided site or route data.
 * @param {SiteRouteData} data - Site or route data object.
 * @returns {void}
 * @throws {Error} - If the provided data is not an object or meta data is not an array.
 */
export function metaUpdateHead(data) {
    try {
        if (!checkIsObject(data)) {
            throw 'Data provided is not an object.'
        }
        if (data.title) {
            document.title = data.title;
        }
        if (data.meta) {
            let dataMeta = data.meta;
            if (!checkIsArray(dataMeta)) {
                throw 'Site or page meta data is not an array as expected.'
            }
            for (let i = 0; i < dataMeta.length; i++) {
                metaUpdateTag(dataMeta[i]);
            }
        }
        return;
    } catch (er) {
        throw new Error(er);
    }
}

/**
 * Creates a new meta tag with the provided meta data, removing any tags with matching attributes first.
 * @param {MetaDataArray} data - The meta data for the site or route.
 * @returns {void}
 * @throws {Error} - If the provided data is not an object.
 */
function metaUpdateTag(data) {
    try {
        if (!checkIsObject(data)) {
            throw 'Data provided is not an object.'
        }
        let elmMeta = document.createElement('meta');
        Object.keys(data).forEach(key => {
            const value = data[key];
            const existingMetaTag = document.querySelector(`meta[${key}="${value}"]`);
            if (existingMetaTag) {
                existingMetaTag.remove();
            }
            elmMeta.setAttribute(key, value);
        });
        document.head.appendChild(elmMeta);
        return;
    } catch (er) {
        throw new Error(er);
    }
}

/**
 * Removes a meta tag with with matching attributes.
 * @param {string} key - The meta tag attribute key.
 * @param {string} value - The meta tag attribute value.
 * @returns {void}
 * @throws {Error} - If an error occurs.
 */
function metaRemoveTag(key, value) {
    try {
        const existingMetaTag = document.querySelector(`meta[${key}="${value}"]`);
        if (existingMetaTag) {
            existingMetaTag.remove();
        }
        return;
    } catch (er) {
        throw new Error(er);
    }
}
