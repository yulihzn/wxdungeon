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
export default class HealthBar extends cc.Component {

    @property(cc.Node)
    backbar: cc.Node = null;
    @property(cc.Label)
    label:cc.Label = null;

    progressBar:cc.ProgressBar;
    private timeDelay = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.progressBar = this.getComponent(cc.ProgressBar);
        this.progressBar.progress = 0.3;
    }

    start () {
        
    }
    refreshHealth(currentHealth:number,maxHealth:number): void {
        this.progressBar.progress = currentHealth/maxHealth;
        if(this.label){
            this.label.string=`${currentHealth}/${maxHealth}`;
        }
	}
    update (dt) {
        this.timeDelay += dt;
        if (this.timeDelay > 0.016) {
            this.timeDelay = 0;
        }
        this.backbar.width = this.lerp(this.backbar.width,this.progressBar.barSprite.node.width,dt*3);
    }
    lerp(a, b, r) {
        return a + (b - a) * r;
    };
}
