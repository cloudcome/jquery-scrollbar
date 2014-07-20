# jquery-scrollbar [![spm version](http://spmjs.io/badge/jquery-scrollbar)](http://spmjs.io/package/jquery-scrollbar)

AUTHOR WEBSITE: [http://ydr.me/](http://ydr.me/)

jquery.fn.scrollbar 自定义滚动条

**五星提示：当前脚本未作优化、未完工，请勿用在生产环境**

__IT IS [A SPM PACKAGE](http://spmjs.io/package/jquery-scrollbar).__





#USAGE
```
var $ = require('jquery');
require('jquery-mousewheel')($);
require('jquery-drag')($);
require('jquery-scrollbar.css');
require('jquery-scrollbar')($);


// 1、初始化
$('#demo').scrollbar({...});


// 2、获取位置
$('#demo').scrollbar('x');
$('#demo').scrollbar('y');


// 3、定点滚动
$('#demo').scrollbar('x', x);
$('#demo').scrollbar('y', y);
$('#demo').scrollbar('top');
$('#demo').scrollbar('right');
$('#demo').scrollbar('bottom');
$('#demo').scrollbar('left');


// 4、再次渲染
$('#demo').scrollbar('render',{
  width:100,
  height:100,
});
```



#OPTIONS
```
$.fn.scrollbar.defaults = {
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
