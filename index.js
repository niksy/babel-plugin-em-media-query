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

	function isMediaQueryComment ( value ) {
		return value.trim() === '@media';
	}

	function transformMediaQueryComment ( path, state ) {

		if (
			path.node.leadingComments === null ||
			typeof path.node.leadingComments === 'undefined' ||
			(path.node.leadingComments && path.node.leadingComments.length === 0)
		) {
			return;
		}

		const mediaQueryComments = path.node.leadingComments
			.filter(( comment ) => {
				return isMediaQueryComment(comment.value);
			});

		if ( mediaQueryComments.length !== 0 ) {
			mediaQueryComments
				.forEach(() => {
					if ( t.isStringLiteral(path) ) {
						path.replaceWith(t.stringLiteral(emMediaQuery(path.node.value, state.opts)));
					} else if ( t.isTemplateLiteral(path) && path.node.quasis.length === 1 ) {
						path.replaceWith(t.stringLiteral(emMediaQuery(path.node.quasis[0].value.raw, state.opts)));
					}
				});
		}

		path.node.leadingComments = path.node.leadingComments
			.filter(( comment ) => {
				return !isMediaQueryComment(comment.value);
			});

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
			},
			StringLiteral: transformMediaQueryComment,
			TemplateLiteral: transformMediaQueryComment
		}
	};
};
