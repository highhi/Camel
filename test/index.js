camel.ready(function( c ) {

	var $target = c.elm( '#target' );
	var label = c.elm('label');
	var input = c.elm('input');

	console.log( $target.dataset.fooBar = 'るるる' );
	console.log( $target.dataset.barFoo );
});