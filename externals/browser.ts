// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------

let _stream: NodeBrowserStream = console.debug;

export type NodeBrowserStream = typeof console.debug;
export const getMultithreading = () => false;
export const setMultithreading = (multithreading: boolean) => { };
export const getThreadId = (threadIdParam: number | undefined = undefined) => 0;
export const acquireLock = () => {};
export const releaseLock = () => {};
export const writeToStream = (output: string) => { _stream(output); }
export const setStream = (stream: NodeBrowserStream | undefined) => {
    _stream = stream || _stream;
};
