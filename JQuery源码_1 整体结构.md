JQuery整体结构

```javascript
(function(window,undefined){
  //代码
}(window))
```

JQuery最外层使用的匿名函数自执行结构，为了最大程度避免代码污染，防止冲突

传入参数window的主要目的有两点

1. 在尾端传入的参数是实参，表明在函数执行时第一个参数是window，这样就避免了在内部使用window时再次去外层查找，在js中window属于最顶层的变量，而根据js原型链的查找原则，函数会优先查找本身的变量，在查找不到的情况下逐步向上查找，所以如果在window没有作为参数传入到函数内部的情况下，会从底层一直查找到最顶层，浪费大量性能，在形参中传入第二个参数undefined，主要是考虑到在低版本浏览器中undefined的值是可以改变的

   ```javascript
   //IE7
   undefined=10;
   console.log(undefined); //10
   ```

   在代码中我们可能会需要判断变量值===undefined的情况，为了避免我们获取的undefined的值是被改变过的值，我们在形参中传入一个参数，由于在实参中没有传入对应的值，那么这个值本身就是undefined，所以我们在使用undefined时就可以直接使用该值，而不用担心是否在操作改变过的undefined

2. 为压缩代码做考虑，如果window不是参数而只是一个变量，那么window字段将无法被压缩，但如果只是作为形参的情况下可以被压缩为单字符，实际上我们看压缩后的代码。window被压缩成了e

**JQuery返回的是一个对象**，JQuery采用的是面向对象的写法，在我们平常使用面向对象的写法大概如下

```javascript
function A(){}
A.prototype.init=function(){ }

var a=new A();
a.init();
```

而在使用JQuery时我们不需要new $()的形式来调用是因为JQuery采用了工厂模式，使我们可以采用无"new"的形式来创建对象，大概写法如下

```javascript
function JQuery(){
  rrturn new Jquery.fn.init();
}
```

这样的好处在于

1. 我们直接执行了init的初始化方法
2. 直接返回一个JQuery的对象，用户不需要调用new JQuery( )后再来调用JQuery的方法

但我们会发现在JQuery中返回的是JQuery原型上的init方法，但是JQuery中的其他方法是写在JQuery的prototype上的，那么是如何在init上调用其它方法的呢，主要是通过下面代码

```javascript
//96行
JQuery.fn=JQuery.prototype={
  constructor:JQuery,
  //...
}
//指定JQuery的fn就是JQuery的原型对象

//283行
JQuery.fn.init.prototype=JQuery.fn；
```

JQuery通过将init的原型赋值为JQuery的原型，所以通过new JQuery.fn.init()出的对象可以直接使用JQuery原型上的方法

在8826行将JQuery对象挂载到window下

```javascript
window.JQuery=window.$=JQuery;
```