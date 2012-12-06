module hrfm.events {
    interface IClosure {
        n: IClosure;
        e: (a: any) => IClosure;
    }
    class Closure implements IClosure {
        static _ID;
        private _f;
        private _s;
        private _p;
        public id: number;
        public n: Closure;
        public p: Closure;
        constructor (closure: Function, scope?: Object, priority?: number);
        public e(a?): Closure;
        public eq(closure: Function, scope?: Object): Boolean;
    }
    class ClosureList {
        public head: Closure;
        public tail: Closure;
        constructor ();
        public add(closure: Function, scope?: Object, priority?: number): number;
        public rm(closure: Function, scope?: Object): void;
        public rmById(id: number): void;
        public rmAll(): void;
        public exec(eventObject?: Object): void;
        private _rm(c);
    }
    class EventDispatcher {
        public _hash_: ClosureList[];
        constructor ();
        public on(state: string, closure: Function, scope?: Object): EventDispatcher;
        public onWithId(state: string, closure: Function, scope?: Object): number;
        public off(state: any, closure?: Function, scope?: Object): EventDispatcher;
        public execute(state: string, eventObject?: Object): void;
        public removeAllListeners(): void;
    }
    class Cycle extends EventDispatcher {
        public interval: number;
        public initialTime: number;
        public elapsedTime: number;
        public running: Boolean;
        private _onAnimate;
        private _animateID;
        private _requestAnimationFrame;
        private _cancelAnimationFrame;
        constructor (interval?: number);
        public start(): void;
        public stop(): void;
    }
}
