// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Status extends cc.Component {
    public static readonly ICE = 1;
    public static readonly FIRE = 2;
    public static readonly DIZZ = 3;
    public static readonly TOXIC = 4;
    public static readonly CURSE = 5;
    public static readonly BLEED = 5;

    anim:cc.Animation;
    label:cc.Label;
    duration:number = 0;
    isRunning:boolean = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.label = this.node.getChildByName('sprite').getChildByName('label').getComponent(cc.Label);
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
    }
    showStatus(duration:number){
        if(!this.anim){return;}
        this.anim.playAdditive('StatusShow');
        this.duration = duration;
    }
    delayTime = 0;
    private isTimeDelay(dt: number): boolean {
        this.delayTime += dt;
        if (this.delayTime > 1) {
            this.delayTime = 0;
            return true;
        }
        return false;
    }
    update (dt) {
        this.isRunning = this.duration>0;
        this.label.string = `${this.duration}`;
        if(this.isTimeDelay(dt)){
            if(this.duration > 0){
                this.duration--;
                if(this.duration < 1){
                    this.anim.play('StatusHide');
                    setTimeout(()=>{if(this.node){this.node.active = false;}},1000);
                }
            }
        }
    }
}
