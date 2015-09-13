;(function( global ){
    'use strict';

    var
        _win    = window,
        _doc    = document,
        _shadow = _doc.createElement( 'a' )
    ;

    _win.camel = marge( CamelFactory, {
        ready      : readyHandler,
        isString   : isString,
        isArray    : isArray,
        isNumber   : isNumber,
        isObject   : isObject,
        isFunction : isFunction,
        isType     : isType,
        elm        : marge( elementsQuery, {
            addClass    : addClass,
            removeClass : removeClass,
            toggleClass : toggleClass,
            hasClass    : hasClass,
            clazz       : clazz
        })
    });

    var
        TYPEOF_STRING    = '[object String]',
        TYPEOF_NUMBER    = '[object Number]',
        TYPEOF_ARRAY     = '[object Array]',
        TYPEOF_OBJECT    = '[object Object]',
        TYPEOF_REGEXP    = '[object RegExp]',
        TYPEOF_DATE      = '[object Date]',
        TYPEOF_NULL      = '[object Null]',
        TYPEOF_UNDEFINED = '[object Undefined]',
        TYPEOF_FUNCTION  = '[object Function]',
        TYPEOF_BOOLEAN   = '[object Boolean]',
        TYPEOF_ERROR     = '[object Error]',
        
        DOM_CONT_LOADED  = 'DOMContentLoaded',

        REG_SELECTOR_INITIALS = /^([.#]?)[\w\-_]+$/,

        HAS_CLASS_LIST = _shadow.classList ? true : false
    ;

    var
        Object_toString = Object.prototype.toString
    ;

    fill( Array.prototype, {
        indexOf : ArrayIndexOf,
        forEach : ArrayForEach
    });

    fill( String.prototype, {
        trim : StringTrim
    });
        

    //
    //  
    //  Function CamelFactory
    //=================================================

    /**
     * Camelオブジェクトを生成
     * @param {String} expr htmlタグ
     * @return {Object} Camelオブジェクト
     */
    function CamelFactory( expr ){
        return new Camel( expr );
    }

    //
    //  Object Camel
    //=================================================

    /**
     * Camelオブジェクト
     * @param {String} elms htmlタグ
     * @constructor
     */
    function Camel( elms ) {
        if ( !( this instanceof Camel ) ) {
            return new Camel( elms );
        }

        this.elm = elementsSelector( elms );
    }

    //
    // 
    //=================================================

    /**
     * DOMの構築完了判定（DOMContentLoaded）
     * @param {Fuction} handler 
     */
    function readyHandler( handler ) {
        _doc.addEventListener( DOM_CONT_LOADED, function() {
            handler( camel );
        }, false );
    }

    /**
     * セレクタ受け取り
     * @param  {String} expr
     * @return {Node}
     */
    function elementsQuery( expr, roots ) {
        var str = null;

        if ( isCamel( expr ) ) {
            return expr.elm;
        } else {
            return elementsSelector( expr, roots );
        }
    }

    /**
     * セレクタ解析
     * @param  {String | Node} roots 
     * @param  {String} expr
     * @return {Node}
     */
    function elementsSelector( expr, roots ) {
        var initials, loots;

        loots = roots || _doc;

        console.log(loots);

        initials = expr.substr( 0, 1 );

        switch( initials ) {
            case '#' : return loots.getElementById( expr.substr(1) );
            case '.' : 
                if ( _doc.getElementsByClassName ) {
                    return loots.getElementsByClassName( expr.substr(1) );
                } else {
                    return AdaptiveGetElementsByClassName.call( loots, expr.substr(1) );
                }
            break;
            default  : return loots.getElementsByTagName( expr );
        }
    }

    /**
     * クラス名を追加する
     * @param {Node} elms
     * @param {String} str  クラス名
     * @return {Node}
     */
    function addClass( elms, str ) {
        var
            original = isString( elms ) ? elementsSelector( elms ) : elms,
            copy     = original,
            len      = original.length,
            names,
            i
        ;

        if( !len ) {
            copy = [original];
            len = 1;
        }

        for ( i = len; i--; ) {
            names = copy[i].className.trim();
            if ( names.indexOf( str ) === -1 ) {
                copy[i].className = names ? names + ' ' + str : str;
            }
        }

        return original;
    }

    /**
     * クラス名を削除する
     * @param {Node} elms
     * @param {String} str  クラス名
     * @return {Node}
     */
    function removeClass( elms, str ) {
        var
            original = isString( elms ) ? elementsSelector( elms ) : elms,
            copy     = original,
            len      = original.length,
            names,
            i
        ;

        if( !len ) {
            copy = [original];
            len = 1;
        }

        for ( i = len; i--; ) {
            names = copy[i].className.trim();
            if ( names.indexOf( str ) !== 1 ) {
                copy[i].className = names.replace( str, '' ).trim();
            }
        }

        return original;
    }

    /**
     * クラス名の追加・削除を交互に行う
     * @param  {Node} elm
     * @param  {[type]} str
     * @return {[type]}
     */
    function toggleClass( elms, str ) {
         var
            original = isString( elms ) ? elementsSelector( elms ) : elms,
            copy     = original,
            len      = original.length,
            names,
            i
        ;

        if( !len ) {
            copy = [original];
            len = 1;
        }

        for ( i = len; i--; ) {
            names = copy[i].className.trim();
            if ( names.indexOf( str ) === -1 ) {
                copy[i].className = names ? names + ' ' + str : str;
            } else {
                copy[i].className = names.replace( str, '' ).trim();
            }
        }

        return original;
    }

    /**
     * クラス名の有無を調べる
     * @param  {Node}  elm
     * @param  {String}  str
     * @return {Boolean}
     */
    function hasClass( elm, str ) {
        var
            el = isString( elm ) ? elementsSelector( elm ) : elm,
            len = el.length,
            names
        ;

        if( el.length )  return;

        names = el.className.trim();

        if( names.indexOf( str ) !== -1 ) {
            return true;
        }

        return false;
    }

    /**
     * addClass, removeClass, toggleClass, hasClassを一括して行う
     * @param  {Node} elms
     * @param  {String} str
     * @param  {String} type add or remove or toggle or has
     * @return {Array | Boolean}
     */
    function clazz( elms, str, type) {
        switch( type ) {
            case 'add'    : return addClass( elms, str );
            case 'remove' : return removeClass( elms, str );
            case 'toggle' : return toggleClass( elms, str );
            case 'has'    : return hasClass( elms, str );
            default       : return '?';
        }
    }

    //
    //  helpers
    //=================================================

    /**
    * オブジェクトを合成
    *  
    * @param {Function} a
    * @param {Object} b
    * @return {Object}
    */
    function marge( a, b ) {
        var key = null;
        for ( key in b ) {
            if ( b.hasOwnProperty( key ) ) {
                if ( !( key in a ) ) a[ key ] = b[ key ];
            }
        }
        return a;
    }

    /**
     * オブジェクトを合成
     * 主にprototype拡張に利用
     *
     * @param  {Object} proto
     * @param  {Object} obj
     * @return {void}
     */
    function fill( a, b ) {
        var key = null;
        for ( key in b ) {
            if ( b.hasOwnProperty( key ) ) {
                if ( !( key in a ) ) a[ key ] = b[ key ];
            }
        }
    }

     //  is系関数
    function isString( obj ) {
        return Object_toString.call( obj ) === TYPEOF_STRING;
    }

    function isArray( obj ) {
        return Object_toString.call( obj ) === TYPEOF_ARRAY;
    }

    function isNumber( obj ) {
        return Object_toString.call( obj ) === TYPEOF_NUMBER;
    }

    function isObject( obj ) {
        return Object_toString.call( obj ) === TYPEOF_OBJECT;
    }

    function isFunction( obj ) {
        return Object_toString.call( obj ) === TYPEOF_FUNCTION;
    }

    //Camelオブジェクト判定
    function isCamel( obj ) {
        return obj.constructor.name === 'Camel';
    }

    /**
     * 型判定
     * @param  {Object}  obj
     * @return {String}
     */
    function isType( obj ) {
        if ( isCamel( obj ) ) {
            return 'Camel';
        }

        switch ( Object_toString.call( obj ) ) {
            case TYPEOF_STRING : return 'String';
            case TYPEOF_NUMBER : return 'Number';
            case TYPEOF_ARRAY  : return 'Array';
            case TYPEOF_OBJECT : return 'Object';
            default            : return 'void';
        }
    }

    /**
     * getElementsByClassNameの補填
     * @param {String} str 検索するクラス名
     * @return {Array}
     */
    function AdaptiveGetElementsByClassName( str ) {
        var
            elms = this.getElementsByTagName( '*' ),
            len = elms.length,
            arr = [],
            names,
            i
        ;

        for ( i = len; i--; ) {
            names = elms[i].className.trim();
            if ( names.indexOf( str ) !== -1 ) {
                arr.push( elms[i] );
            }
        }

        return arr;
    }

    /**
     * ArrayIndexOfの補填
     * @param {＊} serach
     * @return {Number}
     */
    function ArrayIndexOf( serach ) {
        if ( this === null ) {
            throw new TypeError();
        }

        var
            t = Object(this),
            len = t.length >>> 0,
            n = 0
        ;

        if ( len === 0 ) {
            return -1;
        }
        if ( arguments.length > 0 ) {
            n = Number( arguments[1] );
            if ( n !== n ) { // shortcut for verifying if it's NaN
                n = 0;
            } else if ( n !== 0 && n !== Infinity && n !== -Infinity ) {
                n = (n > 0 || -1) * Math.floor( Math.abs( n ) );
            }
        }
        if ( n >= len ) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max( len - Math.abs( n ), 0 );
        for (; k < len; k++) {
            if ( k in t && t[k] === serach ) {
                return k;
            }
        }
        return -1;
    }

    /**
     * array.forEachの補填
     * @param {Function} callback
     * @param {[type]}   thisArg
     */
    function ArrayForEach( callback, thisArg ) {

        var T, k;

        if ( this === null ) {
            throw new TypeError( " this is null or not defined" );
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ( {}.toString.call(callback) != "[object Function]" ) {
            throw new TypeError( callback + " is not a function" );
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if ( thisArg ) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while( k < len ) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then

            if ( k in O ) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[ k ];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call( T, kValue, k, O );
            }
            // d. Increase k by 1.
            k++;
            // 8. return undefined
        }
    }

    /**
     * String.prototype.trim の補填
     */
    function StringTrim() {
        return this.replace(/^\s+|\s+$/g,'');
    }
    
})( this );