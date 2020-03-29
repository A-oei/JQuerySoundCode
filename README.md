目前来说`jquery`现在已经不能算是一个特别主流的框架，在现在数据驱动的理念下，`Vue`、`React`是目前的热门常用框架，但是个人感觉，对于刚入门的同学来说，了解`jquery`的源码对于我们更加深入的理解`javscript`语言有极大的帮助，对于大部分长期使用如`Vue`框架的开发者来说，可能很多人对原生`JavaScript`的开发已经生疏了，适当回顾`JQuery`的源码其实对我们对原生`JavaScript`的理解更加完善

本文分析的`JQuery2.0.3`版本内部实现原理，该版本已经去除了大量的对于旧版本浏览器的兼容性的处理，但是还是有部分源码是对不常见的浏览器进行处理，在看到这部分的时候如果感兴趣可以看一下，也可以直接跳过，个人一直认为学习旧版本浏览器的兼容是最没有收益的，不要在必然要被淘汰技术上浪费太多时间

为了节省篇幅，我们这里不会直接放`jquery`的源码，会在文章中标注出代码是在源码的那个段落，可以配合下面的[jquery官方源码](http://code.jquery.com/jquery-2.0.3.js)进行查看

#### 源码分析章节

* [整体结构]([https://github.com/A-oei/JQuerySoundCode/blob/master/JQuery%E6%BA%90%E7%A0%811(%E6%95%B4%E4%BD%93%E7%BB%93%E6%9E%84).md](https://github.com/A-oei/JQuerySoundCode/blob/master/JQuery源码1(整体结构).md)

* [init方法](https://github.com/A-oei/JQuerySoundCode/blob/master/JQuery%E6%BA%90%E7%A0%812(init%E6%96%B9%E6%B3%95).md)

  