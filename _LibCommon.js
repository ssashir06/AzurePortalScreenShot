// チャタリング防止
var Waiter = function(func, delayMs) {
    var self = this;
    self.func = func;
    self.delay = delayMs;
    self.lastTime = null;
    self.done = false;
};
Waiter.prototype = {
    doit: function() {
        var self = this;
        self.lastTime = Date.now();
        setTimeout(function() {
            var now = Date.now();
            var diff = now - self.lastTime;
            if (self.done) {
                //console.log('ALEADY DONE');
            } else if (diff < self.delay) {
                console.log('WAITING (diff=' + diff + ')');
            } else {
                self.lastTime = Date.now();
                self.done = true;
                self.func();
            }
        }, self.delay*1.05);
    }
};

// Callback
page.onInitialized = function() {
    console.log('PAGE INITIALIZED');
    page.evaluate(function() {
        if (typeof window.callPhantom === 'function') {
            window.callPhantom('DOMContentLoaded');
        }
    });
};
// Callback
page.onLoadFinished = function() {
    console.log('PAGE LOAD FINISHED');
    page.evaluate(function() {
        if (typeof window.callPhantom === 'function') {
            window.callPhantom('DOMContentLoaded');
        }
    });
}

// DFR
var Dfr = function(head){
    var self = this;
    self.func = null;
    self.nextDfr = null;
    self.head = (!!head) ? head : self;
};
Dfr.prototype = {
    resolve: function() {
        var self = this;
        if (self.func !== null) {
            self.func(self.nextDfr);
        }
    },
    then: function(func) {
        var self = this;
        self.func = func;
        self.nextDfr = new Dfr(self.head);
        return self.nextDfr;
    },
    append: function(func) {
        var self = this;
        return func(self);
    },
    start : function() {
        var self = this;
        self.head.resolve();
    },
	waitPage: function(delayMs) {
		var self = this;

        var waiter = new Waiter(function() {
            console.log('---------------PAGE WAIT: NEXT---------------');
            self.resolve();
        }, delayMs);
        
		page.onCallback = function(data){
			if (data === 'DOMContentLoaded') {
                waiter.doit();
            }
		}
	},
    waitTime: function(delayMs) {
		var self = this;
        setTimeout(function() { 
            console.log('---------------TIME WAIT: NEXT---------------');
            self.resolve(); 
        }, delayMs);
    }
};

// スクリーンショット保存
var savePage = function(name, silent) {
    if (!silent) {
        console.log('Save:' + name);
        console.log('Url:' + page.url);
    }
    page.render(name + '.png');
    if (false) {
        var html = page.evaluate(function() {
            return document.getElementsByTagName('html')[0].innerHTML;
        });
        fs.write(name + '.html', html, 'w');
    }
}
