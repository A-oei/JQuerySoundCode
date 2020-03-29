这一部分开始分析`JQuery`的原型部分代码，在 96-283 部分主要实现了`init`方法，该方法主要用于对`jquery`的选择器做初步的过滤，在接受用户传入的值之后将其转化为**`{0:div,1:div,length:2,...}`**的形式存储

`init`函数接收三个参数，分别作用如下

```javascript
init: function (selector, context, rootJQuery) {
    //select 当前选择的对象
    //context 执行环境的上下文
    //rootJQuery 就是我们使用的$(document)
}
```

#### 用户没有传入select参数

在代码中首先判断用户传入的值的情况，`jquery`可以处理多种用户传入的格式，我们首先要判断用户传入的是不是一个有效的值，如果传入的情况是`$(null)`、`$(undefined)`或者是`$(false)`的情况，那么直接返回`jquery`对象

```javascript
if(!selector) {
    return this
}
```

#### 用户传入的select是字符串

接下来判断用户传入的是否是一个字符串格式的参数，这里可能出现的情况有下几种

```
$("ele"),$("#id"),$(".class"),$("<li></li>")
```

`jQuery`首先会使用`charAt`方法匹配`$(<li></li>)`的情况，方法也很简单，就是匹配传入的字符串开头是否为`<`结尾是否为`>`，然后判断一下字符的长度是否大于3，如果大于3那么我们可以确定传入的不是一个单标签，如果符合，那么用变量`math`先将其存储为特定的格式，其余的情况通过正则`rquickExpr`存储为其他类型的格式，

```javascript
if (selector.charAt(0) == "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
   math = [null, selector, null];
}
```

我们可以看下`rquickExpr`对于其他情况的匹配结果

| 传入格式 |                           转换格式                           |
| :------: | :----------------------------------------------------------: |
|   #id    | ["#id", undefined, "id", index: 0, input: "#id", groups: undefined] |
| "< li >li" | "["< li >li", "< li >", undefined, index: 0, input: "< li >li", groups: undefined]" |
|  .class  |                             null                             |
|          |                                                              |

接下来对`match`的情况进行判断，首先考虑如果`match`存在，并且`match[1]`存在或者用户没有传入了执行环境的上下文，通过上面我们对`match`可能出现的情况我们可以分析出能进入到这个判断的是用户传入了`#id`、`<li>`、`<li>li`的情况

```javascript
if (match && (match[1] || !context)) {}
```

接下来通过判断`match[1]`是否存在继续对传入的参数情况进行筛选，`match[1]`表示用户传入的是`<li>`、`<li>li`的情况，不存在说明用户传入的是`#id`

```javascript
if (match[1]) {} else {}
```

那么首先对第一种情况进行处理

```javascript
context = context instanceof jQuery ? context[0] : context;
```

如果用户传入了`content`参数，如果` context instanceof jQuery`为`true`那么说明用户传入的是`$(coument)`类似的情况，此时的`context[0]`就是原生的`dom`例如`document`

```javascript
jQuery.merge(this, jQuery.parseHTML(
	match[1],
	context && context.nodeType ? context.ownerDocument || context : document,
	true
));
```

在这里我们首先判断`context`是否存在并且具有节点类型，如果符合这个条件的话就使用用户自定义的执行上下文环境，在使用用户自定义的执行上文环境的时候先判断用户传入的是否是一个`iframe`标签，`ownerDocument`是针对`iframe`标签的写法，也就是说如果存在`iframe`标签，`JQuery`会使用`iframe`中的`document`做为执行环境，如果用户没有传入，那么使用默认的`document`作为执行环境上下文

 这里用到了`jQuery.parseHTML`和`jQuery.merge`方法，我们先了解一下这两个方法

* `jQuery.parseHTM`主要用于将字符串转化为数组节点，该方法主要接受三个参数

  * 字符串格式参数

  * 执行的上下文环境

  * 一个布尔值，默认为`false`，表示不允许用户在`$()`方法中创建自己的`script`标签，创建了也会被忽略，为`true`表示允许创建，`script`标签中的方法也会被执行，举个例子

    ```javascript
    let str=`'<script>alert(1)<\/script>`;
    parseHTML(str, window.document,true)
    ```

可以通过例子来查看该方法的执行结果

```javascript
let str='<li>1</li><li>2</li>';
$.parseHTML(str);  //[li,li]
```

* `jQuery.merge`方法是一个内部方法，用来将数组转化成一个对象字面量的格式，举一个例子

```javascript
let arr = ["a", "b"],
  obj = {
  	0: 'c',
  	1: "d",
  	length: 2
  };
$.merge(obj,arr) //{0: "c", 1: "d", 2: "a", 3: "b", length: 4}
```

接下来进一步的筛选，此时能符合的只有`$(#id)`的情况，那么就直接获取到该元素并将为`this`赋值

  ```javascript
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
  ```

筛选完以上情况后就是继续对用户是否传入`context`参数进行筛选

```javascript
else if (!context || context.jQuery) {
     return (context || rootjQuery).find(selector);
}
else{
     return this.constructor(context).find(selector);
}
```

如果用户没有传入`context`参数或者用户传入的执行上下文是一个`JQuery`对象，那么返回`find`方法的值，如果以上方法也都不匹配，通过`this.constructor`返回函数创建实例`Query.fn`确保之后能调用`find`方法并执行，假设我们页面中有一个`#box`的元素，那么我们看一下返回结果

```javascript
$(document).find('#box')
//nit [div#box,length:1, prevObject: init(1), context: document, selector: "#box"]
```

#### 用户传入的select是函数

```javascript
else if (jQuery.isFunction(selector)) {
    return rootjQuery.ready(selector);
}
```

如果用户传入的是一个`functuion`那么会直接将直接调用`ready`方法，所以我们可以看出`$(function(){})` 等同于`$(document).ready(function(){})`

#### 如果用户传入的是一个对象

```javascript
 if (selector.selector !== undefined) {
	this.selector = selector.selector;
	this.context = this.context;
}

return jQuery.makeArray(selector, this);
```



  

  

