// --------------------------------------------------------------------
// Copyright (c) 2024 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT license
// --------------------------------------------------------------------
// Version: 0.1.1
"use strict";
var jstracetoix = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // jstracetoix.ts
  var jstracetoix_exports = {};
  __export(jstracetoix_exports, {
    DEFAULT_FORMAT: () => DEFAULT_FORMAT,
    c__: () => c__,
    d__: () => d__,
    init__: () => init__,
    t__: () => t__
  });
  var import_worker_threads = __require("worker_threads");
  var DEFAULT_FORMAT = {
    result: "{name}:`{value}`",
    input: "{name}:`{value}`",
    thread: "{id}: ",
    sep: " | ",
    new_line: true
  };
  var _stream = false ? process.stdout : console.debug;
  var _multithreading = false;
  var _format = DEFAULT_FORMAT;
  var _inputsPerThreads = {};
  var _threadNames = {};
  var _sharedLockBuffer = false ? new SharedArrayBuffer(4) : void 0;
  var _lockArray = false ? new Int32Array(_sharedLockBuffer) : void 0;
  var acquireLock = () => {
    if (false) {
      while (Atomics.compareExchange(_lockArray, 0, 0, 1) !== 0) {
      }
    }
  };
  var releaseLock = () => {
    if (false) {
      Atomics.store(_lockArray, 0, 0);
    }
  };
  var getThreadId = (threadIdParam = void 0) => {
    return false ? threadIdParam || threadId : 0;
  };
  var init__ = ({
    stream = _stream,
    multithreading = false,
    format = DEFAULT_FORMAT
  } = {}) => {
    acquireLock();
    _stream = stream;
    _multithreading = false ? multithreading : false;
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
    const data = __spreadValues(__spreadValues({}, threadInputs[threadInputs.length - 1]), inputs || {});
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
        if (_multithreading && format.thread) {
          output += format.thread.replace("{id}", _threadNames[_threadId] || `${_threadId}`);
        }
        const replaceMacro = (_format2, _name, _value) => _format2.replace("{name}", _name).replace(
          "{value}",
          typeof _value === "object" ? JSON.stringify(_value) : _value
        );
        for (const key in data) {
          if (!data.meta__.includes(key)) {
            output += replaceMacro(format.input, key, data[key]) + format.sep;
          }
        }
        if (format.result) {
          output += replaceMacro(format.result, name, data[name]);
        }
        data.meta__ += ["output__"];
        data.output__ = output;
        if (before === void 0 || before(data)) {
          output = data.output__ + (format.new_line ? "\n" : "");
          if (false) {
            _stream.write(output);
          } else {
            _stream(output);
          }
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
  return __toCommonJS(jstracetoix_exports);
})();
for(key of Object.keys(jstracetoix).filter((key) => key.includes("__"))) { window[key]=jstracetoix[key]; }
