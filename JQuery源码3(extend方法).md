jQuery中的`extend`方法主要实现了继承的功能

我们首先看一下`extend`的几种用法

* 为`JQuery`添加方法

  * 添加工具方法

  ```javascript
  $.extend({
      a:function(){
          alert('a')
      }
  })
  $.a();
  ```

  * 添加实例方法

  ```javascript
  $.fn.extend({
      a:function(){
          console.log('a')
      }
  })
  $().a();
  ```

* 将后续参数的属性、方法追加到第一个参数上

  该方法类似于`Object.assign()`可以理解为`JQuery`中的混合

  ```javascript
  let a={
      name:'tom'
  	},
      b={
          age:18
      },
      c={
          sayHi(){
              console.log('my name is tom')
          }
      };
  $.extend(a,b,c);
  a;//{name:'tom',age:18,sayHi:f}
  ```

* 实现拷贝

  传入的第一个值为`boolean`，默认为`false`为浅拷贝，如果设置为`true`，表示进行深拷贝

  ```javascript
  let a={},
      b={
          tom:{
              age:18
          }
      };
  $.extend(true,a,b);
  a.tom.age=36;
  b.tom.age//18
  ```

同样，实现`extend`方法主要是通过对参数的判断来实现，在jQuery中首先定义了不同的参数

```javascript
  var options,
  	name, src, copy, copyIsArray, clone,
  	target = arguments[0] || {}, 
  	i = 1,
  	length = arguments.length,
  	deep = false;
```

这里我们重点看一下这些参数

* **target** 默认为用户传入的第一个参数，也就是我们要对其进行操作的对象

* **i** 默认设置为`1`，`JQuery`默认我们使用该方法的时候是要做一个拷贝的处理，也就是第一个参数是一个`boolean`参数，所以要在循环的时候跳过第一个参数

* **deep** 默认用户执行浅拷贝的操作

  

jQuery的实现思路是首先判断用户传入的第一个参数也就是`target`的类型，然后控制是否跳过第一个参数遍历其余传入的参数，首先判断用户是否要进行拷贝的操作

```javascript
  if (typeof target === "boolean") {
  	deep = target;
  	target = arguments[1] || {};
  	i = 2;
  }
```

在这里如果用户传入了一个`boolean`值，那么将默认设置的变量进行一个重新赋值，`deep`设置为用户设置的值，`target`设置为用户传入的第二个参数，那么循环也是要从第三个参数开始，所以将`i`的值设置为`2`

```javascript
if (length === i) {
	target = this;
	--i;
}
```

这里如果用户只传入了一个参数或者用户传入了以下的情况

```javascript
$.extend(true,{name:'tom'})
```

上面的写法会导致在第一次的判断中设置了`i=2`，但是由于没有后续的参数，`JQuery`依然会认定这是为`JQuery`上添加方法，所以将`target`设定为`this`，并且将`i`的值转化为`1`然后从第二个参数开始遍历，那么如果用户只传入了一个参数，那么同样执行该操作就会将`i`的值转化为`0`  然后从第一个参数开始遍历，这里的写法是比较巧妙的

在执行完上面这些操作后接下来就开始遍历我们传入的参数然后开始操作，这里涉及到一个深拷贝的问题，那么依然是要判断我们传入的参数中是否有对象或者数组，如果有的话就需要用到递归对参数进行处理

这里涉及到之前定义的一些参数的后续处理，我们来看一下

```javascript
if ((options = arguments[i]) != null) 
```

在`for in`循环中用`options`接收后续参数，如果有值那么对该值进行`for in`循环

```javascript
src = target[name];
copy = options[name];
if (target === copy) {
	continue;
}   
```

在循环中用`copy`存储被遍历者的`value`值，这里是为了防止出现循环引用，例如用户可能传入下面的情况

```javascript
var a={};
$.extend(a,{name:a})
```

如果有这样的情况，那么直接通过`continue`跳出这一次的循环

```javascript
if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) 
```

这里判断用户要进行深拷贝并且后续参数的值不为空并且这个参数的值是一个对象或者数组，那么进行深拷贝操作，这个也是`extend`函数的精华所在

我们先看一下如果不是深拷贝的操作

```javascript
else if (copy !== undefined) {
	target[name] = copy;
}
```

如果不是深拷贝，并且`copy`有值，那么直接在当前目标对象也就是`target`上添加该值

如果是深拷贝，那么首先判断是要对对象还是数组进行深拷贝

```javascript
if (copyIsArray) {}else{}
```

如果是数组

```javascript
copyIsArray = false;
clone = src && jQuery.isArray(src) ? src : [];
```

首先那个变量`copyIsArray`设置为`false`，防止影响下一次的判断，然后给变量`clone`赋值，如果当前对象上存在和后续对象一样的`key`值的值，那么判断当前对象上这个值是不是一个数组，是的话继续保留这个数组，不是的话用一个`[]`替换掉该值，如果是对象也是同样的操作

```javascript
clone = src && jQuery.isPlainObject(src) ? src : {};
```

这里的操作的目的是为了防止下面这样的情况

```javascript
let a={
   arr:[1,2,3] 
},
    b={
        arr:{}
    };
```

如果通过`extend`函数将`a`拷贝到`b`上，那么`b`最后得到的值就会是`arr:{0:1}`

在执行完这些操作后递归`extend`函数

```javascript
target[name] = jQuery.extend(deep, clone, copy);
```

