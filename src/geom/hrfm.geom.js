var hrfm;
(function (hrfm) {
    (function (geom) {
        var Vector = (function () {
            function Vector(x, y, z) {
            }
            Vector.times = function times(k, v) {
                return new Vector(k * v.x, k * v.y, k * v.z);
            }
            Vector.plus = function plus(v1, v2) {
                return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
            }
            Vector.minus = function minus(v1, v2) {
                return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
            }
            Vector.dot = function dot(v1, v2) {
                return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
            }
            Vector.cross = function cross(v1, v2) {
                return new Vector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
            }
            Vector.mag = function mag(v) {
                return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
            }
            Vector.norm = function norm(v) {
                var mag = Vector.mag(v);
                var div = (mag === 0) ? Infinity : 1 / mag;
                return Vector.times(div, v);
            }
            return Vector;
        })();
        geom.Vector = Vector;        
    })(hrfm.geom || (hrfm.geom = {}));
    var geom = hrfm.geom;
})(hrfm || (hrfm = {}));
