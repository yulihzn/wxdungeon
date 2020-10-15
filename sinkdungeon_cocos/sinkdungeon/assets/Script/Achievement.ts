import AchievementData from "./Data/AchievementData";
import AudioPlayer from "./Utils/AudioPlayer";

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
export default class Achievements extends cc.Component {

    readonly MONSTER_SIZE = 25;
    readonly BOSS_SIZE = 9;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    contentBottom: cc.Node = null;
    @property(cc.Prefab)
    prefab: cc.Prefab = null;
    @property(cc.Label)
    lifesLabel: cc.Label = null;
    @property(cc.Label)
    coinLabel: cc.Label = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;
    //图片资源
    spriteFrames: { [key: string]: cc.SpriteFrame } = null;
    bossSpriteFrames: { [key: string]: cc.SpriteFrame } = null;
    // LIFE-CYCLE CALLBACKS:
    iconList: cc.Sprite[] = new Array();
    isMonsterLoaded = false;
    isBossLoaded = false;

    onLoad() {
        this.content.removeAllChildren();
        this.contentBottom.removeAllChildren();
        for (let i = 0; i < this.MONSTER_SIZE + this.BOSS_SIZE; i++) {
            let icon = cc.instantiate(this.prefab);
            if (i > this.MONSTER_SIZE - 1) {
                this.contentBottom.addChild(icon);
            } else {
                this.content.addChild(icon);
            }
            let sprite = icon.getChildByName('sprite');
            sprite.color = cc.color(0, 0, 0);
            this.iconList.push(sprite.getComponent(cc.Sprite));
        }
        this.loadSpriteFrames();
        this.loadBossSpriteFrames();
        let data: AchievementData = Achievements.getAchievementData();
        if (this.lifesLabel && data.playerLifes) {
            this.lifesLabel.string = `DIE ${data.playerLifes}`;
        }
        if(this.goldLabel){
            let o = cc.sys.localStorage.getItem('oilgold');
            this.goldLabel.string = `${o ? parseInt(o) : 0}`;
        }
        if(this.coinLabel){
            let c = cc.sys.localStorage.getItem('coin');
            this.coinLabel.string = `${c ? parseInt(c) : 0}`;
        }
    }
    loadSpriteFrames() {
        if (this.spriteFrames) {
            this.isMonsterLoaded = true;
            return;
        }
        cc.resources.load('Texture/texures', cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
            this.spriteFrames = {};
            for (let frame of atlas.getSpriteFrames()) {
                this.spriteFrames[frame.name] = frame;
            }
            this.isMonsterLoaded = true;
            cc.log('texures spriteatlas loaded');
        })
    }
    loadBossSpriteFrames() {
        if (this.bossSpriteFrames) {
            this.isBossLoaded = true;
            return;
        }
        cc.resources.load('OtherTexture/bossicons', cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
            this.bossSpriteFrames = {};
            for (let frame of atlas.getSpriteFrames()) {
                this.bossSpriteFrames[frame.name] = frame;
            }
            this.isBossLoaded = true;
            cc.log('bossicons spriteatlas loaded');
        })
    }
    show() {
        if (!this.iconList) {
            return;
        }
        let colors = ['#ffffff', '#00ff00', '#0000ff', '#800080', '#ffa500'];
        let data: AchievementData = Achievements.getAchievementData();
        for (let i = 0; i < this.iconList.length; i++) {
            let name = `monster${i < 10 ? '00' + i : '0' + i}anim000`;
            let fr = this.spriteFrames[name];
            if (i > this.MONSTER_SIZE - 1) {
                name = `iconboss00${i - this.MONSTER_SIZE}`;
                fr = this.bossSpriteFrames[name];
            }
            if (fr) {
                this.iconList[i].node.width = 96;
                this.iconList[i].node.height = 96;
                this.iconList[i].spriteFrame = this.spriteFrames[name];
                if (i > this.MONSTER_SIZE - 1) {
                    this.iconList[i].spriteFrame = this.bossSpriteFrames[name];
                }
                let label = this.iconList[i].node.parent.getComponentInChildren(cc.Label);
                label.string = ``;
                if (data && data.monsters && data.monsters[name] && data.monsters[name] > 0) {
                    this.iconList[i].node.color = cc.color(255, 255, 255);
                    label.node.color = cc.color(255, 255, 255);
                    label.string = `${data.monsters[name]}`;
                    let num = 0;
                    if (data.monsters[name] && data.monsters[name] > 0) {
                        num = data.monsters[name];
                    }
                    label.string = '';
                    if (num > 0) {
                        let length = num % 20;
                        if (num > 100) {
                            length = 20;
                        }
                        let str = '';
                        for (let i = 0; i < length; i += 4) {
                            str += '★';
                        }
                        label.string = str;
                        let count = Math.floor(num / 20);
                        if (count > colors.length - 1) {
                            count = colors.length - 1;
                        }
                        label.node.color = cc.Color.WHITE.fromHEX(colors[count]);
                    }
                } else {
                    this.iconList[i].node.color = cc.color(0, 0, 0);

                }

            }
        }
    }
    start() {

    }
    backToHome() {
        cc.director.loadScene('start');
        AudioPlayer.play(AudioPlayer.SELECT);
    }
    static getAchievementData(): AchievementData {
        let s: string = cc.sys.localStorage.getItem("achievement");
        if (!s) {
            s = '{}'
        }
        let data: AchievementData = JSON.parse(s);
        if (!data || !data.monsters) {
            data = new AchievementData();
        }
        return data;
    }
    static saveAchievementData(data: AchievementData): void {
        cc.sys.localStorage.setItem("achievement", JSON.stringify(data));
    }
    static addMonsterKillAchievement(name: string) {
        let data: AchievementData = Achievements.getAchievementData();
        if (data.monsters[name]) {
            data.monsters[name] = data.monsters[name] + 1;
        } else {
            data.monsters[name] = 1;
        }
        Achievements.saveAchievementData(data);
    }
    static addPlayerDiedLifesAchievement() {
        let data: AchievementData = Achievements.getAchievementData();
        if (data.playerLifes) {
            data.playerLifes = data.playerLifes + 1;
        } else {
            data.playerLifes = 1;
        }
        Achievements.saveAchievementData(data);
    }
    update(dt) {
        if (this.isBossLoaded && this.isMonsterLoaded) {
            this.isBossLoaded = true;
            this.isMonsterLoaded = true;
            this.show();
        }
    }
}
