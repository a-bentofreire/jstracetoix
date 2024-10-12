// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------

import { threadId } from 'worker_threads';
import { Writable } from 'stream';

/**
 * Format Type -- Defines how result and input values will be formatted.
 *
 * @typedef {Object} Format
 * @property {string} result - The format of the result value to be displayed. Defaults to `'{name}: `{value}`'`.
 * @property {string} input - The format of the input value to be displayed. Defaults to `'{name}: `{value}`'`.
 * @property {string} thread - The format of the thread ID to be displayed. Defaults to `'{id}: '`.
 * @property {string} sep - The separator text between each input and the result. Defaults to `' | '`.
 * @property {boolean} new_line - If `true`, it will add a new line at the end of the output.
 */
export type Format = {
    result: string,
    input: string,
    thread: string,
    sep: string,
    new_line: boolean
};

type AllowResult = boolean | any;
type AllowCallback = (data: Record<string, any>) => AllowResult;
type EventCallback = (data: Record<string, any>) => boolean;
type NodeBrowserStream = Writable | typeof console.debug;

export const DEFAULT_FORMAT: Format = {
    result: '{name}:`{value}`',
    input: '{name}:`{value}`',
    thread: '{id}: ',
    sep: ' | ',
    new_line: true
};

let _stream: NodeBrowserStream = IS_NODE ? process.stdout : console.debug;
let _multithreading = false;
let _format: Format = DEFAULT_FORMAT;
let _inputsPerThreads: Record<number, Record<string, any>[]> = {};
let _threadNames: Record<number, string> = {};

let _sharedLockBuffer = IS_NODE ? new SharedArrayBuffer(4) : undefined;
let _lockArray = IS_NODE ? new Int32Array(_sharedLockBuffer as SharedArrayBuffer) : undefined;

const acquireLock = () => {
    if (IS_NODE && _multithreading) {
        while (Atomics.compareExchange(_lockArray as Int32Array, 0, 0, 1) !== 0) { }
    }
};

const releaseLock = () => {
    if (IS_NODE && _multithreading) {
        Atomics.store(_lockArray as Int32Array, 0, 0);
    }
};

const getThreadId = (threadIdParam: number | undefined = undefined) => {
    return IS_NODE ? (threadIdParam || threadId) : 0;
};

/**
 * Initializes global settings of the tracing tool.
 *
 * @param {Object} params - Parameters for initialization.
 * @param {NodeBrowserStream} [params.stream=process.stdout] - The output stream to write the output lines.
 *      Defaults to `process.stdout`.
 * @param {boolean} [params.multithreading=false] - If `true`, it prefixes the output with `thread_id:`.
 * @param {Format} [params.format=DEFAULT_FORMAT] - Format object defining the output format. Defaults to `DEFAULT_FORMAT`.
 */
export const init__ = ({
    stream = _stream,
    multithreading = false,
    format = DEFAULT_FORMAT
}: {
    stream?: NodeBrowserStream,
    multithreading?: boolean,
    format?: Format
} = {}): void => {

    acquireLock();
    _stream = stream;
    _multithreading = IS_NODE ? multithreading : false;
    _format = format;
    _inputsPerThreads = {};
    _threadNames = {};
    releaseLock();
};

/**
 * Assigns a name to a thread.
 *
 * If no **name** is provided, it generates a name based on the number of threads.
 *
 * If no threadIdParam is provided, it uses the current thread ID.
 *
 * @param {string} [name] - The name for the thread. Defaults to 't%d' where %d is the number of threads.
 * @param {number} [threadIdParam] - The ID of the thread. Defaults to the current thread ID.
 */
export const t__ = (
    name: string | undefined = undefined,
    threadIdParam: number | undefined = undefined
): void => {

    acquireLock();
    _threadNames[getThreadId(threadIdParam)] = name || `t${Object.keys(_threadNames).length}`;
    releaseLock();
};

/**
 * Captures the input value for the current thread.
 *
 * If no name is provided, it generates a default name.
 *
 * @param {any} value The input value to store.
 * @param {Object} params Optional parameters object
 * @param {string | ((index: number, allowIndex: number, value: any) => string) } params.name The
 *                     name of the input.
 *                     Defaults to 'i%d' where %d is the number of inputs for the thread.
 * @param {boolean | ((index: number, name: string, value: any) => AllowResult} params.allow A function
 *                     or value to allow tracing the input. **allow** is called before **name**.
 *                     If it returns True or False, it will allow or disallow respectively.
 *                     If it returns not bool, then it will display the allow result instead of the input value.
 * @param {number} params.level The level number to be used when there is more than one **d__** within the same
 *                     expression or function.
 *                     Defaults to 0.
 *
 * @returns The input value
 *
 * @example
 * c__(x);
 *
 * c__(x, { name: "var-name" });
 * c__(x, { name: (index, allowIndex, value) => `${index}` });
 *
 * [1, 2, 3, 4, 5].map(i => c__(i, { allow: (index, name, value) => index > 2 }));
 * [10, 20, 30].map(x => c__(x, { allow: (index, name, value) => value === 20 }));
 *
 * const z = d__(() => c__(outside_1) + y * c__(outside_2) + d__(() => k * c__(inside(5), { level: 1 })));
 */
export const c__ = (
    value: any,
    params?: {
        name?: string | ((index: number, allowIndex: number, value: any) => string);
        allow?: boolean | ((index: number, name: string, value: any) => AllowResult);
        level?: number;
    }
): any => {
    const { name = undefined, allow = undefined, level = 0 } = params || {};
    acquireLock();
    const _threadId = getThreadId();
    if (!_inputsPerThreads[_threadId]) {
        _inputsPerThreads[_threadId] = [{ index__: 0, meta__: ['meta__', 'index__'] }];
    }

    while (_inputsPerThreads[_threadId].length <= level) {
        _inputsPerThreads[_threadId].push({ index__: 0, meta__: ['meta__', 'index__'] });
    }

    const inputs = _inputsPerThreads[_threadId][level];
    const index = inputs.index__;
    const metaCount = inputs.meta__.length;

    let displayName = typeof name === 'function' ? name(index, Object.keys(inputs).length -
        metaCount, value) : name || `i${Object.keys(inputs).length - metaCount}`;
    let displayValue = value;

    let allowResult = allow;
    if (typeof allow === 'function') {
        allowResult = allow(index, displayName, value);
        if (typeof allowResult !== 'boolean') {
            displayValue = allowResult;
            allowResult = true;
        }
    }

    if (allowResult === undefined || allowResult) {
        inputs[displayName] = displayValue;
    }
    inputs.index__ = index + 1;
    releaseLock();
    return value;
};

/**
 * Displays formatted result and inputs for the current thread using a given format.
 *
 * Optionally calls `allow`, `before`, and `after` functions with the data.
 *
 * `allow`, `before`, and `after` will receive a parameter `data` with the allowed inputs.
 * The following meta values will also be available:
 *
 * - `meta__`: List of meta keys including the name key.
 * - `thread_id__`: ID of the thread being executed.
 * - `allow_input_count__`: Total number of inputs that are allowed.
 * - `input_count__`: Total number of inputs being captured.
 * - `allow__`: If `false` it was allowed. Use this for the `after` callback.
 * - `output__`: Text passed to `before` without `new_line`.
 * - `name`: The `value` parameter.
 *
 * @param {any} value - The result to trace.
 * @param {Object} params - The named parameters.
 * @param {string} [params.name='_'] - The name of the function being traced.
 * @param {boolean | AllowCallback} [params.allow] - A function to call to allow tracing.
 *  If it returns `false`, tracing is skipped but `after` is still called.
 *  If it returns a non-boolean value, it will display the allow result instead of the value.
 * @param {EventCallback} [params.before] - A function to call before displaying the output.
 *  If it returns `false`, tracing is skipped.
 * @param {EventCallback} [params.after] - A function to call after displaying the output.
 *  `after` is always called even if not allowed.
 * @param {Record<string, any>} [params.inputs] - Dictionary of additional inputs.
 * @param {Format} [params.format] - Alternative output format.
 * @returns {any} The traced value.
 *
 * @example
 * d__(x);
 * d__(c__(x) + c__(y));
 *
 * d__(c__(x) + c__(y), { name: "output" });
 *
 * d__(c__(x) + c__(y), { allow: data => data.input_count__ === 2 });
 * d__(c__(x) + c__(y), { allow: data => data.i0 === 10.0 });
 * d__(c__(x, { allow: (index, name, value) => value > 10 }) + c__(y),
 *     { allow: data => data.allow_input_count__ === 2 });
 *
 * d__([c__(x) for x in ['10', '20']], { before: data => '10' in data.output__ });
 *
 * d__([c__(x) for x in ['1', '2']], {
 *     allow: data => data.allow_input_count__ === 2,
 *     after: data => call_after(data) if (data.allow__) else ""
 * });
 */
export const d__ = (
    value: any,
    params: {
        name?: string,
        allow?: boolean | AllowCallback,
        before?: EventCallback,
        after?: EventCallback,
        inputs?: Record<string, any>,
        format?: Format
    } = {}
): any => {

    let {
        name = '_',
        allow = undefined,
        before = undefined,
        after = undefined,
        inputs = undefined,
        format = undefined
    } = params || {};

    acquireLock();
    const _threadId = getThreadId();
    const threadInputs = _inputsPerThreads[_threadId] || [{}];
    const data = { ...threadInputs[threadInputs.length - 1], ...(inputs || {}) };

    data.thread_id__ = _threadId;
    data.input_count__ = data.index__ || 0;
    data.allow__ = true;
    data.meta__ = [...(data.meta__ || ['meta__']), 'allow__', 'allow_input_count__',
        'input_count__', 'thread_id__', name];
    data[name] = value;
    delete data.index__;
    data.meta__ = data.meta__.filter((item: string) => item !== 'index__');
    data.allow_input_count__ = Object.keys(data).length - data.meta__.length + 1

    if (typeof allow === 'function') {
        allow = allow(data);
        if (typeof allow !== 'boolean') {
            data[name] = allow;
            allow = true;
        }
    }

    if (allow !== false) {
        format = format || _format;
        let output = '';

        if (_multithreading && format.thread) {
            output += format.thread.replace('{id}', _threadNames[_threadId] || `${_threadId}`);
        }

        const replaceMacro = (_format: string, _name: string, _value: any) =>
            _format.replace('{name}', _name)
                .replace('{value}', typeof _value === 'object' ? JSON.stringify(_value) : _value);

        for (const key in data) {
            if (!data.meta__.includes(key)) {
                output += replaceMacro(format.input, key, data[key]) + format.sep;
            }
        }

        if (format.result) {
            output += replaceMacro(format.result, name, data[name]);
        }

        data.meta__ += ['output__'];
        data.output__ = output;
        if (before === undefined || before(data)) {
            output = data.output__ + (format.new_line ? '\n' : '');
            if (IS_NODE) {
                (_stream as Writable).write(output);
            } else {
                (_stream as typeof console.debug)(output);
            }
        }
    } else {
        data.allow__ = false;
    }

    after && after(data);

    if (_inputsPerThreads[_threadId]) {
        _inputsPerThreads[_threadId].pop();
        if (_inputsPerThreads[_threadId].length === 0) {
            delete _inputsPerThreads[_threadId];
        }
    }
    releaseLock();
    return value;
};
