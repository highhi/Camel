;(function( global ){
    'use strict';

    var
        _win         = window,
        _doc         = document,
        _isDomLoaded = false
    ;

    _win.camel = marge( CamelFactory, {
        ready      : ReadyHandler,
        isString   : isString,
        isArray    : isArray,
        isNumber   : isNumber,
        isObject   : isObject,
        isFunction : isFunction,
        isType     : isType,
    });

    var
        TYPE_STRING      = '[object String]',
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
        
        DOM_CONT_LOADED  = 'DOMContentLoaded'
    ;

    var Object_toString = Object.prototype.toString;

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
        var elms = null;
        if ( isString( expr ) ) {
            elms = expr;
        }
        return new Camel( elms );
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

    Camel.elm = elementsQuery;

    fill( Camel.prototype, {
        test : function() {
            console.log(this);
        }
    });

    //
    //  Camel method
    //=================================================

    /**
     * DOMの構築完了判定（DOMContentLoaded）
     * @param {Fuction} handler 
     */
    function ReadyHandler( handler ) {
        _doc.addEventListener( DOM_CONT_LOADED, function() {
            handler( Camel );
        }, false );
    }

    function elementsQuery( expr ) {
        var str = null;

        if ( isCamel( expr ) ) {
            return expr.elm;
        } else {
            return elementsSelector( expr );
        }
    }

    function elementsSelector( expr ) {
        var initials = null;

        if ( isString( expr ) ) {
            initials = new RegExp( '^' + expr );
            switch( initials ) {
                case '#' : return _doc.querySelector( expr );
                case '.' : return _doc.querySelectorAll( expr );
                default  : return _doc.querySelectorAll( expr );
            }
        }
    }

    //
    //  helpers
    //=================================================

    /**
    * オブジェクトを合成
    * prototype以外に利用
    *  
    * @param {Function} a
    * @param {Object} b
    * @return {Object}
    */
    function marge( a, b ) {
        var key = null;
        for ( key in b ) {
            if ( b.hasOwnProperty( key ) ) {
                a[ key ] = b[ key ];
            }
        }
        return a;
    }

    /**
     * オブジェクトを合成
     * prototype拡張に利用
     *
     * @param  {Object} proto
     * @param  {Object} obj
     * @return {void}
     */
    function fill( proto, obj ) {
        var key = null;
        for ( key in obj ) {
            if ( obj.hasOwnProperty( key ) ) {
                proto[ key ] = obj[ key ];
            }
        }
    }

     //  is系関数
    function isString( obj ) {
        return Object_toString.call( obj ) === TYPE_STRING;
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
            case TYPE_STRING   : return 'String';
            case TYPEOF_NUMBER : return 'Number';
            case TYPEOF_ARRAY  : return 'Array';
            case TYPEOF_OBJECT : return 'Object';
            default            : return 'void';
        }
    }
    
})( this );