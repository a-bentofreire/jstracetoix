// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------

import { Writable } from 'stream';
import { threadId } from 'worker_threads';

let _sharedLockBuffer = new SharedArrayBuffer(4);
let _lockArray = new Int32Array(_sharedLockBuffer as SharedArrayBuffer);
let _multithreading = false;
let _stream: NodeBrowserStream = process.stdout;

export type NodeBrowserStream = Writable;
export const getMultithreading = () => _multithreading;
export const setMultithreading = (multithreading: boolean) => { _multithreading = multithreading; };
export const setStream = (stream: NodeBrowserStream | undefined) => { _stream = stream || _stream; };
export const writeToStream = (output: string) => { _stream.write(output); }
export const getThreadId = (threadIdParam: number | undefined = undefined) => threadIdParam || threadId;
export const acquireLock = () => {
    while (_multithreading && Atomics.compareExchange(_lockArray as Int32Array, 0, 0, 1) !== 0) { }
};

export const releaseLock = () => {
    if (_multithreading) {
        Atomics.store(_lockArray as Int32Array, 0, 0);
    }
};
