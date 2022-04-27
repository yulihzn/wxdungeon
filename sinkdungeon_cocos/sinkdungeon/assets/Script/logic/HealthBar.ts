// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class HealthBar extends cc.Component {
    static readonly ICON_SIZE = 17;
    @property(cc.Node)
    backbar: cc.Node = null;
    @property(cc.Label)
    label: cc.Label = null;
    @property
    isPlayer = false;

    progressBar: cc.ProgressBar;
    private timeDelay = 0;
    hideWhenFull = false
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.progressBar = this.getComponent(cc.ProgressBar);
        this.progressBar.progress = 1;
    }

    start() {

    }
    refreshHealth(currentHealth: number, maxHealth: number): void {
        if (this.progressBar) {
            if (this.isPlayer) {
                this.progressBar.totalLength = maxHealth * HealthBar.ICON_SIZE;
                this.node.width = this.progressBar.totalLength;
            }
            this.progressBar.progress = currentHealth / maxHealth;
            if (this.label) {
                this.label.string = `${parseFloat(currentHealth.toFixed(1))}/${maxHealth}`;
            }

        }
    }
    shake() {
        cc.tween(this.node).to(0.05, { scale: 1.05 }).to(0.05, { scale: 0.95 }).to(0.1, { scale: 1.05 }).to(0.05, { scale: 1 }).start();
    }
    update(dt) {
        this.backbar.width = this.lerp(this.backbar.width, this.progressBar.barSprite.node.width, dt * 5);
        if (this.hideWhenFull) {
            if (this.progressBar.progress == 1) {
                this.node.opacity = 0
            } else {
                this.node.opacity = 255
            }
        }
    }
    lerp(a: number, b: number, r: number) {
        return a + (b - a) * r;
    }
}
