import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import { JSDOM } from 'jsdom';
import { checkIsArray, checkIsObject } from 'tuijs-util';

import { consoleLog } from './_logging.js';

async function createSiteMap(configFile, inputFile, outputFile) {
    try {
        const data = fs.readFileSync(inputFile, 'utf-8');
        let routeDataArray = [];

        switch (inputFile.toLowerCase().split('.').pop()) {
            case 'json':
                routeDataArray = JSON.parse(data);
                break;
            case 'js':
                const fileURL = pathToFileURL(path.resolve(inputFile));
                const module = await import(fileURL);
                routeDataArray = module.default || module;
                break;
            default:
                throw new Error(`The provided inputFile is not a .json or .js file.`);
        }
        if (!checkIsArray(routeDataArray)) {
            throw new Error(`The provided site data is not a valid JavaScript Array.`);
        }

        const dom = new JSDOM(elmSite(), { contentType: "text/xml" });
        const document = dom.window.document;

        for (let i = 0; i < routeDataArray.length; i++) {
            const routeObject = routeDataArray[i];
            if (!checkIsObject(routeObject)) {
                consoleLog({ type: 'warning', message: `The provided site data array contains a non-object entry at index ${i}. Skipping this entry.` });
                continue;
            }

            const routeObjectMapData = routeObject['map'];
            if (!routeObjectMapData) {
                consoleLog({ type: 'warning', message: `The provided site data object at index ${i} is missing the required 'map' property.` });
                continue;
            }

            const routeObjectRoute = routeObject['route'];
            if (!routeObjectRoute) {
                consoleLog({ type: 'warning', message: `The provided site data object at index ${i} is missing the required 'route' property.` });
                continue;
            }
            if (routeObjectRoute === '*') {
                continue;
            }

            const routeElement = addRouteToMap(rootUrl, routeObjectRoute, routeObjectMapData, document);
            document.querySelector("urlset").appendChild(routeElement);
        }

        const siteMapSerialized = new dom.window.XMLSerializer().serializeToString(document);
        const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
        const siteMapFinal = xmlDeclaration + siteMapSerialized;
        createFile(outputFile, siteMapFinal);
    } catch (er) {
        throw new Error(er);
    }
}

function elmSite() {
    return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
}

function addRouteToMap(root, route, data, document) {
    try {
        const elmUrl = document.createElementNS(null, 'url');
        if (!elmUrl) {
            throw new Error(`Could not create 'url' element.`);
        }

        const elmLoc = document.createElementNS(null, 'loc');
        if (elmLoc) {
            elmLoc.textContent = `${root}${route.startsWith('/') ? '' : '/'}${route}`;
            elmUrl.appendChild(elmLoc);
        }

        for (const [key, value] of Object.entries(data)) {
            const elmUrlChild = document.createElementNS(null, `${key}`);
            if (elmUrlChild) {
                elmUrlChild.textContent = value;
                elmUrl.appendChild(elmUrlChild);
            }
        }

        const elmLastMod = elmUrl.querySelector('lastmod');
        if (elmLastMod) {
            const date = new Date(elmLastMod.textContent || '');
            elmLastMod.textContent = date.toISOString().split('T')[0];
        }
        elmUrl.appendChild(elmLastMod);

        if (elmUrl.hasAttribute('xmlns')) {
            elmUrl.removeAttribute('xmlns');
        }

        return elmUrl;
    } catch (er) {
        throw new Error(er);
    }
}

function createFile(filePath, fileTemplate) {
    try {
        fs.writeFileSync(filePath, fileTemplate);
        consoleLog({ type: 'info', message: `File '${filePath}' created.` });
        return;
    } catch (er) {
        throw new Error(er);
    }
}

export default {
    createSiteMap
}
