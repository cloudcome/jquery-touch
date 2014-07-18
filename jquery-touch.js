/*!
 * jquery-touch
 * @author ydr.me
 * @version 1.0
 * 2014年7月12日15:30:39
 */



/**
 * v1.0
 * 2014年7月12日15:33:49
 * 利用$.Event，增加了 tap taphold swipe swipeup swiperight swipedown swipeleft tapick 原型方法
 * 增加 $.tapSetup $.tapholdSetup $.swipeSetup 来配置参数
 * 模块化
 */

module.exports = function($) {
    var win = window,
        doc = win.document,
        body = doc.body,
        $doc = $(doc),
        defaults = {
            tap: {
                x: 30,
                y: 30,
                timeout: 500
            },
            taphold: {
                x: 30,
                y: 30,
                timeout: 750
            },
            swipe: {
                x: 30,
                y: 30
            }
        },
        customTouchEvents = 'tap taphold swipe swipeup swiperight swipedown swipeleft'.split(' '),
        // 不能增删！！
        mustEventProperties = 'target detail which clientX clientY pageX pageY screenX screenY'.split(' '),
        timeid, x0, y0, t0,
        tapOptions = defaults.tap,
        tapholdOptions = defaults.taphold,
        swipeOptions = defaults.swipe,
        events = {};

    if ($.AUTHOR && $.AUTHOR === 'ydr.me') return;

    $.extend({
        tapSetup: function(settings) {
            $.extend(defaults.tap, settings);
        },
        tapholdSetup: function(settings) {
            $.extend(defaults.taphold, settings);
        },
        swipeSetup: function(settings) {
            $.extend(defaults.swipe, settings);
        }
    });

    $.each(customTouchEvents, function(index, eventType) {
        events[eventType] = $.Event(eventType);
    });

    // touchstart
    $doc.bind('touchstart', function(e) {
        e = e.originalEvent;
        if (e.touches && e.touches.length === 1) {
            var firstTouch = e.touches[0],
                element = firstTouch.target,
                toucheCallout = $.css(body, 'touch-callout'),
                userSelect = $.css(body, 'user-select');

            _reset(e);
            $.css(body, 'touch-callout', 'none');
            $.css(body, 'user-select', 'none');
            x0 = firstTouch.pageX;
            y0 = firstTouch.pageY;
            t0 = Date.now();

            timeid = setTimeout(function() {
                $.css(body, 'touch-callout', toucheCallout);
                $.css(body, 'user-select', userSelect);
                _mergeEvent(events.taphold, e);
                $(element).trigger(events.taphold);
            }, tapholdOptions.timeout);
        }
    });

    // touchmove
    $doc.bind('touchmove', function(e) {
        e = e.originalEvent;
        if (e.touches && e.touches.length === 1) {
            var firstTouch = e.touches[0],
                element = firstTouch.target,
                deltaX = Math.abs(firstTouch.pageX - x0),
                deltaY = Math.abs(firstTouch.pageY - y0),
                rect = element.getBoundingClientRect();

            // 在元素范围
            if (firstTouch.clientX > rect.left && firstTouch.clientY > rect.top && firstTouch.clientX < rect.right && firstTouch.clientY < rect.bottom) {
                if (timeid && (deltaX > tapholdOptions.x || deltaY > tapholdOptions.y)) _reset(e);
            }
        }
    });

    // touchend
    $doc.bind('touchend', function(e) {
        e = e.originalEvent;
        _reset(e);
        var firstTouch = e.changedTouches[0],
            x1 = firstTouch.pageX,
            y1 = firstTouch.pageY,
            x = x1 - x0,
            y = y1 - y0,
            deltaX = Math.abs(x),
            deltaY = Math.abs(y),
            deltaT = Date.now() - t0,
            element = firstTouch.target;

        if (deltaX < tapOptions.x && deltaY < tapOptions.y && deltaT < tapOptions.timeout) {
            _mergeEvent(events.tap, e);
            $(element).trigger(events.tap);
        }

        if (deltaX >= swipeOptions.x || deltaY >= swipeOptions.y) {
            setTimeout(function() {
                var dir = deltaX > deltaY ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up');

                _mergeEvent(events.swipe, e);
                _mergeEvent(events['swipe' + dir], e);

                $(element).trigger(events.swipe);
                $(element).trigger(events['swipe' + dir]);
            }, 0);
        }
    });

    $doc.bind('touchcancel', _reset);
    $(win).bind('scroll', _reset);


    function _reset(e) {
        if (e.changedTouches && e.changedTouches.length === 1 || e.touches && e.touches.length === 1) {
            if (timeid) clearTimeout(timeid);
            timeid = 0;
        }
    }

    /**
     * 合并必要的信息到创建的事件对象上
     * @param  {Event} createEvent    创建的事件对象
     * @param  {Event} originalEvent  原始的事件对象
     * @return {Event} 合并后的事件对象
     * @version 1.0
     * 2014年7月12日13:36:11
     */
    function _mergeEvent(createEvent, originalEvent) {
        var copyEvent = originalEvent;
        _copy();

        if (copyEvent.touches && copyEvent.touches.length) {
            copyEvent = copyEvent.touches[0];
            _copy();
        } else if (copyEvent.changedTouches && copyEvent.changedTouches.length) {
            copyEvent = copyEvent.changedTouches[0];
            _copy();
        }

        function _copy() {
            mustEventProperties.forEach(function(prototype) {
                if (prototype in copyEvent) createEvent[prototype] = copyEvent[prototype];
            });
        }

        return createEvent;
    }



    $.each(customTouchEvents, function(index, eventType) {
        $.fn[eventType] = function(fn) {
            return this.on(eventType, fn);
        };
    });

    $.fn.tapick = function(fn) {
        return this.bind('ontouchend' in doc ? 'tap' : 'click', fn);
    };


};
