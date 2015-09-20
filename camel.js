/*eslint
 "strict": 2,
 "eqeqeq": 2,
 "curly": 2,
 "quotes": [2, "single"],
 "no-mixed-requires": [1, true],
 "no-var": 0,
 "no-new": 2,
 "no-multi-spaces": 0,
 "consistent-this": [2, "DO NOT USE"]
 */
;(function( global ){
    'use strict';

    var
        _win    = window,
        _doc    = document,
        _shadow = _doc.createElement( 'a' )
    ;

    _win.camel = marge( camelFactory, {
        ready      : readyHandler,
        isString   : isString,
        isArray    : isArray,
        isNumber   : isNumber,
        isObject   : isObject,
        isFunction : isFunction,
        isType     : isType,
        elm        : marge( elementsQuery, {
            addClass    : elementsAddClass,
            removeClass : elementsRemoveClass,
            toggleClass : elementsToggleClass,
            hasClass    : elementsHasClass,
            clazz       : elementsClazz,
            css         : elementsCss,
            attr        : elementsAttr
        }),
        evt        : eventsDefine
    });

    var
        TYPEOF_STRING         = '[object String]',
        TYPEOF_NUMBER         = '[object Number]',
        TYPEOF_ARRAY          = '[object Array]',
        TYPEOF_OBJECT         = '[object Object]',
        TYPEOF_REGEXP         = '[object RegExp]',
        TYPEOF_DATE           = '[object Date]',
        TYPEOF_NULL           = '[object Null]',
        TYPEOF_UNDEFINED      = '[object Undefined]',
        TYPEOF_FUNCTION       = '[object Function]',
        TYPEOF_BOOLEAN        = '[object Boolean]',
        TYPEOF_ERROR          = '[object Error]',
        
        DOM_CONT_LOADED       = 'DOMContentLoaded',

        HAS_CLASS_LIST        = _shadow.classList,
        HAS_DATA_SET          = _shadow.dataset,
        HAS_EVT_LISTENER      = _doc.addEventListener,
        USER_AGENT            = environmentCheck()
    ;

    var
        Object_toString = Object.prototype.toString
    ;

    fill( Array.prototype, {
        indexOf : ArrayIndexOf,
        forEach : ArrayForEach,
        filter  : ArrayFileter,
        map     : ArrayMap
    });

    fill( String.prototype, {
        trim       : StringTrim,
        camelize   : StringCamelize,
        decamelize : StringDeCamelize
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
    function camelFactory( expr ){
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
        if ( _doc.addEventListener ) {
            _doc.addEventListener( DOM_CONT_LOADED, function() {
                handler( camel );
            }, false );
        } else {
            alternativeDOMContentLoaded( handler, camel );
        }
    }

    function eventsDefine( elms, type, listener ) {
        var
            original = isString( elms ) ? elementsSelector( elms ) : elms,
            copy     = original,
            len      = original.length,
            closer,
            i
        ;

        if ( !len ) {
            copy = [original];
            len = 1;
        }

        if ( HAS_EVT_LISTENER ) {
            for ( i = len; i--; ) {
                copy[i].addEventListener( type, listener, false );
            }
        } else {
            closer = eventRaising( listener );
            for ( i = len; i--; ) {
                copy[i].attachEvent( 'on' + type, closer );
            }
        }
    }

    /**
     * レガシーIEのeventオブジェクトをモダンブラウザの仕様に合わせる
     * @param  {Function} listener
     * @return {Function} 
     */
    function eventRaising( listener ) {
        return function( e ) {
            e.target = e.currentTarget = e.srcElement;

            e.preventDefault = function() {
                e.returnValue  = false;
            };
            e.stopPropagation = function() {
                e.cancelBubble = true;
            };
            
            listener.call( e.target, e );
        };
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

        loots    = roots || _doc;
        initials = expr.substr( 0, 1 );

        switch( initials ) {
            case '#' : return loots.getElementById( expr.substr(1) );
            case '.' : 
                // NodeListは処理速度向上のためにArrayに変換してreturnする
                if ( _doc.getElementsByClassName ) {
                    return toArray( loots.getElementsByClassName( expr.substr(1) ) );
                } else if( _doc.querySelectorAll ) {
                    return toArray( loots.querySelectorAll( expr ) );
                } else {
                    return alternativeGetElementsByClassName( loots, expr.substr(1) );
                }
            break;
            default  : return toArray( loots.getElementsByTagName( expr ) );
        }
    }

    /**
     * クラス名を追加する
     * @param {String | Node} elms
     * @param {String} str  クラス名
     * @return {Node}
     */
    function elementsAddClass( elms, str ) {
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

        if ( HAS_CLASS_LIST ) {
            for ( i = len; i--; ) {
                copy[i].classList.add( str );
            }
        } else {
            for ( i = len; i--; ) {
                names = copy[i].className.trim();
                if ( names.indexOf( str ) === -1 ) {
                    copy[i].className = names ? names + ' ' + str : str;
                }
            }
        }
        return original;
    }

    /**
     * クラス名を削除する
     * @param {String | Node} elms
     * @param {String} str  クラス名
     * @return {Node}
     */
    function elementsRemoveClass( elms, str ) {
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

        if ( HAS_CLASS_LIST ) {
            for ( i = len; i--; ) {
                copy[i].classList.remove( str );
            }
        } else {
            for ( i = len; i--; ) {
                names = copy[i].className.trim();
                if ( names.indexOf( str ) !== 1 ) {
                    copy[i].className = names.replace( str, '' ).trim();
                }
            }
        }

        return original;
    }

    /**
     * クラス名の追加・削除を交互に行う
     * @param  {String | Node} elms
     * @param  {String} str
     * @return {Node}
     */
    function elementsToggleClass( elms, str ) {
         var
            original = isString( elms ) ? elementsSelector( elms ) : elms,
            copy     = original,
            len      = original.length,
            names,
            i
        ;

        if( !len ) {
            copy = [original];
            len  = 1;
        }

        if ( HAS_CLASS_LIST ) {
            for ( i = len; i--; ) {
                copy[i].classList.toggle( str );
            }
        } else {
            for ( i = len; i--; ) {
                names = copy[i].className.trim();
                if ( names.indexOf( str ) === -1 ) {
                    copy[i].className = names ? names + ' ' + str : str;
                } else {
                    copy[i].className = names.replace( str, '' ).trim();
                }
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
    function elementsHasClass( elm, str ) {
        var
            el  = isString( elm ) ? elementsSelector( elm ) : elm,
            len = el.length,
            names
        ;

        if ( el.length ) { return };

        if ( HAS_CLASS_LIST ) {
            return el.classList.contains( str );
        } else {
            names = el.className.trim();
            if( names.indexOf( str ) !== -1 ) {
                return true;
            }
            return false;
        }
    }

    /**
     * addClass, removeClass, toggleClass, hasClassを一括して行う
     * @param  {Node} elms
     * @param  {String} str
     * @param  {String} type add or remove or toggle or has
     * @return {Array | Boolean}
     */
    function elementsClazz( elms, str, type) {
        switch( type ) {
            case 'add'    : return elementsAddClass( elms, str );
            case 'remove' : return elementsRemoveClass( elms, str );
            case 'toggle' : return elementsToggleClass( elms, str );
            case 'has'    : return elementsHasClass( elms, str );
            default       : return '?';
        }
    }

    /**
     * styleをセットしたりゲットしたり
     * @param  {Node | String} elms
     * @param  {Object | String} key
     * @param  {Number | String} value
     * @return {Node}
     */
    function elementsCss( elms, key, value ) {
        var
            original = isString( elms ) ? elementsSelector( elms ) : elms,
            copy     = original,
            len      = original.length,
            argLen   = arguments.length,
            currentStyle,
            k,
            i
        ;

        if ( !len ) {
            copy = [original];
            len  = 1;
        }

        if ( argLen === 3 ) {
            for ( i = len; i--; ) {
                copy[i].style[key] = value;
            }
        } else if ( argLen === 2 ) {

            switch( isType( key ) ) {
                case 'String' : 
                    currentStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle( copy[0], null ) : copy[0].currentStyle;
                    return currentStyle[key];
                case 'Object' :
                    for ( k in key ) {
                        if ( key.hasOwnProperty( k ) ) {
                            for ( i = len; i--; ) {
                                copy[i].style[k] = key[k];
                            }
                        }
                    }
                    break;
            };
        } else {
            throw new Error('invalid arguments');
        }

        return original;
    }

    /**
     * 属性をセットしたりゲットしたり
     * @param  {Node | String} elms
     * @param  {Object | String} key
     * @param  {Number | String} value
     * @return {Node}
     */
    function elementsAttr( elms, key, value ) {
         var
            original = isString( elms ) ? elementsSelector( elms ) : elms,
            copy     = original,
            len      = original.length,
            argLen   = arguments.length,
            k,
            i
        ;

        if ( !len ) {
            copy = [original];
            len  = 1;
        }

        if ( argLen === 3 ) {
            for ( i = len; i--; ) {
                copy[i].setAttribute( key, value );
            }
        } else if ( argLen === 2 ) {
            for ( i = len; i--; ) {
                switch( isType( key ) ) {
                    case 'String' :
                        if ( copy[0].hasAttributes( key ) ){
                            return copy[0].getAttribute( key );
                        }
                        break;
                    case 'Object' :
                        for ( k in key ) {
                            if ( key.hasOwnProperty( k ) ) {
                                for ( i = len; i--; ) {
                                    copy[i].setAttribute( k, key[k] );
                                }
                            }
                        }
                        break;
                };
            }
        } else {
            throw new Error('invalid arguments');
        }

        return original;
    }

    function elementsData( elms, key, value ) {
        var
            original = isString( elms ) ? elementsSelector( elms ) : elms,
            copy     = original,
            len      = original.length,
            argLen   = arguments.length,
            k,
            i
        ;
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
            if ( b.hasOwnProperty( key ) && !( key in a ) ) {
                a[ key ] = b[ key ];
            }
        }
        return a;
    }

    /**
     * オブジェクトを合成
     * 主にprototype拡張に利用
     *
     * @param  {Object} a
     * @param  {Object} b
     * @return {void}
     */
    function fill( a, b ) {
        var key = null;
        for ( key in b ) {
            if ( b.hasOwnProperty( key ) && !( key in a ) ) {
                a[ key ] = b[ key ];
            }
        }
    }

    /**
     * オブジェクトを上書きする
     * @param  {Object} a
     * @param  {Object} b
     * @return {Object}
     */
    function overwrite(a, b) {
        var key = null;
        for ( key in b ) {
            if ( b.hasOwnProperty( key ) && a.hasOwnProperty( key ) ) {
                a[ key ] = b[ key ];
            }
        }
        return a;
    }

    /**
     * 配列のようなオブジェクトを配列に変換
     * @param  {NodeList | HTML Collection} obj 
     * @return {Array}
     */
    function toArray( obj ) {
        if ( HAS_EVT_LISTENER ) {
            return Array.prototype.slice.call( obj );
        } else {
            var res = [], len = obj.length, i;
            for ( i = len; i--; ) {
                res[i] = obj[i];
            }
            return res;
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
            default            : return void 0;
        }
    }

    /**
     * getElementsByClassNameの補填
     * @param {Node} roots
     * @param {String} str 検索するクラス名
     * @return {Array}
     */
    function alternativeGetElementsByClassName( roots, str ) {
        var
            elms = roots.getElementsByTagName( '*' ),
            len  = elms.length,
            arr  = [],
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
     * DOMContentLoadedの補填
     * @param {Function} handler
     * @param {Function} func
     */
    function alternativeDOMContentLoaded( handler, func ) {
        var scrollCheck = function() {
            try {
                _doc.documentElement.doScroll( 'left' );
            } catch( e ) {
                setTimeout( scrollCheck, 1 );
                return;
            }
            handler( func );
        };
        scrollCheck();
    }

    function environmentCheck() {
        var
            ua                   = navigator.userAgent.toUpperCase(),
            //RE_RENDERRING_ENGINE = /(TRIDENT|WEBKIT|GECKO|PRESTO)\/([\d\.]+)/,
            RE_RENDERRING_ENGINE = /(TRIDENT|WEBKIT|GECKO|PRESTO)\/([\d\.]+)/,
            RE_MOBILE_DEVICE     = /(?=ANDROID).+(MOBILE)|(ANDROID|IPAD|IPHONE|IPOD|BLACKBERRY|WINDOWS PHONE|WEBOS)/,
            RE_MOBILE_OS         = /(ANDROID|[IPHONE ]?OS|BLACKBERRY\d+|WINDOWS PHONE OS|WEBOS)[\s\/]([\d\._]+)/,
            RE_DESKTOP_BROWSER   = /(CHROME|OPERA|IE|FIREFOX|VERSION)[\/\s]([\d\.]+)/,
            RE_DESKTOP_OS        = /(WINDOWS|MAC|LINUX)[\sA-Z;]+([\d\._]+)/,
            RE_GAME_DEVICE       = /(PLAYSTATION 3|PSP \(PlayStation Portable\))[;\s]+([\d\.]+)/,
            matches,
            res = {

            }
        ;
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
            t   = Object(this),
            len = t.length >>> 0,
            n   = 0
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
        if ( !isFunction( callback ) ) {
            throw new TypeError( callback + ' is not a function' );
        }

        var
            O   = Object(this),
            len = O.length >>> 0,
            i   = 0
        ;

        while( i < len ) {
            if ( i in O ) {
                callback.call( thisArg, O[i], i, O );
            }
            i++;
        }
    }

    /**
     * array.filterの補填
     * @param {Function} callback
     * @return {Array}
     */
    function ArrayFileter( callback ) {
        if ( !isFunction( callback ) ) {
            throw new TypeError();
        }

        var
            O     = Object(this),
            len   = O.length >>> 0
            res   = [],
            thisp = arguments[1],
            i
        ;

        for ( i = 0; i < len; i++) {
            if ( i in O ) {
                if ( callback.call(thisp, O[i], i, O ) ) {
                    res.push( O[i] );
                }
            }
        }

        return res;
    }

    function ArrayMap( callback, thisArg ) {
        if ( !isFunction( callback ) ) {
            throw new TypeError();
        }

        var
            O   = Object(this),
            len = O.length >>> 0,
            res = new Array( len ),
            i   = 0
        ;

        while( i < len ) {
            if ( i in O ) {
                res[i] = callback.call( thisArg, O[i], i, O );
            }
            i++;
        }

        return res;
    }

    /**
     * String.prototype.trim の補填
     */
    function StringTrim() {
        return this.replace(/^\s+|\s+$/g,'');
    }

    /**
     * -,_などで区切られた文字列をキャメルケースに変換する
     */
    function StringCamelize() {
        return this.replace(/(\-|\_)(\w)/g, function (a, b, c) {
            return c ? c.toUpperCase() : '';
        });
    }

    /**
     * キャメルケースの文字列を指定されたセパレートでつなぐ
     * @param {String} sep
     */
    function StringDeCamelize( sep ) {
        sep = sep || '-';
        return this.replace(/([a-z\d])([A-Z])/g, '$1' + (sep) + '$2').toLowerCase();
    }
    
})( this );