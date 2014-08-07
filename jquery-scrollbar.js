/*!
 * jquery.fn.scrollbar
 * @author ydr.me
 * @version 1.2
 * @require jquery-scrollbar.css
 * @require jquery-drag
 * @require jquery-mousewheel
 * 2014年7月3日18:18:53
 */








module.exports = function($) {
    'use strict';

    var udf,
        datakey = 'jquery-scrollbar',
        win = window,
        body = win.document.body,
        isPlaceholderScroll = _isPlaceholderScroll(),
        // @link http://en.wikipedia.org/wiki/DOM_events#Common.2FW3C_events
        reRenderEvent = 'DOMSubtreeModified DOMNodeInserted DOMNodeRemoved DOMNodeRemovedFromDocument DOMNodeInsertedIntoDocument DOMAttrModified DOMCharacterDataModified',
        defaults = {
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


    $.fn.scrollbar = function(settings) {
        // 当前第1个参数为字符串
        var run = $.type(settings) === 'string',
            // 获取运行方法时的其他参数
            args = [].slice.call(arguments, 1),
            // 复制默认配置
            options = $.extend({}, defaults),
            // 运行实例化方法的元素
            $element,
            // 实例化对象
            instance;

        // 运行实例化方法，第1个字符不能是“_”
        // 下划线开始的方法皆为私有方法
        if (run && run[0] !== '_') {
            if (!this.length) return;

            // 只取集合中的第1个元素
            $element = $(this[0]);

            // 获取保存的实例化对象
            instance = $element.data(datakey);

            // 若未保存实例化对象，则先保存实例化对象
            if (!instance) $element.data(datakey, instance = new Constructor($element[0], options)._init());

            // 防止与静态方法重合，只运行原型上的方法
            // 返回原型方法结果，否则返回undefined
            return Constructor.prototype[settings] ? Constructor.prototype[settings].apply(instance, args) : udf;
        }
        // instantiation options
        else if (!run) {
            // 合并参数
            options = $.extend(options, settings);
        }

        return this.each(function() {
            var element = this,
                instance = $(element).data(datakey);

            // 如果没有保存实例
            if (!instance) {
                // 保存实例
                $(element).data(datakey, instance = new Constructor(element, options)._init());
            }
        });
    };


    function Constructor(element, options) {
        var the = this;
        the.$element = $(element);
        the.options = options;
    }

    Constructor.prototype = {
        /**
         * 初始化
         * element => div.container>(element + .bar-x + .bar-y)
         * @return this
         * @version 1.0
         * 2014年7月3日18:30:53
         */
        _init: function() {
            var the = this,
                $element = the.$element,
                elementTagName = $element[0].tagName,
                $container,
                $content,
                $trackX,
                $trackY,
                $thumbX,
                $thumbY;

            if (elementTagName === 'TBODY') {
                $element = $element.closest('table').clone().insertAfter($element.closest('table')).empty().append($element);
            }

            $element.wrap('<div class="' + datakey + '-container"/>');
            $container = $element.parent();

            if (isPlaceholderScroll) {
                $element.wrap('<div class="' + datakey + '-content"/>');
                $content = $element.parent();
                $trackX = $('<div class="' + datakey + '-track-x"/>').appendTo($container);
                $trackY = $('<div class="' + datakey + '-track-y"/>').appendTo($container);
                $thumbX = $('<div class="' + datakey + '-thumb-x"/>').appendTo($trackX);
                $thumbY = $('<div class="' + datakey + '-thumb-y"/>').appendTo($trackY);
            }

            the.$container = $container;
            the.$content = $content;
            the.$trackX = $trackX;
            the.$trackY = $trackY;
            the.$thumbX = $thumbX;
            the.$thumbY = $thumbY;

            // 滑块当前位置
            the.thumbX = 0;
            the.thumbY = 0;

            $element.bind(reRenderEvent, $.proxy(the.render, the));
            the.render();
            return the;
        },



        /**
         * 拖拽滚动条
         * @return this
         * @version 1.0
         * 2014年7月3日19:44:33
         */
        _drag: function() {
            var the = this,
                $trackX = the.$trackX,
                $trackY = the.$trackY,
                $thumbX = the.$thumbX,
                $thumbY = the.$thumbY;

            $thumbX.drag({
                axis: 'x',
                cursor: !1,
                min: {
                    left: 0
                },
                max: {
                    left: the.maxX
                },
                ondragstart: function() {
                    $trackX.addClass('active');
                },
                ondrag: function() {
                    the.thumbX = parseInt($thumbX.css('left'));
                    the._scroll('x', !0);
                },
                ondragend: function() {
                    $trackX.removeClass('active');
                }
            });

            $thumbY.drag({
                axis: 'y',
                cursor: !1,
                min: {
                    top: 0
                },
                max: {
                    top: the.maxY
                },
                ondragstart: function() {
                    $trackY.addClass('active');
                },
                ondrag: function() {
                    the.thumbY = parseInt($thumbY.css('top'));
                    the._scroll('y', !0);
                },
                ondragend: function() {
                    $trackY.removeClass('active');
                }
            });
        },



        /**
         * 滚动鼠标滚轮
         * @return this
         * @version 1.0
         * 2014年7月3日19:44:33
         */
        _wheel: function() {
            if (!isPlaceholderScroll) return;

            var the = this,
                options = the.options,
                $container = the.$container,
                $track = options.mousewheelAsix === 'x' ? the.$trackX : the.$trackY;

            $container.mousewheel({
                onmousewheeltart: function() {
                    $track.addClass('active');
                },
                onmousewheel: function(dir) {
                    if (options.mousewheelAsix === 'x') {
                        the.thumbX += -dir * the.speedX;

                        // 不阻止默认事件
                        // 向上滚动 && 水平距离<=0 || 向下滚动 && 水平距离>=最大值
                        if (dir > 0 && the.thumbX <= 0 || dir < 0 && the.thumbX >= the.maxX) {
                            if (options.canCrossBoundary) $container.mousewheel('preventDefault', !1);
                        } else {
                            if (options.canCrossBoundary) $container.mousewheel('preventDefault', !0);
                        }

                        the._scroll('x');
                    } else {
                        the.thumbY += -dir * the.speedY;

                        // 不阻止默认事件
                        if (dir > 0 && the.thumbY <= 0 || dir < 0 && the.thumbY >= the.maxY) {
                            if (options.canCrossBoundary) $container.mousewheel('preventDefault', !1);
                        } else {
                            if (options.canCrossBoundary) $container.mousewheel('preventDefault', !0);
                        }

                        the._scroll('y');
                    }
                },
                onmousewheelend: function() {
                    $track.removeClass('active');
                }
            });
        },



        /**
         * 单击滚动条，滚动条运动到该位置
         * @return {[type]} [description]
         */
        _click: function() {
            if (!isPlaceholderScroll) return;

            var the = this,
                $trackX = the.$trackX,
                $trackY = the.$trackY;

            $trackX.click(function(e) {
                if (e.target === this) {
                    var clickX = e.pageX - $(this).offset().left,
                        minX = the.thumbX,
                        maxX = minX + 　the.thumbW;

                    the.thumbX = clickX < minX ? clickX : minX + clickX - maxX;
                    the._scroll('x', the.options.duration);
                }
            });

            $trackY.click(function(e) {
                if (e.target === this) {
                    var clickY = e.pageY - $(this).offset().top,
                        minY = the.thumbY,
                        maxY = minY + 　the.thumbH;

                    the.thumbY = clickY < minY ? clickY : minY + clickY - maxY;
                    the._scroll('y', the.options.duration);
                }
            });
        },



        /**
         * 滚动
         * @param  {String}    axis                      轴向，默认y
         * @param  {Number}    durationORdontToggleClass 动画时间或不切换class
         * @param  {Function}  callback                  动画回调，默认为$.noop
         * @return undefined
         * @version 1.0
         * 2014年7月5日01:20:39
         */
        _scroll: function(axis, durationORdontToggleClass, callback) {
            var the = this,
                options = the.options,
                left,
                top,
                duration = 0,
                dontToggleClass = durationORdontToggleClass === true;

            duration = dontToggleClass ? 0 : (durationORdontToggleClass || 0);
            callback = callback || $.noop;

            if (~axis.indexOf('x')) {
                if (the.thumbX < 0) the.thumbX = 0;
                if (the.thumbX > the.maxX) the.thumbX = the.maxX;

                left = the.maxX ? the.thumbX * the.maxW / the.maxX : 0;

                if (isPlaceholderScroll) {
                    if (!dontToggleClass) the.$trackX.addClass('active');
                    the.$thumbX.animate({
                        left: the.thumbX
                    }, duration);
                    the.$content.animate({
                        left: -left
                    }, duration, function() {
                        if (!dontToggleClass) the.$trackX.removeClass('active');
                        callback.call(this);
                    });
                } else {
                    the.$container.animate({
                        scrollLeft: left
                    }, duration, callback);
                }

                options.onscrollx.call(the.$element[0], the.thumbX / the.maxX);
            }

            if (~axis.indexOf('y')) {
                if (the.thumbY < 0) the.thumbY = 0;
                if (the.thumbY > the.maxY) the.thumbY = the.maxY;

                top = the.maxY ? the.thumbY * the.maxH / the.maxY : 0;

                if (isPlaceholderScroll) {
                    if (!dontToggleClass) the.$trackY.addClass('active');
                    the.$thumbY.animate({
                        top: the.thumbY
                    }, duration);
                    the.$content.animate({
                        top: -top
                    }, duration, function() {
                        if (!dontToggleClass) the.$trackY.removeClass('active');
                        callback.call(this);
                    });
                } else {
                    the.$container.animate({
                        scrollTop: top
                    }, duration, callback);
                }

                options.onscrolly.call(the.$element[0], the.thumbY / the.maxY);
            }

            if (axis === 'xy' && isPlaceholderScroll && !dontToggleClass) {
                the.$trackX.removeClass('active');
                the.$trackY.removeClass('active');
            }
        },




        /**
         * 渲染滚动条，与内容的尺寸有关
         * @return this
         * @version 1.0
         * 2014年7月3日19:41:50
         */
        render: function(settings) {
            if (settings) this.options = $.extend(this.options, settings);

            var the = this,
                options = the.options,
                $element = the.$element,
                $container = the.$container,

                // 元素的尺寸
                outerWidth = $element.outerWidth(),
                outerHeight = $element.outerHeight(),

                // 包装集的尺寸
                containerWidth = options.width === 'auto' ? $container.innerWidth() : options.width,
                containerHeight = options.height === 'auto' ? $container.innerHeight() : options.height;

            if (!isPlaceholderScroll) {
                $container.css({
                    width: containerWidth,
                    height: containerHeight,
                    'overflow-scrolling': 'touch',
                    overflow: 'auto'
                });
                the.maxX = the.maxW = outerWidth - $container[0].clientWidth;
                the.maxY = the.maxH = outerHeight - $container[0].clientHeight;
                if (!the.has1stRender) {
                    $container.scroll(function() {
                        the.thumbX = this.scrollLeft;
                        the.thumbY = this.scrollTop;
                    });
                }
                the.has1stRender = !0;
                return the;
            }

            ////////////////////////////////////////////////////////////////////////////////////////

            var $trackX = the.$trackX,
                $trackY = the.$trackY,
                $thumbX = the.$thumbX,
                $thumbY = the.$thumbY,

                // 滚动条的尺寸
                barWidth = options.width * containerWidth / outerWidth,
                barHeight = options.height * containerHeight / outerHeight,

                // 上一次滚动条占比
                lastRatioX,
                lastRatioY;


            $container.css({
                width: containerWidth,
                height: containerHeight
            });

            if (barWidth < options.minWidth) barWidth = options.minWidth;
            $thumbX.css('width', barWidth);

            if (barHeight < options.minHeight) barHeight = options.minHeight;
            $thumbY.css('height', barHeight);

            // 滑动区域的最大尺寸
            the.maxW = outerWidth - containerWidth;
            the.maxH = outerHeight - containerHeight;
            if (the.maxW > 0) $trackX.show();
            else $trackX.hide();
            if (the.maxH > 0) $trackY.show();
            else $trackY.hide();

            lastRatioX = the.maxX ? the.thumbX / the.maxX : 0;
            lastRatioY = the.maxY ? the.thumbY / the.maxY : 0;

            // 滑块的尺寸
            the.thumbW = barWidth;
            the.thumbH = barHeight;

            // 滑块最大位置
            the.maxX = containerWidth - barWidth;
            the.maxY = containerHeight - barHeight;
            if (the.maxX < 0) the.maxX = 0;
            if (the.maxY < 0) the.maxY = 0;

            // 计算出的滚动速率
            the.speedX = the.maxX * options.speed / the.maxW;
            the.speedY = the.maxY * options.speed / the.maxH;

            // 第2+次渲染
            if (the.has1stRender) {
                the.thumbX = lastRatioX * the.maxX;
                the.thumbY = lastRatioY * the.maxY;
                the._scroll('xy');
            } else {
                the._click();
            }


            if ($.fn.drag) {
                the._drag();

                $thumbX.drag('options', {
                    max: {
                        left: the.maxX
                    }
                });

                $thumbY.drag('options', {
                    max: {
                        top: the.maxY
                    }
                });
            }

            if ($.fn.mousewheel) {
                the._wheel();
            }

            // 是否已经完成了第1次渲染
            the.has1stRender = !0;
            return the;
        },


        /**
         * x轴定点滚动并执行回调
         * @param  {Number/String}   target 位置或元素位置
         * @param  {Function}        fn     回调
         * @return 无传参时，返回位置比例值
         * @version 1.0
         * 2014年7月5日11:06:34
         */
        x: function(target, fn) {
            var the = this,
                options = the.options,
                $element = the.$element,
                $target;

            if (target === udf) return the.maxX ? the.thumbX / the.maxX : 0;

            // .1 || 0.1
            if ($.type(target) === 'number') {
                the.thumbX = target * the.maxX;
                the._scroll('x', options.duration, fn);
            } else {
                $target = $(target, $element);
                if ($target.length) {
                    the.thumbX = the.maxX * ($target.offset().left - $element.offset().left) / the.maxW;
                    the._scroll('x', options.duration, fn);
                }
            }
        },

        /**
         * y轴定点滚动并执行回调
         * @param  {Number/String}   target 位置或元素位置
         * @param  {Function}        fn     回调
         * @return 无传参时，返回位置比例值
         * @version 1.0
         * 2014年7月5日11:06:34
         */
        y: function(target, fn) {
            var the = this,
                options = the.options,
                $element = the.$element,
                $target;

            if (target === udf) return the.maxY ? the.thumbY / the.maxY : 0;

            // .1 || 0.1
            if ($.type(target) === 'number') {
                the.thumbY = target * the.maxY;
                the._scroll('y', options.duration, fn);
            } else {
                $target = $(target, $element);
                if ($target.length) {
                    the.thumbY = the.maxY * ($target.offset().top - $element.offset().top) / the.maxH;
                    the._scroll('y', options.duration, fn);
                }
            }
        },

        /**
         * 滚动到顶部
         * @param  {Function} fn       滚动结束回调
         * @return undefined
         * @version 1.0
         * 2014年7月5日10:29:11
         */
        top: function(fn) {
            return this.y(0, fn);
        },

        /**
         * 滚动到最右边
         * @param  {Function} fn       滚动结束回调
         * @return undefined
         * @version 1.0
         * 2014年7月5日10:29:35
         */
        right: function(fn) {
            return this.x(1, fn);
        },

        /**
         * 滚动到底部
         * @param  {Function} fn       滚动结束回调
         * @return undefined
         * @version 1.0
         * 2014年7月5日10:29:35
         */
        bottom: function(fn) {
            return this.y(1, fn);
        },

        /**
         * 滚动到最左边
         * @param  {Function} fn       滚动结束回调
         * @return undefined
         * @version 1.0
         * 2014年7月5日10:29:35
         */
        left: function(fn) {
            return this.x(0, fn);
        },




         /**
         * 设置或获取选项
         * @param  {String/Object} key 键或键值对
         * @param  {*}             val 值
         * @return 获取时返回键值，否则返回this
         * @version 1.0
         * 2014年7月3日20:08:16
         */
        options: function(key, val) {
            // get
            if ($.type(key) === 'string' && val === udf) return this.options[key];

            var map = {};
            if ($.type(key) === 'object') map = key;
            else map[key] = val;

            this.options = $.extend(this.options, map);
        }
    };


    /**
     * 判断是否为占位（占用内容区域）的滚动条
     * 这通常是非手机浏览器
     * @return {Boolean}
     * @version 1.0
     * 2014年3月20日22:48:43
     */

    function _isPlaceholderScroll() {
        var $iframe = $('<iframe>').appendTo(body),
            $div,
            clientWidth;

        $iframe.contents()[0].write('<!DOCTYPE html><html><body><div></div></body></html>');

        $div = $iframe.contents().find('div');

        $div.css({
            width: 100,
            height: 100,
            position: 'absolute',
            top: -999999,
            left: -999999,
            padding: 0,
            margin: 0,
            overflow: 'scroll'
        });

        clientWidth = $div[0].clientWidth;

        $iframe.remove();
        return clientWidth < 100;
    }

};