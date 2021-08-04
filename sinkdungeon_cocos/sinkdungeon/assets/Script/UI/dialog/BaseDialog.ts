// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseDialog extends cc.Component {


    bg:cc.Node = null;
    dialogBg:cc.Node=null;
    private dismissCallBack:Function;
    private cancelOutSide = true;
    _isAniming = false;
    get isAniming(){
        return this._isAniming;
    }
    get isShow(){
        return this.node.active == true;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bg = this.node.getChildByName('bg');
        this.dialogBg = this.node.getChildByName('dialogbg');
        this.bg.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if(this.cancelOutSide){
                this.dismiss();
            }
        }, this);
    }

    start () {

    }
    setCanceledOnTouchOutside(flag:boolean){
        this.cancelOutSide = flag;
    }
    show(){
        if(this._isAniming){
            return;
        }
        this._isAniming = true;
        this.node.active = true;
        this.node.opacity = 255;
        this.node.scale = 0;
        cc.tween(this.node).to(0.1,{scale:0.1}).to(0.1,{scaleX:1}).to(0.1,{scaleY:1}).call(()=>{
            this._isAniming = false;
        }).start();
    }
    dismiss(){
        if(this._isAniming){
            return;
        }
        this._isAniming = true;
        cc.tween(this.node).to(0.1,{scaleY:0.1}).to(0.1,{scaleX:0}).to(0.1,{opacity:0}).call(()=>{
            this.node.active = false;
            this._isAniming = false;
            if(this.dismissCallBack){
                this.dismissCallBack();
            }
        }).start();
    }
    onDismissListener(callback:Function){
        this.dismissCallBack = callback;
    }

    // update (dt) {}
}
