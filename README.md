# jquery-scrollbar

---

[![spm version](http://spmjs.io/badge/jquery-scrollbar)](http://spmjs.io/package/jquery-scrollbar)

jQuery 自定义滚动条插件

---

## Install

```
$ spm install jquery-scrollbar --save
```

## Usage

It is very easy to use this module.

```js
// require jquery
var $ = require('jquery');

// require jquery-mousewheel
require('jquery-mousewheel')($);

// require jquery-drag
require('jquery-drag')($);

// extend jquery.fn
require('jquery-scrollbar')($);

// use
$('#demo').scrollbar();
```


## Api

### Options

```js
$.fn.drag.scrollbar = {
    // 区域的宽度
    width: 'auto',
    // 区域的高度
    height: 'auto',
    // 鼠标滚轮绑定轴向，默认y轴
    mousewheelAsix: 'y',
    // 定向滚动的动画时间
    duration: 345,
    // 每次滚动的速度，单位px/次
    speed: 30,
    // x轴滚动条最小宽度
    minWidth: 100,
    // y轴滚动条最小宽度
    minHeight: 100,
    // 是否可以越过边界
    // true: 在容器内滚动条到达边界后，将把鼠标滚轮事件交给外部容器
    // false: 在容器内滚动鼠标事件一直紧抓不放
    canCrossBoundary: !0,
    // x轴滚动回调
    // this：element
    // 参数1：x轴方向滚动区域占比
    onscrollx: $.noop,
    // y轴滚动回调
    // this：element
    // 参数1：y轴方向滚动区域占比
    onscrolly: $.noop
};
```


### Functions

#### x
```js
// 滚动条在x轴的比例
$('#demo').scrollbar('x');

// 设置滚动条在x轴的比例
$('#demo').scrollbar('x', .5);
```


#### y
```js
// 滚动条在y轴的比例
$('#demo').scrollbar('y');

// 设置滚动条在y轴的比例
$('#demo').scrollbar('y', .5);
```


#### top
```js
// 设置滚动条到最顶部
$('#demo').scrollbar('top');
```


#### right
```js
// 设置滚动条到最右边
$('#demo').scrollbar('right');
```

#### bottom
```js
// 设置滚动条到最底部
$('#demo').scrollbar('bottom');
```

#### left
```js
// 设置滚动条到最左边
$('#demo').scrollbar('left');
```


#### options
```js
// get options
$('#demo').scrollbar('options');

// set options
$('#demo').scrollbar('options', 'zIndex', 9999);
$('#demo').scrollbar('options', {
    axis: 'x',
    cursor: 'auto'
});
```


## Demo
[http://spmjs.io/docs/jquery-scrollbar/examples/index.html](http://spmjs.io/docs/jquery-scrollbar/examples/index.html)


## History
[http://spmjs.io/docs/jquery-scrollbar/history.html](http://spmjs.io/docs/jquery-scrollbar/history.html)

