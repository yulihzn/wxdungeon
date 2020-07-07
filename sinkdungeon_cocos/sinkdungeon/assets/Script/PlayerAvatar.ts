// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerAvatar extends cc.Component {

    static readonly DIR_UP = 0;
    static readonly DIR_DOWN = 1;
    static readonly DIR_LEFT = 2;
    static readonly DIR_RIGHT = 3;
    static readonly IDLE = 0;
    static readonly WALK = 1;
    static readonly HURT = 2;
    static readonly ATTACK = 3;
    static readonly DIED = 4;
    dir = PlayerAvatar.DIR_RIGHT;
    status = PlayerAvatar.IDLE;
    anim: cc.Animation;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
    }
    playAnim(status: number,dir:number) {
        if(!this.anim){
            this.anim = this.getComponent(cc.Animation);
        }
        switch (status) {
            case PlayerAvatar.IDLE:
                if(this.status != status){
                    this.anim.play('AvatarIdle');
                }
                break;
            case PlayerAvatar.WALK:
                if(this.status != status||this.dir != dir){
                    this.anim.play(dir<2?'AvatarWalkVertical':'AvatarWalkHorizontal'); break;
                }
            case PlayerAvatar.HURT: break;
            case PlayerAvatar.ATTACK: break;
            case PlayerAvatar.DIED: break;
        }
        this.status = status;
        this.dir = dir;
    }

    start() {

    }

    // update (dt) {}
}
