module hrfm.geom {
    class Vector {
        public x: number;
        public y: number;
        public z: number;
        constructor (x: number, y: number, z: number);
        static times(k: number, v: Vector): Vector;
        static plus(v1: Vector, v2: Vector): Vector;
        static minus(v1: Vector, v2: Vector): Vector;
        static dot(v1: Vector, v2: Vector): number;
        static cross(v1: Vector, v2: Vector): Vector;
        static mag(v: Vector): number;
        static norm(v: Vector): Vector;
    }
}
