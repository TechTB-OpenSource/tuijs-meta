import type { MetaRoute, MetaTag } from './models.js';

export function createMetaInstance() {
    const metaData: MetaRoute[] = [];

    function setMetaData(metaRoutes: MetaRoute[]) {
        metaData.length = 0;
        metaData.push(...metaRoutes);
    }

    function metaUpdate(metaData: MetaTag[]) {
        for (let i = 0; i < metaData.length; i++) {
            metaUpdateTag(metaData[i]);
        }
    }

    function metaRouteUpdate(route: string) {
        let globalRouteMeta, specifiedRouteMeta: MetaRoute | undefined;
        for (let i = 0; i < metaData.length; i++) {
            const item = metaData[i];
            if (item.route === '*') globalRouteMeta = item;
            if (item.route === route) specifiedRouteMeta = item;
            if (globalRouteMeta && specifiedRouteMeta) break;
        }
        if (!globalRouteMeta && !specifiedRouteMeta) {
            console.error(`tuijs-meta: No meta data found for route "${route}", and no global meta route defined.`);
            return;
        }
        if (globalRouteMeta) {
            if (globalRouteMeta.meta) {
                const globalMeta: MetaTag[] = globalRouteMeta.meta;
                for (let i = 0; i < globalMeta.length; i++) {
                    metaUpdateTag(globalMeta[i]);
                }
            }
        }
        if (!specifiedRouteMeta) {
            document.title = globalRouteMeta?.title || 'Unknown Page';
            console.warn(`tuijs-meta: No specific meta data found for route "${route}".`);
            return;
        }
        if (specifiedRouteMeta.title) {
            document.title = specifiedRouteMeta.title;
        } else {
            document.title = globalRouteMeta?.title || 'Unknown Page';
        }
        if (specifiedRouteMeta.meta) {
            const dataMeta: MetaTag[] = specifiedRouteMeta.meta;
            for (let i = 0; i < dataMeta.length; i++) {
                metaUpdateTag(dataMeta[i]);
            }
        }
        return;
    }

    function metaUpdateTag(newMetaTag: MetaTag) {
        const existingMetaTagList = Array.from(document.getElementsByTagName('meta'));
        
        // Find the meta type key and value dynamically
        const metaEntries = Object.entries(newMetaTag).filter(([key]) => key !== 'content');
        const [typeKey, typeValue] = metaEntries[0];

        // Remove existing meta tags that match the typeKey and typeValue
        existingMetaTagList.forEach(existingMetaTag => {
            if (existingMetaTag.getAttribute(typeKey) === typeValue) {
                existingMetaTag.remove();
            }
        });

        // Create and append the new meta tag
        const elmMeta = document.createElement('meta');
        elmMeta.setAttribute(typeKey, typeValue);
        elmMeta.setAttribute('content', newMetaTag.content);
        document.head.appendChild(elmMeta);
        return true;
    }

    return {
        setMetaData,
        metaUpdate,
        metaRouteUpdate
    }
}
