# Pancake Agent

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![Downloads][downloads-image]][downloads-url]

The agent library to execute Pancake Target Code, current implementation is copied from
[strongloop/loopback].

## Installation

```sh
$ npm install pancake-agent --save
```

## Usage

```
const app = require('pancake-agent')(__dirname, () => {
  // here we can access:
  // - app.models
});
```

This repository 100% keeps to [strongloop/loopback]'s API, for more detail,
check [StrongLoop Official Documentation](http://apidocs.strongloop.com/).

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