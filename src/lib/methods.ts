import type { MetaRoute, MetaTag } from './models.js';

export function createMetaInstance() {
    const metaData: MetaRoute[] = [];

    function setMetaData(data: MetaRoute) {
        metaData.length = 0;
        metaData.push(data);
    }

    function metaUpdateHead(route: string) {
        const data = metaData.find(item => item.route === route);
        if (!data) {
            return;
        }
        if (data.title) {
            document.title = data.title;
        }
        if (data.meta) {
            let dataMeta = data.meta;
            for (let i = 0; i < dataMeta.length; i++) {
                metaUpdateTag(dataMeta[i]);
            }
        }
        return;
    }

    function metaUpdateTag(data: MetaTag) {
        // Remove existing meta tags with matching attributes
        const existingMetaTags = document.getElementsByTagName('meta');
        for (let i = 0; i < existingMetaTags.length; i++) {
            const metaTag = existingMetaTags[i];
            let hasMatchingAttribute = false; // Assume no matching attribute initially
            // Check if any attribute in 'data' matches (ignore 'content' key)
            for (const [key, value] of Object.entries(data)) {
                if (key === 'content') continue; // Skip the 'content' key

                if (metaTag.getAttribute(key) === value) {
                    hasMatchingAttribute = true; // Set to true if any attribute matches
                    break; // Exit loop if any attribute matches
                }
            }
            // If any attribute matches, remove the meta tag
            if (hasMatchingAttribute) {
                metaTag.remove();
                i--; // Adjust index after removal
            }
        }

        let elmMeta = document.createElement('meta');
        Object.keys(data).forEach(key => {
            elmMeta.setAttribute(key, data[key]);
        });
        document.head.appendChild(elmMeta);
        return true;
    }

    return {
        setMetaData,
        metaUpdateHead
    }
}
