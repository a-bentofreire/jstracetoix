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
    const rootPath = path.dirname(process.argv[1]);
    const readFile = (filename) => fs.readFileSync(filename, 'utf8');
    const version = JSON.parse(readFile(path.join(rootPath, 'package.json')))['version'];

    let params = {
        entryPoints: ['./jstracetoix.ts'],
        outfile: isBrowser ? `browser/jstracetoix${suffix}.js` : `node/jstracetoix${suffix}.mjs`,
        minify: isProduction,
        sourcemap: isProduction,
        treeShaking: true,
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
        params.banner.js += `
// Version: ${version}`;
    }

    try {
        await esbuild.build(params);
        console.log(`Build completed successfully${isProduction ? ' in production mode' : ''}.`);
        if (isBrowser) {
            const jsFilePath = path.join(rootPath, 'browser', 'jstracetoix.js');
            fs.writeFileSync(jsFilePath, readFile(jsFilePath)
                .replace(/var\s+\w+\s*=\s*\w+\("worker_threads"\);?/g, ''));
            if (isProduction) {
                const readmePath = path.join(rootPath, 'README.md');
                fs.writeFileSync(readmePath, readFile(readmePath).replace(/\?v=[\d\.]+/, `?v=${version}`));
                if (readFile(path.join(rootPath, 'CHANGELOG.md')).split("\n")[0].indexOf(version) === -1) {
                    throw new Error(`CHANGELOG.md doesn't ${version}`)
                }
            }
        }
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();