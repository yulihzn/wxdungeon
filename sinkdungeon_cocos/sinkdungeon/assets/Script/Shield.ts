import Logic from "./Logic";
import PlayerAvatar from "./PlayerAvatar";
import EquipmentData from "./Data/EquipmentData";
import Equipment from "./Equipment/Equipment";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shield extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    private status = -1;
    static readonly STATUS_IDLE = 0;
    static readonly STATUS_REFLECT = 1;
    static readonly STATUS_DEFEND = 2;
    static readonly STATUS_TRANSFORM = 3;
    data: EquipmentData = new EquipmentData();
    get Status() {
        return this.status;
    }
    onLoad() {
    }
    private changeStatus(status: number) {
        switch (status) {
            case Shield.STATUS_IDLE:
                break;
            case Shield.STATUS_REFLECT:
                break;
            case Shield.STATUS_DEFEND:
                break;
            case Shield.STATUS_TRANSFORM:
                break;
            default:
                break;
        }
    }
    private playIdle() {
        if (this.status == Shield.STATUS_TRANSFORM || this.status == Shield.STATUS_IDLE) {
            return;
        }
        this.status = Shield.STATUS_IDLE;
        let idle = cc.tween().to(0.2, { y: 2 }).to(0.2, { y: -2 });
        cc.tween(this.sprite.node).repeatForever(idle).start();
    }
    private playReflect() {
        if (this.status == Shield.STATUS_TRANSFORM
            || this.status == Shield.STATUS_DEFEND
            || this.status == Shield.STATUS_REFLECT) {
            return;
        }
        this.status = Shield.STATUS_REFLECT;
        cc.tween(this.node).delay(0.2).call(()=>{
            this.playIdle();
        }).start();
    }
    private playDefend() {
        if (this.status == Shield.STATUS_TRANSFORM
            || this.status == Shield.STATUS_DEFEND
            || this.status == Shield.STATUS_REFLECT) {
            return;
        }
        this.status = Shield.STATUS_TRANSFORM;
        cc.tween(this.node).delay(0.1).call(()=>{
            this.status = Shield.STATUS_DEFEND;
        }).start();
    }
    private playPutDown(){
        if (this.status == Shield.STATUS_TRANSFORM
            || this.status == Shield.STATUS_IDLE
            || this.status == Shield.STATUS_REFLECT) {
            return;
        }
        this.status = Shield.STATUS_TRANSFORM;
        cc.tween(this.node).delay(0.2).call(()=>{
            this.playIdle();
        }).start();
    }

    changeZIndexByDir(avatarZindex: number, dir: number) {
        let currentIndex = avatarZindex - 2;
        switch (dir) {
            case PlayerAvatar.DIR_UP:
                currentIndex = avatarZindex + 2;
                this.node.position = cc.v3(0, 32);
                this.node.color = cc.Color.WHITE;
                break;
            case PlayerAvatar.DIR_DOWN:
                currentIndex = avatarZindex - 2;
                this.node.position = cc.v3(0, 48);
                this.node.color =  cc.Color.GRAY;
                break;
            case PlayerAvatar.DIR_LEFT:
            case PlayerAvatar.DIR_RIGHT:
                this.node.position = cc.v3(-16, 48);
                currentIndex = avatarZindex - 2;
                this.node.color =  cc.Color.GRAY;
                break;
        }
        this.node.zIndex = currentIndex;
    }
    use(isReflect:boolean) {
        if (this.data.equipmetType != Equipment.SHIELD) {
            return;
        }
        if(isReflect){
            this.playReflect();
        }else{
            if(this.status == Shield.STATUS_DEFEND){
                this.playDefend();
            }else{
                this.playPutDown();
            }
        }
    }
    changeRes(resName: string) {
        if (!resName || resName.length < 1) {
            return;
        }
        this.sprite.spriteFrame = Logic.spriteFrames[resName];
        if(this.data.equipmetType == Equipment.SHIELD){
            this.playIdle();
        }
    }
}