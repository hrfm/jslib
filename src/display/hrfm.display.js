var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var hrfm;
(function (hrfm) {
    (function (display) {
        var InteractiveObject = (function (_super) {
            __extends(InteractiveObject, _super);
            function InteractiveObject(el) {
                        _super.call(this);
                this.el = el;
            }
            return InteractiveObject;
        })(hrfm.events.EventDispatcher);
        display.InteractiveObject = InteractiveObject;        
        var Sprite = (function (_super) {
            __extends(Sprite, _super);
            function Sprite(el) {
                        _super.call(this, el);
                if(!Sprite._CYCLE) {
                    Sprite._CYCLE = new hrfm.events.Cycle(16);
                    Sprite._CYCLE.start();
                }
                this._ids = [];
                this._cycle = Sprite._CYCLE;
                this._cycle.on('cycle', this.__onCycle__, this, -1);
                this.x = 0;
                this.y = 0;
                this.rotation = 0;
            }
            Sprite._CYCLE = null;
            Sprite.prototype.on = function (state, closure, scope, priotiry) {
                if (typeof scope === "undefined") { scope = this; }
                if (typeof priotiry === "undefined") { priotiry = 0; }
                if(state == 'cycle') {
                    this.onWithId('cycle', closure, scope, priotiry);
                } else {
                    _super.prototype.on.call(this, state, closure, scope, priotiry);
                }
                return this;
            };
            Sprite.prototype.onWithId = function (state, closure, scope, priotiry) {
                if (typeof scope === "undefined") { scope = this; }
                if (typeof priotiry === "undefined") { priotiry = 0; }
                if(state == 'cycle') {
                    var id = this._cycle.onWithId('cycle', closure, scope, priotiry);
                    if(0 <= id) {
                        this._ids.push(id);
                    }
                    return id;
                } else {
                    return _super.prototype.onWithId.call(this, state, closure, scope, priotiry);
                }
            };
            Sprite.prototype.off = function (state, closure, scope) {
                if (typeof closure === "undefined") { closure = undefined; }
                if (typeof scope === "undefined") { scope = this; }
                if(state == 'cycle') {
                    this._cycle.off('cycle', closure, scope);
                } else {
                    _super.prototype.off.call(this, state, closure, scope);
                }
                return this;
            };
            Sprite.prototype.destroy = function () {
                var i, len = this._ids.length;
                for(i = 0; i < len; i++) {
                    this._cycle.off(this._ids[i]);
                }
                this._ids = [];
                this.removeAllListeners();
                this._cycle = null;
            };
            Sprite.prototype.__onCycle__ = function () {
                this.el.css('transform', 'translate3d(' + this.x + 'px,' + this.y + 'px, 0px) rotate(' + this.rotation + 'deg)');
            };
            return Sprite;
        })(InteractiveObject);
        display.Sprite = Sprite;        
        var MovieClip = (function (_super) {
            __extends(MovieClip, _super);
            function MovieClip() {
                _super.apply(this, arguments);

            }
            return MovieClip;
        })(Sprite);
        display.MovieClip = MovieClip;        
    })(hrfm.display || (hrfm.display = {}));
    var display = hrfm.display;
})(hrfm || (hrfm = {}));
