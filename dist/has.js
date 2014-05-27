///#source 1 1 C:\Users\mark\Projects\contrib-has.js\has.js
;(function(g){

    // summary: A simple feature detection function/framework.
    //
    // name: String
    //      The name of the feature to detect, as defined by the overall `has` tests.
    //      Tests can be registered via `has.add(testname, testfunction)`.
    //
    // example:
    //      mylibrary.bind = has("native-bind") ? function(fn, context){
    //          return fn.bind(context);
    //      } : function(fn, context){
    //          return function(){
    //              fn.apply(context, arguments);
    //          }
    //      }

    var NON_HOST_TYPES = { "boolean": 1, "number": 1, "string": 1, "undefined": 1 },
        VENDOR_PREFIXES = ["Webkit", "Moz", "O", "ms", "Khtml"],
        d = isHostType(g, "document") && g.document,
        el = d && isHostType(d, "createElement") && d.createElement("DiV"),
        freeExports = typeof exports == "object" && exports,
        freeModule = typeof module == "object" && module,
        testCache = {}
    ;

    function has(/* String */name){
        if(typeof testCache[name] == "function"){
            testCache[name] = testCache[name](g, d, el);
        }
        return testCache[name]; // Boolean
    }

    function add(/* String */name, /* Function */test, /* Boolean? */now){
        // summary: Register a new feature detection test for some named feature
        //
        // name: String
        //      The name of the feature to test.
        //
        // test: Function
        //      A test function to register. If a function, queued for testing until actually
        //      needed. The test function should return a boolean indicating
        //      the presence of a feature or bug.
        //
        // now: Boolean?
        //      Optional. Omit if `test` is not a function. Provides a way to immediately
        //      run the test and cache the result.
        // example:
        //      A redundant test, testFn with immediate execution:
        //  |       has.add("javascript", function(){ return true; }, true);
        //
        // example:
        //      Again with the redundantness. You can do this in your tests, but we should
        //      not be doing this in any internal has.js tests
        //  |       has.add("javascript", true);
        //
        // example:
        //      Three things are passed to the testFunction. `global`, `document`, and a generic element
        //      from which to work your test should the need arise.
        //  |       has.add("bug-byid", function(g, d, el){
        //  |           // g  == global, typically window, yadda yadda
        //  |           // d  == document object
        //  |           // el == the generic element. a `has` element.
        //  |           return false; // fake test, byid-when-form-has-name-matching-an-id is slightly longer
        //  |       });
        testCache[name] = now ? test(g, d, el) : test;
    }

    // cssprop adapted from http://gist.github.com/598008 (thanks, ^pi)
    function cssprop(name, el){
        var supported = false,
            capitalized = name.charAt(0).toUpperCase() + name.slice(1),
            length = VENDOR_PREFIXES.length,
            style = el.style;

        if(typeof style[name] == "string"){
            supported = true;
        }else{
            while(length--){
                if(typeof style[VENDOR_PREFIXES[length] + capitalized] == "string"){
                    supported = true;
                    break;
                }
            }
        }
        return supported;
    }

    function clearElement(el){
        if(el){
            while(el.lastChild){
                el.removeChild(el.lastChild);
            }
        }
        return el;
    }

    // Host objects can return type values that are different from their actual
    // data type. The objects we are concerned with usually return non-primitive
    // types of object, function, or unknown.
    function isHostType(object, property){
        var type = typeof object[property];
        return type == "object" ? !!object[property] : !NON_HOST_TYPES[type];
    }

    //>>excludeStart("production", true);
    function all(){
        // summary: For debugging or logging, can be removed in production. Run all known tests
        //  at some point in time for the current environment.
        var name, ret = {};
        for(name in testCache){
            try{
                ret[name] = has(name);
            }catch(e){
                ret[name] = "error";
                ret[name].ERROR_MSG = e.toString();
            }
        }
        return ret;
    }

    has.all = all;
    //>>excludeEnd("production");
    has.add = add;
    has.clearElement = clearElement;
    has.cssprop = cssprop;
    has.isHostType = isHostType;
    has._tests = testCache;

    has.add("dom", function(g, d, el){
        return d && el && isHostType(g, "location") && isHostType(d, "documentElement") &&
            isHostType(d, "getElementById") && isHostType(d, "getElementsByName") &&
            isHostType(d, "getElementsByTagName") && isHostType(d, "createComment") &&
            isHostType(d, "createElement") && isHostType(d, "createTextNode") &&
            isHostType(el, "appendChild") && isHostType(el, "insertBefore") &&
            isHostType(el, "removeChild") && isHostType(el, "getAttribute") &&
            isHostType(el, "setAttribute") && isHostType(el, "removeAttribute") &&
            isHostType(el, "style") && typeof el.style.cssText == "string";
    });

    // Stop repeat background-image requests and reduce memory consumption in IE6 SP1
    // http://misterpixel.blogspot.com/2006/09/forensic-analysis-of-ie6.html
    // http://blogs.msdn.com/b/cwilso/archive/2006/11/07/ie-re-downloading-background-images.aspx?PageIndex=1
    // http://support.microsoft.com/kb/823727
    try{
        document.execCommand("BackgroundImageCache", false, true);
    }catch(e){}

    // Expose has()
    // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
    if(typeof define == "function" && typeof define.amd == "object" && define.amd){
        define("has", function(){
            return has;
        });
    }
    // check for `exports` after `define` in case a build optimizer adds an `exports` object
    else if(freeExports){
        // in Node.js or RingoJS v0.8.0+
        if(freeModule && freeModule.exports == freeExports){
          (freeModule.exports = has).has = has;
        }
        // in Narwhal or RingoJS v0.7.0-
        else{
          freeExports.has = has;
        }
    }
    // in a browser or Rhino
    else{
        // use square bracket notation so Closure Compiler won't munge `has`
        // http://code.google.com/closure/compiler/docs/api-tutorial3.html#export
        g["has"] = has;
    }
})(this);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\__base.js
(function(has, addtest, cssprop){

    var STR = "string",
        FN = "function"
    ;

    // above this line is "boilerplate" template for all test groupings.
    // while each module has it's own enclosing function, these strings
    // and aliases passed through the self-executing-anon-function are
    // common across all tests. This is so we can blindly pull parts
    // of other test modules into a single rollup. Tests should be
    // "as standalone as humanly possible", with some exceptions (and
    // then, only for the benefit of performance and sharing)

    // put your tests here, eg:
    addtest("has-test-skeleton", function(global, document, anElement){
        return true; // Boolean
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\array.js
(function(has, addtest, cssprop){

    var toString = {}.toString,
        EMPTY_ARRAY = [],
        FUNCTION_CLASS = "[object Function]";

    // Array tests
    addtest("array-every", function(){
        return toString.call(EMPTY_ARRAY.every) == FUNCTION_CLASS;
    });

    addtest("array-filter", function(){
        return toString.call(EMPTY_ARRAY.filter) == FUNCTION_CLASS;
    });

    addtest("array-foreach", function(){
        return toString.call(EMPTY_ARRAY.forEach) == FUNCTION_CLASS;
    });

    addtest("array-indexof", function(){
        return toString.call(EMPTY_ARRAY.indexOf) == FUNCTION_CLASS;
    });

    addtest("array-isarray", function(){
        return toString.call(Array.isArray) == FUNCTION_CLASS &&
            Array.isArray(EMPTY_ARRAY) === true;
    });

    addtest("array-lastindexof", function(){
        return toString.call(EMPTY_ARRAY.lastIndexOf) == FUNCTION_CLASS;
    });

    addtest("array-map", function(){
        return toString.call(EMPTY_ARRAY.map) == FUNCTION_CLASS;
    });

    addtest("array-reduce", function(){
        return toString.call(EMPTY_ARRAY.reduce) == FUNCTION_CLASS;
    });

    addtest("array-reduceright", function(){
        return toString.call(EMPTY_ARRAY.reduceRight) == FUNCTION_CLASS;
    });

    addtest("array-some", function(){
        return toString.call(EMPTY_ARRAY.some) == FUNCTION_CLASS;
    });

    addtest("array-es5", function(){
        return has("array-every") && has("array-filter") && has("array-foreach") &&
            has("array-indexof") && has("array-isarray") && has("array-lastindexof") &&
            has("array-map") && has("array-reduce") && has("array-reduceright") &&
            has("array-some");
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\audio.js
(function(has, addtest, cssprop){

    var CAN_PLAY_GUESSES = { "maybe": 1, "probably": 1 },
        STR = "string",
        FN = "function"
    ;

    if(!has("dom")){ return; }

    var audio = document.createElement("audio");

    addtest("audio", function(){
        return has.isHostType(audio, "canPlayType");
    });

    // TODO: evaluate if these tests fit within the has.js scope because they don't
    // provide a definate yes or no answer
    //
    // NOTE: Opera returns a false-negative in this test if there are single spaces
    // around the codes value, e.g. codes='vorbis'
    addtest("audio-ogg", function(){
        return has("audio") && !!CAN_PLAY_GUESSES[audio.canPlayType("audio/ogg; codecs=vorbis")];
    });

    addtest("audio-mp3", function(){
        return has("audio") && !!CAN_PLAY_GUESSES[audio.canPlayType("audio/mpeg;")];
    });

    addtest("audio-wav", function(){
        return has("audio") && !!CAN_PLAY_GUESSES[audio.canPlayType("audio/wav; codecs=1")];
    });

    addtest("audio-m4a", function(){
        return has("audio") && !!(CAN_PLAY_GUESSES[audio.canPlayType("audio/x-m4a;")] ||
            CAN_PLAY_GUESSES[audio.canPlayType("audio/aac;")]);
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\bugs.js
(function(has, addtest, cssprop){

    // http://github.com/kangax/cft
    var toString = {}.toString,
        STR = "string",
        FN = "function",
        FUNCTION_CLASS = "[object Function]"
    ;

    function testForIn(value){
        var i,
            count = 0,
            klass = function(){ this.toString = 1; };

        for(i in new klass){
            count++;
        }
        return count == value;
    }

    // true for IE < 9
    addtest("bug-for-in-skips-shadowed", function(){
        return testForIn(0);
    });

    // true for Safari 2
    addtest("bug-for-in-repeats-shadowed", function(){
        return testForIn(2);
    });

    addtest("bug-string-split-regexp", function(){
        var buggy = null, s = "a_b";
        if(toString.call(s.split) == FUNCTION_CLASS){
            buggy = s.split(/(_)/).length != 3;
        }
        return buggy;
    });

    addtest("bug-function-expression", function(){
        // `x` should be resolved to `null` (the one we declared outside this function)
        // but since named function expression identifier leaks onto the enclosing scope in IE,
        // it will be resolved to a function
        var f = function x(){},
            buggy = typeof x == FN;
        if(buggy){
          x = null;
        }
        return buggy;
    });

    addtest("bug-string-replace-ignores-functions", function(){
        var buggy = null,
            s = "a";
        if(toString.call(s.replace) == FUNCTION_CLASS){
            buggy = s.replace(s, function(){ return ""; }) != "";
        }
        return buggy;
    });

    addtest("bug-arguments-instanceof-array", function(g){
        return arguments instanceof g.Array;
    });

    addtest("bug-array-concat-arguments", function(){
        return (function(){
            var buggy = null;
            if(has("bug-arguments-instanceof-array")){
                buggy = [].concat(arguments)[0] != 1;
            }
            return buggy;
        })(1,2);
    });

    // ES5 added <BOM> (\uFEFF) as a whitespace character
    var whitespace = "\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002"+
        "\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";

    addtest("bug-es5-trim", function(){
        var buggy = null;
        if(has("string-trim")){
            buggy = !!whitespace.trim();
        }
        return buggy;
    });

    addtest("bug-es5-regexp", function(){
        return !(/^\s+$/).test(whitespace);
    });

    addtest("bug-tofixed-rounding", function(){
        return (.9).toFixed() == 0;
    });

    if(!has("dom")){ return; }

    addtest("bug-offset-values-positioned-inside-static", function(g, d, el){
        var div, fake,
            buggy = null,
            de = d.documentElement,
            id = "__test_" + Number(new Date()),
            css = "margin:0;padding:0;border:0;visibility:hidden;",
            root = d.body || (function(){
                fake = true;
                return de.insertBefore(d.createElement("body"), de.firstChild);
            }());

        el.innerHTML =
            "<div style='position:absolute;top:10px;" + css + "'>"+
            "<div style='position:relative;top:10px;" + css + "'>"+
            "<div style='height:10px;font-size:1px;"  + css + "'><\/div>"+
            "<div id='" + id + "'>x<\/div>"+
            "<\/div>"+
            "<\/div>";

        root.insertBefore(el, root.firstChild);
        div = d.getElementById(id);

        if(div.firstChild){
            buggy = false;
            if(div.offsetTop != 10){
                // buggy, set position to relative and check if it fixes it
                div.style.position = "relative";
                if(div.offsetTop == 10){
                    buggy = true;
                }
            }
        }
        if(fake){
            root.parentNode.removeChild(root);
        }
        root.removeChild(el);
        has.clearElement(el);
        return buggy;
    });

    // Opera 9.x (possibly other versions as well) returns actual values (instead of "auto")
    // for statically positioned elements
    addtest("bug-computed-values-for-static", function(g, d){
        var cs,
            view,
            de = d.documentElement,
            style = d.style,
            position = null,
            buggy = position;

        if(has("dom-computed-style")){
            // if element is not statically positioned, make it as such, then restore
            view = d.defaultView;
            cs = view.getComputedStyle(de, null);
            if(cs.position != "static"){
                position = cs.position;
                style.position = "";
            }
            buggy = !!(buggy = view.getComputedStyle(de, null)) && buggy.left != "auto";
            if(position !== null){
                style.position = position;
            }
        }
        return buggy;
    });

    addtest("bug-computed-style-hidden-zero-height", function(g, d){
        var cs,
            de = d.documentElement,
            style = de.style,
            display = style.display,
            buggy = null;

        if(has("dom-computed-style")){
            style.display = "none";
            cs = d.defaultView.getComputedStyle(de, null);
            buggy = cs && cs.height == "0px";
            style.display = display;
        }
        return buggy;
    });

    addtest("bug-root-children-not-styled", function(g, d, el){
        var buggy = null,
            de = d.documentElement;

        el.style.cssText = "width:40px;height:40px;";

        try{
            de.insertBefore(el, de.firstChild);
            buggy = el.clientWidth == 0;
            de.removeChild(el);
        }catch(e){}

        el.style.cssText = "";
        return buggy;
    });

    addtest("bug-contains", function(g, d, el){
        var buggy = null,
            e2 = d.createElement("div");

        if(has.isHostType(el, "contains")){
            buggy = el.contains(e2);
        }
        return buggy;
    });

    addtest("bug-query-selector-ignores-caps", function(g, d, el){
        var e2,
            buggy = null;

        if(d.compatMode == "BackCompat" && has.isHostType(el, "querySelector")){
            e2 = d.createElement("span");
            e2.className = "Test";
            el.appendChild(e2);
            buggy = (el.querySelector(".Test") != null);
            el.removeChild(e2);
        }
        return buggy;
    });

    // true for Safari
    addtest("bug-typeof-nodelist-function", function(g, d){
        return (typeof d.documentElement.childNodes == FN);
    });

    // true for IE
    addtest("bug-getelementsbytagname-returns-comment-nodes", function(g, d, el){
        var all,
            buggy = null;

        el.appendChild(d.createElement("span")).appendChild(d.createTextNode("a"));
        el.appendChild(d.createComment("b"));
        all = el.getElementsByTagName("*");

        // IE5.5 returns a 0-length collection when calling getElementsByTagName with wildcard
        if(all.length){
            buggy = !!all[1] && all[1].nodeType != 1;
        }
        has.clearElement(el);
        return buggy;
    });

    // name attribute can not be set at run time in IE < 8
    // http://msdn.microsoft.com/en-us/library/ms536389.aspx
    addtest("bug-readonly-element-name", function(g, d, el){
        var buggy, form = el.appendChild(d.createElement("form")),
            input = form.appendChild(d.createElement("input"));

        input.name = "x";
        buggy = input !== form.elements["x"];
        has.clearElement(el);
        return buggy;
    });

    // type attribute can only be set once and cannot be changed once in DOM
    // http://msdn.microsoft.com/en-us/library/ms534700.aspx
    addtest("bug-readonly-element-type", function(g, d, el){
        var buggy = true,
            input = el.appendChild(d.createElement("input"));

        input.type = "text";
        try {
          input.type = "password";
          buggy = input.type != "password";
        } catch (e) { }
        has.clearElement(el);
        return buggy;
    });

    // true for IE
    addtest("bug-properties-are-attributes", function(g, d, el){
        el.__foo = "bar";
        var buggy = el.getAttribute("__foo") == "bar";

        if(buggy){
            el.removeAttribute("__foo");
        }else{
            delete el.__foo;
        }
        return buggy;
    });

    // true for IE
    addtest("bug-pre-ignores-newline", function(g, d){
        var buggy,
            de = d.documentElement,
            el = de.appendChild(d.createElement("pre")),
            txt = el.appendChild(d.createTextNode("xx")),
            initialHeight = el.offsetHeight;

        el.firstChild.nodeValue = "x\nx";
        // check if `offsetHeight` changed after adding "\n" to the value
        buggy = el.offsetHeight == initialHeight;
        de.removeChild(el);
        return buggy;
    });

    addtest("bug-select-innerhtml", function(g, d, el){
        var buggy = true;
        el = d.createElement("select");
        el.innerHTML = "<option value='test'>test<\/option>";
        if(has.isHostType(el, "options") && el.options[0]){
            buggy = el.options[0].nodeName.toUpperCase() != "OPTION";
        }
        return buggy;
    });

    addtest("bug-table-innerhtml", function(g, d, el){
        var buggy = true;
        el = d.createElement("table");
        try{
            if(has.isHostType(el, "tBodies")){
                el.innerHTML = "<tbody><tr><td>test<\/td><\/tr><\/tbody>";
                buggy = typeof el.tBodies[0] == "undefined";
            }
        }catch(e){}
        return buggy;
    });

    addtest("bug-script-rejects-textnode-append", function(g, d){
        var buggy = true,
            script = d.createElement("script");

        try{
            script.appendChild(d.createTextNode(""));
            buggy = !script.firstChild ||
                (script.firstChild && script.firstChild.nodeType != 3);
        }catch(e){}
        return buggy;
    });

    addtest("bug-getelementbyid-ids-names", function(g, d){
        var input,
            name = "__test_" + Number(new Date()),
            root = d.getElementsByTagName("head")[0] || d.documentElement,
            buggy = null;

        if(has("dom-create-attr")){
            input = d.createElement("<input name='"+ name +"'>");
        }else{
            input = d.createElement("input");
            input.name = name;
        }
        try{
            root.insertBefore(input, root.firstChild);
            buggy = d.getElementById(name) == input;
            root.removeChild(input);
        }catch(e){}
        return buggy;
    });

    addtest("bug-getelementbyid-ignores-case", function(g, d){
        var buggy,
            id = "__test_" + Number(new Date()),
            script = d.createElement("script"),
            root = d.getElementsByTagName("script")[0].parentNode;

        script.id = id;
        script.type = "text/javascript";
        root.insertBefore(script, root.firstChild);
        buggy = d.getElementById(id.toUpperCase()) == script;
        root.removeChild(script);
        return buggy;
    });

    addtest("bug-getelementsbyname", function(g, d, el){
        var buggy,
            script = d.createElement("script"),
            id = "__test_" + Number(new Date()),
            root = d.getElementsByTagName("script")[0].parentNode;

        script.id = id;
        script.type = "text/javascript";
        root.insertBefore(script, root.firstChild);
        buggy = d.getElementsByName(id)[0] == script;
        root.removeChild(script);
        return buggy;
    });

    addtest("bug-xpath-position", function(g, d, el){
        var buggy = null,
            xpath = ".//*[local-name()='p' or local-name()='P'][position() = 2]";

        if(has.isHostType(d, "evaluate") && has.isHostType(g, "XPathResult")){
            el.appendChild(d.createElement("p")).appendChild(d.createTextNode("a"));
            el.appendChild(d.createElement("p")).appendChild(d.createTextNode("b"));
            xpath = d.evaluate(xpath, el, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            if(xpath && has.isHostType(xpath, "snapshotItem")){
                xpath = xpath.snapshotItem(0);
                buggy = !!(xpath && xpath.firstChild) && xpath.firstChild.nodeValue != "b";
            }
            has.clearElement(el);
        }
        return buggy;
    });

    addtest("bug-overflow-style", function(g, d, el){
        el.innerHTML = "<p style='overflow: visible;'>x</p>";

        var buggy = null,
            p = el.firstChild,
            style = p && p.style;

        if(style){
            style.overflow = "hidden";
            buggy = style.overflow != "hidden";
        }
        el.innerHTML = "";
        return buggy;
    });

    // TODO: Add more QSA tests
    addtest("bug-qsa", function(g, d, el){
        var buggy = null;
        if(has.isHostType(el, "querySelectorAll")){
            el.appendChild(d.createElement("object"))
                .appendChild(d.createElement("param"));
            buggy = el.querySelectorAll("param").length != 1;
            has.clearElement(el);
        }
        return buggy;
    });

})(has, has.add, has.cssprop);


///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\css.js
(function(has, addtest, cssprop){

    if(!has("dom")){ return; }

    // FROM cft.js
    addtest("css-enabled", function(g, d, el){
        var fake,
            supported,
            de = d.documentElement,
            root = d.body || (function(){
                fake = true;
                return de.insertBefore(d.createElement("body"), de.firstChild);
            }());

        el.style.display = "none";
        root.insertBefore(el, root.firstChild);
        supported = (el.offsetWidth === 0);
        root.removeChild(el);

        if(fake){
            root.parentNode.removeChild(root);
        }
        return supported;
    });

    addtest("css-content-box", function(g, d, el){
        var fake,
            root,
            de = d.documentElement,
            supported = null;

        if(has("css-enabled")){
            root = d.body || (function(){
                fake = true;
                return de.insertBefore(d.createElement("body"), de.firstChild);
            }());

            el.style.cssText = "position: absolute; top: -4000px; width: 40px; height: 40px; border: 1px solid black;";
            root.insertBefore(el, root.firstChild);

            supported = (el.clientWidth == 40);
            root.removeChild(el);
            el.style.cssText = "";
        }
        if(fake){
            root.parentNode.removeChild(root);
        }
        return supported;
    });

    addtest("css-position-fixed", function(g, d, el){
        var backup,
            control,
            fake,
            root,
            de = d.documentElement,
            supported = null;

        if(has("css-enabled")){
            control = el.cloneNode(false);
            root = d.body || (function(){
                fake = true;
                return de.insertBefore(d.createElement("body"), de.firstChild);
            }());

            backup = root.style.cssText;
            root.style.cssText = "padding:0;margin:0";
            el.style.cssText = "position:fixed;top:42px";

            root.insertBefore(control, root.firstChild);
            root.insertBefore(el, control);
            supported = (el.offsetTop !== control.offsetTop);

            root.removeChild(el);
            root.removeChild(control);
            root.style.cssText = backup;
            el.style.cssText = "";
        }
        if(fake){
            root.parentNode.removeChild(root);
        }
        return supported;
    });

    // FROM cft.js
    addtest("css-rgba", function(g, d, el){
        var re = /^rgba/,
            supported = null;

        if(has("css-enabled")){
          try{
              el.style.color = "rgba(1,1,1,0.5)";
              supported = re.test(el.style.color);
              el.style.color = "";
          }catch(e){}
        }
        return supported;
    });

    addtest("css-border-radius", function(g, d, el){
        return cssprop("borderRadius", el);
    });

    addtest("css-box-shadow", function(g, d, el){
        return cssprop("boxShadow", el);
    });

    addtest("css-box-sizing", function(g, d, el){
        return cssprop("boxSizing", el);
    });

    addtest("css-opacity", function(g, d, el){
        return cssprop("opacity", el);
    });

    addtest("css-opacity-filter", function(g, d){
        return !has("css-opacity") && (typeof d.documentElement.filters != "undefined");
    });

    addtest("css-resize", function(g, d, el){
        return cssprop("resize", el);
    });

    addtest("css-selectable", function(g, d, el){
        return cssprop("userSelect", el);
    });

    addtest("css-style-float", function(g, d, el){
        return cssprop("styleFloat", el);
    });

    // TODO: Fix false positive in Opera
    addtest("css-pointerevents", function(g, d, el){
        return cssprop("pointerEvents", el);
    });

    addtest("css-text-overflow", function(g, d, el){
        return cssprop("textOverflow", el);
    });

    addtest("css-text-shadow", function(g, d, el){
        return cssprop("textShadow", el);
    });

    addtest("css-transform", function(g, d, el){
        return cssprop("transform", el);
    });

    // FIXME: modernizr has flexbox, backgroundsize, borderimage, cssanimations, csscolumns, cssgradients,
    // cssreflections, csstransforms, csstransforms3d, csstransitions, fontface

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\dates.js
(function(has, addtest, cssprop){

    var toString = {}.toString,
        NEW_DATE = new Date,
        FUNCTION_CLASS = "[object Function]";

    // Date tests
    addtest("date-toisostring", function(){
        return toString.call(NEW_DATE.toISOString) == FUNCTION_CLASS;
    });

    addtest("date-tojson", function(){
        return toString.call(NEW_DATE.toJSON) == FUNCTION_CLASS;
    });

    addtest("date-now", function(){
        return toString.call(Date.now) == FUNCTION_CLASS;
    });

    addtest("performance-now", function(){
        return toString.call(performance.now) == FUNCTION_CLASS ||
               toString.call(performance.webkitNow) == FUNCTION_CLASS;
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\dom.js
(function(has, addtest, cssprop){

    if(!has("dom")){ return; }

    addtest("dom-quirks", function(g, d, el){
        var supported;
        if(typeof d.compatMode == "string"){
            supported = (d.compatMode == "BackCompat");
        }else{
            el.style.width = "1";
            supported = (e.style.width == "1px");
            el.style.cssText = "";
        }
        return supported;
    });

    addtest("dom-dataset", function(g, d, el){
        el.setAttribute("data-a-b", "c");
        return has.isHostType(el, "dataset") && el.dataset.aB == "c";
    });

    // works in all but IE < 9
    addtest("dom-addeventlistener", function(g, d){
        return has.isHostType(d, "addEventListener");
    });

    // works in all but IE
    addtest("dom-createelementns", function(g, d){
        return has.isHostType(d, "createElementNS");
    });

    // should fail in webkit, as they dont support it.
    addtest("dom-attrmodified", function(g, d, el){
        var supported = false,
            listener = function(){ supported = true; };

        if(has("dom-addeventlistener")){
            supported = false;
            el.addEventListener("DOMAttrModified", listener, false);
            el.setAttribute("___TEST___", true);
            el.removeAttribute("___TEST___", true);
            el.removeEventListener("DOMAttrModified", listener, false);
        }
        return supported;
    });

    addtest("dom-subtreemodified", function(g, d, el){
        var supported = false,
            listener = function(){ supported = true; };

        if(has("dom-addeventlistener")){
            supported = false;
            el.appendChild(d.createElement("div"));
            el.addEventListener("DOMSubtreeModified", listener, false);
            has.clearElement(el);
            el.removeEventListener("DOMSubtreeModified", listener, false);
        }
        return supported;
    });

    // FROM cft.js
    addtest("dom-children", function(g, d, el){
        var supported = false;
        if(has.isHostType(el, "children")){
            var div = el.appendChild(d.createElement("div")),
                children = el.children;

            // Safari 2.x returns ALL children including text nodes
            el.appendChild(d.createTextNode("x"));
            div.appendChild(div.cloneNode(false));
            supported = !!children && children.length == 1 && children[0] == div;
            has.clearElement(el);
        }
        return supported;
    });

    // true for html, xhtml and unknown elements are case
    // sensitive to how they are written in the markup
    addtest("dom-tagname-uppercase", function(g, d, el){
        return el.nodeName == "DIV";
    });

    addtest("dom-html5-elements", function(g, d, el){
        el.innerHTML = "<nav>a</nav>";
        return el.childNodes.length == 1;
    });

    // true for IE < 9
    // http://msdn.microsoft.com/en-us/library/ms536389(VS.85).aspx vs
    // http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-2141741547
    addtest("dom-create-attr", function(g, d){
        var input,
            supported = false;
        try{
            input = d.createElement("<input type='hidden' name='hasjs'>");
            supported = input.type == "hidden" && input.name == "hasjs";
        }catch(e){}
        return supported;
    });

    // TODO: this test is really testing if expando's become attributes (IE)
    // true for IE
    addtest("dom-selectable", function(g, d, el){
        var supported = false;
        try{
            el.unselectable = "on";
            supported = typeof el.attributes.unselectable != "undefined" &&
                el.attributes.unselectable.value == "on";
            el.unselectable = "off";
        }catch(e){}
        return supported;
    });

    // true for all modern browsers, including IE 9+
    addtest("dom-computed-style", function(g, d){
        return has.isHostType(d, "defaultView") && has.isHostType(d.defaultView, "getComputedStyle");
    });

    // true for IE
    addtest("dom-current-style", function(g, d){
        return !has("dom-computed-style") && has.isHostType(d.documentElement, "currentStyle");
    });

    // true for IE
    addtest("dom-element-do-scroll", function(g, d){
        return has.isHostType(d.documentElement, "doScroll");
    });

    // test for dynamic-updating base tag support (allows us to avoid href & src attr rewriting)
    // false for Firefox < 4 and IE < 8
    addtest("dom-dynamic-base", function (g, d, el){
        var attempt,
            backup,
            base,
            attempts = [[d.createElement("a"), "href"], [d.createElement("q"), "cite"]],
            head = d.getElementsByTagName("head")[0],
            href = location.href,
            fake = false,
            supported = null,
            token = location.search || location.hash;

        if(head){
            base = d.getElementsByTagName("base")[0] || (function(){
                fake = true;
                return head.insertBefore(d.createElement("base"), head.firstChild);
            })();

            backup = base.href || href.slice(0, token ? href.indexOf(token) : href.length).replace(/[^\/]*$/, "");
            base.href = location.protocol + "//x";

            // check support on more than one element to be thorough
            while(attempt = attempts.pop()){
                if(supported != false){
                    attempt[0][attempt[1]] = "y";
                    supported = attempt[0][attempt[1]].indexOf("x/y") > -1;
                }
            }
            // reset href before removal, otherwise href persists in Opera
            base.href = backup;
            if(fake){
                head.removeChild(base);
            }
        }
        return supported;
    });

    addtest("dom-nodelist-sliceable", function(g, d, el){
        var supported = false,
            de = d.documentElement,
            id = de.id;

        // Opera 9.25 bug
        de.id = "length";
        // older Safari will return an empty array
        try{
            supported = !![].slice.call(d.childNodes, 0)[0];
        }catch(e){}

        de.id = id;
        return supported;
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\events.js
(function(has, addtest, cssprop){

    function event_tests(g, d, test){
        var de = d.documentElement,
            input = d.createElement("input"),
            result = {
                metakey: null,
                preventdefault: null,
                stoppropagation: null,
                srcelement: null,
                relatedtarget: null
            };

        if(has.isHostType(input, "click")){
            input.type = "checkbox";
            input.style.display = "none";
            input.onclick = function(e){
                e || (e = g.event);
                result.metakey = ("metaKey" in e);
                result.stoppropagation = ("stopPropagation" in e);
                result.preventdefault = ("preventDefault" in e);
                result.srcelement = ("srcElement" in e);
                result.relatedtarget = ("relatedTarget" in e);
            };
            try{
                de.insertBefore(input, de.firstChild);
                input.click();
                de.removeChild(input);
            }catch(e){}
            input.onclick = null;
        }

        addtest("event-metakey", result.metakey);
        addtest("event-preventdefault", result.preventdefault);
        addtest("event-stoppropagation", result.stoppropagation);
        addtest("event-srcelement", result.srcelement);
        addtest("event-relatedtarget", result.relatedtarget);
        return result[test];
    }

    if(!has("dom")){ return; }

    addtest("event-contextmenu", function(g, d, el){
        var supported = null;
        if(has.isHostType(el, "setAttribute")){
            el.setAttribute("oncontextmenu", "");
            supported = (typeof el.oncontextmenu != "undefined");
        }
        return supported;
    });

    addtest("event-metakey", function(g, d){
        return event_tests(g, d, "metakey");
    });

    addtest("event-preventdefault", function(g, d){
        return event_tests(g, d, "preventdefault");
    });

    addtest("event-stoppropagation", function(g, d){
        return event_tests(g, d, "stoppropagation");
    });

    addtest("event-srcelement", function(g, d){
        return event_tests(g, d, "srcelement");
    });

    addtest("event-relatedtarget", function(g, d){
        return event_tests(g, d, "relatedtarget");
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\features.js
(function(has, addtest, cssprop, undefined){

    var STR = "string",
        FN = "function"
    ;

    // FIXME: isn't really native
    // miller device gives "[object Console]" in Opera & WebKit. Object in FF, though. ^pi
    addtest("native-console", function(g){
        return ("console" in g);
    });

    addtest("native-xhr", function(g){
        return has.isHostType(g, "XMLHttpRequest");
    });

    addtest("native-cors-xhr", function(g){
        return has("native-xhr") && ("withCredentials" in new XMLHttpRequest);
    });

    addtest("native-xhr-uploadevents", function(g){
        return has("native-xhr") && ("upload" in new XMLHttpRequest);
    });

    addtest("activex", function(g){
        return has.isHostType(g, "ActiveXObject");
    });

    addtest("activex-enabled", function(g){
        var supported = null;
        if(has("activex")){
            try{
                supported = !!new ActiveXObject("htmlfile");
            }catch(e){
                supported = false;
            }
        }
        return supported;
    });

    addtest("native-navigator", function(g){
        return ("navigator" in g);
    });

    /**
     * Geolocation tests for the new Geolocation API specification:
     * This test is a standards compliant-only test; for more complete
     * testing, including a Google Gears fallback, please see:
     *   http://code.google.com/p/geo-location-javascript/
     * or view a fallback solution using google's geo API:
     *   http://gist.github.com/366184
     */
    addtest("native-geolocation", function(g){
        return has("native-navigator") && ("geolocation" in g.navigator);
    });

    addtest("native-crosswindowmessaging", function(g){
        return ("postMessage" in g);
    });

    addtest("native-orientation",function(g){
        return ("ondeviceorientation" in g);
    });

    /**
     * not sure if there is any point in testing for worker support
     * as an adequate fallback is impossible/pointless
     *
     * ^rw
     */
    addtest("native-worker", function(g){
        return ("Worker" in g);
    });

    addtest("native-sharedworker", function(g){
        return ("SharedWorker" in g);
    });

    addtest("native-eventsource", function(g){
        return ("EventSource" in g);
    });

    // non-browser specific
    addtest("eval-global-scope", function(g){
        var fnId = "__eval" + Number(new Date()),
            supported = false;

        // catch indirect eval call errors (i.e. in such clients as Blackberry 9530)
        try{
            g.eval("var " + fnId + "=true");
        }catch(e){}

        supported = (g[fnId] === true);
        if(supported){
            try{
                delete g[fnId];
            }catch(e){
                g[fnId] = undefined;
            }
        }
        return supported;
    });

    // in chrome incognito mode, openDatabase is truthy, but using it
    //   will throw an exception: http://crbug.com/42380
    // we create a dummy database. there is no way to delete it afterwards. sorry.
    addtest("native-sql-db", function(g){
        var dbname = "hasjstestdb",
            supported = ("openDatabase" in g);

        if(supported){
            try{
                supported = !!openDatabase( dbname, "1.0", dbname, 2e4);
            }catch(e){
                supported = false;
            }
        }
        return supported;
    });

    // FIXME: hosttype
    // FIXME: moz and webkit now ship this prefixed. check all possible prefixes. ^pi
    addtest("native-indexeddb", function(g){
        return ("indexedDB" in g);
    });


    addtest("native-localstorage", function(g){
        //  Thanks Modernizr!
        var supported = false;
        try{
            supported = ("localStorage" in g) && ("setItem" in localStorage);
        }catch(e){}
        return supported;
    });

    addtest("native-sessionstorage", function(g){
        //  Thanks Modernizr!
        var supported = false;
        try{
            supported = ("sessionStorage" in g) && ("setItem" in sessionStorage);
        }catch(e){}
        return supported;
    });

    addtest("native-history-state", function(g){
        return ("history" in g) && ("pushState" in history);
    });

    addtest("native-websockets", function(g){
        return ("WebSocket" in g);
    });

    addtest("native-details", function(g, d){
        return (function(){
            var el = d.createElement("details"),
                de = d.documentElement,
                fake,
                root = d.body || (function(){
                    fake = true;
                    return de.insertBefore(d.createElement("body"), de.firstElementChild || de.firstChild);
                }()),
                diff;
            el.innerHTML = "<summary>a</summary>b";
            el.style.display = "block";
            root.appendChild(el);
            diff = el.offsetHeight;
            el.open = true;
            diff = diff != el.offsetHeight;
            root.removeChild(el);
            if(fake){
                root.parentNode.removeChild(root);
            }
            return diff;
        }());
    });

    // Currently SpeechRecognition only available with webkit prefix
    addtest("speech-recognition", function(g){
        return ("webkitSpeechRecognition" in g);
    });

    // Check for filesystem
    addtest("native-filesystem", function(g){
        return ("requestFileSystem" in g
                || "webkitRequestFileSystem" in g
                || "mozRequestFileSystem" in g);
    });

    // Check for blob save
    addtest("native-blobsave", function(g){
        return has("native-navigator")
            && ("msSaveOrOpenBlob" in g.navigator);
    });

    // Check for external host
    addtest("native-externalhost", function(g){
        return ("externalHost" in g);
    });

    // Check for anchor download
    addtest("native-anchordownload", function(g, d){
        return has("dom-createelementns")
            && ("download" in d.createElementNS("http://www.w3.org/1999/xhtml", "a"));
    });

})(has, has.add, has.cssprop);


///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\form.js
(function(has, addtest, cssprop){

    var STR = "string",
        FN = "function"
    ;

    function typeValidates( type ){
        input.setAttribute("type", type);
        input.value = "\x01";
        return has("input-checkvalidity") && input.type == type &&
               (/search|tel/.test(type) || input.value != "\x01" || !input.checkValidity());
    }

    if(!has("dom")){ return; }

    var input = document.createElement("input");

    addtest("input-checkvalidity", function(){
        return has.isHostType(input, "checkValidity");
    });

    addtest("input-attr-autocomplete", function(){
        return ("autocomplete" in input);
    });

    addtest("input-attr-autofocus", function(){
        return ("autofocus" in input);
    });

    addtest("input-attr-list", function(){
        return ("list" in input);
    });

    addtest("input-attr-placeholder", function(){
        return ("placeholder" in input);
    });

    addtest("input-attr-max", function(){
        return ("max" in input);
    });

    addtest("input-attr-maxlength", function(){
        return ("maxLength" in input);
    });

    addtest("input-attr-min", function(){
        return ("min" in input);
    });

    addtest("input-attr-multiple", function(){
        return ("multiple" in input);
    });

    addtest("input-attr-pattern", function(){
        return ("pattern" in input);
    });

    addtest("input-attr-readonly", function(){
        return ("readOnly" in input);
    });

    addtest("input-attr-required", function(){
        return ("required" in input);
    });

    addtest("input-attr-size", function(){
        return ("size" in input);
    });

    addtest("input-attr-step", function(){
        return ("step" in input);
    });

    addtest("input-attr-selectedoption", function(){
        return ("selectedOption" in input);
    });

    addtest("input-attr-indeterminate ", function(){
        return ("indeterminate" in input);
    });

    addtest("input-attr-willvalidate", function(){
        return ("willValidate" in input);
    });

    addtest("input-attr-valueasnumber", function(){
        return ("valueAsNumber" in input);
    });

    addtest("input-attr-valueasdate", function(){
        return ("valueAsDate" in input);
    });

    addtest("input-attr-validity", function(){
        return has.isHostType(input, "validity");
    });

    addtest("input-attr-validationmessage", function(){
        return ("validationMessage" in input);
    });

    addtest("input-attr-willvalidate", function(){
        return ("willValidate" in input);
    });

    addtest("input-type-color", function(){
        return typeValidates("color");
    });

    addtest("input-type-search", function(){
        return typeValidates("search");
    });

    addtest("input-type-tel", function(){
        return typeValidates("tel");
    });

    addtest("input-type-url", function(){
        return typeValidates("url");
    });

    addtest("input-type-email", function(){
        return typeValidates("email");
    });

    addtest("input-type-datetime", function(){
        return typeValidates("datetime");
    });

    addtest("input-type-date", function(){
        return typeValidates("date");
    });

    addtest("input-type-month", function(){
        return typeValidates("month");
    });

    addtest("input-type-week", function(){
        return typeValidates("week");
    });

    addtest("input-type-time", function(){
        return typeValidates("time");
    });

    addtest("input-type-datetime-local", function(){
        return typeValidates("datetime-local");
    });

    addtest("input-type-number", function(){
        return typeValidates("number");
    });

    addtest("input-type-range", function(g, d){
        return typeValidates("range");
    });

    addtest("input-speech", function(g, d){
        return ("speech" in input || "onwebkitspeechchange" in input);
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\function.js
 (function(has, addtest, cssprop, undefined){

    var toString = {}.toString,
        FUNCTION_CLASS = "[object Function]";

    // Function tests
    addtest("function-bind", function(){
        return toString.call(Function.bind) == FUNCTION_CLASS;
    });

    addtest("function-caller", function(){
        function test(){ return test.caller !== undefined; }
        return test();
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\graphics.js
(function(has, addtest, cssprop){

    var toString = {}.toString,
        STR = "string",
        FN = "function"
    ;

    if(!has("dom")){ return; }

    addtest("canvas", function(g){
        return has.isHostType(g, "CanvasRenderingContext2D");
    });

    addtest("canvas-webgl", function(g){
        return has.isHostType(g, "WebGLRenderingContext");
    });

    addtest("canvas-text", function(g, d){
        return has("canvas") && typeof d.createElement("canvas").getContext("2d").fillText == FN;
    });


    var svgNS = "http://www.w3.org/2000/svg";

    addtest("svg", function(g){
        return ("SVGAngle" in g);
    });

    addtest("svg-inlinesvg", function(g, d, el){
        var supported = null;
        el.innerHTML = "<svg/>";
        supported = (el.firstChild && el.firstChild.namespaceURI) == svgNS;
        el.innerHTML = "";
        return supported;
    });

    addtest("svg-smil", function(g, d){
        return has("dom-createelementns") && /SVG/.test(toString.call(d.createElementNS(svgNS, "animate")));
    });

    addtest("svg-clippaths", function(g, d){
        return has("dom-createelementns") && /SVG/.test(toString.call(d.createElementNS(svgNS, "clipPath")));
    });

    addtest("vml", function(g, d, el){
        /*
          Sources:
          http://en.wikipedia.org/wiki/Vector_Markup_Language
          http://msdn.microsoft.com/en-us/library/bb263897(v=VS.85).aspx
          http://www.svg-vml.net/Zibool-compar.htm
        */
        el.innerHTML = "<v:shape adj=\"1\"/>";
        var supported = ("adj" in el.firstChild);
        el.innerHTML = "";
        return supported;
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\json.js
(function(has, addtest, cssprop, undef){
    var FN = "function";

    // Determines whether the (possibly native) `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    addtest("json-parse", function(){
        var supported = false, value;
        if(typeof JSON == "object" && JSON){
            if(typeof JSON.parse == FN){
                try{
                    // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                    // Conforming implementations should also coerce the initial argument to
                    // a string prior to parsing.
                    if(JSON.parse("0") === 0 && !JSON.parse(false)){
                        // Simple parsing test.
                        value = JSON.parse("{\"A\":[1,true,false,null,\"\\u0000\\b\\n\\f\\r\\t\"]}");
                        if((supported = value.A.length == 5 && value.A[0] == 1)){
                            try{
                                // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                                supported = !JSON.parse('"\t"');
                            }catch(e){}
                            if(supported){
                                try{
                                    // FF 4.0 and 4.0.1 allow leading `+` signs, and leading and
                                    // trailing decimal points. FF 4.0, 4.0.1, and IE 9-10 also
                                    // allow certain octal literals.
                                    supported = JSON.parse("01") != 1;
                                }catch(e){}
                            }
                        }
                    }
                }catch(e){
                    supported = false;
                }
            }
        }
        return supported;
    });

    addtest("json-stringify", function(){
        var supported = false, value;
        if(typeof JSON == "object" && JSON){
            if(typeof JSON.stringify == FN){
                // A test function object with a custom `toJSON` method.
                (value = function(){
                    return 1;
                }).toJSON = value;
                try{
                    supported =
                        // Firefox 3.1b1 and b2 serialize string, number, and boolean
                        // primitives as object literals.
                        JSON.stringify(0) === "0" &&
                        // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                        // literals.
                        JSON.stringify(new Number()) === "0" &&
                        JSON.stringify(new String()) == '""' &&
                        // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                        // does not define a canonical JSON representation (this applies to
                        // objects with `toJSON` properties as well, *unless* they are nested
                        // within an object or array).
                        JSON.stringify(isNaN) === undef &&
                        // IE 8 serializes `undefined` as `"undefined"`. Safari 5.1.7 and FF
                        // 3.1b3 pass this test.
                        JSON.stringify(undef) === undef &&
                        // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                        // respectively, if the value is omitted entirely.
                        JSON.stringify() === undef &&
                        // FF 3.1b1, 2 throw an error if the given value is not a number,
                        // string, array, object, Boolean, or `null` literal. This applies to
                        // objects with custom `toJSON` methods as well, unless they are nested
                        // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                        // methods entirely.
                        JSON.stringify(value) === "1" &&
                        JSON.stringify([value]) == "[1]" &&
                        // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                        // `"[null]"`.
                        JSON.stringify([undef]) == "[null]" &&
                        // YUI 3.0.0b1 fails to serialize `null` literals.
                        JSON.stringify(null) == "null" &&
                        // FF 3.1b1, 2 halts serialization if an array contains a function:
                        // `[1, true, isNaN, 1]` serializes as "[1,true,],". These versions
                        // of Firefox also allow trailing commas in JSON objects and arrays.
                        // FF 3.1b3 elides non-JSON values from objects and arrays, unless they
                        // define custom `toJSON` methods.
                        JSON.stringify([undef, isNaN, null]) == "[null,null,null]" &&
                        // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                        // where character escape codes are expected (e.g., `\b` => `\u0008`).
                        JSON.stringify({ "A": [value, true, false, null, "\0\b\n\f\r\t"] }) == '{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}' &&
                        // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                        JSON.stringify(null, value) === "1" &&
                        JSON.stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                        // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                        // serialize extended years.
                        JSON.stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                        // The milliseconds are optional in ES 5, but required in 5.1.
                        JSON.stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                        // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                        // four-digit years instead of six-digit years. Credits: @Yaffle.
                        JSON.stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                        // Safari <= 5.1.7 and Opera >= 10.53 incorrectly serialize millisecond
                        // values less than 1000. Credits: @Yaffle.
                        JSON.stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                }catch(e){
                    supported = false;
                }
            }
        }
        return supported;
    });

    addtest("json", function(){
        return has("json-stringify") && has("json-parse");
    });
})(has, has.add, has.cssprop);
///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\object.js
(function(has, addtest, cssprop){

    // FIXME: break this out into "modules", like array.js, dom.js, lang.js (?) ^ph

    // we could define a couple "constants" for reuse ...
    // just need to ensure they are the same across detect/*.js
    // so we can wrap in a single (fn(){})() at 'build' ^ph
    var toString = {}.toString,
        FN = "function",
        FUNCTION_CLASS = "[object Function]",
        OBJECT = Object
    ;

    // true for Gecko, Webkit, Opera 10.5+
    addtest("object-__proto__", function(){
        var supported = false,
            arr = [],
            obj = { },
            backup = arr.__proto__;

        if(arr.__proto__ == Array.prototype &&
                obj.__proto__ == Object.prototype){
            // test if it's writable and restorable
            arr.__proto__ = obj;
            supported = typeof arr.push == "undefined";
            arr.__proto__ = backup;
        }
        return supported && typeof arr.push == FN;
    });

    addtest("object-create", function(){
        return toString.call(OBJECT.create) == FUNCTION_CLASS;
    });

    addtest("object-getprototypeof", function(){
        return toString.call(OBJECT.getPrototypeOf) == FUNCTION_CLASS;
    });

    addtest("object-seal", function(){
        return toString.call(OBJECT.seal) == FUNCTION_CLASS;
    });

    addtest("object-freeze", function(){
        return toString.call(OBJECT.freeze) == FUNCTION_CLASS;
    });

    addtest("object-issealed", function(){
        return toString.call(OBJECT.isSealed) == FUNCTION_CLASS;
    });

    addtest("object-isfrozen", function(){
        return toString.call(OBJECT.isFrozen) == FUNCTION_CLASS;
    });

    addtest("object-keys", function(){
        return toString.call(OBJECT.keys) == FUNCTION_CLASS;
    });

    addtest("object-preventextensions", function(){
        return toString.call(OBJECT.preventExtensions) == FUNCTION_CLASS;
    });

    addtest("object-isextensible", function(){
        return toString.call(OBJECT.isExtensible) == FUNCTION_CLASS;
    });

    addtest("object-defineproperty", function(){
        return toString.call(OBJECT.defineProperty) == FUNCTION_CLASS;
    });

    addtest("object-defineproperties", function(){
        return toString.call(OBJECT.defineProperties) == FUNCTION_CLASS;
    });

    addtest("object-getownpropertydescriptor", function(){
        return toString.call(OBJECT.getOwnPropertyDescriptor) == FUNCTION_CLASS;
    });

    addtest("object-getownpropertynames", function(){
        return toString.call(OBJECT.getOwnPropertyNames) == FUNCTION_CLASS;
    });

    addtest("object-es5", function(){
        return has("object-create") && has("object-defineproperties") && has("object-defineproperty") &&
               has("object-freeze") && has("object-getownpropertydescriptor") && has("object-getownpropertynames") &&
               has("object-getprototypeof") && has("object-isextensible") && has("object-isfrozen") &&
               has("object-issealed") && has("object-keys") && has("object-preventextensions") && has("object-seal");
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\script.js
(function(has, addtest, cssprop){

    if(!has("dom")){ return; }

    var script = document.createElement("script");

    addtest("script-defer", function(){
        return ("defer" in script);
    });

    addtest("script-async", function(){
        return ("async" in script);
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\strings.js
(function(has, addtest, cssprop){

    // String tests
    addtest("string-trim", function(){
        return {}.toString.call(''.trim) == "[object Function]";
    });

})(has, has.add, has.cssprop);

///#source 1 1 C:\Users\mark\Projects\contrib-has.js\detect\video.js
(function(has, addtest, cssprop){

    if(!has("dom")){ return; }

    var video = document.createElement("video");

    addtest("video", function(){
        return has.isHostType(video, "canPlayType");
    });

    // note: in FF 3.5.1 and 3.5.0 only, "no" was a return value instead of empty string.

    addtest("video-h264-baseline", function(){
        // workaround required for ie9, who doesn't report video support without audio codec specified.
        //   bug 599718 @ msft connect
        var h264 = 'video/mp4; codecs="avc1.42E01E';
        return has("video") && (video.canPlayType(h264 + '"') || video.canPlayType(h264 + ', mp4a.40.2"'));
    });

    addtest("video-ogg-theora", function(){
        return has("video") && video.canPlayType('video/ogg; codecs="theora, vorbis"');
    });

    addtest("video-webm", function(){
        return has("video") && video.canPlayType('video/webm; codecs="vp8, vorbis"');
    });

})(has, has.add, has.cssprop);

