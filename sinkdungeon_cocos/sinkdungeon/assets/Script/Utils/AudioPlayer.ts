import { EventHelper } from "../EventHelper";
import Random from "./Random";
import Logic from "../Logic";
import RoomType from "../Rect/RoomType";

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
    public static readonly DASH = 'DASH';
    public static readonly DIE = 'DIE';
    public static readonly PICK_ITEM = 'PICK_ITEM';
    public static readonly EXIT = 'EXIT';
    public static readonly STOP_BG = 'STOP_BG';
    public static readonly PLAY_BG = 'PLAY_BG';
    public static readonly SELECT = 'SELECT';
    public static readonly BLINK = 'BLINK';
    public static readonly BOSS_ICEDEMON_DASH = 'BOSS_ICEDEMON_DASH';
    public static readonly BOSS_ICEDEMON_DEFEND = 'BOSS_ICEDEMON_DEFEND';
    public static readonly BOSS_ICEDEMON_HIT = 'BOSS_ICEDEMON_HIT';
    public static readonly BOSS_ICEDEMON_THRON = 'BOSS_ICEDEMON_THRON';
    public static readonly BOOS_ICEDEMON_ATTACK = 'BOOS_ICEDEMON_ATTACK';
    public static readonly MELEE_PARRY = 'MELEE_PARRY';
    public static readonly RAINDROP = 'RAINDROP';
    public static readonly SKILL_FIREBALL = 'SKILL_FIREBALL';
    public static readonly SKILL_ICETHRON = 'SKILL_ICETHRON';
    public static readonly SKILL_MAGICBALL = 'SKILL_MAGICBALL';
    public static readonly SKILL_MAGICBALL1 = 'SKILL_MAGICBALL';
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
    dash: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    die: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    exit: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    pickItem: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    melee: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    walk: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    blink: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    select: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    bossicedemonattack: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    meleereflect: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    raindrop: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    skillfireball: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    skillicethron: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    skillmagicball: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    skillmagicball1: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    bossicedemondash: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    bossicedemondefend: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    bossicedemonhit: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    bossicedemonthron: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    bg01: cc.AudioClip = null;
  
   
 
    

    lastName = '';
    isSoundNeedPause = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        EventHelper.on(EventHelper.PLAY_AUDIO, (detail) => { this.playSound(detail.name); });
        cc.audioEngine.setMusicVolume(0.1);
        cc.audioEngine.setEffectsVolume(0.3);
    }
    playbg() {
        let bgms = [this.bg01]
        if (Logic.lastBgmIndex == -1 || Logic.lastBgmIndex > bgms.length - 1) {
            Logic.lastBgmIndex = Random.getRandomNum(0, bgms.length - 1);
        }
        let clip = bgms[bgms.length-1];
        if (clip&&!cc.audioEngine.isMusicPlaying) {
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(clip, true);
        }

    }
    private playSound(name: string) {
        if (name == this.lastName && this.isSoundNeedPause) {
            return;
        }
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
            case AudioPlayer.EXIT:
                cc.audioEngine.playEffect(this.exit, false);
                break;
            case AudioPlayer.DASH:
                cc.audioEngine.playEffect(this.dash, false);
                break;
            case AudioPlayer.DIE:
                cc.audioEngine.playEffect(this.die, false);
                break;
            case AudioPlayer.PICK_ITEM:
                cc.audioEngine.playEffect(this.pickItem, false);
                break;
            case AudioPlayer.SELECT:
                cc.audioEngine.playEffect(this.select, false);
                break;
            case AudioPlayer.BLINK:
                cc.audioEngine.playEffect(this.blink, false);
                break;
            case AudioPlayer.BOSS_ICEDEMON_DASH:
                cc.audioEngine.playEffect(this.bossicedemondash, false);
                break;
            case AudioPlayer.BOSS_ICEDEMON_DEFEND:
                cc.audioEngine.playEffect(this.bossicedemondefend, false);
                break;
            case AudioPlayer.BOSS_ICEDEMON_HIT:
                cc.audioEngine.playEffect(this.bossicedemonhit, false);
                break;
            case AudioPlayer.BOSS_ICEDEMON_THRON:
                cc.audioEngine.playEffect(this.bossicedemonthron, false);
                break;
            case AudioPlayer.BOOS_ICEDEMON_ATTACK:
                cc.audioEngine.playEffect(this.bossicedemonattack, false);
                break;
            case AudioPlayer.MELEE_PARRY:
                cc.audioEngine.playEffect(this.meleereflect, false);
                break;
            case AudioPlayer.RAINDROP:
                cc.audioEngine.playEffect(this.raindrop, false);
                break;
            case AudioPlayer.SKILL_FIREBALL:
                cc.audioEngine.playEffect(this.skillfireball, false);
                break;
            case AudioPlayer.SKILL_ICETHRON:
                cc.audioEngine.playEffect(this.skillicethron, false);
                break;
            case AudioPlayer.SKILL_MAGICBALL:
                cc.audioEngine.playEffect(this.skillmagicball, false);
                break;
            case AudioPlayer.SKILL_MAGICBALL1:
                cc.audioEngine.playEffect(this.skillmagicball1, false);
                break;
            case AudioPlayer.STOP_BG:
                cc.audioEngine.stopMusic();
                break;
            case AudioPlayer.PLAY_BG:
                this.playbg();
                break;
        }
        this.lastName = name;
        this.isSoundNeedPause = true;
        this.scheduleOnce(() => {
            this.isSoundNeedPause = false;
        }, 0.1)
    }

    static play(audioName: string,delayTime?:number) {
        EventHelper.emit(EventHelper.PLAY_AUDIO, { name: audioName });
    }
}
