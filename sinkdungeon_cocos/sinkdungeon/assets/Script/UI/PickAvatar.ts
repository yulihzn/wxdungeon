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
    isSpirteLoaded = false;
    //图片资源
    spriteFrames: { [key: string]: cc.SpriteFrame } = null;
    @property(cc.Node)
    loadingBackground:cc.Node = null;
    @property(cc.Node)
    avatarTable:cc.Node = null;
    @property(cc.Node)
    attributeLayout:cc.Node = null;
    @property(cc.Prefab)
    selectorPrefab:cc.Prefab = null;
    @property(cc.Prefab)
    brightnessBarPrefab:cc.Prefab = null;
    @property(cc.Prefab)
    palettePrefab:cc.Prefab = null;

    bedSprite:cc.Sprite;
    coverSprite:cc.Sprite;
    bodySprite:cc.Sprite;
    headSprite:cc.Sprite;
    hairSprite:cc.Sprite;
    eyesSprite:cc.Sprite;
    faceSprite:cc.Sprite;
    handSprite1:cc.Sprite;
    handSprite2:cc.Sprite;
    underWearSprite:cc.Sprite;
    onLoad() {
        this.bedSprite = this.getSpriteChildSprite(this.avatarTable,['bed']);
        this.coverSprite = this.getSpriteChildSprite(this.avatarTable,['cover']);
        this.bodySprite = this.getSpriteChildSprite(this.avatarTable,['avatar','body']);
        this.underWearSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','body','underwear']);
        this.handSprite1 = this.getSpriteChildSprite(this.avatarTable,['avatar','body','hand1']);
        this.handSprite2 = this.getSpriteChildSprite(this.avatarTable,['avatar','body','hand2']);
        this.headSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','head']);
        this.hairSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','head','hair']);
        this.faceSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','head','face']);
        this.eyesSprite = this.getSpriteChildSprite(this.avatarTable,['avatar','head','eyes']);
        this.loadingBackground.active = true;
        this.loadSpriteFrames();
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
        this.addAttributeSelector('组织：',organList).selectorCallback = (data:AttributeData)=>{
            this.bedSprite.spriteFrame = this.spriteFrames[`avatarbed00${data.id}`];
            this.coverSprite.spriteFrame = this.spriteFrames[`avatarcover00${data.id}`];
        };
        //性别
        this.addAttributeSelector('性别：',[new AttributeData(0,'男性',''),new AttributeData(1,'女性','')]).selectorCallback = (data:AttributeData)=>{
            this.underWearSprite.node.opacity = data.id == 0?0:255;
        };
        this.addAttributeSelector('身体：',[new AttributeData(0,'正常',''),new AttributeData(1,'瘦小',''),new AttributeData(2,'高大','')]).selectorCallback = (data:AttributeData)=>{

        };
        //皮肤颜色
        this.addBrightnessBar().setSelectorCallback((index:number)=>{
            this.bodySprite.spriteFrame = this.spriteFrames[`avatarbody0${index>9?'':'0'}${index}`];
            this.headSprite.spriteFrame = this.spriteFrames[`avatarbody0${index>9?'':'0'}${index}`];
            this.handSprite1.spriteFrame = this.spriteFrames[`avatarhand0${index>9?'':'0'}${index}`];
            this.handSprite2.spriteFrame = this.spriteFrames[`avatarhand0${index>9?'':'0'}${index}`];
        });
        //发型
        let hairList = [];
        for(let i=0;i<4;i++){
            hairList.push(new AttributeData(i,`样式${i}`,`avatarhair0${i>9?'':'0'}${i}anim000`));
        }
        this.addAttributeSelector('发型：',hairList).selectorCallback = (data:AttributeData)=>{
            this.hairSprite.spriteFrame = this.spriteFrames[data.resName];
        };
        //头发颜色
        this.addPaletteSelector(PaletteSelector.TYPE_HAIR).setSelectorCallback((color:cc.Color)=>{
            this.hairSprite.node.color = color;
        })
        //眼睛
        let eyesList = [];
        for(let i=0;i<4;i++){
            eyesList.push(new AttributeData(i,`样式${i}`,`avatareyes0${i>9?'':'0'}${i}anim000`));
        }
        this.addAttributeSelector('眼睛：',eyesList).selectorCallback = (data:AttributeData)=>{
            this.eyesSprite.spriteFrame = this.spriteFrames[data.resName];
        };
        //眼睛颜色
        this.addPaletteSelector(PaletteSelector.TYPE_EYES).setSelectorCallback((color:cc.Color)=>{
            this.eyesSprite.node.color = color;
        })
        //面颊
        let faceList = [];
        for(let i=0;i<4;i++){
            faceList.push(new AttributeData(i,`样式${i}`,`avatarface0${i>9?'':'0'}${i}anim000`));
        }
        this.addAttributeSelector('面颊：',faceList).selectorCallback = (data:AttributeData)=>{
            this.faceSprite.spriteFrame = this.spriteFrames[data.resName];
        };
        //脸部颜色
        this.addPaletteSelector(PaletteSelector.TYPE_FACE).setSelectorCallback((color:cc.Color)=>{
            this.faceSprite.node.color = color;
        })
        
    }
    
    startGame(){
        //清除存档
        Logic.profileManager.clearData();
        //重置数据
        Logic.resetData();
        //加载资源
        AudioPlayer.play(AudioPlayer.SELECT);
        cc.director.loadScene('loading');
    }
    backToHome() {
        cc.director.loadScene('start');
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
}
