export function createMetaInstance() {
    const metaData = [];
    function setMetaData(metaRoutes) {
        metaData.length = 0;
        metaData.push(...metaRoutes);
    }
    function metaUpdateHead(route) {
        const data = metaData.find(item => item.route === route);
        if (!data) {
            return;
        }
        if (data.title) {
            document.title = data.title;
        }
        if (data.meta) {
            const dataMeta = data.meta;
            for (let i = 0; i < dataMeta.length; i++) {
                metaUpdateTag(dataMeta[i]);
            }
        }
        return;
    }
    function metaUpdateTag(newMetaTag) {
        const existingMetaTagList = Array.from(document.getElementsByTagName('meta'));
        const { typeKey, typeValue } = newMetaTag;
        // Remove existing meta tags that match the typeKey and typeValue
        existingMetaTagList.forEach(existingMetaTag => {
            if (existingMetaTag.getAttribute(typeKey) === typeValue) {
                existingMetaTag.remove();
            }
        });
        // Create and append the new meta tag
        const elmMeta = document.createElement('meta');
        elmMeta.setAttribute(newMetaTag.typeKey, newMetaTag.typeValue);
        elmMeta.setAttribute('content', newMetaTag.content);
        document.head.appendChild(elmMeta);
        return true;
    }
    return {
        setMetaData,
        metaUpdateHead
    };
}
//# sourceMappingURL=methods.js.map