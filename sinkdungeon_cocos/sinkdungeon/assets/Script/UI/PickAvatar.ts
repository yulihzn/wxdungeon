// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "../Logic";
import AudioPlayer from "../Utils/AudioPlayer";
import AttributeSelector from "./AttributeSelector";
import AttributeData from "../Data/AttributeData";
import BrightnessBar from "./BrightnessBar";
import PaletteSelector from "./PaletteSelector";
import AvatarData from "../Data/AvatarData";
import ProfessionData from "../Data/ProfessionData";
import EquipmentManager from "../Manager/EquipmentManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PickAvatar extends cc.Component {
    readonly SELECTOR_ORGANIZATION = 0;
    readonly SELECTOR_GENGER = 1;
    readonly SELECTOR_HAIR = 2;
    readonly COLOR_PATTLE_HAIR = 3;
    readonly SELECTOR_EYES = 4;
    readonly COLOR_PATTLE_EYES = 5;
    readonly SELECTOR_FACE = 6;
    readonly COLOR_PATTLE_FACE = 7;
    readonly SELECTOR_BODY = 8;
    readonly PROGRESS_SKIN_COLOR = 9;
    readonly SELECTOR_PROFESSION = 10;
    private isSpirteLoaded = false;
    private isProfessionLoaded = false;
    private isEquipmentLoaded = false;
    private isItemsLoaded = false;
    private isTalentsLoaded = false;
    //图片资源
    private spriteFrames: { [key: string]: cc.SpriteFrame } = null;
    @property(cc.Node)
    loadingBackground: cc.Node = null;
    @property(cc.Node)
    avatarTable: cc.Node = null;
    @property(cc.Node)
    attributeLayout: cc.Node = null;
    @property(cc.Node)
    randomLayout: cc.Node = null;
    @property(cc.Label)
    randomLabelTitle: cc.Label = null;
    @property(cc.Label)
    randomLabelName: cc.Label = null;
    @property(cc.Label)
    randomLabelDesc: cc.Label = null;
    @property(cc.Label)
    randomLabelSkillName: cc.Label = null;
    @property(cc.Label)
    randomLabelSkillDesc: cc.Label = null;
    @property(cc.Node)
    randomButton:cc.Node = null;
    @property(cc.Prefab)
    selectorPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    brightnessBarPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    palettePrefab: cc.Prefab = null;

    private bedSprite: cc.Sprite;
    private coverSprite: cc.Sprite;
    private bodySprite: cc.Sprite;
    private headSprite: cc.Sprite;
    private hairSprite: cc.Sprite;
    private eyesSprite: cc.Sprite;
    private faceSprite: cc.Sprite;
    private handSprite1: cc.Sprite;
    private handSprite2: cc.Sprite;
    private legSprite1: cc.Sprite;
    private legSprite2: cc.Sprite;
    private cloakSprite: cc.Sprite = null;
    private shoesSprite1: cc.Sprite = null;
    private shoesSprite2: cc.Sprite = null;
    private helmetSprite: cc.Sprite = null;
    private pantsSprite: cc.Sprite = null;
    private clothesSprite: cc.Sprite = null;
    private glovesSprite1: cc.Sprite = null;
    private glovesSprite2: cc.Sprite = null;
    private weaponSprite: cc.Sprite = null;
    private remoteSprite: cc.Sprite = null;
    private shieldSprite: cc.Sprite = null;

    private organizationSelector: AttributeSelector;
    private professionSelector: AttributeSelector;
    private skinSelector: BrightnessBar;
    private hairSelector: AttributeSelector;
    private hairColorSelector: PaletteSelector;
    private eyesSelector: AttributeSelector;
    private eyesColorSelector: PaletteSelector;
    private faceSelector: AttributeSelector;
    private faceColorSelector: PaletteSelector;
    private data: AvatarData;

    private randomTouched = false;
    private isShow = false;

    onLoad() {
        this.data = new AvatarData();
        this.bedSprite = this.getSpriteChildSprite(this.avatarTable, ['bed']);
        this.coverSprite = this.getSpriteChildSprite(this.avatarTable, ['cover']);
        this.bodySprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body']);
        this.handSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'hand1']);
        this.handSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'hand2']);
        this.legSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'leg1']);
        this.legSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'leg2']);
        this.headSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head']);
        this.hairSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head', 'hair']);
        this.faceSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head', 'face']);
        this.eyesSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head', 'eyes']);
        this.helmetSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'head', 'helmet']);
        this.pantsSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'pants']);
        this.cloakSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'cloak']);
        this.weaponSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'weapon']);
        this.remoteSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'remote']);
        this.shieldSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'shield']);
        this.clothesSprite = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'clothes']);
        this.glovesSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'hand1', 'gloves']);
        this.glovesSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'hand2', 'gloves']);
        this.shoesSprite1 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'leg1', 'shoes']);
        this.shoesSprite2 = this.getSpriteChildSprite(this.avatarTable, ['avatar', 'body', 'leg2', 'shoes']);
        this.loadingBackground.active = true;
        this.loadSpriteFrames();
        this.loadProfession();
        this.loadEquipment();
        this.loadTalents();
        this.loadItems();
        this.attributeLayout.active = false;
        this.randomButton.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.randomTouched = true;
        }, this)

        this.randomButton.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.randomTouched = false;
        }, this)

        this.randomButton.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.randomTouched = false;
        }, this)
    }
    private getSpriteChildSprite(node: cc.Node, childNames: string[]): cc.Sprite {
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
    }
    loadEquipment() {
        if (Logic.equipments) {
            this.isEquipmentLoaded = true;
            return;
        }
        cc.resources.load('Data/equipment', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.equipments = resource.json;
                this.isEquipmentLoaded = true;
                cc.log('equipment loaded');
                Logic.equipmentNameList = new Array();
                for (let key in resource.json) {
                    Logic.equipmentNameList.push(key);
                }
            }
        })
    }
    loadProfession() {
        if (Logic.professionList && Logic.professionList.length > 0) {
            this.isProfessionLoaded = true;
            return;
        }
        cc.resources.load('Data/profession', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.professionList = new Array();
                let arr: ProfessionData[] = resource.json;
                for (let i = 0; i < arr.length; i++) {
                    let data = new ProfessionData();
                    data.valueCopy(arr[i])
                    data.id = i;
                    Logic.professionList.push(data);
                }

                this.isProfessionLoaded = true;
                cc.log('professionList loaded');
            }
        })
    }
    loadTalents() {
        if (Logic.talents) {
            this.isTalentsLoaded = true;
            return;
        }
        cc.resources.load('Data/talent', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.talents = resource.json;
                this.isTalentsLoaded = true;
                cc.log('talents loaded');
            }
        })
    }
    loadItems() {
        if (Logic.items) {
            this.isItemsLoaded = true;
            return;
        }
        cc.resources.load('Data/item', (err: Error, resource: cc.JsonAsset) => {
            if (err) {
                cc.error(err);
            } else {
                Logic.items = resource.json;
                Logic.itemNameList = new Array();
                Logic.goodsNameList = new Array();
                for (let key in resource.json) {
                    if (Logic.items[key].canSave&&key.indexOf('food')==-1&&key.indexOf('goods')==-1) {
                        Logic.itemNameList.push(key);
                    }else if(key.indexOf('goods')!=-1){
                        Logic.goodsNameList.push(key);
                    }
                }
                this.isItemsLoaded = true;
                cc.log('items loaded');
            }
        })
    }
    loadSpriteFrames() {
        if (this.spriteFrames) {
            this.isSpirteLoaded = true;
            return;
        }
        cc.resources.load('Texture/texures', cc.SpriteAtlas, (err: Error, atlas: cc.SpriteAtlas) => {
            this.spriteFrames = {};
            for (let frame of atlas.getSpriteFrames()) {
                this.spriteFrames[frame.name] = frame;
            }
            this.isSpirteLoaded = true;
            cc.log('texures spriteatlas loaded');
        })
    }
    show() {
        this.isShow = true;
        this.loadingBackground.active = false;
        //组织
        let organList = new Array();
        let organization = ['弥世逐流', '宝藏猎人', '幽光守护', '翠金科技'];
        for (let i = 0; i < organization.length; i++) {
            organList.push(new AttributeData(i, organization[i], '', '', '', ''));
        }
        this.organizationSelector = this.addAttributeSelector('组织：', organList)
        this.organizationSelector.selectorCallback = (data: AttributeData) => {
            this.data.organizationIndex = data.id;
            this.bedSprite.spriteFrame = this.spriteFrames[`avatarbed00${data.id}`];
            this.coverSprite.spriteFrame = this.spriteFrames[`avatarcover00${data.id}`];
            this.randomLabelTitle.string = data.name;
        };
        //职业
        let professionList = new Array();
        for (let i = 0; i < Logic.professionList.length; i++) {
            let data = Logic.professionList[i];
            let talent = Logic.talents[data.talent];
            professionList.push(new AttributeData(data.id, data.nameCn, '', data.desc, `技能：${talent.nameCn}`, `${talent.desc}`));
        }
        this.professionSelector = this.addAttributeSelector('职业：', professionList)
        this.professionSelector.selectorCallback = (data: AttributeData) => {
            this.data.professionData.valueCopy(Logic.professionList[data.id]);
            this.randomLabelName.string = `${data.name}`;
            this.randomLabelDesc.string = `${data.desc}`;
            this.randomLabelSkillName.string = `${data.name1}`;
            this.randomLabelSkillDesc.string = `${data.desc1}`;
            this.changeEquipment(Logic.professionList[data.id]);
        };

        //皮肤颜色
        this.skinSelector = this.addBrightnessBar()
        this.skinSelector.setSelectorCallback((color: cc.Color) => {
            this.bodySprite.node.color = color;
            this.headSprite.node.color = color;
            this.handSprite1.node.color = color;
            this.handSprite2.node.color = color;
            this.legSprite1.node.color = color;
            this.legSprite2.node.color = color;
            this.data.skinColor = color.toHEX('#rrggbb');
        });
        //发型
        let hairList = [];
        for (let i = 0; i < 10; i++) {
            hairList.push(new AttributeData(i, `样式${i}`, `avatarhair0${i > 9 ? '' : '0'}${i}anim00`, '', '', ''));
        }
        this.hairSelector = this.addAttributeSelector('发型：', hairList)
        this.hairSelector.selectorCallback = (data: AttributeData) => {
            this.hairSprite.spriteFrame = this.spriteFrames[data.resName + '0'];
            this.data.hairResName = data.resName;
        };
        //头发颜色
        this.hairColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_HAIR)
        this.hairColorSelector.setSelectorCallback((color: cc.Color) => {
            this.hairSprite.node.color = color;
            this.data.hairColor = color.toHEX('#rrggbb');
        })
        //眼睛
        let eyesList = [];
        for (let i = 0; i < 7; i++) {
            eyesList.push(new AttributeData(i, `样式${i}`, `avatareyes0${i > 9 ? '' : '0'}${i}anim00`, '', '', ''));
        }
        this.eyesSelector = this.addAttributeSelector('眼睛：', eyesList)
        this.eyesSelector.selectorCallback = (data: AttributeData) => {
            this.eyesSprite.spriteFrame = this.spriteFrames[data.resName + '0'];
            this.data.eyesResName = data.resName;
        };
        //眼睛颜色
        this.eyesColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_EYES)
        this.eyesColorSelector.setSelectorCallback((color: cc.Color) => {
            this.eyesSprite.node.color = color;
            this.data.eyesColor = color.toHEX('#rrggbb');
        })
        //面颊
        let faceList = [];
        for (let i = 0; i < 9; i++) {
            faceList.push(new AttributeData(i, `样式${i}`, `avatarface0${i > 9 ? '' : '0'}${i}anim00`, '', '', ''));
        }
        this.faceSelector = this.addAttributeSelector('面颊：', faceList)
        this.faceSelector.selectorCallback = (data: AttributeData) => {
            this.faceSprite.spriteFrame = this.spriteFrames[data.resName + '0'];
            this.data.faceResName = data.resName;
        };
        //脸部颜色
        this.faceColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_FACE)
        this.faceColorSelector.setSelectorCallback((color: cc.Color) => {
            this.faceSprite.node.color = color;
            this.data.faceColor = color.toHEX('#rrggbb');
        })
        this.ButtonRandom();
    }
    private changeEquipment(data: ProfessionData) {
        this.changeRes(this.helmetSprite, data.helmet, 'anim0');
        this.changeRes(this.pantsSprite, data.trousers);
        this.changeRes(this.cloakSprite, data.cloak);
        this.changeRes(this.weaponSprite, data.weapon);
        this.changeRes(this.remoteSprite, data.remote, 'anim0');
        this.changeRes(this.shieldSprite, data.shield);
        this.changeRes(this.clothesSprite, data.clothes, 'anim0');
        this.changeRes(this.glovesSprite1, data.gloves);
        this.changeRes(this.glovesSprite2, data.gloves);
        this.changeRes(this.shoesSprite1, data.shoes);
        this.changeRes(this.shoesSprite2, data.shoes);
        this.resetSpriteSize(this.weaponSprite);
        this.resetSpriteSize(this.remoteSprite);
        this.resetSpriteSize(this.shieldSprite);
    }
    private resetSpriteSize(sprite: cc.Sprite) {
        if (sprite.spriteFrame) {
            sprite.node.width = sprite.spriteFrame.getRect().width;
            sprite.node.height = sprite.spriteFrame.getRect().height;
        }
    }
    private changeRes(sprite: cc.Sprite, resName: string, subfix?: string) {
        if (!sprite) {
            return false;
        }
        let spriteFrame = this.spriteFrames[resName];
        if (subfix && this.spriteFrames[resName+subfix]) {
            spriteFrame = this.spriteFrames[resName+subfix];
        }
        if(spriteFrame){
            sprite.spriteFrame = spriteFrame;
        }else{
            sprite.spriteFrame = null;
        }
    }
    startGame() {
        if (this.loadingBackground.active) {
            return;
        }
        //清除存档
        Logic.profileManager.clearData();
        //重置数据
        Logic.resetData(Logic.jumpChapter);
        Logic.jumpChapter = 0;
        //加载资源
        AudioPlayer.play(AudioPlayer.SELECT);
        Logic.playerData.AvatarData = this.data.clone();
        this.addPorfessionEquipment();
        cc.director.loadScene('loading');
    }
    backToHome() {
        cc.director.loadScene('start');
        AudioPlayer.play(AudioPlayer.SELECT);
    }
    addPorfessionEquipment() {
        Logic.inventoryManager.weapon.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.weapon));
        Logic.inventoryManager.remote.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.remote));
        Logic.inventoryManager.shield.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.shield));
        Logic.inventoryManager.shoes.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.shoes));
        Logic.inventoryManager.cloak.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.cloak));
        Logic.inventoryManager.clothes.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.clothes));
        Logic.inventoryManager.gloves.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.gloves));
        Logic.inventoryManager.helmet.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.helmet));
        Logic.inventoryManager.trousers.valueCopy(EquipmentManager.getNewEquipData(this.data.professionData.trousers));
    }
    addBrightnessBar(): BrightnessBar {
        let prefab = cc.instantiate(this.brightnessBarPrefab);
        let script = prefab.getComponent(BrightnessBar);
        this.attributeLayout.addChild(prefab);
        return script;
    }
    addAttributeSelector(title: string, nameList: AttributeData[], defaultIndex?: number): AttributeSelector {
        let prefab = cc.instantiate(this.selectorPrefab);
        let script = prefab.getComponent(AttributeSelector);
        this.attributeLayout.addChild(prefab);
        script.init(title, nameList, defaultIndex);
        return script;
    }
    addPaletteSelector(colorType: number, defaultIndex?: number): PaletteSelector {
        let prefab = cc.instantiate(this.palettePrefab);
        let script = prefab.getComponent(PaletteSelector);
        this.attributeLayout.addChild(prefab);
        script.init(colorType, defaultIndex);
        return script;
    }
    update(dt) {
        if (this.isSpirteLoaded && this.isProfessionLoaded && this.isEquipmentLoaded && this.isTalentsLoaded && this.isItemsLoaded) {
            this.isSpirteLoaded = false;
            this.isProfessionLoaded = false;
            this.isEquipmentLoaded = false;
            this.isItemsLoaded = false;
            this.isTalentsLoaded = false;
            this.show();
        }
        if(this.isShow){
            if(this.isTimeDelay(dt)&&this.randomTouched){
                this.ButtonRandom();
            }
        }
    }
    private delayTime = 0;
    private isTimeDelay(dt: number): boolean {
        this.delayTime += dt;
        if (this.delayTime > 0.1) {
            this.delayTime = 0;
            return true;
        }
        return false;
    }
    ButtonSwitch() {
        if (this.loadingBackground.active) {
            return;
        }
        this.randomLayout.active = this.randomLayout.active ? false : true;
        this.attributeLayout.active = this.attributeLayout.active ? false : true;
        AudioPlayer.play(AudioPlayer.SELECT);
    }
    ButtonRandom() {
        if (this.loadingBackground.active) {
            return;
        }
        this.organizationSelector.selectRandom();
        this.professionSelector.selectRandom();
        this.skinSelector.selectRandom();
        this.hairSelector.selectRandom();
        this.hairColorSelector.selectRandom();
        this.eyesSelector.selectRandom();
        this.eyesColorSelector.selectRandom();
        this.faceSelector.selectRandom();
        this.faceColorSelector.selectRandom();
        AudioPlayer.play(AudioPlayer.SELECT);
    }
    ButtonSelect(event:cc.Event, isLeft:boolean){
        if (this.loadingBackground.active) {
            return;
        }
        this.professionSelector.slectNext(isLeft);
        AudioPlayer.play(AudioPlayer.SELECT);
    }
}
