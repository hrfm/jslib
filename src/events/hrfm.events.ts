module hrfm.events{
        
    export interface IClosure{
        // ------- MEMBER --------------------
        n :IClosure;
        // ------- PUBLIC --------------------
        e :(a) => IClosure;
    }

    /**
     * ClosureList で使われるクロージャ管理用のオブジェクト.
     */
    export class Closure implements IClosure{
        // ------- MEMBER --------------------
        private static _ID:number = 0;
        // function
        private _f:Function;
        // scope
        private _s:Object;
        // priority
        priority:number;
        // indentity of this instance.
        id : number;
        // next
        n : Closure;
        // prev
        p : Closure;
        // ------- PUBLIC --------------------
        constructor( closure:Function, scope:Object = undefined, priority:number = 0 ){
            this.id = Closure._ID++;
            this._f = closure;
            this._s = scope;
            this.priority = priority;
        }
        e(a = null):Closure{
            this._f.call( this._s, a );
            return this.n;
        }
        eq( closure:Function, scope:Object = undefined ):Boolean{
            return ( closure == this._f && scope == this._s )
        }
    }

    /**
     * 関数を連続実行するための Function の Linked List.
     */
    export class ClosureList{

        // ------- MEMBER --------------------

        head:Closure;
        tail:Closure;

        // ------- PUBLIC --------------------

        constructor(){}

        /**
         * Linked List に Closure を追加.
         * @param closure
         * @param scope
         * @param priority
         */
        add( closure:Function, scope:Object = undefined, priority:number = 0 ):number{
            var c:Closure, n:Closure, t:Closure;
            if( !this.head ){
                // そもそも存在しない場合は即追加.
                c = new Closure( closure, scope, priority );
                this.head = this.tail = c;
            }else{
                // 重複を調べて追加.
                c = this.head;
                while(c){
                    if( c.eq( closure, scope ) ) return -1;
                    // priority で入れる場所を判断.
                    if( c.priority <= priority ) t = c;
                    c = c.n;
                }
                // 新規 Closure インスタンスを作成.
                c = new Closure( closure, scope, priority );
                if( t == this.tail ){
                    t.n = c;
                    c.p = t;
                    this.tail = c;
                }else{
                    n   = t.n;
                    t.n = c;
                    c.p = t;
                    c.n = n;
                    n.p = c;
                }
            }
            return c.id;
        }

        /**
         * 指定した closure と scope の Closure を
         * Linked List から削除します.
         * @param closure
         * @param scope
         */
        rm( closure:Function, scope:Object = undefined ):void{
            var c:Closure = this.head;
            while(c){
                if( c.eq( closure, scope ) ){
                    this._rm(c);
                    c = null;
                    return;
                }
                c = c.n;
            }
        }

        /**
         * 指定した ID の Closure を
         * Linked List から削除します.
         * @param id
         */
        rmById( id:number ):void{
            var c:Closure = this.head;
            while(c){
                if( c.id == id ){
                    this._rm(c);
                    c = null;
                    return;
                }
                c = c.n;
            }
        }

        /**
         * このリストに登録されている全てのリスナを削除します.
         */
        rmAll():void{
            var c:Closure = this.head, n:Closure;
            // スコープの指定が無い場合は全て破棄する.
            while( c ){
                n = c.n;
                c = null;
                c = n;
            }
            this.head = null;
            this.tail = null;
        }

        /**
         * このリストに登録されている全てのリスナを実行します.
         * @param eventObject
         */
        exec( eventObject:Object = undefined ):void{
            if( !this.head ) return;
            var c:Closure = this.head;
            if( typeof eventObject === 'undefined' ){
                while(c) c = c.e();
            }else{
                while(c) c = c.e(eventObject);
            }
        }

        // ------- PRIVATE ------------------------------------------

        /**
         * リスナ削除の内部処理.
         */
        private _rm(c:Closure){
            // Closure の削除
            if( c.p ){
                c.p.n = c.n;
                if( c == this.tail ){
                    this.tail = c.p;
                }
            }
            if( c.n ){
                c.n.p = c.p;
                if( c == this.head ){
                    this.head = c.n;
                }
            }
        }

    }

    // ===================================================================
    // Event の通知を管理するクラス.

    export class EventDispatcher{

        // ------- MEMBER --------------------------------------------
        
        _hash_:ClosureList[];

        // ------- PUBLIC --------------------------------------------

        constructor(){
            this._hash_ = [];
        }

        /**
         * 指定した state のイベントを Listen します.
         * @param state
         * @param closure
         * @param scope
         */
        on( state:string, closure:Function, scope:Object = this, priority:number = 0 ):EventDispatcher{
            var i:number, s:string,
                list:string[] = state.split(' '),
                len:number = list.length;
            for( i=0; i<len; i++ ){
                s = list[i];
                if( !this._hash_[s] ){
                    this._hash_[s] = new ClosureList();
                }
                this._hash_[s].add( closure, scope, priority );
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
        onWithId( state:string, closure:Function, scope:Object = this, priority:number = 0 ):number{
            if( !this._hash_[state] ){
                this._hash_[state] = new ClosureList();
            }
            return this._hash_[state].add( closure, scope, priority );
        }

        /**
         * 指定した state のイベントの Listen を解除します.
         * @param state
         * @param closure
         * @param scope
         */
        off( state:any, closure:Function = undefined, scope:Object = this ):EventDispatcher{
            if( typeof state === 'number' ){
                for( var key in this._hash_ ){
                    this._hash_[key].rmById(state);
                }
            }else if( typeof state === 'string' ){
                var i:number, s:string,
                    list:string[] = state.split(' '),
                    len:number = list.length;
                for( i=0; i<len; i++ ){
                    s = list[i];
                    if( !this._hash_[s] ){
                        continue;
                    }
                    if( typeof closure === 'undefined' ){
                        this._hash_[s].rmAll();
                    }else{
                        this._hash_[s].rm( closure, scope );
                    }
                }
            }
            return this;
        }

        /**
         * 指定した state のイベントを発行します.
         * @param state
         */
        execute( state:string, eventObject:Object = null ):void{
            if( this._hash_[state] ) this._hash_[state].exec(eventObject);
        }
        
        /**
         * 全てのリスナを破棄します.
         * この動作は取り消しが出来ません.
         */
        removeAllListeners():void{
            for( var key in this._hash_ ){
                this._hash_[key].rmAll();
            }
            this._hash_ = [];
        }

    }

    /**
     * 時間監視を行うユーティリティクラスです.
     * 利用可能であれば AnimationFrame を利用し、描画タイミングの最適化を行いやすくします.
     * 
     * @author KAWAKITA Hirofumi.
     * @version 0.1
     */
    export class Cycle extends hrfm.events.EventDispatcher{

        // ------- MEMBER --------------------------------------------

        interval    : number;
        initialTime : number;
        elapsedTime : number;
        running     : Boolean;
        
        private _onAnimate : Function;
        private _animateID : number;
        private _requestAnimationFrame:Function;
        private _cancelAnimationFrame :Function;

        // ------- PUBLIC --------------------------------------------

        constructor( interval:number = 0 ){

            super();

            this.running  = false;
            this.interval = interval;
            this.initialTime = Date.now();
            this.elapsedTime = 0;

            // アニメーション管理用の処理
            this._requestAnimationFrame =
                window['requestAnimationFrame']       ||
                window['webkitRequestAnimationFrame'] ||
                window['mozRequestAnimationFrame']    ||
                window['oRequestAnimationFrame']      ||
                window['msRequestAnimationFrame']     ||
                function(callback){ return setTimeout(callback, interval || 1 ); };

            this._cancelAnimationFrame =
                window['cancelRequestAnimationFrame']       ||
                window['webkitCancelAnimationFrame']        ||
                window['webkitCancelRequestAnimationFrame'] ||
                window['mozCancelRequestAnimationFrame']    ||
                window['oCancelRequestAnimationFrame']      ||
                window['msCancelRequestAnimationFrame']     ||
                clearTimeout;

        }

        /**
         * 監視サイクルを開始します.
         */
        start(){

            if( this.running == true ) return;

            var that = this,
                _now       : number   = 0,
                _time      : number   = Date.now(),
                _startTime : number   = _time,
                _elapsed   : number   = 0,
                _interval  : number   = this.interval;

            // 単位時間ごとの処理を最適化するか.
            if( 0 < _interval ){
                this._onAnimate = function(){
                    _now = Date.now();
                    if( _interval * 100 < _now - _time ){
                        _time = _now - _interval;
                    }
                    while( _interval <= _now - _time ){
                        _elapsed = _now - _time;
                        that.elapsedTime += _elapsed;
                        _time += _interval;
                        that.execute( 'cycle', _now - _time < _interval );
                    }
                    that._animateID = that._requestAnimationFrame.call( window, that._onAnimate );
                }
            }else{
                this._onAnimate = function(){
                    _now     = Date.now();
                    _elapsed = _now - _time;
                    that.elapsedTime += _elapsed;
                    that.execute( 'cycle', true );
                    _time = _now;
                    that._animateID = that._requestAnimationFrame.call( window, that._onAnimate );
                }
            }
            this._animateID = this._requestAnimationFrame.call( window, that._onAnimate );

            this.running = true;

            this.execute('start');

        }

        /**
         * 監視サイクルを停止します.
         */
        stop(){

            if( this.running == false ) return;

            this._onAnimate = function(){};
            this._cancelAnimationFrame.call( window, this._animateID );

            this.running = false;

            this.execute('stop');

        }

        // ------- PRIVATE -------------------------------------------

    }
}