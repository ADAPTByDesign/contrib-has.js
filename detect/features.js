(function(has){

    // FIXME: break this out into "modules", like array.js, dom.js, lang.js (?) ^ph

    var addtest = has.add;

    // Array tests
    addtest("native-forEach", function(){
        return "forEach" in [];
    });

    addtest("native-isArray", function(){
        return "isArray" in Array;
    });

    addtest("native-map", function(){
        return "map" in [];
    });
    
    addtest("es5-array", function(){
        var ar = [];
        return has("native-isArray") && ("indexOf" in ar) && ("lastIndexOf" in ar) &&
            ("every" in ar) && ("some" in ar) && has("native-forEach") &&
            has("native-map") && ("filter" in ar) && ("reduce" in ar) && ("reduceRight" in ar);
    });

    // Function tests
    addtest("native-bind", function(){
        return "bind" in Function.prototype;
    });

    addtest('function-caller', (function(undefined) { 
        function test() { return test.caller !== undefined; }
        return test();
    })());

    // Object tests
    addtest("object-create", function(){
        return "create" in Object;
    });
    
    addtest("object-getPrototypeOf", function(){
        return "getPrototypeOf" in Object;
    });
    
    addtest("object-seal", function(g){
        var o = Object;
        return ("seal" in o) && ("freeze" in o) && ("isSealed" in o) && ("isFrozen" in o);
    });
    
    addtest("object-keys", function(){
        return "keys" in Object;
    });
    
    addtest("object-extensible", function(){
        return ("preventExtensions" in Object) && ("isExtensible" in Object);
    });
    
    addtest("object-properties", function(){
        var o = Object;
        return ("defineProperty" in o) && ("defineProperties" in o) &&
            ("getOwnPropertyDescriptor" in o) && ("getOwnPropertyNames" in o);
    });
    
    addtest("es5-object", function(){
        return has("object-create") && has("object-getPrototypeOf") && has("object-seal") &&
            has("object-keys") && has("object-extensible") && has("object-properties");
    });

    // String tests
    addtest("string-trim", function(){
        return "trim" in String.prototype;
    });

    // Date tests
    addtest("date-toISOString", function(){
        return "toISOString" in Date.prototype;
    });

    addtest("date-toJSON", function(){
        return "toJSON" in Date.prototype;
    });

    addtest("date-now", function(){
        return "now" in Date;
    });

    // JSON tests
    addtest("json-parse", function(global){
        return !!("JSON" in global && typeof JSON.parse == "function" && JSON.parse('{"a":true}').a);
    });
    
    addtest("json-stringify", function(global){
        return !!("JSON" in global && typeof JSON.stringify == "function" && JSON.stringify({a:true}) == '{"a":true}');
    });

    // FIXME: isn't really native
    addtest("native-console", function(global){
        return !!("console" in global);
    });

    if(!has('is-browser')){ return; }

    // begin browser tests
    addtest("native-dataset", function(g, d, e){
        e.setAttribute("data-a-b", "c");
        return !!(e.dataset && e.dataset.aB === "c");
    });

    // FIXME: need to decide how to handle 'branching' like this ^ph
    addtest("native-xhr", function(){
        var xhrTests = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
            http, ret;
        try{
            http = new XMLHttpRequest();
            if(http){
                ret = new Boolean(true); 
                ret.ACTIVEX = false; 
            }
        }catch(e){
            for(var i = 0, xhr; xhr = xhrTests[i]; i++){
                try{
                    http = new ActiveXObject(xhr);
                }catch(e){}
                if(http){
                    // FIXME: should this be true and sniff ACTIVEX
                    ret = new Boolean(false);
                    ret.ACTIVEX = xhr;
                    break;
                }
            }
        }
        delete xhrTests;
        return ret;
    });

    var elem = document.createElement( "canvas" ); // FIXME: needs to be self-containedish ^ph
    addtest("canvas", function() { 
        return !!(elem.getContext && elem.getContext('2d'));
    });
    addtest("canvastext", function() {
        return !!(has("canvas") && typeof elem.getContext('2d').fillText == 'function');
    });
    
    /**
     * geolocation tests for the new Geolocation API specification.
     *   This test is a standards compliant-only test; for more complete
     *   testing, including a Google Gears fallback, please see:
     *   http://code.google.com/p/geo-location-javascript/
     * or view a fallback solution using google's geo API:
     *   http://gist.github.com/366184
     */

    addtest("geolocation", function() {
        return !!navigator.geolocation;
    });

    addtest("crosswindowmessaging", function(global) {
        return !!global.postMessage;
    });
        
    addtest('orientation',function(global){
        return 'ondeviceorientation' in global;
    });
    
    addtest('positionfixed', function(g, d) {
        var test = d.createElement('div'),
            control = test.cloneNode(false),
            fake = false,
            root = d.body || (function() {
                fake = true;
                return d.documentElement.appendChild(d.createElement('body'));
            }());

        var oldCssText = root.style.cssText;
        root.style.cssText = 'padding:0;margin:0';
        test.style.cssText = 'position:fixed;top:42px';
        root.appendChild(test);
        root.appendChild(control);

        var ret = test.offsetTop !== control.offsetTop;

        root.removeChild(test);
        root.removeChild(control);
        root.style.cssText = oldCssText;

        if(fake){
            d.documentElement.removeChild(root);
        }

        return ret;
    });
    
    // should fail in webkit, as they dont support it.
    addtest('mutation-attrmodified', function(g, document){
        var bool = false;
        var listener = function(){ bool = true; };
        document.documentElement.addEventListener("DOMAttrModified", listener, false);
        document.documentElement.setAttribute("___TEST___", true);
        document.documentElement.removeAttribute("___TEST___", true);
        document.documentElement.removeEventListener("DOMAttrModified", listener, false);
        return bool;
    });

    // works in chrome/ff. not in opera.
    addtest('mutation-domsubtreemodified', function(){

        var bool = false;
        var listener = function(){ console.log(arguments); bool = true; };

        var elem = document.createElement("div");
        //document.documentElement.appendChild(elem)
        elem.innerHTML = "<elem></elem>";

        elem.addEventListener("DOMSubtreeModified", listener, false);
        elem.innerHTML = "<foo></foo>";
        elem.removeEventListener("DOMSubtreeModified", listener, false);
        return bool;

    });

    addtest("css-border-radius", function(g, d, e){
        var s;
        if(e && (s = e.style)){
            return (typeof s.borderRadius == "string" ||
                typeof s.WebkitBorderRadius == "string" ||
                typeof s.MozBorderRadius == "string" ||
                typeof s.KhtmlBorderRadius == "string");
        }
        return false;
    });

    addtest("css-box-shadow", function(g, d, e){
        var s;
        if(e && (s = e.style)){
            return (typeof s.boxShadow == "string" ||
                typeof s.WebkitBoxShadow == "string" ||
                typeof s.MozBoxShadow == "string" ||
                typeof s.OBoxShadow == "string" ||
                typeof s.MsBoxShadow == "string");
        }
        return false;
    });

    addtest("css-opacity", function(g, d, e){
        var s;
        if(e && (s = e.style)){
            return (typeof s.opacity == "string");
        }
        return false;
    });

    addtest("css-resize", function(g, d, e){
        var s;
        if(e && (s = e.style)){
            return (typeof s.resize == "string");
        }
        return false;
    });

    addtest("css-text-overflow", function(g, d, e){
        var s;
        if(e && (s = e.style)){
            return (typeof s.textOverflow == "string" ||
                typeof s.OTextOverflow == "string");
        }
        return false;
    });

    addtest("css-text-shadow", function(g, d, e){
        var s;
        if(e && (s = e.style)){
            return (typeof s.textShadow == "string");
        }
        return false;
    });

    addtest("css-transform", function(g, d, e){
        var s;
        if(e && (s = e.style)){
            return (typeof s.WebkitTransform == "string" ||
                typeof s.MozTransform == "string");
        }
        return false;
    });

})(has);
