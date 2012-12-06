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
        constructor (el: JQuery);
        public on(state: string, closure: Function, scope?: Object): events.EventDispatcher;
        public onWithId(state: string, closure: Function, scope?: Object): number;
        public off(state: string, closure?: Function, scope?: Object): events.EventDispatcher;
        public destroy(): void;
        private _onCycle();
    }
    class MovieClip extends Sprite {
    }
}
