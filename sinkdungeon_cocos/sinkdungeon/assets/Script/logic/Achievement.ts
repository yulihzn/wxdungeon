import AchievementData from "../data/AchievementData";
import EquipmentData from "../data/EquipmentData";
import FurnitureData from "../data/FurnitureData";
import ItemData from "../data/ItemData";
import NonPlayerData from "../data/NonPlayerData";
import Logic from "./Logic";
import InventoryManager from "../manager/InventoryManager";
import LoadingManager from "../manager/LoadingManager";
import AchievementItem from "../ui/AchievementItem";
import AchievementItemDialog from "../ui/dialog/AchievementItemDialog";
import AudioPlayer from "../utils/AudioPlayer";
import LocalStorage from "../utils/LocalStorage";

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
export default class Achievement extends cc.Component {

    static readonly MONSTER_SIZE = 33;
    static readonly BOSS_SIZE = 9;

    static readonly TYPE_CHALLENGE = 0;
    static readonly TYPE_MAP = 1;
    static readonly TYPE_FURNITURE = 2;
    static readonly TYPE_NPC = 3;
    static readonly TYPE_BOSS = 4;
    static readonly TYPE_MONSTER = 5;
    static readonly TYPE_EQUIP = 6;
    static readonly TYPE_ITEM = 7;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    prefab: cc.Prefab = null;
    @property(cc.Label)
    lifesLabel: cc.Label = null;
    @property(cc.Label)
    coinLabel: cc.Label = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;
    @property(cc.Node)
    loadingBackground: cc.Node = null;
    @property(AchievementItemDialog)
    achievementItemDialog: AchievementItemDialog = null;
    //图片资源
    bossSpriteFrames: { [key: string]: cc.SpriteFrame } = null;
    // LIFE-CYCLE CALLBACKS:
    isBossLoaded = false;
    currentListIndex = 0;
    currentItemIndex = -1;
    private loadingManager: LoadingManager = new LoadingManager();
    data: AchievementData;

    onLoad() {
        this.loadingManager.init();
        this.content.removeAllChildren();
        this.data = LocalStorage.getAchievementData();
        if (this.lifesLabel && this.data.playerLifes) {
            this.lifesLabel.string = `DIED ${this.data.playerLifes}`;
        }
        if (this.coinLabel) {
            let c = LocalStorage.getValueFromData(LocalStorage.KEY_COIN);
            this.coinLabel.string = `${c ? parseInt(c) : 0}`;
        }
        if (this.achievementItemDialog) {
            this.achievementItemDialog.node.active = false;
        }
    }
    start() {
        this.loadingManager.loadEquipment();
        this.loadingManager.loadAutoSpriteFrames();
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_TEXTURES, 'ammo');
        this.loadingManager.loadSpriteAtlas(LoadingManager.KEY_NPC, 'monster000anim000');
        this.loadingManager.loadMonsters();
        this.loadingManager.loadItems();
        this.loadingManager.loadNonplayer();
        this.loadingManager.loadSuits();
        this.loadingManager.loadFurnitures();
        this.loadBossSpriteFrames();
        this.loadingBackground.active = true;
    }

    //toggle
    changeList(toggle: cc.Toggle, index: string) {
        this.currentListIndex = parseInt(index);
        switch (this.currentListIndex) {
            case Achievement.TYPE_CHALLENGE: this.content.removeAllChildren(); break;
            case Achievement.TYPE_MAP: this.content.removeAllChildren(); break;
            case Achievement.TYPE_FURNITURE: this.showFurnitureList(); break;
            case Achievement.TYPE_NPC: this.showNpcList(); break;
            case Achievement.TYPE_BOSS: this.showBossList(); break;
            case Achievement.TYPE_MONSTER: this.showMonsterList(); break;
            case Achievement.TYPE_EQUIP: this.showEquipList(); break;
            case Achievement.TYPE_ITEM: this.showItemList(); break;
        }
    }
    private showMonsterList() {
        this.content.removeAllChildren();
        let index = 0;
        for (let key in Logic.monsters) {
            let data = new NonPlayerData();
            data.valueCopy(Logic.monsters[key]);
            let icon = cc.instantiate(this.prefab).getComponent(AchievementItem);
            icon.init(this, this.currentListIndex, index++, this.data.monsters[data.resName]
                , Logic.spriteFrameRes(data.resName + 'anim000'), data, null, null, null);
            this.content.addChild(icon.node);
        }
    }
    private showBossList() {
        this.content.removeAllChildren();
        for (let i = 0; i < Achievement.BOSS_SIZE; i++) {
            let icon = cc.instantiate(this.prefab).getComponent(AchievementItem);
            icon.init(this, this.currentListIndex, i, this.data.monsters[`iconboss00${i}`]
                , this.bossSpriteFrames[`iconboss00${i}`], null, null, null, null);
            this.content.addChild(icon.node);
        }
    }
    private showNpcList() {
        this.content.removeAllChildren();
        let index = 0;
        for (let key in Logic.nonplayers) {
            let data = new NonPlayerData();
            data.valueCopy(Logic.nonplayers[key]);
            let icon = cc.instantiate(this.prefab).getComponent(AchievementItem);
            icon.init(this, this.currentListIndex, index++, this.data.npcs[data.resName]
                , Logic.spriteFrameRes(data.resName + 'anim000'), data, null, null, null);
            this.content.addChild(icon.node);
        }
    }
    private showItemList() {
        this.content.removeAllChildren();
        let index = 0;
        for (let key in Logic.items) {
            let data = new ItemData();
            data.valueCopy(Logic.items[key]);
            let icon = cc.instantiate(this.prefab).getComponent(AchievementItem);
            icon.init(this, this.currentListIndex, index++, this.data.items[data.resName]
                , Logic.spriteFrameRes(data.resName), null, data, null, null);
            if (index > 5) {
                this.content.addChild(icon.node)
            };
        }
    }
    private showEquipList() {
        this.content.removeAllChildren();
        let index = 0;
        for (let key in Logic.equipments) {
            let data = new EquipmentData();
            data.valueCopy(Logic.equipments[key]);
            let icon = cc.instantiate(this.prefab).getComponent(AchievementItem);
            let spriteFrame = Logic.spriteFrameRes(data.img);
            if (data.equipmetType == InventoryManager.CLOTHES) {
                spriteFrame = Logic.spriteFrameRes(data.img + 'anim0');
            } else if (data.equipmetType == InventoryManager.HELMET) {
                spriteFrame = Logic.spriteFrameRes(data.img + 'anim0');
            } else if (data.equipmetType == InventoryManager.REMOTE) {
                spriteFrame = Logic.spriteFrameRes(data.img + 'anim0');
            }
            icon.init(this, this.currentListIndex, index++, this.data.equips[data.img]
                , spriteFrame, null, null, data, null);
            if (index > 1) {
                this.content.addChild(icon.node)
            };
        }
    }
    private showFurnitureList() {
        this.content.removeAllChildren();
        let index = 0;
        for (let key in Logic.furnitures) {
            let data = new FurnitureData();
            data.valueCopy(Logic.furnitures[key]);
            let icon = cc.instantiate(this.prefab).getComponent(AchievementItem);
            icon.init(this, this.currentListIndex, index++, this.data.furnitures[data.id]
                , Logic.spriteFrameRes(data.resName), null, null, null, data);
            this.content.addChild(icon.node)

        }
    }
    show() {
        this.changeList(null, '0');
    }
    // show() {
    //     if (!this.itemList) {
    //         return;
    //     }
    //     let colors = ['#ffffff', '#00ff00', '#0000ff', '#800080', '#ffa500'];
    //     let data: AchievementData = LocalStorage.getAchievementData();
    //     for (let i = 0; i < this.itemList.length; i++) {
    //         let name = `monster${i < 10 ? '00' + i : '0' + i}`;
    //         let fr = Logic.spriteFrameRes(name+'anim000');
    //         if (i > this.MONSTER_SIZE - 1) {
    //             name = `iconboss00${i - this.MONSTER_SIZE}`;
    //             fr = this.bossSpriteFrames[name];
    //         }
    //         if (fr) {
    //             this.itemList[i].node.width = 96;
    //             this.itemList[i].node.height = 96;
    //             if(Logic.spriteFrameRes(name+'anim000')){
    //                 this.itemList[i].spriteFrame = Logic.spriteFrameRes(name+'anim000');
    //             }
    //             if (i > this.MONSTER_SIZE - 1 && this.bossSpriteFrames[name]) {
    //                 this.itemList[i].spriteFrame = this.bossSpriteFrames[name];
    //             }
    //             let label = this.itemList[i].node.parent.getComponentInChildren(cc.Label);
    //             label.string = ``;
    //             if (data && data.monsters && data.monsters[name] && data.monsters[name] > 0) {
    //                 this.itemList[i].node.color = cc.color(255, 255, 255);
    //                 label.node.color = cc.color(255, 255, 255);
    //                 label.string = `${data.monsters[name]}`;
    //                 let num = 0;
    //                 if (data.monsters[name] && data.monsters[name] > 0) {
    //                     num = data.monsters[name];
    //                 }
    //                 label.string = '';
    //                 if (num > 0) {
    //                     let length = num % 20;
    //                     if (num > 100) {
    //                         length = 20;
    //                     }
    //                     let str = '';
    //                     for (let i = 0; i < length; i += 4) {
    //                         str += '★';
    //                     }
    //                     label.string = str;
    //                     let count = Math.floor(num / 20);
    //                     if (count > colors.length - 1) {
    //                         count = colors.length - 1;
    //                     }
    //                     label.node.color = cc.Color.WHITE.fromHEX(colors[count]);
    //                 }
    //             } else {
    //                 this.itemList[i].node.color = cc.color(0, 0, 0);

    //             }

    //         }
    //     }
    // }
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


    backToHome() {
        cc.director.loadScene('start');
        AudioPlayer.play(AudioPlayer.SELECT);
    }

    static addMonsterKillAchievement(name: string) {
        let data: AchievementData = LocalStorage.getAchievementData();
        if (data.monsters[name]) {
            data.monsters[name] = data.monsters[name] + 1;
            if (data.monsters[name] > 9999) {
                data.monsters[name] = 9999;
            }
        } else {
            data.monsters[name] = 1;
        }
        LocalStorage.saveAchievementData(data);
    }
    static addPlayerDiedLifesAchievement() {
        let data: AchievementData = LocalStorage.getAchievementData();
        if (data.playerLifes) {
            data.playerLifes = data.playerLifes + 1;
            if (data.playerLifes > 9999) {
                data.playerLifes = 9999;
            }
        } else {
            data.playerLifes = 1;
        }
        LocalStorage.saveAchievementData(data);
    }
    static addItemAchievement(name: string) {
        let data: AchievementData = LocalStorage.getAchievementData();
        if (data.items[name]) {
            data.items[name] = data.items[name] + 1;
            if (data.items[name] > 9999) {
                data.items[name] = 9999;
            }
        } else {
            data.items[name] = 1;
        }
        LocalStorage.saveAchievementData(data);
    }
    static addEquipsAchievement(name: string) {
        let data: AchievementData = LocalStorage.getAchievementData();
        if (data.equips[name]) {
            data.equips[name] = data.equips[name] + 1;
            if (data.equips[name] > 9999) {
                data.equips[name] = 9999;
            }
        } else {
            data.equips[name] = 1;
        }
        LocalStorage.saveAchievementData(data);
    }
    static addNpcsAchievement(name: string) {
        let data: AchievementData = LocalStorage.getAchievementData();
        if (data.npcs[name]) {
            data.npcs[name] = data.npcs[name] + 1;
            if (data.npcs[name] > 9999) {
                data.npcs[name] = 9999;
            }
        } else {
            data.npcs[name] = 1;
        }
        LocalStorage.saveAchievementData(data);
    }
    static addMapsAchievement(name: string) {
        let data: AchievementData = LocalStorage.getAchievementData();
        if (data.maps[name]) {
            data.maps[name] = data.maps[name] + 1;
            if (data.maps[name] > 9999) {
                data.maps[name] = 9999;
            }
        } else {
            data.maps[name] = 1;
        }
        LocalStorage.saveAchievementData(data);
    }
    static addChallengesAchievement(name: string) {
        let data: AchievementData = LocalStorage.getAchievementData();
        if (data.challenges[name]) {
            data.challenges[name] = data.challenges[name] + 1;
            if (data.challenges[name] > 9999) {
                data.challenges[name] = 9999;
            }
        } else {
            data.challenges[name] = 1;
        }
        LocalStorage.saveAchievementData(data);
    }
    static addFurnituresAchievement(name: string) {
        let data: AchievementData = LocalStorage.getAchievementData();
        if (data.furnitures[name]) {
            data.furnitures[name] = data.furnitures[name] + 1;
            if (data.furnitures[name] > 9999) {
                data.furnitures[name] = 9999;
            }
        } else {
            data.furnitures[name] = 1;
        }
        LocalStorage.saveAchievementData(data);
    }
    update(dt) {
        if (this.isBossLoaded
            && this.loadingManager.isEquipmentLoaded
            && this.loadingManager.isAllSpriteFramesLoaded()
            && this.loadingManager.isMonsterLoaded
            && this.loadingManager.isNonplayerLoaded
            && this.loadingManager.isItemsLoaded
            && this.loadingManager.isFurnituresLoaded
            && this.loadingManager.isSuitsLoaded) {
            this.isBossLoaded = true;
            this.loadingBackground.active = false;
            this.loadingManager.reset();
            this.show();
        }
    }
}
