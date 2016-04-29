# pancake-agent

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![Downloads][downloads-image]][downloads-url]

## Overview

pancake-agent is an agent library to execute the PTC(Pancake Target Code), which is based on
[strongloop/loopback].

_Pancake_ is a tool to generate PTC(Pancake Target Code) which can be executed by pancake-agent
and exposes a loopback-compatible API.

_PTC_ is an abbreviation of _Pancake Target Code_, which is the JSON files collection of an embedable 
DSL that expresses models what user defined in pancake documents.

## Installation

```sh
$ npm install pancake-agent --save
```

## Usage

```js
const app = require('pancake-agent')(__dirname, () => {
  // here we can access:
  // - app.models
});
```

## API

The pancake-agent library only exposes 1 main function as below arguments:

| name      | type      | description               |
|-----------|-----------|---------------------------|
| pathname  | String    | the pathname to load PTC  |
| onboot    | Function  | fired when app booted     |

For more detail APIs, see [Loopback API](http://apidocs.strongloop.com/loopback/)

## License

MIT @ WeFlex, Inc

[strongloop/loopback]: https://github.com/strongloop/loopback
[npm-image]: https://img.shields.io/npm/v/pancake-agent.svg?style=flat-square
[npm-url]: https://npmjs.org/package/pancake-agent
[travis-image]: https://img.shields.io/travis/weflex/pancake-agent.svg?style=flat-square
[travis-url]: https://travis-ci.org/weflex/pancake-agent
[david-image]: http://img.shields.io/david/weflex/pancake-agent.svg?style=flat-square
[david-url]: https://david-dm.org/weflex/pancake-agent
[downloads-image]: http://img.shields.io/npm/dm/pancake-agent.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/pancake-agent