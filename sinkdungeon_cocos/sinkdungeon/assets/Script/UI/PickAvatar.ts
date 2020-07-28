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
    //图片资源
    private spriteFrames: { [key: string]: cc.SpriteFrame } = null;
    @property(cc.Node)
    loadingBackground:cc.Node = null;
    @property(cc.Node)
    avatarTable:cc.Node = null;
    @property(cc.Node)
    attributeLayout:cc.Node = null;
    @property(cc.Node)
    randomLayout:cc.Node = null;
    @property(cc.Label)
    randomLabel:cc.Label = null;
    @property(cc.Prefab)
    selectorPrefab:cc.Prefab = null;
    @property(cc.Prefab)
    brightnessBarPrefab:cc.Prefab = null;
    @property(cc.Prefab)
    palettePrefab:cc.Prefab = null;

    private bedSprite:cc.Sprite;
    private coverSprite:cc.Sprite;
    private bodySprite:cc.Sprite;
    private headSprite:cc.Sprite;
    private hairSprite:cc.Sprite;
    private eyesSprite:cc.Sprite;
    private faceSprite:cc.Sprite;
    private handSprite1:cc.Sprite;
    private handSprite2:cc.Sprite;
    private legSprite1:cc.Sprite;
    private legSprite2:cc.Sprite;
    private underWearSprite:cc.Sprite;

    private organizationSelector:AttributeSelector;
    private genderSelector:AttributeSelector;
    private bodySizeSelector:AttributeSelector;
    private skinSelector:BrightnessBar;
    private hairSelector:AttributeSelector;
    private hairColorSelector:PaletteSelector;
    private eyesSelector:AttributeSelector;
    private eyesColorSelector:PaletteSelector;
    private faceSelector:AttributeSelector;
    private faceColorSelector:PaletteSelector;
    private data:AvatarData;

    onLoad() {
        this.data = new AvatarData();
        this.bedSprite = this.getSpriteChildSprite(this.avatarTable,['bed']);
        this.coverSprite = this.getSpriteChildSprite(this.avatarTable,['cover']);
        this.bodySprite = this.getSpriteChildSprite(this.avatarTable,['avatar','body']);
        this.underWearSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','body','underwear']);
        this.handSprite1 = this.getSpriteChildSprite(this.avatarTable,['avatar','body','hand1']);
        this.handSprite2 = this.getSpriteChildSprite(this.avatarTable,['avatar','body','hand2']);
        this.legSprite1 = this.getSpriteChildSprite(this.avatarTable,['avatar','body','leg1']);
        this.legSprite2 = this.getSpriteChildSprite(this.avatarTable,['avatar','body','leg2']);
        this.headSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','head']);
        this.hairSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','head','hair']);
        this.faceSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','head','face']);
        this.eyesSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','head','eyes']);
        this.loadingBackground.active = true;
        this.loadSpriteFrames();
        this.attributeLayout.active = false;
    }
    private getSpriteChildSprite(node:cc.Node,childNames: string[]): cc.Sprite {
        for (let name of childNames) {
            node = node.getChildByName(name);
        }
        return node.getComponent(cc.Sprite);
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
    show(){
        this.loadingBackground.active = false;
        //组织
        let organList = new Array();
        let organization = ['弥世逐流','宝藏猎人','幽光守护','翠金科技'];
        for(let i=0;i<organization.length;i++){
            organList.push(new AttributeData(i,organization[i],''));
        }
        this.organizationSelector = this.addAttributeSelector('组织：',organList)
        this.organizationSelector.selectorCallback = (data:AttributeData)=>{
            this.data.organizationIndex = data.id;
            this.bedSprite.spriteFrame = this.spriteFrames[`avatarbed00${data.id}`];
            this.coverSprite.spriteFrame = this.spriteFrames[`avatarcover00${data.id}`];
            this.randomLabel.string = data.name;
        };
        //性别
        this.genderSelector = this.addAttributeSelector('性别：',[new AttributeData(0,'男性',''),new AttributeData(1,'女性','')])
        this.genderSelector.selectorCallback = (data:AttributeData)=>{
            this.underWearSprite.node.opacity = data.id == 0?0:255;
            this.data.gender = data.id;
        };
        this.bodySizeSelector = this.addAttributeSelector('身体：',[new AttributeData(0,'正常',''),new AttributeData(1,'瘦小',''),new AttributeData(2,'高大','')])
        this.bodySizeSelector.selectorCallback = (data:AttributeData)=>{
            this.data.bodySize = data.id;
        };
        //皮肤颜色
        this.skinSelector = this.addBrightnessBar()
        this.skinSelector.setSelectorCallback((color:cc.Color)=>{
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
        for(let i=0;i<4;i++){
            hairList.push(new AttributeData(i,`样式${i}`,`avatarhair0${i>9?'':'0'}${i}anim00`));
        }
        this.hairSelector = this.addAttributeSelector('发型：',hairList)
        this.hairSelector.selectorCallback = (data:AttributeData)=>{
            this.hairSprite.spriteFrame = this.spriteFrames[data.resName+'0'];
            this.data.hairResName = data.resName;
        };
        //头发颜色
        this.hairColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_HAIR)
        this.hairColorSelector.setSelectorCallback((color:cc.Color)=>{
            this.hairSprite.node.color = color;
            this.data.hairColor = color.toHEX('#rrggbb');
        })
        //眼睛
        let eyesList = [];
        for(let i=0;i<4;i++){
            eyesList.push(new AttributeData(i,`样式${i}`,`avatareyes0${i>9?'':'0'}${i}anim00`));
        }
        this.eyesSelector = this.addAttributeSelector('眼睛：',eyesList)
        this.eyesSelector.selectorCallback = (data:AttributeData)=>{
            this.eyesSprite.spriteFrame = this.spriteFrames[data.resName+'0'];
            this.data.eyesResName = data.resName;
        };
        //眼睛颜色
        this.eyesColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_EYES)
        this.eyesColorSelector.setSelectorCallback((color:cc.Color)=>{
            this.eyesSprite.node.color = color;
            this.data.eyesColor = color.toHEX('#rrggbb');
        })
        //面颊
        let faceList = [];
        for(let i=0;i<4;i++){
            faceList.push(new AttributeData(i,`样式${i}`,`avatarface0${i>9?'':'0'}${i}anim00`));
        }
        this.faceSelector = this.addAttributeSelector('面颊：',faceList)
        this.faceSelector.selectorCallback = (data:AttributeData)=>{
            this.faceSprite.spriteFrame = this.spriteFrames[data.resName+'0'];
            this.data.faceResName = data.resName;
        };
        //脸部颜色
        this.faceColorSelector = this.addPaletteSelector(PaletteSelector.TYPE_FACE)
        this.faceColorSelector.setSelectorCallback((color:cc.Color)=>{
            this.faceSprite.node.color = color;
            this.data.faceColor = color.toHEX('#rrggbb');
        })
        this.ButtonRandom();
    }
    
    startGame(){
        //清除存档
        Logic.profileManager.clearData();
        //重置数据
        Logic.resetData();
        //加载资源
        AudioPlayer.play(AudioPlayer.SELECT);
        Logic.playerData.AvatarData = this.data.clone();
        cc.director.loadScene('loading');
    }
    backToHome() {
        cc.director.loadScene('start');
        AudioPlayer.play(AudioPlayer.SELECT);
    }
    
    addBrightnessBar():BrightnessBar{
        let prefab = cc.instantiate(this.brightnessBarPrefab);
        let script = prefab.getComponent(BrightnessBar);
        this.attributeLayout.addChild(prefab);
        return script;
    }
    addAttributeSelector(title:string,nameList:AttributeData[],defaultIndex?:number):AttributeSelector{
        let prefab = cc.instantiate(this.selectorPrefab);
        let script = prefab.getComponent(AttributeSelector);
        this.attributeLayout.addChild(prefab);
        script.init(title,nameList,defaultIndex);
        return script;
    }
    addPaletteSelector(colorType:number,defaultIndex?:number):PaletteSelector{
        let prefab = cc.instantiate(this.palettePrefab);
        let script = prefab.getComponent(PaletteSelector);
        this.attributeLayout.addChild(prefab);
        script.init(colorType,defaultIndex);
        return script;
    }
    update(dt) {
        if (this.isSpirteLoaded) {
            this.isSpirteLoaded = false;
            this.show();
        }
    }

    ButtonSwitch(){
        this.randomLayout.active = this.randomLayout.active?false:true;
        this.attributeLayout.active = this.attributeLayout.active?false:true;
        AudioPlayer.play(AudioPlayer.SELECT);
    }
    ButtonRandom(){
        this.organizationSelector.selectRandom();
        this.genderSelector.selectRandom();
        this.bodySizeSelector.selectRandom();
        this.skinSelector.selectRandom();
        this.hairSelector.selectRandom();
        this.hairColorSelector.selectRandom();
        this.eyesSelector.selectRandom();
        this.eyesColorSelector.selectRandom();
        this.faceSelector.selectRandom();
        this.faceColorSelector.selectRandom();
        AudioPlayer.play(AudioPlayer.SELECT);
    }
}
