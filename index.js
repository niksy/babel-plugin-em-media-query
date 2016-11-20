'use strict';

const emMediaQuery = require('em-media-query');

module.exports = ( opts ) => {
	const t = opts.types;

	function getParent ( path ) {
		const parent = path.parentPath;
		if ( t.isCallExpression(parent.node) ) {
			return parent;
		}
		return getParent(parent);
	}

	return {
		visitor: {
			Identifier: ( path, state ) => {
				if ( t.isIdentifier(path.node, { name: 'matchMedia' }) ) {
					const parent = getParent(path);
					parent.node.arguments = parent.node.arguments.map(( arg ) => {
						if ( t.isStringLiteral(arg) ) {
							return t.stringLiteral(emMediaQuery(arg.value, state.opts));
						} else if ( t.isTemplateLiteral(arg) && arg.quasis.length === 1 ) {
							return t.stringLiteral(emMediaQuery(arg.quasis[0].value.raw, state.opts));
						}
						return arg;
					});
				}
			}
		}
	};
};
