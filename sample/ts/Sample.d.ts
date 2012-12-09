/// <reference path="../../src/display/hrfm.display.d.ts" />
/// <reference path="../../src/d/jquery.d.ts" />
class Sample extends hrfm.display.Sprite {
    public size: number;
    public speedX: number;
    public speedY: number;
    public shototsu: Boolean;
    private dragging;
    constructor (el: JQuery);
    public _onCycle(): void;
}
class Stage extends hrfm.display.Sprite {
    private _list;
    public width: number;
    public height: number;
    constructor (el: JQuery, width?: number, height?: number);
    public addChild(s: Sample): void;
    public _onCycle(): void;
}
