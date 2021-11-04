import Achievement from "../logic/Achievement";
import FurnitureData from "../data/FurnitureData";
import Dungeon from "../logic/Dungeon";
import Logic from "../logic/Logic";
import Tips from "../ui/Tips";
import AudioPlayer from "../utils/AudioPlayer";
import LocalStorage from "../utils/LocalStorage";
import Utils from "../utils/Utils";
import Building from "./Building";
import RoomFishtank from "./RoomFishtank";
import RoomStool from "./RoomStool";
import RoomTv from "./RoomTv";
import CCollider from "../collider/CCollider";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 家具 家具在初次出现的时候会显示成快递盒子的样子，靠近出现交互提示，可以打开盒子显示该建筑并激活改建筑的效果
 */
@ccclass
export default class Furniture extends Building {

    static readonly SOFA = 'furniture001';
    static readonly BATH = 'furniture002';
    static readonly DINNER_TABLE = 'furniture003';
    static readonly WASHING_MACHINE = 'furniture004';
    static readonly COOKING_BENCH = 'furniture005';
    static readonly COOKING_BENCH_1 = 'furniture006';
    static readonly COOKING_BENCH_2 = 'furniture007';
    static readonly COOKING_BENCH_3 = 'furniture008';
    static readonly FRIDGE = 'furniture009';
    static readonly DESK = 'furniture010';
    static readonly CUPBOARD = 'furniture011';
    static readonly LITTLE_TABLE = 'furniture012';
    static readonly LITTLE_TABLE_1 = 'furniture013';
    static readonly LITTLE_TABLE_2 = 'furniture014';
    static readonly STOOL = 'furniture015';
    static readonly TV = 'furniture016';
    static readonly FISHTANK = 'furniture017';
    sprite: cc.Sprite;
    boxcover: cc.Sprite;
    boxback: cc.Sprite;
    tips: Tips;
    isOpening = false;
    anim: cc.Animation;
    furnitureData: FurnitureData;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.getComponent(cc.Animation);
        this.sprite = this.node.getChildByName('sprite').getComponent(cc.Sprite);
        this.boxcover = this.node.getChildByName('boxcover').getComponent(cc.Sprite);
        this.boxback = this.node.getChildByName('boxback').getComponent(cc.Sprite);
        this.tips = this.getComponentInChildren(Tips);
        this.tips.onInteract(() => {
            if (this.furnitureData) {
                if (this.furnitureData.isOpen) {
                    this.interact();
                } else {
                    this.openBox();
                }
            }
        });
        this.tips.onEnter(() => {
            if (this.furnitureData) {
                if (this.furnitureData.isOpen) {
                    this.onEnter();
                }
            }
        });
        this.tips.onExit(() => {
            if (this.furnitureData) {
                if (this.furnitureData.isOpen) {
                    this.onExit();
                }
            }
        });
    }
    interact() {
        switch (this.furnitureData.id) {
            case Furniture.TV:
                let tv = this.getComponent(RoomTv);
                if (tv) {
                    tv.interact();
                }
                break;
            case Furniture.STOOL:
                let stool = this.getComponent(RoomStool);
                if (stool) {
                    stool.open();
                } break;
            case Furniture.FISHTANK:
                let fishtank = this.getComponent(RoomFishtank);
                if (fishtank) {
                    fishtank.feed();
                } break;
            default:
                AudioPlayer.play(AudioPlayer.SELECT_FAIL);
                Utils.toast('梦境开发中,无法使用');
                break;
        }
    }
    onEnter() {
        switch (this.furnitureData.id) {
            case Furniture.FISHTANK:
                let fishtank = this.getComponent(RoomFishtank);
                if (fishtank) {
                    fishtank.zoomCamera(true);
                }
                break;
        }
    }
    onExit() {
        switch (this.furnitureData.id) {
            case Furniture.FISHTANK:
                let fishtank = this.getComponent(RoomFishtank);
                if (fishtank) {
                    fishtank.zoomCamera(false);
                }
                break;
        }
    }
    init(furnitureData: FurnitureData) {
        this.furnitureData = new FurnitureData();
        this.furnitureData.valueCopy(furnitureData);
        if (this.furnitureData.isOpen) {
            this.boxcover.node.active = false;
            this.boxback.node.active = false;
        } else {
            this.boxcover.node.active = true;
            this.boxback.node.active = true;
        }
        this.changeRes(this.furnitureData.resName);
        if (this.furnitureData.collider.length > 0) {
            let arr = this.furnitureData.collider.split(',');
            let pcollider = this.getComponent(CCollider);
            pcollider.offset = cc.v2(parseInt(arr[0]), parseInt(arr[1]));
            pcollider.setSize(cc.size(parseInt(arr[2]), parseInt(arr[3])));
        }
        LocalStorage.saveFurnitureData(this.furnitureData);
        Achievement.addFurnituresAchievement(this.furnitureData.id);

    }
    changeRes(resName: string) {
        let spriteFrame = Logic.spriteFrameRes(resName);
        if (spriteFrame) {
            this.sprite.spriteFrame = spriteFrame;
            this.sprite.node.width = spriteFrame.getOriginalSize().width;
            this.sprite.node.height = spriteFrame.getOriginalSize().height;
            this.boxback.node.width = spriteFrame.getOriginalSize().width;
            this.boxback.node.height = spriteFrame.getOriginalSize().height;
            this.boxcover.node.width = spriteFrame.getOriginalSize().width;
            this.boxcover.node.height = spriteFrame.getOriginalSize().height;
            this.sprite.node.scale = this.furnitureData.scale;
            this.tips.node.scale = 2;
            this.boxback.node.scale = this.furnitureData.scale;
            this.boxcover.node.scale = this.furnitureData.scale;
            let width = this.sprite.node.width * this.sprite.node.scale;
            let height = this.sprite.node.height * this.sprite.node.scale;
            if (this.furnitureData.id != Furniture.STOOL
                && this.furnitureData.id != Furniture.TV
                && this.furnitureData.id != Furniture.SOFA
                && this.furnitureData.id != Furniture.FISHTANK) {
                this.tips.node.position = cc.v3(width / 2 - Dungeon.TILE_SIZE / 2, height - Dungeon.TILE_SIZE / 2)
                let collider = this.tips.node.getComponent(CCollider);
                collider.radius = width > height ? height / 2 : width / 2;
                if (width > height) {
                    collider.radius = height / 2;
                    collider.offset = cc.v2(0, -height / 2);
                } else {
                    collider.radius = width / 2;
                    collider.offset = cc.v2(0, -height + width);
                }
            }

        }
    }
    openBox() {
        if (this.furnitureData.isOpen) {
            return;
        }
        this.furnitureData.isOpen = true;
        LocalStorage.saveFurnitureData(this.furnitureData);
        this.anim.play('FurnitureOpen');
    }

    start() {
    }

    // update (dt) {}
}
