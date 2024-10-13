
function elog(v) {
    console.log(v);
    return v;
}
const callAfter = (s) => true;

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------- Copy From Here ----------------------------------------

import { Worker, isMainThread, workerData } from 'worker_threads';
import { c__, d__, init__, t__ } from '../node/jstracetoix.mjs';

// Initializing with multithreading
init__({ multithreading: true });

// It displays the threadId: i0: `4` | _: `5`
const threadFunction = () => {
    d__(c__(4) + 1);
};

// It displays the something: i0: `4` | _: `5`
const threadFunctionWithName = () => {
    t__('something');
    d__(c__(4) + 1);
};


if (isMainThread) {
    const threads = [];

    // Create 5 workers
    for (let i = 0; i < 5; i++) {
        const worker = new Worker(__filename);
        threads.push(worker);
    }

    const workerWithName = new Worker(__filename, { workerData: { withName: true } });
    threads.push(workerWithName);
    threads.forEach(thread => {
        thread.on('message', message => {
            console.log('From worker:', message);
        });

        thread.on('exit', () => {
            console.log('Thread finished');
        });
    });

} else {
    if (workerData && workerData.withName) {
        threadFunctionWithName();
    } else {
        threadFunction();
    }
}