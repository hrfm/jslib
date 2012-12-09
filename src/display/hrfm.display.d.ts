/// <reference path="../events/hrfm.events.d.ts" />
/// <reference path="../d/jquery.d.ts" />
module hrfm.display {
    class InteractiveObject extends events.EventDispatcher {
        public el: JQuery;
        constructor (el: JQuery);
    }
    class Sprite extends InteractiveObject {
        static _CYCLE;
        private _ids;
        private _cycle;
        public x: number;
        public y: number;
        public rotation: number;
        constructor (el: JQuery);
        public on(state: string, closure: Function, scope?: Object, priotiry?: number): events.EventDispatcher;
        public onWithId(state: string, closure: Function, scope?: Object, priotiry?: number): number;
        public off(state: string, closure?: Function, scope?: Object): events.EventDispatcher;
        public destroy(): void;
        private __onCycle__();
    }
    class MovieClip extends Sprite {
    }
}
