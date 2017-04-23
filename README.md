# babel-plugin-em-media-query

[![Build Status][ci-img]][ci]

Babel plugin for transforming min/max-width/height media queries to ems.

## Install

```sh
npm install babel-plugin-em-media-query --save
```

## Usage

Use it via available [plugin activation options][babel-plugins].

For `.babelrc` file:

```json
{
	"plugins": [
		"babel-plugin-em-media-query"
	]
}
```

Then, in your code:

```js
/* Before */

// Standard matchMedia call
window.matchMedia('screen and (min-width:600px) and (max-width:739px)');

// Special leading comment before string or template literal
const jackie = /* @media */ 'screen and (min-width:600px)';

/* After */

window.matchMedia('screen and (min-width:37.5em) and (max-width:46.1875em)');

const jackie = 'screen and (min-width:37.5em)';
```

## Options

### precision

Type: `Integer`  
Default: `5`

Rounding precision for values.

## License

MIT © [Ivan Nikolić](http://ivannikolic.com)

[ci]: https://travis-ci.org/niksy/babel-plugin-em-media-query
[ci-img]: https://img.shields.io/travis/niksy/babel-plugin-em-media-query.svg
[babel-plugins]: http://babeljs.io/docs/plugins/
