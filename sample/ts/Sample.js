var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Sample = (function (_super) {
    __extends(Sample, _super);
    function Sample(el) {
        _super.call(this, el);
        this.on('cycle', this._onCycle);
    }
    Sample.prototype._onCycle = function () {
        this.el.css('left', Math.random() * 1000);
    };
    return Sample;
})(hrfm.display.Sprite);
