(function(global){
	'use strict';
	var test = '水の';
	function confirm(){
		console.log(test);
	}

	console.log(test);

	global.confirm = confirm;
})(this);