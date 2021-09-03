import Achievement from "../Achievement";
import EquipmentData from "../Data/EquipmentData";
import FurnitureData from "../Data/FurnitureData";
import ItemData from "../Data/ItemData";
import NonPlayerData from "../Data/NonPlayerData";
import AudioPlayer from "../Utils/AudioPlayer";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//交互作用的提示,依托于父组件不能独立放置
const { ccclass, property } = cc._decorator;

@ccclass
export default class AchievementItem extends cc.Component {
    static readonly TYPE_EMPTY = 0;
    static readonly TYPE_CHALLENGE = 1;
    static readonly TYPE_MAP = 2;
    static readonly TYPE_FURNITURE = 3;
    static readonly TYPE_NPC = 4;
    static readonly TYPE_BOSS = 5;
    static readonly TYPE_MONSTER = 6;
    static readonly TYPE_EQUIP = 7;
    static readonly TYPE_ITEM = 8;
    static readonly COLORS = ['#ffffff', '#00ff00', '#0000ff', '#800080', '#ffa500'];
    isSelect = false;
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property(cc.Label)
    label: cc.Label = null;
    index = 0;//列表里的下标
    parentIndex = 0; //父下标
    achievements: Achievement;
    count = 0;//数量
    spriteFrame: cc.SpriteFrame = null;
    mat: cc.MaterialVariant;
    nonPlayerData: NonPlayerData;
    itemData: ItemData;
    equipData: EquipmentData;
    furnitureData:FurnitureData;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
        }, this)

        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.node&&this.count > 0) {
                AudioPlayer.play(AudioPlayer.SELECT);
                this.achievements.achievementItemDialog.show(this.nonPlayerData, this.itemData, this.equipData,this.furnitureData, this.sprite.spriteFrame);
            }else{
                AudioPlayer.play(AudioPlayer.SELECT_FAIL);
            }
        }, this)

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
        }, this)
    }
    init(achievements: Achievement, parentIndex: number, index: number, count: number, spriteFrame: cc.SpriteFrame, nonPlayerData: NonPlayerData, itemData: ItemData, equipData: EquipmentData,furnitureData:FurnitureData) {
        this.nonPlayerData = nonPlayerData;
        this.itemData = itemData;
        this.equipData = equipData;
        this.furnitureData = furnitureData;
        this.achievements = achievements;
        this.parentIndex = parentIndex;
        this.index = index;
        this.count = count;
        this.spriteFrame = spriteFrame;
        this.isSelect = false;
        this.updateData();
    }
    updateData() {
        this.isSelect = false;
        this.label.string = ``;
        this.sprite.spriteFrame = null;
        if (this.spriteFrame) {
            this.sprite.spriteFrame = this.spriteFrame;
            let w = this.spriteFrame.getOriginalSize().width;
            let h = this.spriteFrame.getOriginalSize().height;
            this.sprite.node.width = w * 4;
            this.sprite.node.height = h * 4;
            if (this.sprite.node.height > 96) {
                this.sprite.node.height = 96;
                this.sprite.node.width = 96 / this.spriteFrame.getOriginalSize().height * this.spriteFrame.getOriginalSize().width;
            }
            let scale = 4;
            if (h > 96) {
                scale = 0.5;
            }
            if (!this.mat) {
                this.mat = this.sprite.getMaterial(0);
            }

            this.mat.setProperty('textureSizeWidth', this.spriteFrame.getTexture().width * scale);
            this.mat.setProperty('textureSizeHeight', this.spriteFrame.getTexture().height * scale);
            this.mat.setProperty('outlineColor', cc.color(200, 200, 200));
            this.mat.setProperty('blackBg', this.count > 0 ? 0 : 1);
            this.mat.setProperty('openOutline', this.count > 0 ? 0 : 1);
        }
        if (this.count > 0) {
            let length = this.count % 20;
            if (this.count > 100) {
                length = 20;
            }
            let str = '';
            for (let i = 0; i < length; i += 4) {
                str += '★';
            }
            this.label.string = str;
            let i = Math.floor(this.count / 20);
            if (i > AchievementItem.COLORS.length - 1) {
                i = AchievementItem.COLORS.length - 1;
            }
            this.label.node.color = cc.Color.WHITE.fromHEX(AchievementItem.COLORS[i]);
        }

    }
    setEmpty() {
        this.label.string = ``;
        this.sprite.spriteFrame = null;
    }
    start() {

    }

    // update (dt) {}
}
