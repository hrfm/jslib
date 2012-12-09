/// <reference path="../../src/display/hrfm.display.d.ts" />
/// <reference path="../../src/d/jquery.d.ts" />

class CollisionObject extends hrfm.display.Sprite{
	vector : 
	velocity:number;
	mass : number;
}

class Sample extends hrfm.display.Sprite{

	size   : number;

	direction : number;
	speedX : number;
	speedY : number;
	mass   :



	shototsu:Boolean;

	private dragging:Boolean;

	constructor(el:JQuery){

		super(el);

		el.css('radias',10);

		this.on('cycle',this._onCycle);
		this.speedX = 0;
		this.speedY = 0;
		this.size = 50;

		var that = this;
		this.el.on('mousedown',function(e){
			e.preventDefault();
			var x_ = e.pageX,
				y_ = e.pageY;

			var mousemove = function(e){
				that.x = e.pageX;
				that.y = e.pageY;
				that.speedX = e.pageX - x_;
				that.speedY = e.pageY - y_;
				x_ = e.pageX;
				y_ = e.pageY;
			}
			that.speedX = 0;
			that.speedY = 0;
			that.dragging = true;
			$(window).on('mousemove',mousemove);
			$(window).on('mouseup',function(){
				that.dragging = false;
				$(window).off('mousemove',mousemove);
				$(window).off('mouseup',arguments.callee);
			});
		});

	}

	_onCycle(){
		//this.rotation += 1;
		if( this.dragging ) return;

		this.speedX *= 0.98;
		this.speedY += 0.98;
		this.x += this.speedX;
		this.y += this.speedY;

	}

}

class Stage extends hrfm.display.Sprite{

	private _list:Sample[];

	width  : number;
	height : number;

	constructor( el:JQuery, width:number = 600, height:number = 500 ){
		super(el);
		this._list = [];
		this.width  = width;
		this.height = height;
		this.on('cycle',this._onCycle, this, -1);
	}

	addChild( s:Sample ){
		this.el.append(s.el);
		this._list.push(s);
	}

	_onCycle(){
		var i:number, j:number,
			dx:number, dy:number, dist:number, s0:Sample, s1:Sample,
			list:Sample[] = this._list,
			len:number = list ? list.length : 0;

		for( i=0; i < len; i++ ){
			s0 = list[i];
			if( s0.x < 0 ){
				s0.speedX *= -1;
				s0.x = 0;
			}else if( 600 < s0.x ){
				s0.speedX *= -1;
				s0.x = 600;
			}

			if( 500 < s0.y ){
				s0.speedY *= -0.7;
				s0.y = 500;
			}

		}

		for( i=0; i < len-1; i++ ){
			for( j=i+1; j<len; j++ ){
				s0 = list[i];
				s1 = list[j];
				dx = s1.x - s0.x;
				dy = s1.y - s0.y;
				dist = Math.sqrt( dx * dx + dy * dy );
				if(  dist < s0.size + s1.size ){
					s0.shototsu = true;
					s1.shototsu = true;
				}else{
					s0.shototsu = false;
					s1.shototsu = false;
				}
			}
		}

		for( i=0; i < len; i++ ){
			s0 = list[i];
			if( s0.shototsu ){
				s0.speedX = -s0.speedX;
				s0.speedY = -s0.speedY;

			}
		}

	}

}