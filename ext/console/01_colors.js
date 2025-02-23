// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

/// <reference path="../../core/internal.d.ts" />

"use strict";

((window) => {
  const {
    RegExp,
    StringPrototypeReplace,
    ArrayPrototypeJoin,
  } = window.__bootstrap.primordials;

  function code(open, close) {
    return {
      open: `\x1b[${open}m`,
      close: `\x1b[${close}m`,
      regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
    };
  }

  function run(str, code) {
    return `${code.open}${
      StringPrototypeReplace(str, code.regexp, code.open)
    }${code.close}`;
  }

  function bold(str) {
    return run(str, code(1, 22));
  }

  function italic(str) {
    return run(str, code(3, 23));
  }

  function yellow(str) {
    return run(str, code(33, 39));
  }

  function cyan(str) {
    return run(str, code(36, 39));
  }

  function red(str) {
    return run(str, code(31, 39));
  }

  function green(str) {
    return run(str, code(32, 39));
  }

  function bgRed(str) {
    return run(str, code(41, 49));
  }

  function white(str) {
    return run(str, code(37, 39));
  }

  function gray(str) {
    return run(str, code(90, 39));
  }

  function magenta(str) {
    return run(str, code(35, 39));
  }

  // https://github.com/chalk/ansi-regex/blob/2b56fb0c7a07108e5b54241e8faec160d393aedb/index.js
  const ANSI_PATTERN = new RegExp(
    ArrayPrototypeJoin([
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
    ], "|"),
    "g",
  );

  function stripColor(string) {
    return StringPrototypeReplace(string, ANSI_PATTERN, "");
  }

  function maybeColor(fn) {
    return !(globalThis.Deno?.noColor ?? false) ? fn : (s) => s;
  }

  window.__bootstrap.colors = {
    bold,
    italic,
    yellow,
    cyan,
    red,
    green,
    bgRed,
    white,
    gray,
    magenta,
    stripColor,
    maybeColor,
  };
})(this);
