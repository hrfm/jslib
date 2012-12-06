/// <reference path="../../src/display/hrfm.display.d.ts" />
/// <reference path="../../src/d/jquery.d.ts" />

class Sample extends hrfm.display.Sprite{

	constructor(el:JQuery){
		super(el);
		this.on('cycle',this._onCycle);
	}

	_onCycle(){
		this.el.css('left', Math.random() * 1000);
	}

}