# jquery-touch [![spm version](http://spmjs.io/badge/jquery-touch)](http://spmjs.io/package/jquery-touch)
AUTHOR WEBSITE: [http://ydr.me/](http://ydr.me/)

Extend touch events for jquery

__IT IS [A spm package](http://spmjs.io/package/jquery-touch).__




#USAGE
```
var $ = require('jquery');
require('jquery-touch')($);

// eventType
$('#demo').tap(fn);
$('#demo').taphold(fn);
$('#demo').swipe(fn);
$('#demo').swipeup(fn);
$('#demo').swiperight(fn);
$('#demo').swipedown(fn);
$('#demo').swipeleft(fn);
```



#OPTIONS
```
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
}
```


#SET OPTIONS
```
$.tapSetup(settings);
$.tapholdSetup(settings);
$.swipeSetup(settings);
```


