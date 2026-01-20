export function createMetaInstance() {
    const metaData = [];
    function setMetaData(metaRoutes) {
        metaData.length = 0;
        metaData.push(...metaRoutes);
    }
    function metaUpdate(metaData) {
        for (let i = 0; i < metaData.length; i++) {
            metaUpdateTag(metaData[i]);
        }
    }
    function metaRouteUpdate(route) {
        let globalRouteMeta, specifiedRouteMeta;
        for (let i = 0; i < metaData.length; i++) {
            const item = metaData[i];
            if (item.route === '*')
                globalRouteMeta = item;
            if (item.route === route)
                specifiedRouteMeta = item;
            if (globalRouteMeta && specifiedRouteMeta)
                break;
        }
        if (!globalRouteMeta && !specifiedRouteMeta) {
            console.error(`tuijs-meta: No meta data found for route "${route}", and no global meta route defined.`);
            return;
        }
        if (globalRouteMeta) {
            if (globalRouteMeta.meta) {
                const globalMeta = globalRouteMeta.meta;
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
        }
        else {
            document.title = globalRouteMeta?.title || 'Unknown Page';
        }
        if (specifiedRouteMeta.meta) {
            const dataMeta = specifiedRouteMeta.meta;
            for (let i = 0; i < dataMeta.length; i++) {
                metaUpdateTag(dataMeta[i]);
            }
        }
        return;
    }
    function metaUpdateTag(newMetaTag) {
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
    };
}
//# sourceMappingURL=methods.js.map