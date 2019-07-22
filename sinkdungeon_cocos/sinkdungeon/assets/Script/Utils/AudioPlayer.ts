import { EventConstant } from "../EventConstant";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioPlayer extends cc.Component {

    public static readonly MONSTER_HIT = 'MONSTER_HIT';
    public static readonly PICK_UP = 'PICK_UP';
    public static readonly PLAYER_HIT = 'PLAYER_HIT';
    public static readonly REMOTE_LASER = 'REMOTE_LASER';
    public static readonly SHOOT = 'SHOOT';
    public static readonly BOOM = 'BOOM';
    public static readonly COIN = 'COIN';
    public static readonly MELEE = 'MELEE';
    public static readonly WALK = 'WALK';
    @property({ type: cc.AudioClip })
    monsterHit: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    pickUp: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    playerHit: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    remoteLaser: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    shoot: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    coin: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    boom: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    melee: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    walk: cc.AudioClip = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.on(EventConstant.PLAY_AUDIO
            , (event) => { this.play(event.detail.name) });
    }
    play(name: string) {
        switch (name) {
            case AudioPlayer.MONSTER_HIT:
                cc.audioEngine.playEffect(this.monsterHit, false);
                break;
            case AudioPlayer.PICK_UP:
                cc.audioEngine.playEffect(this.pickUp, false);
                break;
            case AudioPlayer.PLAYER_HIT:
                cc.audioEngine.playEffect(this.playerHit, false);
                break;
            case AudioPlayer.REMOTE_LASER:
                cc.audioEngine.playEffect(this.remoteLaser, false);
                break;
            case AudioPlayer.SHOOT:
                cc.audioEngine.playEffect(this.shoot, false);
                break;
            case AudioPlayer.BOOM:
                cc.audioEngine.playEffect(this.boom, false);
                break;
            case AudioPlayer.COIN:
                cc.audioEngine.playEffect(this.coin, false);
                break;
            case AudioPlayer.MELEE:
                cc.audioEngine.playEffect(this.melee, false);
                break;
            case AudioPlayer.WALK:
                cc.audioEngine.playEffect(this.walk, false);
                break;
        }
    }

    start() {

    }

    // update (dt) {}
}
