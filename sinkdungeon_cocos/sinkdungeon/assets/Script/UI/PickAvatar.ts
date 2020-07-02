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

    bedSprite:cc.Sprite;
    coverSprite:cc.Sprite;
    bodySprite:cc.Sprite;
    hairSprite:cc.Sprite;
    eyesSprite:cc.Sprite;
    faceSprite:cc.Sprite;
    onLoad() {
        this.bedSprite = this.getSpriteChildSprite(this.avatarTable,['bed']);
        this.coverSprite = this.getSpriteChildSprite(this.avatarTable,['cover']);
        this.bodySprite = this.getSpriteChildSprite(this.avatarTable,['avatar','body']);
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
        let organList = new Array();
        let organization = ['弥世逐流','宝藏猎人','幽光守护','翠金科技'];
        for(let i=0;i<organization.length;i++){
            organList.push(new AttributeData(i,organization[i],''));
        }
        this.addAttributeSelectors(organList).selectorCallback = (data:AttributeData)=>{
            this.bedSprite.spriteFrame = this.spriteFrames[`avatarbed00${data.id}`];
            this.coverSprite.spriteFrame = this.spriteFrames[`avatarcover00${data.id}`];
        };
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
    
    addAttributeSelectors(nameList:AttributeData[],defaultIndex?:number):AttributeSelector{
        let prefab = cc.instantiate(this.selectorPrefab);
        let as = prefab.getComponent(AttributeSelector);
        this.attributeLayout.addChild(prefab);
        as.init(nameList,defaultIndex);
        return as;
    }
    update(dt) {
        if (this.isSpirteLoaded) {
            this.isSpirteLoaded = false;
            this.show();
        }
    }
}
