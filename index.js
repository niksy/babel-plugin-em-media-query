'use strict';

const round = require('lodash/round');
const parse = require('postcss-value-parser');

/**
 * @param  {String} str  [description]
 * @param  {Object} opts
 *
 * @return {String}
 */
function transform ( str, opts ) {

	opts = Object.assign({
		precision: 5
	}, opts);

	const ast = parse(str);

	ast.walk(( node ) => {

		if ( node.type === 'function' ) {

			const values = node.nodes;
			const minMax = values.some(( item ) => {
				return /(?:min|max)\-(?:width|height)/.test(item.value);
			});

			// If we are working with min/max-width/height query
			if ( minMax ) {
				values

					// Work only with pixel values
					.filter(( item ) => {
						const value = parse.unit(item.value);
						return item.type === 'word' && (value && value.unit === 'px');
					})

					// Convert to ems
					.map(( item ) => {
						const value = parse.unit(item.value);
						item.value = [round(Number(value.number)/16, opts.precision), 'em'].join('');
						return item;
					});
			}

		}

	});

	return ast.toString();

}

module.exports = ( opts ) => {
	const t = opts.types;

	function getParent ( path ) {
		const parent = path.parentPath;
		if ( t.isCallExpression(parent.node) ) {
			return parent;
		}
		return getParent(parent);
	}

	const updateMediaQuery = {
		StringLiteral: ( path, state ) => {
			path.node.value = transform(path.node.value, state.opts);
		}
	};

	return {
		visitor: {
			Identifier: ( path, state ) => {
				if ( t.isIdentifier(path.node, { name: 'matchMedia' }) ) {
					const parent = getParent(path);
					parent.traverse(updateMediaQuery, state);
				}
			}
		}
	};
};
