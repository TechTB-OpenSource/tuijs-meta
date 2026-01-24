#! /usr/bin/env node
import { checkUrl } from 'tuijs-util';
import { consoleLog } from './lib/_logging.js';
import createSiteMap from './lib/siteMap.js';

(async () => {
    try {
        consoleLog({ type: 'info', message: `\n\n--------------------------\n` });
        consoleLog({ type: 'info', message: `Attempting to generate site map...\n` });
        const arg = process.argv.slice(2);
        const data = {
            configFile: '',
            inputFile: '',
            outputFile: 'sitemap.xml'
        }

        if (!arg[0]) {
            throw new Error(`No arguments provided.`);
        }
        if (!arg[0].toLowerCase().endsWith('.json')) {
            throw new Error(`The first argument must be a valid config JSON file.`);
        }
        data.configFile = arg[0];

        if (!arg[1]) {
            throw new Error(`No site data input file provided.`);
        }
        data.inputFile = arg[1];

        if (!arg[2]) {
            consoleLog({ type: 'warning', message: `No output file provided. Using the default 'sitemap.xml'.` });
        }
        data.outputFile = arg[2] || data.outputFile;
        await createSiteMap(data.configFile, data.inputFile, data.outputFile);
        return;
    } catch (er) {
        consoleLog({ type: 'error', message: `Error generating site map.` })
        consoleLog({ type: 'error', message: er.toString() });
    }
})();
