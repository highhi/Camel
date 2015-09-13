camel.ready(function( c ) {
	var $root = c.elm('#root');
	var $target = c.elm('#target');

	console.log( c.elm.clazz( $target, 'is-active', 'has' ) );

});