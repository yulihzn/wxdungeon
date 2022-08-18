import { EventHelper } from '../logic/EventHelper'
import Logic from '../logic/Logic'
import LoadingManager from '../manager/LoadingManager'

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator

@ccclass
export default class AudioPlayer extends cc.Component {
    public static readonly BATHING = 'bathing'
    public static readonly BGM001 = 'bgm001'
    public static readonly BGM002 = 'bgm002'
    public static readonly BGM003 = 'bgm003'
    public static readonly BLEEDING = 'bleeding'
    public static readonly BUBBLE = 'bubble'
    public static readonly BLINK = 'blink'
    public static readonly BOOM = 'boom'
    public static readonly BOSS_ICEDEMON_ATTACK = 'bossicedemonattack'
    public static readonly BOSS_ICEDEMON_DASH = 'bossicedemondash'
    public static readonly BOSS_ICEDEMON_DEFEND = 'bossicedemondefend'
    public static readonly BOSS_ICEDEMON_HIT = 'bossicedemonhit'
    public static readonly BOSS_ICEDEMON_THRON = 'bossicedemonthron'
    public static readonly CASHIERING = 'cashiering'
    public static readonly CAT = 'cat'
    public static readonly CHICKEN = 'chicken'
    public static readonly CLOSESTOOL = 'closestool'
    public static readonly COIN = 'coin'
    public static readonly COIN1 = 'coin1'
    public static readonly COIN2 = 'coin2'
    public static readonly COMPLETE = 'complete'
    public static readonly DAGGER_ATTACK = 'dagger'
    public static readonly DAGGER_ATTACK1 = 'dagger1'
    public static readonly DAGGER_ATTACK2 = 'dagger2'
    public static readonly DASH = 'dash'
    public static readonly DIE = 'die'
    public static readonly DOG = 'dog'
    public static readonly DOLLDOWN = 'dolldown'
    public static readonly DOLLMACHINE = 'dollmachine'
    public static readonly DRINK = 'drink'
    public static readonly ELECTRIC_ATTACK = 'electricattack'
    public static readonly EXIT = 'exit'
    public static readonly FEED_FISH = 'feedfish'
    public static readonly FIREBALL = 'fireball'
    public static readonly FISHTANK = 'fishtank'
    public static readonly FIST = 'fist'
    public static readonly FIST1 = 'fist1'
    public static readonly FIST2 = 'fist2'
    public static readonly FLASHLIGHT = 'flashlight'
    public static readonly ICEBOOM = 'iceboom'
    public static readonly JUMP = 'jump'
    public static readonly JUMP_WATER = 'jumpwater'
    public static readonly LASER = 'laser'
    public static readonly LEVELUP = 'levelup'
    public static readonly MELEE = 'melee'
    public static readonly MELEE_PARRY = 'meleeparry'
    public static readonly MELEE_REFLECT = 'meleereflect'
    public static readonly MELEE_REFLECT1 = 'meleereflect1'
    public static readonly MELEE_REFLECT_WALL = 'meleereflectwall'
    public static readonly MELEE_REFLECT_WALL1 = 'meleereflectwall1'
    public static readonly MONSTER_HIT = 'monsterhit'
    public static readonly MONSTER_HIT1 = 'monsterhit1'
    public static readonly MONSTER_HIT2 = 'monsterhit2'
    public static readonly MOUSE = 'mouse'
    public static readonly MUTANT = 'mutant'
    public static readonly OILGOLD = 'oildgold'
    public static readonly PICK_ITEM = 'pickitem'
    public static readonly PICK_UP = 'pickup'
    public static readonly PLAYER_HIT = 'playerhit'
    public static readonly PUNCH = 'punch'
    public static readonly PUNCH1 = 'punch1'
    public static readonly PUNCH2 = 'punch2'
    public static readonly RAINDROP = 'raindrop'
    public static readonly RELOAD = 'reload'
    public static readonly SCARABCRAWL = 'scarabcrawl'
    public static readonly SELECT = 'select'
    public static readonly SELECT_FAIL = 'selectfail'
    public static readonly SENBON = 'senbon'
    public static readonly SHOOT = 'shoot'
    public static readonly SHOOT001 = 'shoot001'
    public static readonly SHOOT002 = 'shoot002'
    public static readonly SHOOT003 = 'shoot003'
    public static readonly SHOOT004 = 'shoot004'
    public static readonly SILENCE = 'silence'
    public static readonly SKILL_FIREBALL = 'skillfireball'
    public static readonly SKILL_ICETHRON = 'skillicethron'
    public static readonly SKILL_MAGICBALL = 'skillmagicball'
    public static readonly SKILL_MAGICBALL1 = 'skillmagicball1'
    public static readonly STICK_ATTACK = 'stickattack'
    public static readonly STICK_ATTACK1 = 'stickattack1'
    public static readonly STICK_ATTACK2 = 'stickattack2'
    public static readonly STICK_ATTACK3 = 'stickattack3'
    public static readonly SWIMMING = 'swimming'
    public static readonly SWORD_ATTACK = 'swordattack'
    public static readonly SWORD_ATTACK1 = 'swordattack1'
    public static readonly SWORD_ATTACK2 = 'swordattack2'
    public static readonly SWORD_HIT = 'swordhit'
    public static readonly SWORD_HIT1 = 'swordhit1'
    public static readonly SWORD_HIT2 = 'swordhit2'
    public static readonly SWORD_SHOW = 'swordshow'
    public static readonly SMOKE_BALL = 'smokeball'
    public static readonly TAKEPHOTO = 'takephoto'
    public static readonly TRANSPORTSHIP = 'transportship'
    public static readonly TRASH = 'trash'
    public static readonly TVCOLOR = 'tvcolor'
    public static readonly TVWHITE = 'tvwhite'
    public static readonly VOICE = 'voice'
    public static readonly WALK = 'walk'
    public static readonly WATERDISPENSER = 'waterdispenser'
    public static readonly WATERFALL = 'waterfall'
    public static readonly WELCOME = 'welcome'
    public static readonly WENTLINE_OPEN = 'wentlineopen'
    public static readonly WENTLINE_SHOW = 'wentlineshow'
    public static readonly ZOMBIE_ATTACK = 'zombieattack'
    public static readonly ZOMBIE_FALL = 'zombiefall'
    public static readonly ZOMBIE_SPITTING = 'zombiespitting'
    public static readonly ZOMBIE_SPITTING1 = 'zombiespitting1'

    public static readonly STOP_BG = 'STOP_BG'
    public static readonly PLAY_BG = 'PLAY_BG'

    @property({ type: cc.AudioClip })
    select: cc.AudioClip = null
    @property({ type: cc.AudioClip })
    selectfail: cc.AudioClip = null
    @property(cc.AudioClip)
    transportship: cc.AudioClip = null
    lastName = ''
    isSoundNeedPause = false
    lastBgmIndex = -1
    private effectMap: Map<string, number> = new Map()
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        EventHelper.on(EventHelper.PLAY_AUDIO, detail => {
            this.playSound(detail.name, detail.bgm, detail.loop)
        })
        EventHelper.on(EventHelper.STOP_ALL_AUDIO_EFFECT, detail => {
            this.stopAllEffect()
        })
        EventHelper.on(EventHelper.STOP_AUDIO_EFFECT, detail => {
            this.stopEffect(detail.name)
        })
        cc.audioEngine.setMusicVolume(0.1)
        cc.audioEngine.setEffectsVolume(0.4)
        Logic.audioClips[AudioPlayer.SELECT] = this.select
        Logic.audioClips[AudioPlayer.SELECT_FAIL] = this.selectfail
        Logic.audioClips[AudioPlayer.TRANSPORTSHIP] = this.transportship
    }
    playbg() {
        LoadingManager.loadAllBundle([LoadingManager.AB_BGM], () => {
            let bgms = [Logic.bgmClips[AudioPlayer.BGM001], Logic.bgmClips[AudioPlayer.BGM002], Logic.bgmClips[AudioPlayer.BGM003]]
            let clip = bgms[Logic.lastBgmIndex]
            if (clip && (!cc.audioEngine.isMusicPlaying() || this.lastBgmIndex != Logic.lastBgmIndex)) {
                cc.audioEngine.stopMusic()
                let audioId = cc.audioEngine.playMusic(clip, true)
                this.effectMap.set(clip.name, audioId)
                this.lastBgmIndex = Logic.lastBgmIndex
            }
        })
    }
    private stopAllEffect() {
        cc.audioEngine.stopAllEffects()
    }
    private stopEffect(name: string) {
        if (this.effectMap.has(name)) {
            cc.audioEngine.stopEffect(this.effectMap.get(name))
        }
    }
    private playSound(name: string, isBgm: boolean, loop: boolean) {
        if (name == this.lastName && name == AudioPlayer.COIN && this.isSoundNeedPause) {
            return
        }
        if (isBgm) {
            switch (name) {
                case AudioPlayer.STOP_BG:
                    cc.audioEngine.stopMusic()
                    break
                case AudioPlayer.PLAY_BG:
                    this.playbg()
                    break
            }
        } else if (Logic.audioClips[name]) {
            let audioId = cc.audioEngine.playEffect(Logic.audioClips[name], loop)
            this.effectMap.set(name, audioId)
        }
        this.lastName = name
        this.isSoundNeedPause = false
        if (name == AudioPlayer.COIN) {
            this.isSoundNeedPause = true
            this.scheduleOnce(() => {
                this.isSoundNeedPause = false
            }, 0.05)
        }
    }

    static play(audioName: string, bgm?: boolean, loop?: boolean) {
        EventHelper.emit(EventHelper.PLAY_AUDIO, { name: audioName, bgm: bgm, loop: loop })
    }
    static stopAllEffect() {
        EventHelper.emit(EventHelper.STOP_ALL_AUDIO_EFFECT, {})
    }
    static stopEffect(name: string) {
        EventHelper.emit(EventHelper.STOP_AUDIO_EFFECT, { name: name })
    }
}
