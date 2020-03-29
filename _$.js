(function (window, undefined) {
    var rootjQuery,
        readyList,
        core_strundefined = typeof undefined,
        location = window.location,
        document = window.document,
        docElem = document.documentElement,

        _jQuery = window.jQuery,
        _$ = window.$,

        class2type = {},
        core_deletedIds = [],
        core_version = "2.0.3",
        core_concat = core_deletedIds.concat,
        core_push = core_deletedIds.push,
        core_slice = core_deletedIds.slice,
        core_indexof = core_deletedIds.indexOf,
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        core_trim = core_version.trim,

        jQuery = function () {
            return new jQuery.fn.init(selector, context, rootjQuery);
        },

        core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

        core_rnotwhite = /\S+/g,

        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,

        fcamelCase = function (all, letter) {
            return letter.toUpperCase();
        },

        completed = function () {
            document.removeEventListener("DOMContentLoaded", completed, false);
            document.removeEventListener("load", completed, false);
            jQuery.ready()
        };

    jQuery.fn = jQuery.prototype = {
        jQuery: core_version,
        //设定jQuery的版本号
        constructor: jQuery,
        //将函数指针指向jQuery，这里注意一个点，在我们通过new方法由构建函数创建对象时，我们会对象内部会自动将constructor
        //指针指向构造函数
        /*
        function A(){}
        var a=new A();
        a;// A __proto__:constructor:f A()
        */
        /*
        我们平时使用面想对象的两种写法：
        1. function A(){}
            A.prototype.init=function (){};
        2. function A(){}
            A.prototype={
                init:function(){}
            }
        这两种写法都是可以的，但是会有一个区别，1方法的构造函数new的对象的constructor的指向还是A，但是2方法时我们将A的
        prototype赋值为一个对    象，那么此时A.prototype的constructor指向已经被我们手动的改变，变为指向改对象，由于该
        对象是默认对象，所以直接指向了Object，如果我们之后我们再通过constructor查找会找到Object，所以我们需要手动
        的将constructor再指向jQuery,避免后续代码出现错误
        */
        init: function (selector, context, rootjQuery) {
            //init jq的选择器的初步过滤和$的返回对象的构造函数，主要目的是在接收用户传入的值之后将其转化为{0:div,1:div,length:2...}这样的形式存储
            //$() //jQuery.fn.init {}
            //所以必须要先了解一个概念，我们在这里使用的this是什么，就是new jQuery.fn.init()获得的对象
            /*
                function $() {
                    return new $.prototype.init();
                }
                $.prototype={
                    init:function () {
                        console.log(this);
                        this.length=1;
                        return this;
                    }
                }
                $(); //init {}
            */

            //selector 当前选择的对象
            //context 执行环境上下文
            //rootjQuery $(document)

            var match, elem;


            if (!selector) {
                //如果用户没有传入对象，或者传入对象格式为$(null),$(undefined),$(false)格式，直接返回$
                return this;
            }

            if (typeof selector == "string") {
                //如果用户传入的对象是字符串格式
                //$("ele"),$("#id"),$(".class"),$("<li></li>")
                if (selector.charAt(0) == "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    //匹配$(<li>xx</li>)的情况
                    math = [null, selector, null];
                } else {
                    //匹配$("#id),$("<li>hi")的情况
                    match = rquickExpr.exec(selector)
                    //exec方法时js的原生方法，得到的是正则中匹配的数组集合,简单理解的话可以理解为匹配的结果会是一个数组
                    //，正则中每个括号匹配到的结果会填充到数组中
                    //rquickExpr正则匹配的是$("#id),$("<li>hi")的情况，其它类型的得到match=null的结果
                    //$(#id)返回match=['#id',null,'id]   $(<li>hi)会得到match=[<li>hi,<li>,null]的结果
                }

                if (match && (match[1] || !context)) {
                    //继续上一步的排除机制,能进入该流程控制的只有$(<li>xx</li>),$("<li>hi"),$("#id")的情况
                    if (match[1]) {
                        //匹配$(<li>hi),$("<li>xxx</li>")
                        context = context instanceof jQuery ? context[0] : context;
                        //jq支持的写法,例如$(<li></li>),$(<li></li>,document),$(<li></li>,$(document)
                        //判断如果用户传入了context参数，context instanceof jQuery 为true说明用户传入的是
                        //$(document),那么context[0]转换为原生document，否则context为用户传入的document

                        jQuery.merge(this, jQuery.parseHTML(
                            math[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            //如果content并且具有节点类型（必须是元素节点），那么使用当前用户自定义的执行上下文环境，否
                            //则的话默认使用document
                            //注意createElement方法是挂载在document下的，其他节点是无法创建节点的
                            //ownerDocument写法是针对iframe标签的写法，也就是说如果存在iframe标签，我们可以使用
                            //iframe中的document做为执行环境
                            true
                        ))

                        //jQuery.parseHTML 该方法主要用于将字符转换为数组节点
                        /*
                          var str='<li>1</li><li>2</li>';
                          $.parseHTML(str);  //[li,li]

                          var match="<li>hi";
                          $.parseHTML(match);  //[li]

                          var march="<li class="a">hi"
                          $.parseHTML(match);  //[li.a]
                        */
                        //该方法接收3个参数，1字符串格式参数，2执行的上下文环境（），3bool值，默认为false，表示不允许
                        //用户在$()方法中自己创建script标签，即使用户创建了也不会被添加到DOM结构中，为true表示允许用户
                        //创建script标签，我们写str='<script>alert(1)<\/script>',那么该标签会被创建，而且alert会
                        //执行（\表示转义，否则</script>会直接和当前所在的<script>标签匹配，然后报错）;
                        //jQuery.merge() 该方法用于合并数组（对象字面量）,正常情况下我们使用该方法可以合并两个数组为一
                        //个数组，还有一种用法是吗，如果第一个参数是一个对象字面量，那么合并后的格式为一个对象字面量
                        /*
                        var arr = ["a", "b"],
                            obj = {
                                0: 'c',
                                1: "d",
                                length: 2
                            };
                        $.merge(obj,arr) //{0: "c", 1: "d", 2: "a", 3: "b", length: 4}
                        */
                        //该方法主要是jq内部的使用方法，用来将通过parseHTML得到的数组转换为一个对象字面量的格式

                        if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                            //该方法主要用于针对 $("<li>", {title: 'li'})的情况
                            //jQuery.isPlainObject()方法用于判断参数是否是一个纯粹的对象，也就是说是由"{}"或"new
                            //Object"创建的
                            for (match in context) {
                                if (jQuery.isFunction(this[match])) {
                                    this[match](context[match])
                                } else {
                                    this.attr(match, context[match])
                                }
                                //判断{}中传入的参数key值是不是方法，比如html，
                                //$.isFunction($("li")["html"]) //true
                                // 如果有那么调用jQuery上的该方法为目标对象赋其value值，
                                // 如果该方法不是jQuery上的方法，那么默认通过attr方法将其以key:value的形式设置为目
                                //标对象的属性值
                            }
                        }

                        return this;
                    } 
                    else {
                        //匹配$(#id)情况
                        elem = document.getElementById(match[2]);

                        if (elem && elem.parentNode) {
                            //兼容黑莓的写法,在黑莓4.6系统下，及时钙元素不存在也能找到该元素，所以判断一下该元素存不存
                            //在父节点，如果该元素父节点不存在，那么该元素也不存在
                            this.length = 1;
                            this[0] = elem;
                        }
                        this.context = document;
                        this.selector = selector;
                        return this;
                    }

                } else if (!context || context.jQuery) {
                    //匹配$(expr),$(expr,$(xx))的格式,context.jQuery存在说明是jq对象
                    return (context || rootjQuery).find(selector);
                    //如果用户！context 那么设定$(document)为执行上下文环境
                    //如果用户传入的是$(xx)对象为执行环境上下文，那么使用该上下文
                    //以上做法确保用户使用的是jq对象，保证能调用find()方法
                } else {
                    //匹配$(expr,document)的情况
                    return this.constructor(context).find(selector);
                    //js constructor() 返回的是一个引用到创建实例的函数
                    //jq constructor(context) 返回jQuery.fn.init(),context在对象字面量0位置
                    /*
                    $().constructor("button")
                    jQuery.fn.init [button#more, prevObject: jQuery.fn.init(1), context: document, selector: "button"]
                    */
                }

                //以上综合匹配$(".class"),$("ele")是否存在用户定义的执行上下文的情况，最后都是交给find方法处理
            } else if (selector.nodeType) {
                //匹配$(document)情况
                this.context = this[0] = selector;
                //执行环境为传入对象本身
                this.length = 1;
                return this;
            } else if (jQuery.isFunction(selector)) {
                //匹配$(function)格式
                return rootjQuery.ready(selector);
                //调用jq的ready方法
                //so 我们可以看出$(function(){}) 等同于$(document).ready(function(){})
            }
            if (selector.selector !== undefined) {
                //匹配$($(selector))格式
                this.selector = selector.selector;
                this.context = this.context;
            }

            return jQuery.makeArray(selector, this);
            //匹配$([])的情况
        },

        selector: '',
        length: 0,
        toArray: function () {
            //传为数组
            //core_slice 等同于 [].slice 等同于Array.prototype.slice
            return core_slice.call(this);
        },
        get: function (num) {
            //get 方法
            //$(xx).get() //获取$(xx)集合下所有元素，并以数组形式返回
            //$(xx).get(-1) //获取$(xx)集合的倒数后一位
            //$(xx).get(1) //获取$(xx)集合的第一位元素
            return num = null ?
                this.toArray() :
                (num < 0 ? this[this.length + num] : this[num]);
        },
        pushStack: function (elems) {
            //*重要方法，该方法属于jq的本身的调用入栈操作，关于栈会在文章末尾讲
            //可以简单理解为该方法主要的目的是在将前一个$()对象进行存储，让我们可以回溯到上一个对象，对其进行操作
            //使用方法
            /*
              $("div").pushStack($("h3")).css("color","red");
            */
            var ret = jQuery.merge(this.constructor(), elems); //jQuery.fn.init {0:elems,length:1}

            ret.prevObject = this;
            ret.context = this.context;

            return ret;
        },
        each: function (callback, args) {
            //$().each() 内部调用$.each()工具方法
            return jQuery.each(this, callback, args);
        },
        ready: function (fn) {
            //ready DOM结构加载完就触发，调用自身的promise延迟回调函数
            jQuery.ready.promise().done(fn);
        },
        slice: function () {
            //slice 可以对$(xx)对象进行裁切
            /*
            $(xx).slice(0,2)
            */
            return this.pushStack(cose_slice.apply(this, arguments));
            //方法内部调用自身的pushStack方法，将调用者转化为数组格式，将用户传入参数做为apply参数传入
            //调用slice方法对其进行裁切，完成后通过pushStack方法将数组转换为jQuery对象返回
            /*
                var obj={
                    0:'div',
                    1:'div',
                    2:'div',
                    length:3
                }
                console.log([].slice.apply(obj,[0,2])); //["div", "div"]
                这里需要注意的是apply，call方法会自执行，bind不会自执行
            */
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1)
        },
        eq: function (i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(i >= 0 && j < len ? [this[j]] : []);
        },
        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem)
            }))
        },
        end: function () {
            return this.prevObject || this.constructor(null);
            //this.constructor(null) //jQuery.fn.init{}
        },
        push: core_push,
        sort: [].sort,
        splice: [].splice
    }

    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.extend = jQuery.fn.extend = function () {
        //jQuery中用于继承的方法
        /*
            //1. 为jQuery添加方法
            //1.1 添加工具方法
            $.extend({
                a: function () {
                    alert("hi")
                }
            })
            $.a();
            //1.2 添加实例方法
            $.fn.extend({
                a: function () {
                    console.log("hi");
                }
            })
            $().a();
            //2 多个参数时表示将后面的对象属性、方法追加到第一个对象上，类似于es6中的object.assign方法，可以理解为混合
            var A = {
                    name: 'tom'
                },
                B = {
                    age: 18,
                },
                C = {
                    sayHi: function () {
                        console.log("hi")
                    }
                };
            $.extend(A, B, C);
            console.log(A); //{name: "tom", age: 18, sayHi: ƒ}
            A.sayHi();
            //3 实现深拷贝，默认是浅拷贝
            var a = {},
                b = {
                    tom: {
                        age: 18
                    }
                };
            //3.1 浅拷贝 使用的一个内存地址引用
        //    $.extend(a,b)
        //    console.log(a); //{tom:{age: 18}}
        //    a.tom.age=36;
            console.log(b.tom.age); //36
            //3.2 深拷贝 开辟一个新的内存地址
            $.extend(true,a,b);
            a.tom.age=36;
            console.log(b.tom.age); //18
        */
        var options,//后续对象
            name, src, copy, copyIsArray, clone,
            target = arguments[0] || {}, //目标元素
            i = 1,
            //默认我们是将第后续参数扩展到第一个参数上，所以默认情况减少一个循环次数，所以i要+1
            length = arguments.length,
            deep = false;//默认浅拷贝

        if (typeof target === 'boolean') { //判断用户是否指定了拷贝方法 true/false
            deep = target;
            target = arguments[1] || {};
            i = 2;
            //如果deep是bool值,说明用户指定了拷贝方法
            //那么将deep赋值为用户指定的bool值,将目标元素变为用户传入的第二个参数,不存在或者不正确的情况下默认定义一个空
            //对象作为target
            //for循环遍历用户传入参数时，由于第一个是bool值，所以排除一个参数，减少一个循环，i+1
        }

        if (typeof target != "object" && jQuery.isFunction(target)) {
            target = [];
        }

        if (length === i) {
            target = this;
            --i;
            //如果用户只传入一个参数,默认认为是用户为jQuery添加方法，那么将target设置为this，也就是$.extend()的调用者$
            //需要循环的参数是全部的参数，所以--i
        }

        for (; i < length; i++) {

            if ((options = arguments[i]) != null) {
                //options={name:'tom'}，如果用户传入的第一个参数不是null，那么用options接收该值
                for (name in options) {
                    src = target[name];
                    //当前目标对象上是否存在与后续对象相同key值得属性/方法
                    copy = options[name];
                    //去重判断，防止循环引用，例如var a={},$.extend(a,{name:a})的情况
                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) { //深拷贝
                        if (copyIsArray) {//数组
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {//对象
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                            //如果目标对象上存在与后续对象相同的属性,将clone赋值为目标对象的属性
                            //没有的话则将clone设置为一个空对象，在递归时将后
                        }
                        //在是深拷贝的情况下，我们对对象进行递归调用extend方法，将当前对象与后续对象相同的属性值作为目标
                        //传入extend中
                        //将原本目标对象上与后续对象具有将同属性的对象作为当前对象传入extend中
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if (copy !== undefined) { //浅拷贝、后续对象上的属性不是object、[]
                        //为目标对象添加后续对象的key值的属性/方法
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }

    jQuery.extend({
        expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),
        //该方法用来生成以个唯一不重复的变量，主要用于处理映射，在后续会用到
        // /\D/g  用来匹配非数字，并替换为""
        noConflict: function (deep) {
            //该方法主要用来防止冲突，在我们导入外部库应经使用了$,或者我们自己定义了一个$变量
            //使用该方法可以用一个新的变量名代替$
            /*
            var Aoei=$.noConflict();
            var $="a";
            Aoei(function(){
                console.log(Aoei);
            })
            */
            if (window.$ === jQuery) {
                window.$ = _$;
            }
            if (deep && window.jQuery === jQuery) {
                window.jQuery = _jQuery;
            }
            return jQuery;
            //说到底这句话才是最核心的，因为我们将jQuery对象做了返回，被外面定义的变量接收了，所以变量才能使用jQuery的方法
        },
        isReady: false,
        readyWait: 1,
        holdReady: function (hold) {
            //该方法用于延迟DOM加载
            //传入参数为false表示放开DOM加载控制，传入参数为true表示阻止DOM加载
            /*
            $.holdReady(true);
            $(function(){
                alert("加载完毕") //不会执行
            })
            该方法主要用于例如我们在使用$.getScript()方法，该方法是异步的，那么有可能出现一个问题，在我们引入的js文件没有
            执行完毕时，$(function(){ })内的代码已经开始执行，而内部的某些方法需要依赖外部引入的js文件，所以为了保证能正
            常使用，可以使用如下写法：
            $.holdReady(true);
            $.getScript('/a.js',function(){
                $.holdReady(false);
            })
            $.holdReady(true);
            $.getScript('/b.js',function(){
                $.holdReady(false);
            })
            $(function(){
                ...
            })
            */
            if (hold) {
                jQuery.readyWait++;
                //如果传入true，让readyWait++;
            } else {
                jQuery.ready(true)
                //如果传入的是false，那么调用jQuery.ready，并传入参数true
            }
        },
        ready: function (wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
                //如果传入的参数是true，那么判断-1后的jQuery.readyWait是否为0，不为0则直接return
                //如果readyWait为0，那么判断条件不成立，跳过该流程控制
                //如果wait值为false，则判断isReady是否为false，不是的话直接return
            }
            jQuery.isReady = true;

            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }
            readyList.resolveWith(document, [jQuery]);
            //改变执行状态，异步回调状态为已完成，传入参数表示执行环境为document，执行时默认参数为jQuery
            /*
            $(function(arg){
                console.log(arg) //ƒ ( selector, context )
            })
            */
            if (jQuery.fn.trigger) {
                jQuery(document).trigger('ready').off("ready")
            }
            //在jQuery中存在三种DOM结构加载完成后触发callback的写法
            //1. $(function(){ })
            //2. $(document).ready(function(){ })
            //3. $(document).on('ready',function(){ })
            //这个if就是用来确保用户在使用第三种方法的时候方法可以正常执行
        },
        isFunction: function (obj) {
            return jQuery.type(obj) === 'function';
        },
        isArray: Array.isArray,
        //es5中的isArray方法
        isWindow: function (obj) {
            return obj != null && obj === obj.window;
            //首先判断传入的对象是不是null，额外注意一点，undefined==null 返回的是true
            //第二步是用来判断传入的对象是不是window，obj.window相当于window.window，而只有在window下才会存在
            //window属性，其他元素会返回false
            //window在js中的作用
            //1.全局父元素   我们在写var a;时相当于在window下挂载了一个a属性
            //2.窗口，如window.open()，所以widow.window相当于在window下打开一个新的窗口
        },
        isNumeric: function (obj) {
            return isNaN(parseInt(obj) && isFinite(obj));
            //这里涉及到一个问题，为什么不直接使用typeof来判断，因为typeof NaN会返回Number
            //parseFloat(NaN)返回NaN isNaN(NaN)返回true
            //isFinite(obj) 用来判断是不是一个有限的数字
            //Number.MAX_VALUE，是计算机能够计算的最大的数值
            //isFinite(Number,MAX_VALUE+1) 返回false
        },
        type: function (obj) {
            //用来判断数据类型,相比于原生的typeof更加强大，能够区分Date、Array、Object
            /*
            console.log($.type("123")); //string
            console.log($.type(new Date())); //date
            console.log($.type([]))//array
            console.log($.type({})) //object
            console.log($.type($("#type"))); //object
            */
            if (obj === null) {
                return String(obj);
                //如果用户传入null/undefined,那么直接返回字符串格式的null/undefined
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[core_toString.call(obj)] || 'object' :
                typeof obj;
            //在safari5.1和chrome老旧版本下，正则的typeof会返回function，所以这里我们做一下兼容处理
            //在该方法中主要使用了原生的Object.prototype.toString.call(obj)的方法，该方法可以准确的判别变量的类型
            //但是以上的写法会有一个弊端，使用typeof判断window、$()对象、document.querySelector、window.location等
            //对象都会返回object，所以我们的第一个表达式会将这些对象都判定为object从而返回给我们object字符结果
            /*
            console.log(typeof document.querySelector("#type")); //object
            console.log($.type($("#type"))); //object
            */
        },
        isPlainObject: function (obj) {
            //该方法用来判断是不是一个对象字面量
            /*
            $.isPlainObject({}) //true
            $.isPlainObject(window) //false
            $.isPlainObject($("#type“)) //false
            */
            if (jQuery.type(obj) != 'object' || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }
            //这一段代码主要用来排除type方法本身存在的缺陷，如DOM节点、window会被判定为object，所以我们要判断obj本身不存
            // 在node节点、并且不是window对象

            try {
                if (obj.constructor && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            //这段代码主要是用来判断上面没有筛选到的情况，如window.location
            //这里使用到了两个方法，分别是core_hasOwn，也就是hasOwnProperty以及isPrototypeOf
            //hasOwnPrototype是用来判断某个属性是对象本身的还是通过原型链由父级继承得来的
            /*
            function Obj(name) {
               this.name=name;
            }
            Obj.prototype.say="hello"

            let obj=new Obj("xm");
            console.log(obj.hasOwnProperty('name')); //true
            console.log(obj.hasOwnProperty('say')) //false
            */
            //isPrototypeOf方法用来检测某个对象是否存在于另一个对象的原型链中，该方法是Object对象上独有的方法，其它对象
            //的该方法都是由Object对象上继承过来的
            /*
            console.log(Array.prototype.hasOwnProperty("isPrototypeOf")); //false
            console.log(Object.prototype.hasOwnProperty("isPrototypeOf")); //true
            */
            //那么这这个if判断的条件就是，我们传入的obj对象上存在constructor属性,该值的原型上没有isPrototypeOf方法，也
            //就是说该值不是Object的情况下判定值为true，return false;
            //使用try{}catch{}的主要原因是因为在Firefox小雨20的版本下，频繁的调用window.constructor会导致递归泄露的问
            //题，这个也是一个兼容处理
            return true;
        },
        isEmptyObject: function (obj) {
            //该方法用来判断obj是否为一个空对象、空数组、未挂载属性/方法的构造函数
            /*
            function fn() {
            }
            fn.prototype.say=function () {
                console.log(this.constructor.name)
            }
            console.log($.isEmptyObject(fn.prototype)); //false
            console.log($.isEmptyObject({})); //true
            */
            var name;
            for (name in obj) {
                return false;
            }
            return true;
            //这个方法利用了for...in...的一个特点，会将不是对象上自带的属性枚举出来，但是不会枚举对象本身的属性，例如函数
            //本身就具有constructor属性，但是constructor属性是本身自带的，所以如果我们遍历fn.prototype不会将
            //constructor属性枚举出来。但是我们后面添加的say方法会被枚举
            //这里说明一点。prototype是一个对象的形式
        },
        error: function (msg) {
            throw new Error(mag);
            //这个没啥好说的，同样是建议我们在使用框架时，某些方法最好是使用原生的方法，这样可以大大加快我们代码运行速度
        },
        parseHTML: function (data, context, keepScript) {
            //该方法用于将字符串转换为节点，我们之前的大量方法都是使用到了这个方法，也是一个比较重要的方法，该方法可以传入
            //3个参数，data是我要转换的字符，第二个参数是节点所在的上下文，第三个参数是一个boolean值，表示我们是否要对
            //script标签进行转义处理
            /*
               console.log($.parseHTML('<li></li><script><\/script>',document,true)); //(2) [li, script]
            */
            if (!data || typeof data !== 'string') { //判断data类型是不是一个字符串或null
                return null;
            }
            if (typeof context === "boolean") {
                keepScript = context;
                context = false;
            }
            //这个流程控制呢是用来判断用户是否传入了第二个参数，也就是执行上下文，如果我们获取到的第二个参数是一个bool值，那
            //么说明用户没有传入context值，那么我们直接将说明用户想要的keepScript值就是当前的第二个位置的值，也就是我们的
            //当前的context值，所以keepScript值等于context值，并将context设置为false
            context = context || document;
            //这里呢就是如果用户传入了执行上下文，我们就使用用户的执行上下文，如果用户没有传入，那么在上一个流程控制中我们将
            //context设置为了false，就相当于context=false||document，最后context就会等于document，相当于我们设置了
            //context的默认值为document，实际上我们的执行上下文也只能是document这里的判断也就是为了区分是否是本页面的
            //document
            var parsed = rsingleTag.exec(data),
                scripts = !keepScript && [];
            //rsingleTag是我们之前定义的正则表达式，用来判断是不是一个单标签
            /*
               var rsingleTag= /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
               console.log(rsingleTag.exec("<li></li>"));//(2) ["<li></li>", "li", index: 0, input: "<li></li>", groups: undefined]
                console.log(rsingleTag.exec("<li><li></li></li>")); //null
            */
            //script的取值呢，如果用户传入的是false，那么!keepScript为true，scripts等于[]，如果用户传入的是true，那额
            //script=false
            if (parsed) {
                return [context.createElement(parsed[1])];
            }
            parsed = jQuery.buildFragment([data], context, scripts);
            //这里我们判断是不是一个单标签，如果是单标签那么我们直接使用document.crateElement方法创建单标签对象
            //如果是一个多标签对象，我们使用buildFragment方法创建多个标签
            //buildFragment方法会返回一个 #document-fragment对象
            /*
            console.log($.buildFragment(["<li><li></li></li>"],document,[]));//#document-fragment
                                                                                    <li></li>
                                                                                    <li></li>
            */
            //这里涉及到一个document.createDocumentFragment（创建文档碎片节点）
            if (scripts) {
                jQuery(scripts).remove();
            }
            //如果用户传入了false，那么该判断会执行，删除掉jQuery对象上的scripts，相对的如果用户传入了true那么我们保留
            //jQuery(script)
            return jQuery.merge([], parsed.childNodes);
            //返回一个通过merge方法转的对象
        },
        parseJSON: JSON.parse,
        //这个没什么好说的，就是调用了原生方法的JSON方法
        parseXML: function (data) {
            //该方法用来解析XML格式的数据
            //ActiveXObject
        },
        noop: function () {
        },
        //该方法就是回调一个空函数，可能在我们自己封装组件/插件的时候用到，实际上基本没什么用
        globalEval: function (code) {
            //该方法用来将讲一个变量在函数内设置为全局变量
            /*
                function test() {
                    $.globalEval("var a=2");
                }
                test();
                console.log(a); // 2
            */
            var script,
                indirect = eval;

            code = jQuery.trim(code);
            if (code) {
                if (code.indexOf("use strict") === 1) {
                    //判断当前解析的字符串是否包含严格模式的字符"use strict",如果包含严格模式，那么不能使用eval方法，需
                    //要我们手段添加到全局的script标签中，在创建完成后script标签已经没用了，我们可以将其删除
                    script = document.createElement("script");
                    script.text = code;
                    document.head.appendChild(script).parentNode.removeChild(script)
                } else {
                    indirect(code)
                }
                //这个方法其实最终的实现原理就是将我们设置的变量直接设置到全局中，所以在函数这个块级作用域中设置的变量也可以
                //在外部获取到，总体代码是比较简单的，但是比较有意思的点是为什么jQuery要在这里将eval设置成一个局部的变量而
                //不是直接调用eval方法，我们看下面的代码
                /*
                    function test() {
                        eval("var a=1");
                    }
                    test()
                    // console.log(a) //a is not defined

                    function test_2() {
                        window.eval("var b=2")
                    }
                    test_2();
                    console.log(b); //2
                */
                //这里我们可以看出如果在块级作用域中我们使用eval方法，eval执行后，解析的代码仍然是在块级作用域内起作用，但
                //是如果通过window.eval执行的话，解析的代码就会挂载到全局作用域下，同样的var indirect=eval;
                //然后indirect(code)，就相当于window.eval(code)
            }
        },
        camelCase(string) {
            //该方法用来将变量/方法转化为驼峰的形式
            /*
            console.log($.camelCase("background-color")); //backgroundColor
            */
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
            //replace(rmsPrefix,"ms-")这个主要是为了兼容ie做的处理，正常情况下如-ms-transition的格式会被转化为
            //MsTransition，但是在ie浏览器下这种格式会报错，ie只能识别msTransition，所以我们在转化前先把-ms-的字符替换
            //为ms-，rmsPrefix就是一个专门用来匹配-ms-字符的正则

            //该方法主要是通过字符串的replace方法来实现，rdashAlpha是在之前定义的正则，用来匹配我们字符串中的 - 和 -
            //之后的下一字符，然后通过我们之前定义的fcamelCase方法将其替换为该字符的大写，值得注意的是在replace中我们不仅
            //可以使用字符，也可以使用函数这一点
            /*
            var rdashAlpha = /-([\da-z])/gi, //这个正则用来获取字符 - 和 - 之后的第一个字符,([\da-z])是子表达式
            fcamelCase = function (all, letter,position,self) {
                console.log(all);
                console.log(letter);
                console.log(position);
                console.log(self);
                return letter.toUpperCase();
            };
            //replace参数如果是一个函数，那么该函数的参数会有不等个，第一个参数是匹配到的结果，第二参数是正则的第一个子表达
            式，以此类推，最后一个参数是字符本身，倒数第二个参数表示匹配到的字符的位置
            var str="background-color";
            str.replace(rdashAlpha,fcamelCase)
            */
        },
        nodeName: function (elem, name) {
            //该方法用来判断一个字符是否是一个节点的节点名称
            /*
              console.log($.nodeName(document.documentElement, "html")); //true
            */
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
            //实现方法很简单，说一下这里之所以使用toLowerCase方法主要是有部分浏览器返回的nodeName是大写格式，所以在这里统
            //一转换为小写进行比较
        },
        each: function (obj, callback, args) {
            //这里传入的是三个参数，我们平时使用的是两个参数，传入第三个参数是为方法内部提供使用
            //这个方法是比较常见的，但是在面试的时候会发现有人说没有用过，也是挺震惊的
            /*
            var arr=[1,2,3];
            $.each(arr,function (i,v) {
                if(i>1){
                    return false;
                }
                console.log(i); //0,1
                console.log(v); //1,2
            })
            var obj={
                name:"tom",
                age:18
            }
            $.each(obj,function (key,v) {
                if(key=="age"){
                    return false;
                }
                console.log(key); //name
                console.log(v) //tom
            })
            */
            //该方法用于遍历数组/对象，callback中传入的参数分别是数组/对象的key和value，在判断中传入return
            //false时会终止遍历，遍历过程中this指向的是当前遍历到的obj[key]对象，如果我们需要对数组进行遍历，推荐使用原生
            //的forEach
            var value,
                i = 0,
                length = obj.length,
                isArray = isArraylike(obj);
            //isArraylike是用来判断当前对象是数组、伪数组/对象、jQuery对象的一个jQuery方法
            //当然我们知道数组是有length属性的，但是对象是没有的，我们如果写简单的方法也可以使用length来对两者进行区分
            if (arg) { //如果是内部使用
                if (isArraylike) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);
                        if (value === false) break;
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);

                        if (value === false) break;
                    }
                }
            } else {//如果是用户使用
                if (isArray) {
                    //判断是不是数组
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value == false) break;
                    }
                    //如果是数组，那么使用for循环来遍历数组，使用call将当前的this指向当前的obj[i]对象，并将i、obj[i]作
                    //为参数传入，判断当前对象的值是否为false，如果是，那么跳出本次循环
                    //call、apply有一个特性就是会自执行，所有不需要再if中再次写表达式
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value === false) break;
                    }
                }
            }
            return obj;
        },
        trim: function (text) {
            //该方法用于去掉字符的前后空格
            return text == null ? "" : core_trim.call(text);
            //这个没什么好说的，core_trim就是调用了原生的方法中trim方法，如果我们需要用到，直接使用原生的速度会更快
        },
        makeArray: function (arr, results) {
            //前面我们很多次的用到了该方法，该方法对外的话一般是用来将一个伪数组转化为一个数组，对内如果我们添加了带有
            //length属性的对象格式的第二个参数，则可以将一个字符串转化为jQuery对象格式
            /*
                console.log($.makeArray(document.getElementsByTagName('div'))); //[div]
                console.log($.makeArray("str",{length:0})) //{0: "str", length: 1}
            */
            var ret = results || [];
            //判断用户是否传入第二个参数，默认为一个空数组
            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    //如果用户传入参数，并且具有长度
                    //这里我们主要是要看一下Object()，这个方法会将接收的参数转换为对应的格式的对象格式
                    /*
                        console.log(Object(123));  //Number {123}
                        console.log(Object("123")) //String {"123"}
                    */
                    //但是需要注意的是字符串方法通过Object方法转换后会具有长度，而数字则不会,isArraylike方法在判断没有
                    //长度的对象实惠返回false
                    jQuery.merge(ret,
                        typeof arr === 'string' ?
                            [arr] : arr
                    );
                    //如果arr对象判断为true，那么通过调用merge方法将ret合并为jQuery对象/数组
                } else {
                    //否则的话调用Array.prototype.push方法进行合并
                    core_push.call(ret, arr);
                }
            }
            return ret;
        },
        inArray: function (elem, arr, i) {
            //该方法相当于数组的indexOf方法，用来判断一个元素是否在指定的数组中，如果存在那么返回该元素在数组中的位置,否则
            //的话返回-1，第三个参数表示我们查询位置的起始位置
            /*
                var arr=[1,2,3];
                console.log($.inArray(1,arr)) //0
                console.log($.inArray(4, arr)); //-1
            */
            return arr == null ? -1 : core_indexof.call(arr, elem, i);
            //上面这段代码其实就是利用了call方法和indexOf方法，首先判断用户是否传入了数组，没有的话直接返回-1，如果用户传
            //入了，那么我们直接使用indexOf方法判断
            //在es6中有一个新的api，includes，该方法可以检测一个元素是否在指定的数组中，返回一个boolean值
            /*
            var arr=[1,2,3];
            console.log(arr.includes(1)); //true
            console.log(arr.includes(4)); //false
            MDN关于该方法的介绍 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
            */
        },
        merge: function (first, second) {
            //该方法我们之前已经经常用到了
            //jQuery.merge() 该方法用于合并数组（对象字面量）,正常情况下我们使用该方法可以合并两个数组为一个数组，还有一
            //种用法是吗，如果第一个参数是一个对象字面量，那么合并后的格式为一个对象字面量
            /*
            var arr = ["a", "b"],
                obj = {
                    0: 'c',
                    1: "d",
                    length: 2
                };
            $.merge(obj,arr) //{0: "c", 1: "d", 2: "a", 3: "b", length: 4}

            console.log($.merge([1, 2], [3, 4])); //[1, 2, 3, 4]
            console.log($.merge({0: 1, 1: 2,length:2}, [3, 4])) //{0: 1, 1: 2, 2: 3, 3: 4, length: 4}
            console.log($.merge({0: 1, 1: 2}, [3, 4]));//{0: 1, 1: 2, NaN: 4, length: NaN}
            */
            //该方法主要是jq内部的使用方法，用来将通过parseHTML得到的数组转换为一个对象字面量的格式
            //但是要记得第二个参数可以传入的是一个{}，但是必须是有格式要求的对象{0:'tom',1:18}这样的格式

            var l = second.length,
                i = first.length,
                j = 0;
            //该方法首先判断传入的第一个参数为数组/对象
            //记住一个点，数组是有长度的，对象是没有的
            if (typeof l === "number") {
                //如果第一个参数有长度，那么说明是数组，对数组进行合并
                for (; j < l; j++) {
                    first[i++] = second[j]
                }
                //循环遍历第一个数组，i++代表在执行完毕之后增加1，也就是说第一次遍历first[first.length]=second[0]，然
                //后依次类推，不得不说jQuery中的很多写法真的很巧妙
                //第二个参数必须是严格的{0:1,1:2}这样的格式才能被正确处理
            } else {
                //如果传入的第一个参数是一个对象，并且该对象是{0:1,1:2}格式的情况下，同样采用合并的方法合并为一个对象
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                    //这里是一个比较有思想的while循环，赞叹一个
                }
            }
            first.length = i;
            //手动的设置对象中的length属性，注意，这里的i由于在之前的循环中已经进行了自增，所以此时的i就是合并后对象的
            //length的长度
            return first;
        },
        grep: function (elems, callback, inv) {
            //该方法用于过滤得到新数组
            /*
            该方法接收3个参数，第一个参数为要进行过滤的数组，第二个参数是一个回调函数，第三个参数是一个boolean值，注意两点
            首先呢这个方法是一个过滤方法，所以在回调函数中我们只是对数组进行过滤而不是其它操作，然后就是第三个参数如果是
            true那么代表我们对我们在回调函数中的过滤条件进行取反
            console.log($.grep([1, 2, 3], function (v, i) { //v 代表值，i代表下标
                            return v<2
                        },true)); //[2, 3]
            */
            var retVal,
                ret = [],
                i = 0,
                length = elems.length;

            inv = !!inv;
            // !! 会将元素转换为boolean值
            //这里对inv进行Boolean转化，如果用户没有传入第三个参数那么inv为undefined，也就是false

            for (; i < length; i++) {
                retVal = !!callback(elems[i], i);
                if (inv !== retVal) {
                    ret.push(elems[i]);
                }
                //这里是一个非常巧妙的写法，首先for循环遍历传入的参数，然后用retVal接收我们传入的规则的boolean值，用上面的
                //例子来说明
                //$.grep([1, 2, 3], function (v, i) { //v 代表值，i代表下标
                //return v<2
                //},true)); //[2,3]
                //第三个参数true会被!!inv转化为true，第一次循环时相当于!!v<2，由于是第一次循环，所以v的值是1,!!(1<2)的
                //结果为true,那么在接下来的if判断时inv ！== retVal 不成立，所以接下来的代码不会执行，依次类推，直到第二
                //、三次循环时，!!(2<2)和!!(3<2)的结果为false，那么inv ！== retVal成立，所以elems[i]也就是2,3会被添
                //加到ret中
            }
            return ret;
        },
        map: function (elems, callback, arg) {
            //map方法基本上是和each方法是一样的，不同的在于在map中我们是建立了一个全新的数组/对象，最终map会返回的是我们
            //新建的数组/对象，在each中是返回我们原有的数组/对象
            //在map方法中我们可以改变数组/对象的值，并且得到改变之后的数组/对象，在each中只能操作方法，不能改变值
            /*
            var arr=[1,2,3]
            console.log($.each(arr, function (v, i) {
                return v+1;
            })); //[1,2,3]
            console.log(arr); //[1,2,3]
            console.log($.map(arr, function (v, i) {
                return v + 1;
            })); //[2, 3, 4]
            console.log(arr); //[1,2,3]
            */
            var value,
                i = 0,
                length = elems.length,
                isArray = isArraylike(elems),
                ret = []; //新建的数组

            if (isArray) {
                for (; i < length; i++) {
                    value = callback(element[i], i, arg);
                    if (value != null) {
                        ret[ret.length] = value;
                        //这里也是一个不错的写法，最初的时候ret.length一定是0，然后在有值添加的情况下length++，那么相
                        //当于ret[0++]
                    }
                    //在这里我们可以看出map和each的区别，each中只是对callback的值进行一个判断是否为false，然后选择是否
                    //break，而在map中我们只要判断值不为null或者undefined，就会将这个值存到我们新建的ret数组中
                }
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret[ret.length] = value;
                    }
                    //这里和each一样，是判断是一个对象格式的元素下进行的，这里记录一下我个人的一点收获
                    /*
                    在一开始的时候我是比较在意 i in elems 这段代码的，因为在之前i是被赋值为0的，而如果我们给一个不是特
                    殊格式的对象obj[0]得到的一定是一个undefined值，所以一直在纠结这个，因为平时一直在使用for in
                    循环的时候都是var key; key in obj 这样的格式，后来查看了一下犀牛书，加深了一下理解，for(v in
                    obj) 中v可以使一个变量名（var key;/key），也可以是一个产生左值得表达式或者是一个通过var语句声明的
                    变量（如果觉得绕口可以理解为可以是一个被声明并且赋值的变量），总之必须是一个适用于赋值表达式左侧的值，
                     只要满足这个条件，它可以是任意表达式，每次循环的时候都会计算这个表达式，也就是说每次循环时它的值都是
                     不同的，可以理解为每次循环都是在为它重新赋值为obj中的键值对的建名字

                    可以看一个上面的这个例子
                    var i=0,
                        obj={x:1,y:2}
                    for(i in obj){}
                    console.log(i) //y

                    比较经典的例子
                    var  obj={x:1,y:2,z:3},
                         arr=[],i=0;
                    for(arr[i++] in obj) { }
                    console.log(arr) // [ x, y, z]
                    */
                }
                return core_concat.apply([], ret);
                //这里之所以没有直接返回ret而是使用concat.apply的方法是为了防止出现用户输入return [v+1]的情况而出现复
                //合数组（[[1],[2]]）的情况，这样处理之后及时用户如上输入的到的结果也是一个没有嵌套的数组
            }
        },
        guid: 1,
        //这个是jQuery中的唯一标识符，主要是用于jQuery中事件函数,我们可以配合proxy方法来大概了解一下这个属性的意义
        proxy: function (fn, context) {
            //该方法用来改变this的指向
            /*
            body标签
            <input type='button' value='click'>
            function click(arg1,arg2){
                console.log(arg1);
                console.log(arg2);
                alert(this)
            }
            click("a","b")//window,a,b
            $.proxy(click,document,'a')('b'); //document,'a','b'
            这里我们可以看到click方法的this指向改变了
            */
            //需要注意几个点，该方法类似于bind改变指向，但是不会自执行，需要手动触发，也就是加()，该方法可有传值，并且传值
            //有两种方式，第一钟是在$.proxy()方法中传值，第二种是在$.proxy()()执行括号中传值，但是需要注意可以同时传参
            //，并且先后顺序也就是执行时参数的顺序，这也是因为我们之前说过proxy方法不是一个自执行方法，jQuery考虑到我们可
            //能不需要立即执行，所以可以选择在方法内传参，也有可能会立即执行，也可以在执行括号中传参

            //另外还支持一个简写的方法
            /*
            var obj={
                show:function () {
                    console.log(this);
                }
            }
            $(document).click(obj.show); //#document
            $(document).click($.proxy(obj.show,obj)) //{show: ƒ}
            //上面的这个方法可以简写为
            $(document).click($.proxy(obj,"show")) ////{show: ƒ}
            */
            var tmp, args, proxy;

            if (typeof context === 'string') {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }
            //这里判断的就是是否是我们上面提到的简写的方法，如果第二个参数是一个字符串。那么默认用户采用的是简化的写法，
            //fn[context]相当于是obj[show]，用tmp接收该方法，然后用content接收fn，也就是show方法
            //这个就是利用变量将位置再次进行了转换，转换为正常的写法然后在进一步进行处理

            if (!jQuery.isFunction(fn)) {
                return undefined;
            }
            //这里判断我们传入的fn必须是以个函数，如果不是一个函数，那么直接返回undefined
            args = core_slice.call(arguments, 2);
            //这里我们将用户传入的参数的前两位取出来，因为argument获得的是一个伪数组对象，不能使用数组的slice方法，所以使
            //用Array.prototype.slice.call()的方法将伪数组转化为真数组，然后以数组的形式将将除了前两位之外的元素取出赋
            //值到args
            proxy = function () {
                return fn.apply(context || this, args.concat(core_slice.call(arguments)))
            }
            //这里刚开始的时候被arguments搞得有些乱，首先呢，我们在为args赋值的时候拿到的是arguments是函数proxy()这个\
            //函数括号内的传参，而在这我们将proxy定义为一个函数，所以函数后面跟随的()，也就是proxy()()的第二个括号，也就
            //是执行时括号内传入的参数才是我们定义的proxy函数的参数，所以如果是$.proxy(...)("b")这种形式，我们拿到的是
            //("b")的arguments，也就是"b"
            //将fn，也就是我们要改变this指向的方法使用apply将this指向我们传入的context，如果没有传入，那么指向jQuery对
            //象，并将之前的获取到的第一款括号内用户的参数和第二个括号用户的参数进行合并

            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
            //这里就用到了我们上一个属性guid，我们看一个实际的例子
            /*
            function click() {
                console.log(this);
            }
            $("#off").click(function () {
                $("#test").off();
            })
            $("#test").click(click); //#test
            //点击#off后我们再次点击#test就不会再打印，可以看到jQuery找到了#test对应的绑定事件，在这时click是一个事件
            函数
            $("#test").click($.proxy(click,document)) //#document
            //那么我们此时使用proxy对#test的click事件函数进行处理，改变了click函数的this指向，那么注意，此时的click函
            数不再是一个事件函数，而是一个普通函数，但是我们点击off，还是能够取消#test的单击事件，所以在jQuery内部一定是对
            #test的事件函数进行了一个内部的绑定，也可以说建立了某种映射关系，这里就是利用了guid
            ps：有的人可能会混淆事件函数和普通函数，事件函数是指我们针对某个事件特定的函数，比如说我们针对click设置的
            click函数，而普通函数则是没有执行的执行环境或者说没有指定的需要监听的用户操作，只要调用就会触发
            这里就是利用guid为每一个设置了一个id值或者是一个++的num，从而查找到对应的函数
            还有一点是上面的写法，js是一个从右向左的赋值过程，类似于一道面试题 var a=b=5; 的解析过程，这里可以看做是这样的
            a=(b=5);在这里只有a被声明了，b被自动解析为隐式全局变量
            */
        },
        access: function (elems, fn, key, value, chainable, emptyGet, raw) {
            //这个是jQuery的一个内部方法，是一个多功能操作的公共方法，例如我们使用$().css()我们既可以实现获取高度，也可
            //以用来设置高度，并且可以同时设定多个值，包括象attr等等这些方法，大部分都是同时存在get/set的，那么我们不可能
            //每一个都去写一个根据用户传入不同做不同操作的这个步骤，所以我们将这部分抽离出来成为一个公共方法，就是access

            //elems 操作的元素，这个可能是一个集合，例如$("div")
            //fn 不同的方法的不同处理的回调函数，例如我们设置attr和css肯定是要有不同操作的，那么这些操作就是在fn中
            //key 我们传入的键 如css(width)中的width
            //value 我们传入的值 如css(width:300px)中的300px
            //chainable 是否可以进行链式操作，如果式set方法那么为true，如果式get操作那么为false
            //其余两个参数主要是为了处理用户在value值中传入回调函数时做处理，raw是如果在用户传入value值为一个函数时处理该函数

            var i = 0,
                length = elems.length,
                bulk = key == null;
            //这里bulk的值是判定key是不是传入了，如果key传入了值，那么根据js从右到左的赋值过程，那么bulk的值会是false
            if (jQuery.type(key) === "object") {
                chainnable = true;
                for (i in key) {
                    jQuery.access(elems, fn, i, key[i], true, emptyGet, raw)
                }
                //这里呢我们判断如果用户传入的是一个object格式的，那么肯定是进行set操作，$().css({width:200px})，那
                //么我们手动将chainable设置为true，表示可以进行链式调用，然后遍历对象，每一次遍历的时候递归传入对象的本次的键值对，作为用户传入的键值对进行处理
            } else if (value !== undefined) {
                chainable = true;
                //如果用户传入了value值，那么一定也是set操作，那么也手动将chainable设置为true
                if (!jQuery.isFunction(value)) {
                    raw = true;
                }
                //如果我们传入的value值不是function，那么将raw设置为true
                if (bulk) {
                    //如果用户传入了key值
                    if (raw) {
                        //并且用户传入的value不是function，那么我们将我们设定的回调函数指向调用对象($(xx))，将我们设置的回调函数设置为null
                        fn.call(elems, value);
                        fn = null;
                    } else {
                        //如果用户传入的value是function,那么使用bulk接收回调函数，将回调函数设置为如下格式
                        bulk = fn;
                        fn = function (elem, key, value) {
                            return bulk.call(jQuery(elem), value)
                        }
                    }
                }
                //如果用户没有传入key值，但是传入了value并且该value不是一个函数，那么就传入将value传入fn中，交给具体方
                //法处理，同时将fn设置为空，如果value是一个函数，那么用bulk接收该函数
            }

            if (fn) {
                //如果fn存在依然存在那么说明用户在value位置上传入的是一个方法
                //为每一个调用这添加用户传入的方法
                for (; i < length; i++) {
                    fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                }
            }


            return chainable ?
                elems :
                bulk ?
                    fn.call(elems) :
                    length ? fn(elems[0], key) : emptyGet;
            // 在最后返回的时候我们会先判断一下，如果我们chainable的值为true，那么说明是set方法，要进行链式操作，所以返回的是调用者本身，如果chainable为false，那么再继续判断bulk的值，bulk的值取决于我们是否传入了key值，如果传入了那么表示是一个get操作，那么将fn方法绑定到调用者上，如果bluk值为false，那么就有可能是用户传入的参数错误了，这种情况下首先判断有没有调用者，也就是length是否为0，如果不是那么bulk为false可能是由于bulk = fn;这个操作的原因，那么将第一个调用和key值传入到用户的方法中，如果没有length那么说明没有调用者。直接返回emptyGet，也就是一个undefined
        },
        now: Date.now,
        //这个就很简单了，就是获取当前时间到1970年的毫秒数，jQuery在这里使用了的是es5的规范中的新API，我们如果考虑某些兼
        //容性问题也可以使用new Date().getTime()
        swap: function (elem, options, callback, args) {
            //该方法主要用来做css交换，这是一个内部交换的方法，这个方法使用的场景可能例如下面这个例子
            /*
            div#test style="width:100px"
            console.log($("#test").width()) //100
            console.log(document.querySelector("#test").offsetWidth) //100
            但是现在我们设定一个情况，如果我们将#test的displays设置为none，那么我们会发现原生js是无法获取宽度的，因为元
            素时没有被渲染的，那么jQuery就利用好swap方法对这种情况进行了处理
            这里我说一下大概的处理思路是什么，因为我们不能直接获取一个没有被渲染的元素，所以我们要做的就是让该元素被渲染出来
            ，做法就是为display:none的属性当前元素添加例如{display:block;visibility:hidden;position:absolute;
            }，这里我们设置block是为了让浏览器渲染元素，但是同时不能让元素展示出来所以要设置visibility:hidden来隐藏元素
            ，但是我们都知道该属性虽然会隐藏元素但是该元素在文档中还是会占用位置，所以我们将其设置为absolute来让其脱离文档
            流，在我们获取得到宽度之后再将我们设置的属性恢复到最初的设定值
            */
            var ret, name,
                old = {};
            //这里我们要做的就是的就是遍历我们传入的样式属性列表options，然后将当前元素原本的和我们重复的样式属性赋值到
            //old上，然后将我们新传入的options样式属性赋值给当前元素，然后执行我们获取当前元素属性的操作方法（例如获取高
            //度），在方法结束后再将原来的属性赋值回元素身上
            for (name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name];
            }
            //这里多说一下，我们这里使用的是style方法，该方法只能获取到我们设置诶行内样式的样式列表，如果我们向要获取到元
            //素的所有被应用的样式的列表，可以使用window.getComputedStyle(elem)的方法，该方法是只读的，不可写，如果想
            //要获取到元素的样式表中的属性，在ie浏览器中提供了currentStyle（elem.currentStyle），在非ie浏览器下使用
            //document.defaultView.getComputedStyle(document.defaultView.getComputedStyle(elem,null))，单
            //由于我们知道行内样式具有最高的优先级，所以我们只需要使用style赋值即可
            //额外说一个点，如果我们设置一个元素如div#test，那么我们直接写该元素的id值也可以获取到该元素
            //console.log(test == document.querySelector("#test")) //true
            ret = callback.apply(elem, args || []);

            for (name in options) {
                elem.style[name] = old[name];
            }

            return ret;
        }

    })

    jQuery.ready.promise = function (obj) {
        if (!readyList) {
            readyList = jQuery.Deferred();

            if (document.readyState === 'completed') {
                //在document载入完成后执行jQuery.ready
                setTimeout(jQuery.ready);
                //这里写setTimeout的目的是兼容ie的处理，在ie浏览器下可能存在一个情况就是在我们dom结构树没有完全加载完成时就ie就会默认将document的readyState状态变为completed,也就是说在ie下，completed的状态会提前，所以为了防止这种情况我们使用setTimeout创建一个任务队列，确保在document整体加载完成后才执行jQuery.ready方法
            } else {
                document.addEventListener('DOMContentLoaded', completed, false);
                window.addEventListener('load', completed, false);
                //首先，了解概念，判断文档加载是否完成有两种方式
                //1. load，在所有DOM和所有文件都加载完成后触发
                //2. DOMContentLoaded,在DOM结构树加载完成后触发
                //这里既绑定load又绑定DOMContentLoaded事件是为了处理兼容性问题，在正常情况下都是DOMContentLoaded优先触发，但是在某些浏览器下(例如火狐)会缓存load事件，这就会造成我们如果第二次刷新页面就会出现load先触发的情况，所以本着谁快使用谁的原则，我们将两个页面都绑定，那个事件先触发就调用哪个事件
            }
        }
        return readyList.promise(obj);
    }

    function isArraylike(obj) {
        //该方法用来判断obj对象是否为一个数组/类数组，或者象jQuery对象一样的具有length属性的特殊格式的对象
        var length = obj.length,
            type = jQuery.type(obj);
        //首先判断obj的length属性和obj的类型，前面我们也说到了，对象是没有length属性的，除非该对象有length的键
        if (jQuery.isWindow(obj)) {
            return false;
        }
        //判断如果用户传入的是一个window对象，那么直接返回false
        if (obj.nodeType === 1 && length) {
            return true;
        }
        //这里我们判断用户传入的对象的nodeType是否是为1，我们知道nodeType为1的是element类型，在为element类型的情况下如
        //果我们不是通过getElementById或则QuerySelector(id)这样的形式获取到的，那额就都会是为数组的形式，所以我们通过
        //判断obj是否有length来排除这两种情况，其余的结果就可以直接返回true
        return type === "array" || type !== "function" &&
            (length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj);
        //在这里判断obj是否为数组并且不是函数（函数也是有length属性的，函数的length属性的值是函数中传入的形参个数）并且length属性是Number大于零的，并且length-1位是存在于obj上的
        //这里的length===0 是为了防止一种情况就是我们如果获取的只有单个的如伪数组的集合情况下，(length -1) in
        //obj返回的一定是false，所以提前判断这种情况，length-1 in obj 这个判断，不管我们传入的是数组/伪数组/jQuery格式
        //的对象，那么这种格式的obj上一定是有length-1位置/键所对应的值存在，其它情况则没有
    }


    var optionsCache = {};

    function createOptions(options) {

        var object = optionsCache[options] = {};

        //core_rnotwhite = /\S+/g
        //match 返回符合匹配条件的结果，并且将匹配的结果存到一个数组中，如果没有匹配的结果那么返回null
        // \S 表示所有的非空字段，+表示匹配前面的子表达式的一个或多个结果
        jQuery.each(options.match(core_rnotwhite) || [], function (_, flag) {
            object[flag] = true;
        });
        return object;
        //createOptions方法最后会返回一个将存在空格分开的字符串（"a b"）转化为{a:true,b:true}的格式的对象
    }

    jQuery.Callbacks = function (options) {
        //该方法就是使用了我们常说的观察者模式
        //主要是可以用来对不同作用域下函数进行管理
        //我们还是首先来看一下这个方法的大概使用
        /*
        function b() {
            alert("b")
        }
        function c() {
            alert("c")
        }
        var callback=$.Callbacks();
        callback.add(b);
        callback.add(c);
        callback.fire()
        */
        //Callback可以一次调用，执行所有挂载在其身上的方法，但是主要的是可以执行不同作用域下的方法
        /*
        var callback = $.Callbacks();

        function a() {
            alert("a");
        }

        callback.add(a);

        (function () {
            function b() {
                alert("b");
            }

            callback.add(b)
        })()
        a();
        // b();// b is not defined
        callback.fire();
        */

        //该方法可以接收4个参数
        //1. once 表示只执行一次该方法，重复的方法不会执行
        /*
        var callback = $.Callbacks('once');
        function a() {
            alert("a");
        }
        callback.add(a);

        callback.fire();
        callback.fire();
        */
        //2. memory 表示不论add是否在fire之前或之后添加方法，在执行fire时，该方法都会被执行
        /*
        function a() {
            alert("a");
        }
        var callback = $.Callbacks('memory');

        callback.fire();  //如果不添加memory函数a不会被执行，因为是在fire之后被add的
        callback.add(a);
        */
        //3. unique 相当于去重，重复的方法只会执行一次
        /*
        function a() {
            alert("a");
        }

        var callback = $.Callbacks('unique');
        callback.add(a);
        callback.add(a);
        callback.fire();
        */
        //4. stopOnFalse 如果遇到方法返回false，那么停止继续执行
        /*
        function a() {
            alert("a");
        }
        function b() {
            return false;
        }
        function c() {
            alert("c")
        }
        var callback = $.Callbacks('stopOnFalse');
        callback.add(a,b,c);
        callback.fire();
        */
        //在fire中可以传递参数
        /*
        function a(res) {
            console.log("a  "+res);
        }
        function b(res) {
            console.log("b  "+res)
        }
        var callback = $.Callbacks();
        callback.add([a],b);
        callback.fire("Callbacks"); //a  Callbacks  b  Callbacks
        */
        options = typeof options === "string" ?
            (optionsCache[options] || createOptions(options)) :
            jQuery.extend({}, options);

        //如果我们传入的是一个字符串格式的参数，那么首先判断optionsCache上是否存在和我们传入值相同的键值了，如果已经存在那么说明我
        //们之前已经处理过相同的传入值了，那么继续为options赋值之前的值，如果没有，那么使用createOptions方法将传入的字符转化为
        //{a:true,b:true}的格式，如果没有传入或传入的不是一个字符串，那么使用extend将该值合并到一个对象上
        var
            memory, //对应我们可以传入的参数memory
            fired,  //表示是否已经触发过fire操作
            firing, //fire是否在执行中
            //该变量可以理解为队列，控制先进先出，例如下面的场景
            /*
            例子 3
            var flag = true;

            function a(res) {
                console.log("a");

                if (flag) {
                    callback.fire();
                    flag = false;
                }

            }
            function b(res) {
                console.log("b")
            }

            var callback = $.Callbacks();
            callback.add([a], b);
            callback.fire() // a b a b
            我们可以发现执行fire时即使存在有fire'插队'的情况，依旧也会是依次的的执行add添加的队列，而不是执行函数a时立即再次执
            行a中的fire，而是在本次fire执行完成后再调用函数a中的fire，这其中就是通过盘端firing的值来进行判断
            */
            firingStart, //存储起始值
            firingLength, //存储长度
            firingIndex, //存储索引值
            list = [],
            //list 是最为关键的值，其实整个Callbacks函数本身的实质可以理解为就是add的方法添加到list数组中，然后调用fire的时候遍历该数组，依次执行，通过一些不同的传入值来执行一些对应的操作，例如决定我们是否可以为这个数组中添加重复的方法（unique），遇到false就break（stopOnFalse）等等
            stack = !options.once && [], //是否只执行一次
            fire = function (data) {
                memory = options.memory && data;
                //如果用户传入了memory（$.Callbacks('memory')），那么将memory设置为true并且用memory来接收在self.fire中传递过来的值
                fired = true;
                //已经触发过fire操作，修改为true
                firingIndex = firingStart || 0;
                firingStart = 0;
                //将firingStart的值归零（同时设置为false）
                firingLength = list.length;
                firing = true; //正在执行中
                for (; list && firingIndex < firingLength; firingIndex++) {

                    if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        //data[0]是fireWith中传入的this，data[1]是fireWith中传入的arg
                        memory = false;
                        break;
                        //这里如果我们传入了stopOnFalse参数，并且本次执行的方法返回了false，那么我们就break跳过本次的循环
                    }
                }
                firing = false;
                if (list) {
                    if (stack) {
                        //如果是用户设定了只执行一次，那么会跳过该判断，不再执行堆中的fire操作，而且下一次的调用self的fire也会在fireWith中的 if (list && (!fired || stack))判定为不执行，直接return
                        //如果用户没有设定只执行一次，那么执行该操作，屏蔽掉后续的操作，保留了list不被清空
                        if (stack.length) {
                            //循环结束后判断stack是否存在length，如果存在，那么递归fire,（例子 3 对应的情况）
                            fire(stack.shift());
                        }
                    } else if (memory) {
                        //如果用户设定了全局执行，那么只是将lists清空
                        list = [];
                    } else {
                        //如果用户没有设定once并且没有设定memory,那么执行disable方法,禁止后续的所有操作
                        self.disable();
                    }
                }
            },
            self = {
                add: function () {
                    if (list) {
                        //list设定的是一个空的数组，所以在进行if判断的时候为true，这里的判断只有我们使用了disable方法后将list设置为false才会
                        //list为false说明我们设定了disable，将list设定为undefined，所以不执行所有操作
                        var start = list.length;
                        //start 第一次调用的时候list是一个空数组，所以start的值为0，相当于存储一个起始值
                        (function add(args) {
                            jQuery.each(args, function (_, arg) {
                                // 一个匿名函数自执行，对我们传入add中的参数进行遍历，（例如add(a,b)的情况）
                                var type = jQuery.type(arg);
                                //判断每一个参数的类型
                                if (type === 'function') {
                                    if (!options.unique || !self.has(arg)) {
                                        //如果参数的类型是一个function，并且我们没有设定unique做去重或者在该函数没有被add添
                                        //加的情况下，将该函数添加到list数组中（针对unique的情况，如果我们设定了unique并且在
                                        //add已经添加过了，那么会返回false，后续相同的函数不会被添加到list中）
                                        list.push(arg)
                                    }
                                } else if (arg && arg.length && type !== 'string') {
                                    //如果存在传入的参数不是函数，（例如我们可以写add([a,b],c)），那么我们需要判断传入的参数是否存在并且具有length属性而且不是一个字符串格式，那么可以判断是一个数组，那么递归调用add方法
                                    add(arg)
                                }
                            })
                        })(arguments);

                        if (firing) {
                            //能够进入这个if判断的情况
                            /*
                            var callback = $.Callbacks();
                            function a() {
                                console.log("a");
                                callback.add(b)
                            }
                            function b() {
                                console.log("b")
                            }
                            callback.add(a);
                            callback.fire();
                            */
                            //此时调用fire后在执行完上面的自执行函数后，firingLength只有最初的list长度，也就是只添加了一个方法a的情况，所以只有1，需要对其重新赋值为当前添加了b方法的情况，也就是list的实际长度为2
                            //在为firingLength赋值了新的长度之后，由于是在fire中调用了add方法，所以重新执行了add方法，将b方法添加到了list中，list的长度法发生了变化，那么我们动态的改变firingLength的长度，使forfire的for循环多循环一次，从而能够也执行b方法，这也是观察者模式的最大优点，一个点的改变，能够确保相关的数据都能变化
                            firingLength = list.length;
                        } else if (memory) {
                            //memory 最开始的时候设定的是一个undefined，所以第一个执行add的时候不会执行下面的代码，但是执行过一次fire方法之后，如果我们设定了memory值，那么memory的值会被改变为true，执行下面的代码
                            firingStart = start;
                            fire(memory);
                            //如果memory为true，那么会再一次调用fire方法，这也是为什么我们在fire之后使用add添加的函数也会被执行的原因
                            //此时start的值是之前的length的长度，我们将firingStart的值赋值为当前list的长度，并且从该值开始向后循环执行剩余被添加的方法，也就是遍历在fire之后被ad添加的方法
                            /*
                            在再次执行fire时会执行
                            firingIndex = firingStart || 0;
                            firingStart = 0;
                            firingLength = list.length;
                            */
                        }
                    }
                    return this;
                },
                remove: function () {
                    if (list) {
                        jQuery.each(arguments, function (_, arg) {
                            var index;
                            while ((index = jQuery.inArray(arg, list, index)) > -1) {
                                list.splice(index, 1);
                                if (firing) {
                                    if (index <= firingLength) {
                                        firingLength--;
                                    }
                                    if (index <= firingIndex) {
                                        firingIndex--;
                                    }
                                }
                            }
                        })
                    }
                    return this;
                },
                has: function (fn) {
                    return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
                    //has函数用来判断是否包含某个方法
                    //首先判断参数是否为一个不为null和undefined的值，如果存在的话判断fn函数名是否存在于list数组中
                    //如果fn是一个bool为false的值,在list存在函数（add添加过方法的情况下）返回true，所以也可以认为has可以用来判断是否添加过方法
                    //只有在没有使用过add/使用了disable后才会返回false
                },
                empty: function () {
                    //用来清空整个lists数组
                    list = [];
                    firingLength = 0;
                    return this;
                },
                disable: function () {
                    //禁止后续的所有操作
                    list = stack = memory = undefined;
                    return this;
                },
                disabled: function () {
                    return !list;
                },
                lock: function () {
                    //只有在不存在memory的情况下才禁止后续的所有操作，否则只是禁止在后续的fire操作
                    stack = undefined;
                    if (!memory) {
                        self.disable();
                    }
                    return this;
                },
                locked: function () {
                    return !stack;
                },
                fireWith: function (context, args) {
                    if (list && (!fired || stack)) {
                        //这里这个if判断的条件是我们是否传入了once参数
                        //第一次执行的时候，if判断的条件为true
                        //在执行了一次fire方法后fired会赋值为true（ fired = true;），那么!fire会得到false，此时如果我们想要继续运行那么就需要stack值为true，而stack的值取决于我们是否传入的once参数（stack = !options.once && []）
                        args = args || [];
                        args = [context, args.slice ? args.slice() : args];
                        //如果我们没有在callbacks.fire()中传入参数，args为一个[]，如果传入了值那么args是我们传入的arguments
                        //将args重新赋值为一个数组，第0位置上是self.fire传入的this，第1位置上如果上一次的取值是[],那么数组具有slice方法，第1位置上是[]，如果上一次的取值是arguments，伪数组不具有slice方法，选择为arguments
                        if (firing) {
                            //这里判断firing，在前面我们看到，如果for循环没有执行完成，那么firing的值是true，那么如果我们此时
                            //在函数中添加了一个fire方法(例子3)
                            //该方法会被添加到stack队列的尾部,在循环结束后判断stack是否存在length，如果存在，那么调用递归fire，也就是使用的堆的存储方式
                            stack.push(args);
                        } else {
                            //如果firing为false，那么说明没有在执行，调用fire方法，传入args
                            fire(args);
                        }
                    }
                    return this;
                },
                fire: function () {
                    self.fireWith(this, arguments);
                    //直接调用fireWith，将self和我们在fire中传递的参数一同传递给fireWith
                    return this;
                    //链式操作，回调自身
                },
                fired: function () {
                    //用来判断是否执行过一次fire操作
                    return !!fired;
                }
            };
        return self;
        // jQuery 实现链式写法的关键，return this; callback.add(a).add(a).fire()
    }
    jQuery.extend({
        //jQuery的延迟对象
        //在看这一块的时候需要注意的是：1.熟悉$.Callbacks的用法 2.要想知道怎么实现一个方法当然是要知道这个方法是怎么使用的，所以要熟悉Deferred的用法（https://www.jianshu.com/p/e7dacd874202）
        Deferred: function (func) {
            //工厂函数
            //映射关系的数组
            var tuples = [
                    ["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", jQuery.callback("memory")]
                ],
                //我们在resolve和reject状态下的时候要设置once，因为这两个状态表示的是一个确定的状态，完成了也就是完成了，失败了也就是失败了，不需要再一次去确定，所以只执行一次fire就可以了，而状态notify则是一个不定的，随着改变需要连续触发
                /*
                const deferred = $.Deferred();
                setInterval(() => {
                    console.log("异步事件触发");
                    deferred.resolve();
                },1000)

                deferred.done(()=>{
                    console.log("异步事件成功"); //异步事件成功  异步事件触发  异步事件触发  异步事件触发 ...
                }
                */
                //而memory则是为了实现一个效果，例如
                /*
                const deferred = $.Deferred();
                setTimeout(() => {
                    console.log("执行nav动画");
                    deferred.resolve();
                }, 10000)

                deferred.done(()=>{
                    console.log("banner执行动画");
                })

                off.onclick= ()=>{
                    deferred.done(()=>{
                        console.log("文字浮现");
                    })
                }
                */
                //onclick操作都会被作为队列存放，直到计时器中resolve执行，而且一个比较经典的案例，例如我们要做一个网站的动画，在第一次进入index的时候nav是经过2s加载完成的，在2s之后加载banner，然后加载文字，但是我们点击nav跳转tab后再点击回到首页，nav是已经加载完成的，所以此时开始立即加载banner，然后加载文字，这个就可以利用了大概如上面例子的代码
                state = "pending",
                //异步初始状态
                promise = {
                    //返回当前延迟对象的状态
                    /*
                    const promise = $.Deferred();
                    setTimeout(() => {
                        console.log(promise.state());
                        promise.resolve();
                        console.log(promise.state());
                    }, 1000)

                    promise.done(()=>{
                        console.log("suc")
                    })
                    //pending suc resolved
                    */
                    state: function () {
                        return state;
                    },
                    always: function () {
                        //不论什么状态，都会出发always事件，所以在这里同时调用done和fail保证不论是什么状态下都能执行always方法
                        deferred.done(arguments).fail(arguments)
                        return this;
                    },
                    then: function (/*fnDone,fnFail,fnProgress*/) {

                        //一个闭包
                        //先处理传入的方法,然后返回 jQuery.Deferred().promise()
                        //我们都知道在执行call方法是，首先只要调用就会执行，其次，传入的第二个参数会被作为调用者的参数，那么也就是说我们传入的第二个参数`deferred`会被作为`function (newDefer){}`的参数，那么也就是说newDefer这个形参会被强制的赋值为deferred对象
                        /*
                        var a={
                            name:"tom"
                        }
                        function b(obj) {
                            return obj;
                        }
                        console.log(b.call(a, a)); //{name: "tom"}
                        console.log(b.call(a, 1)); // 1
                        //执行call后得到b的返回结果，我们可以明显看出此时a被作为了b的参数也就是obj来执行
                        //注意点，call会立即执行，call的第二位以及之后的参数会被作为调用者也就是b的参数
                        */
                        var fns = arguments;

                        return jQuery.Deferred(function (newDefer) {
                            //newDefer  就是 if (func) {} 判断后返回的deferred对象
                            jQuery.each(tuples, function (i, tuple) {

                                var action = tuple[0], //状态


                                    fn = jQuery.isFunction(fns[i]) && fns[i];
                                //如果传入的是一个函数并且存在该方法，那么使用fn来接收该方法

                                deferred[tuple[1]](function () {
                                    //deferred[done]()
                                    var returned = fn && fn.apply(this, arguments);
                                    //returned是返回的apply执行结果，如果我们在方法中传入了参数，那么会将该方法和参数一并指向到this，也就是deferred上，例如then(res){}，其实说白了因为本身调用的是Callbacks的方法，所以这里就是fire的传参
                                    //也就是在这里then执行了对应关系，再循环tuples的同时如果用户传入了对应的函数，那么通过var action = tuple[0]，获取状态，如果用户在对应的位置上传入了参数那么获取该参数fn = jQuery.isFunction(fns[i]) && fns[i];将该参数赋值到对应的方法个                  deferred[tuple[1]](function () {
                                    //deferred[done]()
                                    // }
                                    var returned = fn && fn.apply(this, arguments);
                                    if (returned && jQuery.isFunction(returned.promise)) {
                                        returned.promise()
                                            .done()
                                            .fail()
                                            .progress()
                                    } else {
                                        newDefer[action + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments)
                                        //判断returned是不是一个deferred对象，如果不是，那么说明用户传入的只是单纯的值，那么执行如deferred[resolveWith]
                                    }
                                });
                            });
                            fns = null;
                        }).promise();
                    },
                    //then方法首先先遍历tuples数组，首先通过action = tuple[0]用action接收三个不同的状态（resolve等），然后执行deferred[tuple[1]]也就是如deferred.done通过fn = jQuery.isFunction(fns[i]) && fns[i]和returned = fn && fn.apply(this, arguments)接收传入的第一个赋值到deferred.done，依次如此赋值的一个过程
                    promise: function (obj) {
                        return obj != null ? jQuery.extend(obj, promise) : promise;
                        //判断是否有参数，如果有那么promise对象的键值对合并到参数上，并返回，如果没有那么返回promise
                        //作用 1. 在 promise.promise(deferred);时将promise的方法添加到deferred上   2. 在不存在参数的情况下返回promise对象，该对象没有状态，所以不能被改变状态
                        //promise和deferred的区别，promise没有resolve等三种状态，而deferred又这三种状态，如果我们设置了延迟对象不想被外界改变那么只需要返回例如obj.resolve().promise();那么外界就只能执行方法，不能改变状态
                        /*
                        const promise = $.Deferred();

                        function a() {
                            setTimeout(() => {
                                return promise.resolve().promise();
                            })
                            return promise.promise();
                        }

                        a().done(() => {
                            console.log("suc")
                        }).fail(()=>{
                            console.log("err");
                        })
                        a().reject();
                        //suc
                        */
                    }
                },
                deferred = {};


            promise.pipe = promise.then;
            //pipe是之前版本有但是现在其实不需要要了，方法和then重合了，为了照顾用户习惯进行保留，但是也不另写方法了，直接使用then的方法


            jQuery.each(tuples, function (i, tuple) {
                var list = tuple[2],  //list赋值为Callbacks方法
                    stateString = tuple[3]; //将stateString改变为resolve等状态，在notify时是没有状态的，为undefined

                promise[tuple[1]] = list.add;
                //使用each对数组tuples进行遍历操作，这里可以看到done，file，progress这些操作实际就是Callbacks中的add方法

                if (stateString) {
                    //只有在延迟完成/未完成时才能进入该if判断,tuples[3]是undefined，不进入该判断
                    list.add(function () {
                        state = stateString;
                        //改变sate的状态
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                    //tuples[i ^ 1][2].disable, tuples[2][2].lock 控制只能触发一个状态，截断后续操作，也就是说如果是完成，那么不执行之后的未完成，如果是未完成，那么之后的完成不会被触发
                    /*
                    const promise = $.Deferred();
                    setTimeout(() => {
                        console.log(promise.state());
                        promise.resolve();
                        promise.reject();
                        console.log(promise.state());
                    }, 1000)

                    promise.done(()=>{
                        console.log("suc")
                    }).fail(()=>{
                        console.log("err")
                    })
                    //pending suc resolved
                    */
                    //我们由上面的代码可以看到这三个状态的对应的执行方法都是依赖于Callbacks的add来添加方法，然后在调用fire后执行，那么要达到上面的效果，只需要将后续的fire方法都截断就可以了，也就是说这一步的时候实际上就是建立如resolve=》don的这样关系，在resolve的时候，就将tuples[2][2]中的所有要执行add方法全部设置为一个disable方法，反之同理
                    //tuples[2][2].lock就是状态为notify，jQuery.callback("memory").lock，不再执行fire方法时调用
                    //tuples[i ^ 1][2].disable
                    //[i ^ 1]  位运算符 i 如果是 0 ,得到的值是1，i如果是1，得到的值是0，那么也就是说如果此时我们执行了done，那么对fail方法执行disable，如果我们执行了fail那么对done执行disable
                    /*
                    console.log(0 ^ 1); //1
                    console.log(1 ^ 1); //0
                    */
                    //最终实际上就是分别再状态为resolve/reject时候向list添加了三个函数
                    // doneList : [changeState, failList.disable, processList.lock]
                    // failList : [changeState, doneList.disable, processList.lock]
                }
                //与三个回调对应的resolve，reject，notify状态则是被添加到了deferred上，最后调用了fireWith方法

                //deferred.resolve=function(){
                //      deferred.resolveWith(promise,arguments)
                //      return this;
                // }
                //deferred.resolveWith=list.fireWith;
                //开始的时候纠结了为什么后写deferred.resolveWith=list.fireWith，然后再在function中使用deferred.resolveWith，为什么不会出现赋值不成功的情况，后来想明白了赋值操作是在js读取时就已经执行了，在使用的时候deferred.resolveWith已经是有值的状态了
                deferred[tuple[0]] = function () {
                    deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
                    return this;
                    //tuple[0] 对应deferred[resolve | reject | notify ]三种状态
                };
                deferred[tuple[0] + 'With'] = list.fireWith;
            });
            //在each中将状态（resolve等）设置为Callbacks的fire方法，将对应的方法（done）设置为Callbacks的add方法，通过if (stateString)将每一个方法（done）调用时确保其它方法（fail）不能再执行，所以在状态为resolve时候我们只能调用done/notify，因为在状态为resolve的情况下fail的实际执行方法add已经被通过uples[i ^ 1][2].disable的方法不能执行
            //之前在想的是如何建立的对应关系，但是突然想明白了每一次循环的时候都会通过var list = tuple[2]新建一个Callback的方法返回的对象，每一对的状态和方法（resolve|done）都是该方法上存在的，也就是说在我们调用resolve的时候，该对象上是没有fail方法的，
            promise.promise(deferred);
            //调用promise的promise方法，传入deferred对象

            if (func) {
                func.call(deferred, deferred);
                //func=$.Deffer()
            }

            return deferred;
        },
        when: function (subordinate) {
            var i = 0,
                resolveValues = core_slice.call(arguments),
                //将传入的伪数组转化为数组对象Array.prototype.slice.call(arguments)
                length = resolveValues.length,

                remaining = length !== 1 || (subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,
                //remaining 起到一个计数器的作用
                //如果传入了参数，subordinate接收第一个参数的值，如果第一个参数有promise方法说明是一个deferred对象，那么将remaining赋值为arguments长度
                //否则的话讲remaining赋值为0

                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

                //updateFunc(i,[empty],用户传入的fn)
                updateFunc = function (i, contexts, values) {
                    return function (value) {
                        //闭包，强调一个闭包的特性，也就是会存储值
                        //在执行updateFunc时，最初我们接受的contexts值是一个通过new Array(length)得到的如[empty × 3]类型的值，for循环每执行一次，该数组都会在对应的位置长传入一个this，而这个this值得到保留，在for循环结束后，最后的contexts会是一个如[this,this,this]这样的数组
                        /*
                        var c = new Array(3)

                        function a(i, context) {
                            return function () {
                                c[i] = context;
                                return c;
                            }
                        }
                        var b = [1, 2, 3]
                        for (var i = 0; i < b.length; i++) {
                            console.log(a(i, b[i])());
                        }
                        */
                        contexts[i] = this;
                        values[i] = arguments.length > 1 ? core_slice.call(arguments) : value;

                        if (values === progressValues) {
                            deferred.notifyWith(contexts, values)
                        } else if (!(--remaining)) {
                            deferred.resolveWith(contexts, values)
                        }
                        //这里的if判断就是我们之前在for循环时对传入的不同的参从而确定我们该走哪一条条件判断，如果value===progressValues成立，那么说明在each循环中我们调用的是progress，因为只有在progress中我们传入的是progressValues，那么我们调用notifyWith方法，如果用户写了$.when().progress()，那么我们会执行该条语句
                        //如果if语句判断不成立，那么在each循环中我们触发的是done方法，而在$.when中我们只有在传入的素有参数都执行完毕之后才能执行done方法，所以我们需要判断计数器remaining目前的状态，!(--remaining)只有在remaining为0的情况下才能为true，那么也就是说如果if (!(--remaining))判断成立说明用户传入的参数都被我们遍历完成并且执行完成了，那么我们再调用deferred.resolveWith(contexts, values)来触发$.when().done()的方法
                    }
                },

                progressValues, progressContexts, resolveContexts;

            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                //判断length大于1的情况，也就是说在这种情况下，用户传入的是多个值
                for (; i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise())) {
                        resolveValues[i].promise()
                            .done(updateFunc(i, resolveContexts, resolveValues))
                            //成功则回调updateFunc
                            .fail(deferred.reject)
                            //只要有一个失败就执行将deferred的状态变为reject
                            .progress(updateFunc(i, progressContexts, resolveValues))
                        //progress代表的是正在执行过程中
                        //这里特别需要注意的一个点，在progress调用updateFunc和done调用updateFunc时唯一的区别就是在末尾传入了不同的参数resolveValues/resolveValues，这一点会直接影响到我们后续when函数的判断，详细的看updateFunc的代码注解
                    } else {
                        --remaining;
                        //每有一个参数不是Deferred对象，那么僵remaining的值减少以，保证remaining的值正好是我们传入的Deferred对象的个数
                    }

                }
            }

            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }
            //这个if判断生效的情况，1 用户没有传入参数，2 用户传入的都是非deferred对象的参数
            //1. 不传参 remaining值为0，!0 为 true，那么此时deferred对象是一个$.Deferred对象，直接调用resolveWith方法，所以会直接执行when().done().fail()中的done
            //2. 传入不是Deferred对象情况下，同样remaining值为0，走同样的方法

            return deferred.promise();
            //如果传入的是一个deferred参数，并且该值是一个Deferred对象的情况下，直接返回该值的promise()，调用后续promise方法即可

        }
    })


    //data方法
    //使用方法
    /*
    const box = $("#box");
    box.data("name", "tom");
    console.log(box.data("name"));
    $.data(box, "age", "18")
    console.log($.data(box, "age"));
    box.data({"name": "tom", "age": "18"})
    */
    //很多人在使用data方法时可能会认为该方法与prop、attr方法类似，虽然实际上使用的方式确实是类似的，但是data其实是用来做一个大的数据挂载到dom对象上的时候的处理，如果我们我们将大量的数据直接挂载到dom对象上时，很有可能会导致内存泄露的问题，data就是为了处理这种情况而设计的
    //其实data的实际原理就是利用映射的方式，例如我们在将数据挂载到某个dom对象上的时候，实际上jquery会将该数据设置为data方法中一个对象cache的属性，并为该dom元素设置一个唯一的识别id，并且为dom元素添加expando属性来标识该dom元素的id值，在我们获取的时候去找到该对象并在该对象中查找到dom对应的id，然后再去获取对应的属性值，这样的话就避免了直接在dom上直接挂载属性可能会出现的问题
    //也就是说如果我们使用data方法，在jquery内部的话实际上是进行了一系列的转换，首先会为dom元素添加一个属性，这个属性的值是一个对应这这cache对象上的识别id
    /*
     $.data(box, "name", "tom");
     box元素会变为
     <div id="box" jQuery203087517200126743070.5039236721524551="1"></div>
     这里的1就是cache对象上box的映射的id值，我们在获取box上由data添加的值得时候实际都会去在cache对象上查找到1这个属性，然后在查找对应的如name这个key键的value值
     那么我们再添加一个data语句
      $.data(box, "age", 18);
      $.data(document.body, "name", "tom");
      然后我们打印出Data对象，可以得到如下的一个结果
      Data{
      cache:{
        1:{name: "tom", age: 18},
        2:{name: "tom"},
        0:(...),
      }
        expando:"jQuery203087517200126743070.5039236721524551"
        .....
      }
    */
    var data_user, data_priv,
        rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rmultiDash = /([A-Z])/g;

    function Data() {

        Object.defineProperty(this.cache = {}, 0, {
            get: function () {
                return {};
            }
        });
        //关于Object.defineProperty方法可以查看，如果不能理解的话这里可以直接理解为在这里的作用就是为了使this.cache对象上的0属性不能被修改，在Data方法中0是作为一个当我们想要在比如文本节点上设置data时会直接返回{}，所以要保证0属性是不能被修改的

        this.expando = jQuery.expando + Math.random();
        //jQuery.expando 本身就是一个用来获取当前jquery版本号和一个随机数相加的值，这里再一次和一个随机数相加就是为了能够最大概率上的确保this.expando得到的是一个唯一的值
        //额，多说一句，jQuery.expando的随机数是在载入jquery的时候已经产生的，这里获取的随机数是在调用Data方法时候产生的，两个是不一样的
    }

    Data.uid = 1;
    //accepts 用来判断是否是文本等节点类型
    Data.accepts = function (owner) {
        return owner.nodeType ?
            owner.nodeType === 1 || owner.nodeType === 9 : true;
    }
    // nodeType 判断节点类型 1表示是元素节点，9表示是文档节点（document）,这里我们直接判断如果传入的元素有节点的情况下除了1和9，其它类型都返回false
    //这里首先判断传入的元素具不具有nodeType属性，不具有直接返回true($("div"))
    Data.prototype = {
        //key方法用来为元素分配cache对象上对应的1、2等key值，在执行完key方法之后元素上会被添加一个如jQuery203087517200126743070.5039236721524551=1的属性
        /*
        var a = {},
            b = Math.random();
        a[b] = {value: 1};
        Object.defineProperties(box, a);

        console.log(box[b]);
        */
        key: function (owner) {
            if (!Data.accepts(owner)) {
                return 0;
            }
            //如果我们传入的是一个其它节点类型的元素，那么直接将该元素key值设置为0并返回
            //这个流程控制的触发条件，例如下面的这段代码
            /*
            <div id="box">test</div>
            $.data(box.firstChild,"name","18");
            */

            var descriptor = {},
                unlock = owner[this.expando];
            //unlock 用来判断当前传入的对象上是否具有expando属性
            if (!unlock) {
                unlock = Data.uid++;
                //如果当前对象不存在expando属性，说明该对象之前没有使用过data方法，uid++，设置一个新的id值来对应该元素在cache对象上的key值
                //这里注意的是 i++和++i的区别，i++会先赋值再自增，而++i会先自增再赋值，也就是说如果是首次执行那么unlock为1，然后执行完之后Data.uid会变为2

                try {
                    descriptor[this.expando] = {value: unlock};
                    Object.defineProperties(owner, descriptor);
                    //Object.defineProperties方法和Object.defineProperty不同在于我们可以写入对象的多个属性，写法也略有不同
                    /*
                    const obj = {};
                    Object.defineProperties(obj, {
                        name: {
                            get: function () {
                                console.log("你猜")
                            }
                        },
                        age: {
                            value: 18
                        }
                    })
                     */
                    //我们这里使用defineProperties也是为了不让用户修改我们的expando属性，但是该属性不支持安卓版本4以下，所以这里还是进行了一些兼容性处理
                } catch (e) {
                    descriptor[this.expando] = unlock;
                    jQuery.extend(owner, descriptor);
                    //如果我们的设备不支持defineProperties方法，那么我们就使用extend方法将该属性添加到对象元素上，这样的话用户是有可能修改我们的expando，但是实际上如果用户能够恰好设置一个和我们expando同样名字的属性，这个概率太小了
                }
            }
            //在这个流程控制里做的其实就是一个分配 xxx=1 大概这样的一个过程

            if (!this.cache[unlock]) {
                this.cache[unlock] = {};
            }
            //如果cache对象上没有对应的id值，那么为cache添加一个该id值得属性，然后将其赋值为一个{}
            return unlock;
        },
        //set 方法用来将用户传入的属性、值挂载到在key方法中定义好的如1这样的在cache对象上对应的键上作为值
        set: function (owner, data, value) {
            var prop,
                unlock = this.key(owner),
                //接收在key方法中设置的dom元素在cache对象中对应的id值
                cache = this.cache[unlock];
            //接收cache对象的中dom元素id值的属性

            //data参数是我们在使用data方法中传入的要设置的属性
            //value参数就是我们在使用data方法中传入的要设置的值
            if (typeof data === "string") {
                cache[data] = value;
            } else {
                if (jQuery.isEmptyObject(cache)) {
                    jQuery.extend(this.cache[unlock], data)
                } else {
                    for (prop in data) {
                        cache[prop] = data[prop];
                    }
                }
            }
            //判断我们传入属性:值的形式是以对象的格式{"name":"tom"}传入的，还是以字符"name","tom"传入的，然后采用不同方式
            // console.log(this) 可以在这里打印this，来观察Data对象
            return cache;
        },
        //get 方法用于获取元素上对应的value值
        get: function (owner, key) {
            //获取data上设置的某个属性的值
            var cache = this.cache[this.key(owner)];
            // cache接收dom对象对应的chache上的id值的{}值
            return key === undefined ?
                cache : cache[key];
            //如果key值存在，那么返回对应的value值。不存在，返回整个cache对象
        },
        //整合了data的get和set方法
        access: function (owner, key, value) {
            var stored;
            //柯里化的写法，根据用户是否传入了value值来决定调用get还是set方法
            if (key === undefined ||
                ((key && typeof key === 'string') && value === undefined)) {

                stored = this.get(owner, key);

                return stored !== undefined ?
                    stored : this.get(owner, jQuery.camelCase(key));
                //如果我们判断用户没有传入key值或者用户只传入了key，那么调用get方法，如果通过该key值获取到了值就将该值返回，如果没有，那么尝试将key转换为驼峰写法再调用一次get方法
            }

            this.set(owner, key, value);
            return value !== undefined ? value : key;
            //否则的话调用set方法，如果用户传入了value值，那么返回用户传入的value值，否则的话返回用户传入的key值
        },
        //删除用户指定的元素上挂载的属性
        remove: function (owner, key) {
            var i, name, camel,
                unlock = this.key(owner),
                cache = this.cache[unlock];
            // unlock   获取元素上设置的id值 cache   获取cache对象上id对应的对象

            if (key == undefined) {
                this.cache[unlock] = {};
                //如果用户没有指定key值，那么默认清空元素对应的id值在cache上的value
            } else {
                if (jQuery.isArray(key)) {
                    name = key.concat(key.map(jQuery.camelCase))
                    //如果用户传入的是一个数组，jQuery不仅会查找用户输入的内容，同时也会通过camelCase方法将用户输入的属性转换为驼峰的写法并且也查找一遍
                    //这里注意的是map方法会自动为回调函数中依次传入三个参数：数组元素，元素索引，原数组本身，所以这里我们不需要在camelCase方法中传入参数
                    /*
                        const arr = ["first","last"];
                        function callback() {
                            console.log(arguments[0]);
                        }
                        arr.map(callback); //"first","last"
                    */
                } else {
                    camel = jQuery.camelCase(key);

                    if (key in cache) {
                        name = [key, camel];
                    } else {
                        name = camel;

                        name = name in cache ?
                            [name] : (name.match(core_rnotwhite) || []);
                    }
                    //如果用户输入的不是一个数组，那么魔人认为用户输入的是字符串，判断该字符是否是cache对象上的key值，如果是的话，和该字符串的驼峰写法一起添加到name数组中，如果不是，用name接收该字符串的驼峰写法，然后判断驼峰写法是不是cache对象的key值，如果是的话将驼峰写法添加到name数组中，如果不是的话
                }
            }
            i = name.length;
            while (i--) {
                delete cache[name[i]];
            }
            //删除掉对应的cache中key值
        },
        hasDate: function (owner) {
            return !jQuery.isEmptyObject(
                this.cache[owner[this.expando]]
            )
            //判断某个元素上是否设置了data属性
        },
        discard: function (owner) {
            if (owner[this.expando]) {
                delete this.cache[owner[this.expando]]
            }
            //清空元素上的data属性
        }
    };

    data_user = new Data();
    data_priv = new Data();

    jQuery.extend({
        acceptData: Data.accepts,

        hasData: function (elem) {
            return data_user.hasData(elem) || data_priv.hasData(elem);
        },

        removeData: function (elem, name, data) {
            return data_user.access(elem, name)
        },

        _data: function (elem, name, data) {
            return data_priv.access(elem, name, data);
        },

        _removeData: function (elem, name) {
            data_priv.remove(elem, name)
        }
    });

    jQuery.fn.extend({
        data: function (key, value) {
            var attrs, name,
                elem = this[0],
                //这里设置elem只接收调用者的第一项，也是jQuery的一个思想，例如我们$("div").height()，也只会获取第一个div的高度
                i = 0,
                data = null;

            if (key === undefined) {
                if (this.length) {
                    data = data_user.get(elem);
                    //如果key值是undefined，说明用户没有传入key，value，在判断调用者是合法的情况下，直接调用get方法不传入第二个参数，用data接收cache对象上该元素的对应值

                    //下面的这个判断是针对h5中的新属性data-
                    /*
                    h5 允许我们为元素通过data-的形式为元素添加自定义属性，并且提供了dataset接口来获取我们添加的属性
                    <div id="box" data-index="1">test</div>
                    console.log(box.dataset.index) // 1
                    但是jQuery认为，我们通过data-的形式设置的属性也应该被data方法获取，所以做了下面的处理
                    */
                    if (elem.nodeType === 1 && !data_priv.get(elem, "hasDataAttrs")) {
                        // 判断当前节点是一个元素节点并且该节点上不存在hasDataAttrs属性，说明没有获取过该元素节点的data-
                        attr = elem.attributes;
                        //attributes是用来获取元素上所有属性已经值的对象集合的方法
                        for (; i < attrs.length; i++) {
                            name = attr[i].name;

                            if (name.indexOf("data-") === 0) {
                                //如果条件判断成立，那么说明该属性是以data-开头的
                                name = jQuery.camelCase(name.slice(5));
                                dataAttr(elem, name, data[name]);
                                //截取掉data-，将剩余的部分转换为驼峰的格式，调用dataAttr方法
                            }
                        }
                        data_priv.set(elem, "hasDataAttrs", true);
                        //微元素添加hanDataAttrs属性，将元素标记为已经获取过data-值的元素
                    }
                }
                return data;
            }

            if (typeof key === "object") {
                //如果用户是通过对象的格式来为元素设置data
                return this.each(function () {
                    data_user.set(this, key)
                })
            }

            // 如果上面的条件判断都不成立，使用了access操作（46节视频）
            return jQuery.access(this, function (value) {
                var data,
                    camelKey = jQuery.camelCase(key);

                if (elem && value === undefined) {

                    //首先判断用户传入的原始的key可不可以获取到值，可以的话返回该值
                    data = data_user.get(elem, key);
                    if (data !== undefined) {
                        return data;
                    }
                    //如果原始的key值获取不到，那么将原始的key转换为驼峰格式再次尝试获取
                    data = data_user.get(elem, camelKey);

                    if (data !== undefined) {
                        return data;
                    }

                    //如果面的两种格式都还不能获取到，那么尝试获取H5的data-属性的
                    data = dataAttr(elem, camelKey, undefined);
                    if (data !== undefined) {
                        return data;
                    }
                    return;
                }


                this.each(function () {
                    var data = data_user.get(this, camelKey);

                    data_user.set(this, camelKey, value);

                    if (key.indexOf("-") !== -1 && data !== undefined) {
                        data_user.set(this, key, value)
                    }
                })

            }, null, value, arguments.length > 1, null, true)

        },
        removeData: function (key) {
            return this.each(function () {
                data_user.remove(this, key);
            })
        }
    })

    function dataAttr(elem, key, data) {
        var name;

        if (data === undefined && elem.nodeType === 1) {
            //data 是undefined，说明在元素在cache对象上没有存在和data-相同名称的属性
            name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
            //rmultiDash是一个正则，表示检索大写字母，这里我们将传入dataAttr方法中的key中的大写字母前面添加"-"，并且和data-拼接，然后转换为小写
            data = elem.getAttribute(name);
            //获取设置的h5新属性的值
            if (typeof data === "string") {
                try {
                    data = data === "true" ? true :
                        data === "false" ? false :
                            data === "null" ? null :
                                +data + "" === data ? +data :
                                    rbrace.test(data) ? JSON.parse(data) :
                                        data;
                    //这里是为了处理，如果用户设置了例如<div data-bool="true">的情况，我们要将字符格式的true存储为布尔格式的，后面的数字，对象等格式也都是同理
                    //  +data + "" === data ? +data 如果用户传入的是一个数字，+data会将字符串格式的数字转换为Number格式这里之所以要做成   +data + "" === data   这样一个判断是因为用户如果传入一个a100这样的字符串那么得到一个NAN，这样等式不成立，进行后续的处理，如果等式成立说明用户传入的是一个字符包裹的数字，返回通过+号隐式转换的Number格式的数字即可
                } catch (e) {
                }

                data_user.set(elem, key, data);
                //为元素设置属性，属性名为data-后的字符，值为获取到的data值
            } else {
                data = undefined;
            }
            return data;
        }
    }

    //暂时先跳过
    //这里是queue方法，主要是用来对多个异步进行管理，这里也是类似于队列的先进先出概念，先被添加的函数会被先执行，可以想象为queue是数组中的push操作，dequeue是数组中shift操作
    /*
    function a() {
        console.log("a")
    }

    function b() {
        console.log("b");
    }

    $.queue(document, "first", [b, a]);
    $.dequeue(document, "first");
    $.dequeue(document, "first");
    */

    jQuery.extend({
        //queue方法主要做的是将我们在方法中传入的函数添加到一个数组中
        queue: function (elem, type, data) {
            var queue;

            if (elem) {
                //判断用户是否传入了参数
                type = (type || "fx") + "queue";
                //默认的type值为fxqueue如果用户传入了type，那么type值为用户传入值+"queue"
                queue = data_priv.get(elem, type);
                //这里内部实际调用的还是Data的get方法，由于我们传入了type值，所以在get方法中返回了cache[type]的值，如果是一个首次使用type值，那么queue值为undefined，如果不是首次使用的type值，那么会返回一个!queue为false的值
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = data_priv.access(elem, type, jQuery.makeArray(data))
                        //首先通过makeArray方法将我们传入的函数添加到一个数组中，然后将该数组赋值为cache对象上elem元素对应的kay值的type键名的value值
                        //这里注意，如果我们使用相同的type类型，但是后面以数组的格式传入函数，那么会将之前的传入结果覆盖掉
                        /*
                        function a() {
                            console.log("a");
                        }
                        function b() {
                            console.log("b");
                        }
                        jQuery.queue(document,"test",a);
                        jQuery.queue(document,"test",[b]);
                        jQuery.dequeue(document,"test"); //b
                        */
                    } else {
                        queue.push(data);
                        //如果不是第一次使用该type,那么直接将我们传入的函数添加到queue中
                    }
                }
                return queue || [];
                //这里如果用户没有传入data，也就是方法，直接返回queue这个方法集合，也就是说我们可以使用queue来获取用户已经添加到队列中的方法
                /*
                console.log(document,"test")
                */
            }
        },
        dequeue: function (elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks(elem, type),
                next = function () {
                    jQuery.dequeue(elem, type);
                };

            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }

            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                delete hooks.stop();
                fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        },
        _queueHooks: function (elem, type) {
            var key = type + "queueHooks";
            return data_priv.get(elem, key) || data_priv.access(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function () {
                    data_priv.remove(elem, [type + 'queue', key])
                })
            })
        }
    })

    var nodeHook, boolHook,
        rclass = /[\t\r\n\f]/g,
        rreturn = /\r/g,
        rfocusable = /^(?:input|select|textarea|button)$/i;

    jQuery.fn.extend({
        attr: function (name, value) {
            return jQuery.access(this, jQuery.attr, name, value, arguments.length > 1)
        },
        removeAttr: function () {
            return this.each(function () {
                jQuery.removeAttr(this, name)
            })
        },
        prop: function (name, value) {
            return jQuery.access(this, jQuery.prop, name, value, arguments.length > 1)
        },
        removeProp: function (name) {
            return this.each(function () {
                delete this[jQuery.propFix[name] || name]
            })
        }
        //delete 操作符 表示删除
    })

    jQuery.extend({

        attr: function (elem, name, value) {
            var hooks, ret,
                nType = elem.nodeType;

            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            //如果元素类型是文本、注释、属性那么这些类型是没有办法进行属性值设置/获取的，直接return
            if (typeof elem.getAttribute === core_strundefined) {
                return jQuery.prop(elem, name, value)
            }
            //core_strundefined 就是 undefined
            //如果元素不存在getAttribute方法，那么该元素可能为document等，这些元素节点是不能通过getAttribute/setAttribute方法设置/获取属性值的，但是可以通过 . 或者 [] 的方式来进行设置，所以这里通过prop的方法进行设置

            if (nType !== 1 || jQuery.isXMLDoc(elem)) {
                name = name.toLowerCase();
                hooks = jQuery.attrHoks[name] ||
                    (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
            }
            //这里是ie9和ie10的一个兼容性问题的处理，有兴趣的可以看下，但是没什么必要，有浪费时间的嫌疑
            //在ie9/ie10下如果是radio标签 ，那么如果我们使用getAttribute方法会存在一个问题，如果我们先为一个input标签设置属性，值，然后再去设置type类型为radio，那么会有兼容性问题，我们得到的会是'on'，这个问题只有在ie下有，而且也只有设置type属性时才有这个问题

            if (value !== undefined) {
                //如果value传入了值，那么说明我们要进行的是set操作
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                }
                    //这里这个if判断是一个这样的情况
                    /*
                    $("#box").attr("index", "1").attr("index", null);
                    console.log(box); //<div id='box'>，index属性被删除了
                    */
                //也就是说如果我们在attr中在value的位置上传入一个null，那么代表要将该属性直接删除掉，所以这里调用的是removeAttr的方法
                else if (hooks && 'set' in hooks && (ret == hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                    //调用原生的方法，然后将value值返回，这里将value做了一个字符类型的转换
                }
            } else if (hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            } else {
                ret = jQuery.find.attr(elem, name);
                //jQuery.find.attr 该方法是一个在选择器部分封装的方法，主要是解决getAttribute的兼容性问题，这里可以看做就是getAttribute方法
                return ret === null ?
                    undefined :
                    ret;
                //如果我们能通过getAttribute获取到元素的属性值，那么返回该值，没有的话则返回null
            }
        },
        removeAttr: function (elem, value) {
            var name, propName,
                i = 0,
                attrNames = value && value.match(core_rnotwhite);
            //core_rnotwhite = /\S+/g, 这个正则用来匹配字符串中非空的所有元素
            //match方法会将匹配的结果存放到一个数组中返回，这里是因为在jQuery中我们有一种写法是 $('div').removeAttr('index src');
            if (attrNames && elem.nodeType === 1) {
                //首先要判断用户是不是传入value，也就是要删除的属性值，并且调用必须是一个element元素
                while ((name = attrNames[i++])) {
                    //这个写法是比较帅的，转换为for循环如下  for(;name=attrNames[i];i++)
                    propName = jQuery.propFix[name] || name;
                    //propFix 主要是用来对jQuery中的保留字做一个处理，例如class，for,在js中如果要对这两个属性进行设置或者获取，那么要转化为className，htmlFor的格式，这里htmlFor不常见，常用的用法是获取/设置label的for属性
                    /*
                    <label id="label">click</label>
                    <input type="radio" id="male" value="male">

                    document.querySelector('#label').htmlFor='male'
                    console.log(document.querySelector('#label').htmlFor);
                    */
                    //jQuery这里做了一个兼容性处理，如果用户输入了class，那么转换为className
                    if (jQuery.expr.match.bool.test(name)) {
                        elem[propName] = false;
                    }
                    //这里的条件判断是用来处理原生属性的如checked，在删除这些属性的时候会先将属性值设置为false，确保该属性不再生效
                    //document.querySelector('#male').checked = false;
                    elem.removeAttribute(name)
                    //在经过上面的一些列转换后，保证原生的方法不会出现兼容问题，使用原生方法删除用户传入的属性
                }
            }
        },
        //兼容ie 9 、10 的写法，略
        attrHooks: {
            type: {
                set: function (elem, value) {
                    if (!jQuery.support radioValue && value === 'radio' && jQuery.nodeName(elem, 'input')
                )
                    {
                        var val = elem.value;
                        elem.setAttribute('type', value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function (elem, name, value) {
            var ret, hooks, notxml,
                nType = elem.nodeType;

            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
                //nodeType 类型为3 表示为文本节点 为8表示为注释节点 为2表示为属性值 如果是这几个类型的节点那么直接返回
            }
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }
            //判断是不是xml格式的，如果不是的话那么需要做兼容性处理，首先转换用户输入的name，然后使用propHooks处理需要兼容的属性

            if (value !== undefined) {
                return hooks && 'set' in hooks && (ret = hooks.set(elem, value, name)) !== undefined ?
                    ret :
                    (elem[name] = value);
            } else {
                return hooks && 'get' in hooks && (ret = hooks.get(elem, name)) !== null ?
                    ret :
                    elem[name]
            }
            //    这里就很简单了，三元表达的条件都是判断是不是有兼容性问题，如果有的话做兼容处理，没有的话直接调用原生的方法进行设置/获取操作
            //    其实prop方法的核心就是元素['属性']='值'来进行设置，元素['属性']的方法来进行获取
        },
        removeProp: function (name) {
            return this.each(function () {
                delete this[jQuery.propFix[name] || name];
            })
        },
        propHooks: {
            tableIndex: {
                //tabindex属性可以用来控制切换光标的顺序，正常情况下我们在存在多个光标的页面按tab键光标会优先切换到位置靠上的input，但是在设置了tabindex后，会优先切换到tabindex值大的input
                /*
                <input type="text">
                <input type="text" tabIndex="2">
                <input type="text" tabIndex="1">
                */
                //在ie下有兼容性问题，ie会认为div等元素也具有tabindex属性，这里的兼容处理就是检测到如果不符合rfocusable条件或者没有href属性直接返回-1
                get: function (elem) {
                    return elem.hasAttribute('tabindex') || rfocusable.test(elem.nodeName) || elem.href ?
                        elem.tabIndex :
                        -1;
                }
            }
        },
        //    prop 还有一部分兼容ie的写法，这个就略过了

        addClass: function (value) {
            var classes, elem, cur, clazz, j,
                i = 0,
                len = this.length,
                proceed = typeof value === 'string' && value;
            //这里的写法，如果value的类型是字符串类型，那么proceed的值就是value的值，如果value不是字符串，那么proceed的值为false
            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).addClass(value.call(this, j, this.className))
                })

                //这里的情况是addClass的一种添加方式，我们可以在为元素添加属性时传入一个回调函数，该函数的参数为调用者的下标和当前调用者的className，下标从0开始，例如存在一种情况需要我们为多组div添加有规律的下标，我们可以使用回调函数的方法来添加样式
                /*
                    html部分
                    <div></div>
                    <div></div>
                    <div></div>

                    script部分
                    $('div').addClass(function (index,className) {
                          return 'box'+index
                    })
                */
                //此时查看div元素会发现，分别添加了box0、box1、box2属性
            }

            if (proceed) { //字符串类型
                classes = (value || '').match(core_rnotwhite) || [];

                for (; i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ?
                            (' ' + elem.className + ' ').replace(rclass, ' ') :
                            ' '
                    );
                    //判断调用者的类型，并且是否具有className属性，如果有的话将属性中的回车等转义符替换为' '
                    //rclass 正则，匹配字符串中的制表符，回车，翻页等转义字符，这里主要是防止由于用户在添加class时候用tab产生的空格，导致出现问题
                    if (cur) { //这个条件判断是一定成立的，因为在js中' '也会返回true
                        j = 0;
                        while ((clazz = classes[j++])) {
                            if (cur.indexOf(' ' + clazz + ' ') < 0) {
                                cur += clazz + ' ';
                            }
                            //判断如果当前元素的className不存在要添加的样式，那么将该样式添加到cur
                        }
                        elem.className = jQuery.trim(cur);
                        //设置元素的className为cur
                    }
                }
            }
            return this; //链式操作
        },
        removeClass: function (value) {
            var classes, elem, cur, clazz, j,
                i = 0,
                len = this.length,
                proceed = arguments.length === 0 || typeof value === 'string' && value;
            //这里的执行顺序是先执行typeof value === 'string' && value，如果该值不是false，那么在argument的length属性不为0的情况下，取该值，如果用户没有传入参数，那么取值true
            if (jQuery.isFunction(value)) {
                return this.each(function (j) {
                    jQuery(this).removeClass(value.call(this, j, this.className))
                });
            }
            if (proceed) {
                classes = (value || '').match(core_rnotwhite) || [];
                for (; i > len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ? ('' + elem.className + '').replace(rclass, '')
                            : ''
                    );

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            while (cur.indexOf('' + clazz + '') >= 0) {
                                cur = cur.replace('' + clazz + '', '');
                                //removeClass的操作和addClass操作是大概相同的，区别在于这里是将属性名替换为''
                            }
                        }

                        elem.className = value ? jQuery.trim(cur) : '';
                        //这里写法是如果用户没有传入value值，直接将调用者的className全部赋值为空，如果有的话，将className属性的前后空格去掉，这里就是如果用户不传入参数时将整个调用者属性全部删除
                    }
                }
            }
            return this;
        },
        toggleClass: function (value, stateVal) {
            var type = typeof value;
            //这里解释一下第二个参数的作用，如过我们传入第二个参数，那么在运行时会判断，如果传入的是true，那么toggleClass会只执行添加操作，如果传入的是false，那么toggleClass就只执行删除操作

            if (typeof stateVal === 'boolean' && type === 'string') {

                return stateVal ? this.addClass(value) : this.removeClass(value);
                //如果传入了第二个参数，那么在执行时会先判断该参数值，然后根据值类型的不同来分别执行addClass/removeClass操作
            }

            if (jQuery.isFunction(value)) {
                return this.each(function (i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal)
                })
            }

            return this.each(function () {
                if (type === 'string') {
                    var className,
                        i = 0,
                        self = jQuery(this),
                        classNames = value.match(core_rnotwhite) || [];

                    while ((className = classNames[i++])) {
                        if (self.hasClass(className)) {
                            self.removeClass(className);
                        } else {
                            self.addClass(className);
                        }
                    }
                    //遍历每一个调用者，然后遍历每一个传入的类名，如果调用者本身已经存在该类名，那么该调用者调用removeClass方法，删除自身的同名属性，否则的话调用addClass方法添加该属性
                } else if (type === core_strundefined || type === 'boolean') {
                    //这里是toggleClass的另一种使用方法，如果传入的是false或者是undefined那么代表将调用者现有的属性全部删除，但是jQuery会将这些删除的属性保留，后期如果想要恢复，再在toggleClass中传入true即可恢复
                    /*

                    */
                    //core_strundefined表示undefined
                    if (this.className) {
                        data_priv.set(this, '_className', this.className);
                    }
                }
            })
        }
    })

    jQuery.each([
        'tabIndex',
        'readOnly',
        'maxLength',
        'cellSpacing',
        'rowSpan',
        'colSpan',
        'useMap',
        'frameBorder',
        'contentEditable'
    ], function () {
        jQuery.propFix[this.toLowerCase()] = this;
    })
    //  这里对用户可能输入属性值为小写的情况做一下处理，保证即使用户输入的值为小写，也可以找到对应的属性
})(window)


