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
            }
            Sprite._CYCLE = null;
            Sprite.prototype.on = function (state, closure, scope) {
                if (typeof scope === "undefined") { scope = this; }
                if(state == 'cycle') {
                    this.onWithId('cycle', closure, scope);
                } else {
                    _super.prototype.on.call(this, state, closure, scope);
                }
                return this;
            };
            Sprite.prototype.onWithId = function (state, closure, scope) {
                if (typeof scope === "undefined") { scope = this; }
                if(state == 'cycle') {
                    var id = this._cycle.onWithId('cycle', closure, scope);
                    if(0 <= id) {
                        this._ids.push(id);
                    }
                    return id;
                } else {
                    return _super.prototype.onWithId.call(this, state, closure, scope);
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
            Sprite.prototype._onCycle = function () {
                this.execute('enterframe');
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
