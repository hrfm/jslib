var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Sample = (function (_super) {
    __extends(Sample, _super);
    function Sample(el) {
        _super.call(this, el);
        el.css('radias', 10);
        this.on('cycle', this._onCycle);
        this.speedX = 0;
        this.speedY = 0;
        this.size = 50;
        var that = this;
        this.el.on('mousedown', function (e) {
            e.preventDefault();
            var x_ = e.pageX, y_ = e.pageY;
            var mousemove = function (e) {
                that.x = e.pageX;
                that.y = e.pageY;
                that.speedX = e.pageX - x_;
                that.speedY = e.pageY - y_;
                x_ = e.pageX;
                y_ = e.pageY;
            };
            that.speedX = 0;
            that.speedY = 0;
            that.dragging = true;
            $(window).on('mousemove', mousemove);
            $(window).on('mouseup', function () {
                that.dragging = false;
                $(window).off('mousemove', mousemove);
                $(window).off('mouseup', arguments.callee);
            });
        });
    }
    Sample.prototype._onCycle = function () {
        if(this.dragging) {
            return;
        }
        this.speedX *= 0.98;
        this.speedY += 0.98;
        this.x += this.speedX;
        this.y += this.speedY;
    };
    return Sample;
})(hrfm.display.Sprite);
var Stage = (function (_super) {
    __extends(Stage, _super);
    function Stage(el, width, height) {
        if (typeof width === "undefined") { width = 600; }
        if (typeof height === "undefined") { height = 500; }
        _super.call(this, el);
        this._list = [];
        this.width = width;
        this.height = height;
        this.on('cycle', this._onCycle, this, -1);
    }
    Stage.prototype.addChild = function (s) {
        this.el.append(s.el);
        this._list.push(s);
    };
    Stage.prototype._onCycle = function () {
        var i, j, dx, dy, dist, s0, s1, list = this._list, len = list ? list.length : 0;
        for(i = 0; i < len; i++) {
            s0 = list[i];
            if(s0.x < 0) {
                s0.speedX *= -1;
                s0.x = 0;
            } else {
                if(600 < s0.x) {
                    s0.speedX *= -1;
                    s0.x = 600;
                }
            }
            if(500 < s0.y) {
                s0.speedY *= -0.7;
                s0.y = 500;
            }
        }
        for(i = 0; i < len - 1; i++) {
            for(j = i + 1; j < len; j++) {
                s0 = list[i];
                s1 = list[j];
                dx = s1.x - s0.x;
                dy = s1.y - s0.y;
                dist = Math.sqrt(dx * dx + dy * dy);
                if(dist < s0.size + s1.size) {
                    s0.shototsu = true;
                    s1.shototsu = true;
                } else {
                    s0.shototsu = false;
                    s1.shototsu = false;
                }
            }
        }
        for(i = 0; i < len; i++) {
            s0 = list[i];
            if(s0.shototsu) {
                s0.speedX = -s0.speedX;
                s0.speedY = -s0.speedY;
            }
        }
    };
    return Stage;
})(hrfm.display.Sprite);
