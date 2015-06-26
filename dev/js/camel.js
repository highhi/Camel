(function(global){
	'use strict';

	var win				= window,
		doc				= document,
		OBJ_toString	= Object.prototype.toString;
	
	var reqAnimation = 
		requestAnimationFrame ||
		mozRequestAnimationFrame ||
		webkitRequestAnimationFrame ||
		msRequestAnimationFrame ||
		setTimeout;

	getEnvironment();

	function Camel(elm) {
		if ( !(this instanceof Camel) ) {
			return new Camel(elm);
		}

		if ( typeof elm === 'string' ) {
			var fl = elm.slice( 0, 1 );

			if ( fl === '#' ) {
				this.elm = doc.getElementById( elm.substr(1) );
				this.isArray = false;
			} else if ( fl === '.') {
				this.elm = doc.getElementsByClassName( elm.substr(1) );
				this.isArray = true;
			} else {
				this.elm = doc.getElementsByTagName( elm );
				this.isArray = true;
			}
		}
	}

	Camel.prototype.show = function(){
		
		if( this.isArray ) {	
			var len = this.elm.length, i = 0;

			for (; i < len; i++) {
				this.elm[i].style.display = 'block';
			}

		} else {
			this.elm.style.display = 'block';
		}
	};

	Camel.prototype.hide = function(){
		
		if( this.isArray ) {	
			var len = this.elm.length, i = 0;

			for (; i < len; i++) {
				this.elm[i].style.display = 'none';
			}

		} else {
			this.elm.style.display = 'none';
		}
	};

	Camel.prototype.css = function(options){
		var key = null;

		if( this.isArray ) {	
			var len = this.elm.length, i = 0;

			for ( ; i < len; i++ ) {
				for ( key in options ) {
					if ( !options.hasOwnProperty(key) ) continue;
					this.elm[i].style[key] = options[key];
				}
			}

		} else {
			for ( key in options ) {
				if ( !options.hasOwnProperty(key) ) continue;
				this.elm.style.key = options[key];
			}
		}
	};

	function isArray(obj) {
		return OBJ_toString.call(obj) === '[object Array]';
	}

	function toArray(items) {
		var ary = [], i = items.length;
		for (; i-->0;) {
			if (i in items) ary[i]= items[i];
		}
		return ary;
	}

	function getEnvironment() {
		var ua = navigator.userAgent.toLowerCase();
	}

	global.C = Camel;
})(this);