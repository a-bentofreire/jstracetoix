// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------
// Version: 1.0.0

// externals.ts
import { threadId } from "worker_threads";
var _sharedLockBuffer = new SharedArrayBuffer(4);
var _lockArray = new Int32Array(_sharedLockBuffer);
var _multithreading = false;
var _stream = process.stdout;
var getMultithreading = () => _multithreading;
var setMultithreading = (multithreading) => {
  _multithreading = multithreading;
};
var setStream = (stream) => {
  _stream = stream || _stream;
};
var writeToStream = (output) => {
  _stream.write(output);
};
var getThreadId = (threadIdParam = void 0) => threadIdParam || threadId;
var acquireLock = () => {
  while (_multithreading && Atomics.compareExchange(_lockArray, 0, 0, 1) !== 0) {
  }
};
var releaseLock = () => {
  if (_multithreading) {
    Atomics.store(_lockArray, 0, 0);
  }
};

// jstracetoix.ts
var DEFAULT_FORMAT = {
  result: "{name}:`{value}`",
  input: "{name}:`{value}`",
  thread: "{id}: ",
  sep: " | ",
  new_line: true
};
var _format = DEFAULT_FORMAT;
var _inputsPerThreads = {};
var _threadNames = {};
var init__ = ({
  stream = void 0,
  multithreading = false,
  format = DEFAULT_FORMAT
} = {}) => {
  acquireLock();
  setStream(stream);
  setMultithreading(multithreading);
  _format = format;
  _inputsPerThreads = {};
  _threadNames = {};
  releaseLock();
};
var t__ = (name = void 0, threadIdParam = void 0) => {
  acquireLock();
  _threadNames[getThreadId(threadIdParam)] = name || `t${Object.keys(_threadNames).length}`;
  releaseLock();
};
var c__ = (value, params) => {
  const { name = void 0, allow = void 0, level = 0 } = params || {};
  acquireLock();
  const _threadId = getThreadId();
  if (!_inputsPerThreads[_threadId]) {
    _inputsPerThreads[_threadId] = [{ index__: 0, meta__: ["meta__", "index__"] }];
  }
  while (_inputsPerThreads[_threadId].length <= level) {
    _inputsPerThreads[_threadId].push({ index__: 0, meta__: ["meta__", "index__"] });
  }
  const inputs = _inputsPerThreads[_threadId][level];
  const index = inputs.index__;
  const metaCount = inputs.meta__.length;
  let displayName = typeof name === "function" ? name(index, Object.keys(inputs).length - metaCount, value) : name || `i${Object.keys(inputs).length - metaCount}`;
  let displayValue = value;
  let allowResult = allow;
  try {
    if (typeof allow === "function") {
      allowResult = allow(index, displayName, value);
      if (typeof allowResult !== "boolean") {
        displayValue = allowResult;
        allowResult = true;
      }
    }
  } finally {
    if (allowResult === void 0 || allowResult) {
      inputs[displayName] = displayValue;
    }
    inputs.index__ = index + 1;
    releaseLock();
  }
  return value;
};
var d__ = (value, params = {}) => {
  let {
    name = "_",
    allow = void 0,
    before = void 0,
    after = void 0,
    inputs = void 0,
    format = void 0
  } = params || {};
  acquireLock();
  const _threadId = getThreadId();
  const threadInputs = _inputsPerThreads[_threadId] || [{}];
  const data = { ...threadInputs[threadInputs.length - 1], ...inputs || {} };
  data.thread_id__ = _threadId;
  data.input_count__ = data.index__ || 0;
  data.allow__ = true;
  data.meta__ = [
    ...data.meta__ || ["meta__"],
    "allow__",
    "allow_input_count__",
    "input_count__",
    "thread_id__",
    name
  ];
  data[name] = value;
  delete data.index__;
  data.meta__ = data.meta__.filter((item) => item !== "index__");
  data.allow_input_count__ = Object.keys(data).length - data.meta__.length + 1;
  try {
    if (typeof allow === "function") {
      allow = allow(data);
      if (typeof allow !== "boolean") {
        data[name] = allow;
        allow = true;
      }
    }
    if (allow !== false) {
      format = format || _format;
      let output = "";
      if (getMultithreading() && format.thread) {
        output += format.thread.replace("{id}", _threadNames[_threadId] || `${_threadId}`);
      }
      const replaceMacro = (_format2, _name, _value) => _format2.replace("{name}", _name).replace(
        "{value}",
        typeof _value === "object" ? JSON.stringify(_value) : _value
      );
      if (format.input) {
        for (const key in data) {
          if (!data.meta__.includes(key)) {
            output += replaceMacro(format.input, key, data[key]) + (format.sep || "");
          }
        }
      }
      if (format.result) {
        output += replaceMacro(format.result, name, data[name]);
      }
      data.meta__ += ["output__"];
      data.output__ = output;
      if (before === void 0 || before(data)) {
        writeToStream(data.output__ + (format.new_line ? "\n" : ""));
      }
    } else {
      data.allow__ = false;
    }
    after && after(data);
  } finally {
    if (_inputsPerThreads[_threadId]) {
      _inputsPerThreads[_threadId].pop();
      if (_inputsPerThreads[_threadId].length === 0) {
        delete _inputsPerThreads[_threadId];
      }
    }
    releaseLock();
  }
  return value;
};
export {
  DEFAULT_FORMAT,
  c__,
  d__,
  init__,
  t__
};
