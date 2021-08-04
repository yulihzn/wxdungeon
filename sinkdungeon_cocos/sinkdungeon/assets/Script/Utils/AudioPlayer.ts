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
    public static readonly MONSTER_HIT1 = 'MONSTER_HIT1';
    public static readonly MONSTER_HIT2 = 'MONSTER_HIT2';
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
    public static readonly SELECT_FAIL = 'SELECT_FAIL';
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
    public static readonly PUNCH1 = 'PUNCH1';
    public static readonly PUNCH2 = 'PUNCH2';
    public static readonly FIST = 'FIST';
    public static readonly FIST1 = 'FIST1';
    public static readonly FIST2 = 'FIST2';
    public static readonly SWORD_ATTACK = 'SWORD_ATTACK';
    public static readonly SWORD_ATTACK1 = 'SWORD_ATTACK1';
    public static readonly SWORD_ATTACK2 = 'SWORD_ATTACK2';
    public static readonly SWORD_HIT = 'SWORD_HIT';
    public static readonly SWORD_HIT1 = 'SWORD_HIT1';
    public static readonly SWORD_HIT2 = 'SWORD_HIT2';
    public static readonly BLEEDING = 'BLEEDING';
    public static readonly CASHIERING = 'CASHIERING';
    public static readonly CHICKEN = 'CHICKEN';
    public static readonly CLOSESTOOL = 'CLOSESTOOL';
    public static readonly FIREBALL = 'FIREBALL';
    public static readonly MUTANT = 'MUTANT ';
    public static readonly RELOAD = 'RELOAD ';
    public static readonly SCARABCRAWL = 'SCARABCRAWL';
    public static readonly SHOOT001 = 'SHOOT001';
    public static readonly SHOOT002 = 'SHOOT002';
    public static readonly SHOOT003 = 'SHOOT003';
    public static readonly SHOOT004 = 'SHOOT004';
    public static readonly TAKEPHOTO = 'TAKEPHOTO ';
    public static readonly TRANSPORTSHIP = 'TRANSPORTSHIP';
    public static readonly TVCOLOR = 'TVCOLOR';
    public static readonly TVWHITE = 'TVWHITE';
    public static readonly WELCOME = 'WELCOME';
    public static readonly ICEBOOM = 'ICEBOOM';
    public static readonly LEVELUP = 'LEVELUP';
    public static readonly COMPLETE = 'COMPLETE';
    public static readonly OILGOLD = 'OILGOLD';
    public static readonly DOG = 'DOG';
    @property({ type: cc.AudioClip })
    monsterHit: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    monsterHit1: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    monsterHit2: cc.AudioClip = null;
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
    selectfail: cc.AudioClip = null;
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
    zombieattack: cc.AudioClip = null;
    @property(cc.AudioClip)
    zombiespitting: cc.AudioClip = null;
    @property(cc.AudioClip)
    swordshow: cc.AudioClip = null;
    @property(cc.AudioClip)
    electricattack: cc.AudioClip = null;
    @property(cc.AudioClip)
    punch: cc.AudioClip = null;
    @property(cc.AudioClip)
    punch1: cc.AudioClip = null;
    @property(cc.AudioClip)
    punch2: cc.AudioClip = null;
    @property(cc.AudioClip)
    fist: cc.AudioClip = null;
    @property(cc.AudioClip)
    fist1: cc.AudioClip = null;
    @property(cc.AudioClip)
    fist2: cc.AudioClip = null;
    @property(cc.AudioClip)
    swordattack: cc.AudioClip = null;
    @property(cc.AudioClip)
    swordattack1: cc.AudioClip = null;
    @property(cc.AudioClip)
    swordattack2: cc.AudioClip = null;
    @property(cc.AudioClip)
    swordhit: cc.AudioClip = null;
    @property(cc.AudioClip)
    swordhit1: cc.AudioClip = null;
    @property(cc.AudioClip)
    swordhit2: cc.AudioClip = null;
    @property(cc.AudioClip)
    bleeding: cc.AudioClip = null;
    @property(cc.AudioClip)
    cashiering: cc.AudioClip = null;
    @property(cc.AudioClip)
    chicken: cc.AudioClip = null;
    @property(cc.AudioClip)
    closestool: cc.AudioClip = null;
    @property(cc.AudioClip)
    fireball: cc.AudioClip = null;
    @property(cc.AudioClip)
    mutant: cc.AudioClip = null;
    @property(cc.AudioClip)
    reload: cc.AudioClip = null;
    @property(cc.AudioClip)
    scarabcrawl: cc.AudioClip = null;
    @property(cc.AudioClip)
    shoot001: cc.AudioClip = null;
    @property(cc.AudioClip)
    shoot002: cc.AudioClip = null;
    @property(cc.AudioClip)
    shoot003: cc.AudioClip = null;
    @property(cc.AudioClip)
    shoot004: cc.AudioClip = null;
    @property(cc.AudioClip)
    takephoto: cc.AudioClip = null;
    @property(cc.AudioClip)
    transportship: cc.AudioClip = null;
    @property(cc.AudioClip)
    tvcolor: cc.AudioClip = null;
    @property(cc.AudioClip)
    tvwhite: cc.AudioClip = null;
    @property(cc.AudioClip)
    welcome: cc.AudioClip = null;
    @property(cc.AudioClip)
    iceboom: cc.AudioClip = null;
    @property(cc.AudioClip)
    levelup: cc.AudioClip = null;
    @property(cc.AudioClip)
    complete: cc.AudioClip = null;
    @property(cc.AudioClip)
    oilgold: cc.AudioClip = null;
    @property(cc.AudioClip)
    dog: cc.AudioClip = null;
    @property(cc.AudioClip)
    bg01: cc.AudioClip = null;
    @property(cc.AudioClip)
    bg02: cc.AudioClip = null;
    lastName = '';
    isSoundNeedPause = false;
    audioList: { [key: string]: cc.AudioClip } = {};
    lastBgmIndex = -1;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        EventHelper.on(EventHelper.PLAY_AUDIO, (detail) => { this.playSound(detail.name, detail.bgm, detail.loop); });
        EventHelper.on(EventHelper.STOP_ALL_AUDIO_EFFECT, (detail) => { this.stopAllEffect(); });
        cc.audioEngine.setMusicVolume(0.2);
        cc.audioEngine.setEffectsVolume(0.4);
        this.audioList[AudioPlayer.MONSTER_HIT] = this.monsterHit;
        this.audioList[AudioPlayer.MONSTER_HIT1] = this.monsterHit1;
        this.audioList[AudioPlayer.MONSTER_HIT2] = this.monsterHit2;
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
        this.audioList[AudioPlayer.SELECT_FAIL] = this.selectfail;
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
        this.audioList[AudioPlayer.PUNCH1] = this.punch1;
        this.audioList[AudioPlayer.PUNCH2] = this.punch2;
        this.audioList[AudioPlayer.SWORD_ATTACK] = this.swordattack;
        this.audioList[AudioPlayer.SWORD_ATTACK1] = this.swordattack1;
        this.audioList[AudioPlayer.SWORD_ATTACK2] = this.swordattack2;
        this.audioList[AudioPlayer.SWORD_HIT] = this.swordhit;
        this.audioList[AudioPlayer.SWORD_HIT1] = this.swordhit1;
        this.audioList[AudioPlayer.SWORD_HIT2] = this.swordhit2;
        this.audioList[AudioPlayer.FIST] = this.fist;
        this.audioList[AudioPlayer.FIST1] = this.fist1;
        this.audioList[AudioPlayer.FIST2] = this.fist2;
        this.audioList[AudioPlayer.BLEEDING] = this.bleeding;
        this.audioList[AudioPlayer.CASHIERING] = this.cashiering;
        this.audioList[AudioPlayer.CHICKEN] = this.chicken;
        this.audioList[AudioPlayer.CLOSESTOOL] = this.closestool;
        this.audioList[AudioPlayer.FIREBALL] = this.fireball;
        this.audioList[AudioPlayer.MUTANT] = this.mutant;
        this.audioList[AudioPlayer.RELOAD] = this.reload;
        this.audioList[AudioPlayer.SCARABCRAWL] = this.scarabcrawl;
        this.audioList[AudioPlayer.SHOOT001] = this.shoot001;
        this.audioList[AudioPlayer.SHOOT002] = this.shoot002;
        this.audioList[AudioPlayer.SHOOT003] = this.shoot003;
        this.audioList[AudioPlayer.SHOOT004] = this.shoot004;
        this.audioList[AudioPlayer.TAKEPHOTO] = this.takephoto;
        this.audioList[AudioPlayer.TRANSPORTSHIP] = this.transportship;
        this.audioList[AudioPlayer.TVCOLOR] = this.tvcolor;
        this.audioList[AudioPlayer.TVWHITE] = this.tvwhite;
        this.audioList[AudioPlayer.WELCOME] = this.welcome;
        this.audioList[AudioPlayer.ICEBOOM] = this.iceboom;
        this.audioList[AudioPlayer.LEVELUP] = this.levelup;
        this.audioList[AudioPlayer.COMPLETE] = this.complete;
        this.audioList[AudioPlayer.OILGOLD] = this.oilgold;
        this.audioList[AudioPlayer.DOG] = this.dog;

    }
    playbg() {
        let bgms = [this.bg01, this.bg02];
        let clip = bgms[Logic.lastBgmIndex];
        if (clip && (!cc.audioEngine.isMusicPlaying() || this.lastBgmIndex != Logic.lastBgmIndex)) {
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(clip, true);
            this.lastBgmIndex = Logic.lastBgmIndex;
        }

    }
    private stopAllEffect() {
        cc.audioEngine.stopAllEffects();
    }
    private playSound(name: string, isBgm: boolean, loop: boolean) {
        if (name == this.lastName && this.isSoundNeedPause) {
            return;
        }
        if (isBgm) {
            switch (name) {
                case AudioPlayer.STOP_BG:
                    cc.audioEngine.stopMusic();
                    break;
                case AudioPlayer.PLAY_BG:
                    this.playbg();
                    break;
            }
        } else if (this.audioList[name]) {
            cc.audioEngine.playEffect(this.audioList[name], loop);

        }
        this.lastName = name;
        this.isSoundNeedPause = true;
        this.scheduleOnce(() => {
            this.isSoundNeedPause = false;
        }, 0.05)
    }

    static play(audioName: string, bgm?: boolean, loop?: boolean) {
        EventHelper.emit(EventHelper.PLAY_AUDIO, { name: audioName, bgm: bgm, loop: loop });
    }
    static stopAllEffect() {
        EventHelper.emit(EventHelper.STOP_ALL_AUDIO_EFFECT, {});
    }
}
