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
    public static readonly WENTLINE_OPEN = 'WENTLINE_OPEN';
    public static readonly WENTLINE_SHOW = 'WENTLINE_SHOW';
    public static readonly ZOMBIE_ATTACK = 'ZOMBIE_ATTACK';
    public static readonly ZOMBIE_SPITTING = 'ZOMBIE_SPITTING';
    public static readonly SWORD_SHOW = 'SWORD_SHOW';
    public static readonly ELECTRIC_ATTACK = 'ELECTRIC_ATTACK';
    public static readonly PUNCH = 'PUNCH';
    public static readonly FIST = 'FIST';
    public static readonly SWORD_ATTACK = 'SWORD_ATTACK';
    public static readonly SWORD_HIT = 'SWORD_HIT';
    public static readonly BLEEDING = 'BLEEDING';
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
    wentlineopen: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    wentlineshow: cc.AudioClip = null;
    @property(cc.AudioClip)
    zombieattack:cc.AudioClip=null;
    @property(cc.AudioClip)
    zombiespitting:cc.AudioClip=null;
    @property(cc.AudioClip)
    swordshow:cc.AudioClip=null;
    @property(cc.AudioClip)
    electricattack:cc.AudioClip=null;
    @property(cc.AudioClip)
    punch:cc.AudioClip=null;
    @property(cc.AudioClip)
    fist:cc.AudioClip=null;
    @property(cc.AudioClip)
    swordattack:cc.AudioClip=null;
    @property(cc.AudioClip)
    swordhit:cc.AudioClip=null;
    @property(cc.AudioClip)
    bleeding:cc.AudioClip=null;
    @property({ type: cc.AudioClip })
    bg01: cc.AudioClip = null;

    lastName = '';
    isSoundNeedPause = false;
    audioList: { [key: string]: cc.AudioClip } = {};
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        EventHelper.on(EventHelper.PLAY_AUDIO, (detail) => { this.playSound(detail.name,detail.bgm); });
        cc.audioEngine.setMusicVolume(0.1);
        cc.audioEngine.setEffectsVolume(0.3);
        this.audioList[AudioPlayer.MONSTER_HIT] = this.monsterHit;
        this.audioList[AudioPlayer.PICK_UP] = this.pickUp;
        this.audioList[AudioPlayer.PLAYER_HIT] = this.playerHit;
        this.audioList[AudioPlayer.REMOTE_LASER] = this.remoteLaser;
        this.audioList[AudioPlayer.SHOOT] = this.shoot;
        this.audioList[AudioPlayer.BOOM] = this.boom;
        this.audioList[AudioPlayer.COIN] = this.coin;
        this.audioList[AudioPlayer.MELEE] = this.melee;
        this.audioList[AudioPlayer.WALK] = this.walk;
        this.audioList[AudioPlayer.EXIT] = this.exit;
        this.audioList[AudioPlayer.DASH] = this.dash;
        this.audioList[AudioPlayer.DIE] = this.die;
        this.audioList[AudioPlayer.PICK_ITEM] = this.pickItem;
        this.audioList[AudioPlayer.SELECT] = this.select;
        this.audioList[AudioPlayer.BLINK] = this.blink;
        this.audioList[AudioPlayer.BOSS_ICEDEMON_DASH] = this.bossicedemondash;
        this.audioList[AudioPlayer.BOSS_ICEDEMON_DEFEND] = this.bossicedemondefend;
        this.audioList[AudioPlayer.BOSS_ICEDEMON_HIT] = this.bossicedemonhit;
        this.audioList[AudioPlayer.BOSS_ICEDEMON_THRON] = this.bossicedemonthron;
        this.audioList[AudioPlayer.BOOS_ICEDEMON_ATTACK] = this.bossicedemonattack;
        this.audioList[AudioPlayer.MELEE_PARRY] = this.meleereflect;
        this.audioList[AudioPlayer.RAINDROP] = this.raindrop;
        this.audioList[AudioPlayer.SKILL_FIREBALL] = this.skillfireball;
        this.audioList[AudioPlayer.SKILL_ICETHRON] = this.skillicethron;
        this.audioList[AudioPlayer.SKILL_MAGICBALL] = this.skillmagicball;
        this.audioList[AudioPlayer.SKILL_MAGICBALL1] = this.skillmagicball1;
        this.audioList[AudioPlayer.WENTLINE_OPEN] = this.wentlineopen;
        this.audioList[AudioPlayer.WENTLINE_SHOW] = this.wentlineshow;
        this.audioList[AudioPlayer.ZOMBIE_ATTACK] = this.zombieattack;
        this.audioList[AudioPlayer.ZOMBIE_SPITTING] = this.zombiespitting;
        this.audioList[AudioPlayer.SWORD_SHOW] = this.swordshow;
        this.audioList[AudioPlayer.ELECTRIC_ATTACK] = this.electricattack;
        this.audioList[AudioPlayer.PUNCH] = this.punch;
        this.audioList[AudioPlayer.SWORD_ATTACK] = this.swordattack;
        this.audioList[AudioPlayer.SWORD_HIT] = this.swordhit;
        this.audioList[AudioPlayer.FIST] = this.fist;
        this.audioList[AudioPlayer.BLEEDING] = this.bleeding;

    }
    playbg() {
        let bgms = [this.bg01]
        if (Logic.lastBgmIndex == -1 || Logic.lastBgmIndex > bgms.length - 1) {
            Logic.lastBgmIndex = Random.getRandomNum(0, bgms.length - 1);
        }
        let clip = bgms[bgms.length - 1];
        if (clip && !cc.audioEngine.isMusicPlaying()) {
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(clip, true);
        }

    }
    private playSound(name: string,isBgm:boolean) {
        if (name == this.lastName && this.isSoundNeedPause) {
            return;
        }
        if(isBgm){
            switch (name) {
                case AudioPlayer.STOP_BG:
                    cc.audioEngine.stopMusic();
                    break;
                case AudioPlayer.PLAY_BG:
                    this.playbg();
                    break;
            }
        }else if(this.audioList[name]){
            cc.audioEngine.playEffect(this.audioList[name], false);
        }
        this.lastName = name;
        this.isSoundNeedPause = true;
        this.scheduleOnce(() => {
            this.isSoundNeedPause = false;
        }, 0.1)
    }

    static play(audioName: string, bgm?: boolean) {
        EventHelper.emit(EventHelper.PLAY_AUDIO, { name: audioName ,bgm:bgm});
    }
}
