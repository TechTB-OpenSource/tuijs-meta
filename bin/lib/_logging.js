import { createSmartLogInstance } from 'smart-log-node';

const logger = createSmartLogInstance();
const { consoleLog } = logger;

export default {
    consoleLog
}
