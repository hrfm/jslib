var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var hrfm;
(function (hrfm) {
    (function (events) {
        var Closure = (function () {
            function Closure(closure, scope, priority) {
                if (typeof scope === "undefined") { scope = undefined; }
                if (typeof priority === "undefined") { priority = 0; }
                this.id = Closure._ID++;
                this._f = closure;
                this._s = scope;
                this.priority = priority;
            }
            Closure._ID = 0;
            Closure.prototype.e = function (a) {
                if (typeof a === "undefined") { a = null; }
                this._f.call(this._s, a);
                return this.n;
            };
            Closure.prototype.eq = function (closure, scope) {
                if (typeof scope === "undefined") { scope = undefined; }
                return (closure == this._f && scope == this._s);
            };
            return Closure;
        })();
        events.Closure = Closure;        
        var ClosureList = (function () {
            function ClosureList() {
            }
            ClosureList.prototype.add = function (closure, scope, priority) {
                if (typeof scope === "undefined") { scope = undefined; }
                if (typeof priority === "undefined") { priority = 0; }
                var c, n, t;
                if(!this.head) {
                    c = new Closure(closure, scope, priority);
                    this.head = this.tail = c;
                } else {
                    c = this.head;
                    while(c) {
                        if(c.eq(closure, scope)) {
                            return -1;
                        }
                        if(c.priority <= priority) {
                            t = c;
                        }
                        c = c.n;
                    }
                    c = new Closure(closure, scope, priority);
                    if(t == this.tail) {
                        t.n = c;
                        c.p = t;
                        this.tail = c;
                    } else {
                        n = t.n;
                        t.n = c;
                        c.p = t;
                        c.n = n;
                        n.p = c;
                    }
                }
                return c.id;
            };
            ClosureList.prototype.rm = function (closure, scope) {
                if (typeof scope === "undefined") { scope = undefined; }
                var c = this.head;
                while(c) {
                    if(c.eq(closure, scope)) {
                        this._rm(c);
                        c = null;
                        return;
                    }
                    c = c.n;
                }
            };
            ClosureList.prototype.rmById = function (id) {
                var c = this.head;
                while(c) {
                    if(c.id == id) {
                        this._rm(c);
                        c = null;
                        return;
                    }
                    c = c.n;
                }
            };
            ClosureList.prototype.rmAll = function () {
                var c = this.head, n;
                while(c) {
                    n = c.n;
                    c = null;
                    c = n;
                }
                this.head = null;
                this.tail = null;
            };
            ClosureList.prototype.exec = function (eventObject) {
                if (typeof eventObject === "undefined") { eventObject = undefined; }
                if(!this.head) {
                    return;
                }
                var c = this.head;
                if(typeof eventObject === 'undefined') {
                    while(c) {
                        c = c.e();
                    }
                } else {
                    while(c) {
                        c = c.e(eventObject);
                    }
                }
            };
            ClosureList.prototype._rm = function (c) {
                if(c.p) {
                    c.p.n = c.n;
                    if(c == this.tail) {
                        this.tail = c.p;
                    }
                }
                if(c.n) {
                    c.n.p = c.p;
                    if(c == this.head) {
                        this.head = c.n;
                    }
                }
            };
            return ClosureList;
        })();
        events.ClosureList = ClosureList;        
        var EventDispatcher = (function () {
            function EventDispatcher() {
                this._hash_ = [];
            }
            EventDispatcher.prototype.on = function (state, closure, scope, priority) {
                if (typeof scope === "undefined") { scope = this; }
                if (typeof priority === "undefined") { priority = 0; }
                var i, s, list = state.split(' '), len = list.length;
                for(i = 0; i < len; i++) {
                    s = list[i];
                    if(!this._hash_[s]) {
                        this._hash_[s] = new ClosureList();
                    }
                    this._hash_[s].add(closure, scope, priority);
                }
                return this;
            };
            EventDispatcher.prototype.onWithId = function (state, closure, scope, priority) {
                if (typeof scope === "undefined") { scope = this; }
                if (typeof priority === "undefined") { priority = 0; }
                if(!this._hash_[state]) {
                    this._hash_[state] = new ClosureList();
                }
                return this._hash_[state].add(closure, scope, priority);
            };
            EventDispatcher.prototype.off = function (state, closure, scope) {
                if (typeof closure === "undefined") { closure = undefined; }
                if (typeof scope === "undefined") { scope = this; }
                if(typeof state === 'number') {
                    for(var key in this._hash_) {
                        this._hash_[key].rmById(state);
                    }
                } else {
                    if(typeof state === 'string') {
                        var i, s, list = state.split(' '), len = list.length;
                        for(i = 0; i < len; i++) {
                            s = list[i];
                            if(!this._hash_[s]) {
                                continue;
                            }
                            if(typeof closure === 'undefined') {
                                this._hash_[s].rmAll();
                            } else {
                                this._hash_[s].rm(closure, scope);
                            }
                        }
                    }
                }
                return this;
            };
            EventDispatcher.prototype.execute = function (state, eventObject) {
                if (typeof eventObject === "undefined") { eventObject = null; }
                if(this._hash_[state]) {
                    this._hash_[state].exec(eventObject);
                }
            };
            EventDispatcher.prototype.removeAllListeners = function () {
                for(var key in this._hash_) {
                    this._hash_[key].rmAll();
                }
                this._hash_ = [];
            };
            return EventDispatcher;
        })();
        events.EventDispatcher = EventDispatcher;        
        var Cycle = (function (_super) {
            __extends(Cycle, _super);
            function Cycle(interval) {
                if (typeof interval === "undefined") { interval = 0; }
                        _super.call(this);
                this.running = false;
                this.interval = interval;
                this.initialTime = Date.now();
                this.elapsedTime = 0;
                this._requestAnimationFrame = window['requestAnimationFrame'] || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || window['oRequestAnimationFrame'] || window['msRequestAnimationFrame'] || function (callback) {
                    return setTimeout(callback, interval || 1);
                };
                this._cancelAnimationFrame = window['cancelRequestAnimationFrame'] || window['webkitCancelAnimationFrame'] || window['webkitCancelRequestAnimationFrame'] || window['mozCancelRequestAnimationFrame'] || window['oCancelRequestAnimationFrame'] || window['msCancelRequestAnimationFrame'] || clearTimeout;
            }
            Cycle.prototype.start = function () {
                if(this.running == true) {
                    return;
                }
                var that = this, _now = 0, _time = Date.now(), _startTime = _time, _elapsed = 0, _interval = this.interval;
                if(0 < _interval) {
                    this._onAnimate = function () {
                        _now = Date.now();
                        if(_interval * 100 < _now - _time) {
                            _time = _now - _interval;
                        }
                        while(_interval <= _now - _time) {
                            _elapsed = _now - _time;
                            that.elapsedTime += _elapsed;
                            _time += _interval;
                            that.execute('cycle', _now - _time < _interval);
                        }
                        that._animateID = that._requestAnimationFrame.call(window, that._onAnimate);
                    };
                } else {
                    this._onAnimate = function () {
                        _now = Date.now();
                        _elapsed = _now - _time;
                        that.elapsedTime += _elapsed;
                        that.execute('cycle', true);
                        _time = _now;
                        that._animateID = that._requestAnimationFrame.call(window, that._onAnimate);
                    };
                }
                this._animateID = this._requestAnimationFrame.call(window, that._onAnimate);
                this.running = true;
                this.execute('start');
            };
            Cycle.prototype.stop = function () {
                if(this.running == false) {
                    return;
                }
                this._onAnimate = function () {
                };
                this._cancelAnimationFrame.call(window, this._animateID);
                this.running = false;
                this.execute('stop');
            };
            return Cycle;
        })(hrfm.events.EventDispatcher);
        events.Cycle = Cycle;        
    })(hrfm.events || (hrfm.events = {}));
    var events = hrfm.events;
})(hrfm || (hrfm = {}));
