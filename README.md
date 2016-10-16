# babel-plugin-em-media-query

[![Build Status][ci-img]][ci]

Babel plugin for transforming min/max-width/height media queries to ems.

Works for [`matchMedia`][matchmedia] calls.

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

window.matchMedia('screen and (min-width:600px) and (max-width:739px)');

/* After */

window.matchMedia('screen and (min-width:37.5em) and (max-width:46.1875em)');
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
[matchmedia]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
