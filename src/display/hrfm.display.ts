/// <reference path="../events/hrfm.events.d.ts" />
/// <reference path="../d/jquery.d.ts" />

module hrfm.display{

    export class InteractiveObject extends hrfm.events.EventDispatcher{

        el : JQuery;

        constructor( el:JQuery ){
            super();
            this.el = el;
        }

    }

    export class Sprite extends InteractiveObject{

        // ------- MEMBER --------------------------------------------

        static private _CYCLE:hrfm.events.Cycle;

        private _ids    : number[];
        private _cycle  : hrfm.events.Cycle;

        x : number;
        y : number;
        rotation : number;

        // ------- PUBLIC --------------------------------------------

        constructor( el:JQuery ){
            
            super(el);

            if( !Sprite._CYCLE ){
                Sprite._CYCLE = new hrfm.events.Cycle(16);
                Sprite._CYCLE.start();
            }

            this._ids   = [];
            this._cycle = Sprite._CYCLE;
            this._cycle.on( 'cycle', this.__onCycle__, this, -1 );

            // ---

            this.x = 0;
            this.y = 0;
            this.rotation = 0;

        }

        /**
         * 指定した state のイベントを Listen します.
         * @param state
         * @param closure
         * @param scope
         */
        on( state:string, closure:Function, scope:Object = this, priotiry:number = 0 ):hrfm.events.EventDispatcher{
            if( state == 'cycle' ){
                this.onWithId( 'cycle', closure, scope, priotiry );
            }else{
                super.on( state, closure, scope, priotiry );
            }
            return this;
        }

        /**
         * 指定した state のイベントを Listen し, その id を返します.
         * ここで取得した id を使って off(id) でリスナ解除が可能です.
         * @param state
         * @param closure
         * @param scope
         * @return
         */
        onWithId( state:string, closure:Function, scope:Object = this, priotiry:number = 0 ):number{
            if( state == 'cycle' ){
                var id:number = this._cycle.onWithId( 'cycle', closure, scope, priotiry );
                if( 0 <= id ) this._ids.push( id );
                return id;
            }else{
                return super.onWithId( state, closure, scope, priotiry );
            }
        }

        /**
         * 指定した state のイベントの Listen を解除します.
         * @param state
         * @param closure
         * @param scope
         */
        off( state:string, closure:Function = undefined, scope:Object = this ):hrfm.events.EventDispatcher{
            if( state == 'cycle' ){
                this._cycle.off( 'cycle', closure, scope );
            }else{
                super.off( state, closure, scope );
            }
            return this;
        }

        /**
         * インスタンスを破棄します.
         * 登録されたイベントリスナも削除されます.
         */
        destroy(){
            
            var i:number,
                len:number = this._ids.length;
            
            // --- Remove EventListeners. ---
            for( i=0; i < len; i++ ){
                this._cycle.off( this._ids[i] );
            }
            this._ids   = [];
            this.removeAllListeners();
            
            // --- Remove cycle. ---
            this._cycle = null;

        }

        // ------- PRIVATE -------------------------------------------

        /**
         * 毎フレーム実行される関数.
         */
        private __onCycle__(){
            /*
            this.el.css({
                left : this.x,
                top  : this.y
            });
            */
            this.el.css('transform','translate3d('+this.x+'px,'+this.y+'px, 0px) rotate('+this.rotation+'deg)');
        }

    }

    export class MovieClip extends Sprite{

    }

}