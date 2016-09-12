    /**
     * pl library :　orientation detection
     * 横竖屏检测库
     */
    ;
    (function(win) {
        var meta = {},
            timer;

        var eventType = 'orientationchange';
        // 是否支持orientationchange事件
        var isOrientation = ('orientation' in window && 'onorientationchange' in window);
        meta.isOrientation = isOrientation;
       
        // font-family
        var html = document.documentElement,
            hstyle = win.getComputedStyle(html, null),
            ffstr = hstyle['font-family'];
        meta.font = ffstr;

        // automatically load css script
        function loadStyleString(css) {
            var _style = document.createElement('style'),
                _head = document.head ? document.head : document.getElementsByTagName('head')[0];
            _style.type = 'text/css';
            try {
                _style.appendChild(document.createTextNode(css));
            } catch (ex) {
                // lower IE support, if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
                _style.styleSheet.cssText = css;
            }
            _head.appendChild(_style);
            return _style;
        }
       
        // 触发原生orientationchange
        var fire = function() {
            var e;
            if (document.createEvent) {
                e = document.createEvent('HTMLEvents');
                e.initEvent(eventType, true, false);
                win.dispatchEvent(e);
            } else {
                e = document.createEventObject();
                e.eventType = eventType;
                if (win[eventType]) {
                    win[eventType]();
                } else if (win['on' + eventType]) {
                    win['on' + eventType]();
                } else {
                    win.fireEvent(eventType, e);
                }
            }
        }

        // callback
        var orientationCB = function(e) {
            if (win.orientation === 180 || win.orientation === 0) {
                meta.init = 'portrait';
                meta.current = 'portrait';
            }
            if (win.orientation === 90 || win.orientation === -90) {
                meta.init = 'landscape';
                meta.current = 'landscape';
            }
            return function() {
                if (win.orientation === 180 || win.orientation === 0) {
                    meta.current = 'portrait';
                }
                if (win.orientation === 90 || win.orientation === -90) {
                    meta.current = 'landscape';
                }
                fire();
            }
        };
        var resizeCB = function() {
            var pstr = "portrait, " + ffstr,
                lstr = "landscape, " + ffstr,
                cssstr = '@media (orientation: portrait) { .orientation{font-family:' + pstr + ';} } @media (orientation: landscape) {  .orientation{font-family:' + lstr + ';}}';

            // 载入样式     
            loadStyleString(cssstr);
            // 添加类
            html.className = 'orientation' + html.className;
            if (hstyle['font-family'] === pstr) { //初始化判断
                meta.init = 'portrait';
                meta.current = 'portrait';
            } else {
                meta.init = 'landscape';
                meta.current = 'landscape';
            }
            resizeCB = function() {
                if (hstyle['font-family'] === pstr) {
                    if (meta.current !== 'portrait') {
                        meta.current = 'portrait';
                        fire();
                    }
                } else {
                    if (meta.current !== 'landscape') {
                        meta.current = 'landscape';
                        fire();
                    }
                }
            }
        };
        var callback = isOrientation ? orientationCB() : (function() {
            resizeCB();
            return function() {
                timer && win.clearTimeout(timer);
                timer = win.setTimeout(resizeCB, 300);
            }
        })();

        // 监听
        win.addEventListener(isOrientation ? 'orientationchange' : 'resize', callback, false);
        
        win.neworientation = meta;
    })(window);
