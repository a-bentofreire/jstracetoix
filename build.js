// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------

import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

async function build() {
    const isProduction = process.argv.includes('--production');
    const isBrowser = process.argv.includes('--browser');
    const suffix = isProduction ? '' : '-dev';

    let params = {
        entryPoints: ['./jstracetoix.ts'],
        outfile: isBrowser ? `browser/jstracetoix${suffix}.js` : `node/jstracetoix${suffix}.mjs`,
        minify: isProduction,
        sourcemap: isProduction,
        platform: isBrowser ? 'browser' : 'node',
        define: {
            'IS_NODE': isBrowser ? 'false' : 'true'
        },
        banner: {
            js: `// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------`
        },
    };
    if (isBrowser) {
        params = {
            ...params, ...{
                external: ['*'],
                globalName: 'jstracetoix',
                target: 'es2015',
                bundle: true,
                footer: {
                    js: 'for(key of Object.keys(jstracetoix).filter((key) => key.includes("__"))) { window[key]=jstracetoix[key]; }'
                }
            }
        };
        params.define['']
    }


    try {
        await esbuild.build(params);
        console.log(`Build completed successfully${isProduction ? ' in production mode' : ''}.`);
        if (isBrowser) {
            const filePath = path.join(path.dirname(process.argv[1]), 'browser', 'jstracetoix.js');
            let content = fs.readFileSync(filePath, 'utf8');
            fs.writeFileSync(filePath, content.replace(/var\s+\w+\s*=\s*\w+\("worker_threads"\);?/g, ''));
        }
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();