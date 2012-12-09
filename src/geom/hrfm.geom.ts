module hrfm.geom{
    
    export class Vector{

        // ------- MEMBER --------------------------------------------

        // ------- PUBLIC --------------------------------------------

        constructor( public x: number, public y: number, public z: number) {
        }

        /**
         * Vector を k 倍します.
         */
        static times(k: number, v: Vector) {
            return new Vector(k * v.x, k * v.y, k * v.z);
        }

        /**
         * Vector 同士を加算し新しい Vector を返します.
         * @param v1
         * @param v2
         */
        static plus(v1: Vector, v2: Vector) {
            return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
        }

        /**
         * Vector 同士を減算し新しい Vector を返します.
         * @param v1
         * @param v2
         */
        static minus(v1: Vector, v2: Vector){
            return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
        }
        
        /**
         * Vector の内積を計算します.
         * @param v1
         * @param v2
         */
        static dot(v1: Vector, v2: Vector) {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        }
        
        /**
         * Vector の外積を計算し新しい Vector を返します.
         * @param v1
         * @param v2
         */
        static cross(v1: Vector, v2: Vector) {
            return new Vector(
                v1.y * v2.z - v1.z * v2.y,
                v1.z * v2.x - v1.x * v2.z,
                v1.x * v2.y - v1.y * v2.x
            );
        }

        /**
         * Vector の絶対値の二乗を求めます.
         * @param v
         */
        static mag(v: Vector) {
            return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        }
        
        /**
         * Vector を正規化します.
         * @param v
         */
        static norm(v: Vector) {
           var mag = Vector.mag(v);
           var div = (mag === 0) ? Infinity : 1.0 / mag;
           return Vector.times(div, v);
        }

    }

}