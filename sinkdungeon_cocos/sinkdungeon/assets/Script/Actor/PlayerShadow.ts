// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "../Logic";
import Player from "../Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerShadow extends cc.Component {

    player: Player;
    private spriteList: cc.Sprite[] = [];
    private matList: cc.MaterialVariant[] = [];
    private shadowTexture: cc.RenderTexture;
    private isOpen = true;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.spriteList.push(this.node.getChildByName('sprite0').getComponent(cc.Sprite));
        this.spriteList.push(this.node.getChildByName('sprite1').getComponent(cc.Sprite));
        this.spriteList.push(this.node.getChildByName('sprite2').getComponent(cc.Sprite));
        this.spriteList.push(this.node.getChildByName('sprite3').getComponent(cc.Sprite));
        this.spriteList.push(this.node.getChildByName('sprite4').getComponent(cc.Sprite));
        for (let sprite of this.spriteList) {
            sprite.node.parent = this.node.parent;
            sprite.node.scaleX = 3;
            sprite.node.scaleY = -3;
            this.matList.push(sprite.getMaterial(0));
            sprite.node.active = false;
        }

    }

    start() {
       
    }

    update(dt) {
        if (this.isOpen && this.player) {
            if (!this.shadowTexture) {
                this.shadowTexture = new cc.RenderTexture();
                this.shadowTexture.initWithSize(this.player.shadowCamera.node.width, this.player.shadowCamera.node.height);
                this.shadowTexture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST);
                this.player.shadowCamera.targetTexture = this.shadowTexture;
                let spriteframe = new cc.SpriteFrame(this.shadowTexture);
                for (let i = 0; i < this.spriteList.length; i++) {
                    let sprite = this.spriteList[i];
                    sprite.node.active = true;
                    sprite.spriteFrame = spriteframe;
                    sprite.node.zIndex = this.player.node.zIndex + 1 + i;
                    sprite.node.width = sprite.spriteFrame.getRect().width;
                    sprite.node.height = sprite.spriteFrame.getRect().height;
                    sprite.node.position = this.player.node.position.clone();
                }
            }
            this.node.position = Logic.lerpPos(this.node.position, this.player.node.position, dt * 5);
            for (let i = 0; i < this.spriteList.length; i++) {
                let sprite = this.spriteList[i];
                sprite.node.opacity = 60 + i * 20;
                let mat = this.matList[i];
                mat.setProperty('textureSizeWidth', sprite.spriteFrame.getTexture().width * 3);
                mat.setProperty('textureSizeHeight', sprite.spriteFrame.getTexture().height * 3);
                mat.setProperty('outlineColor', cc.color(200, 200, 200));
                mat.setProperty('outlineSize', 4);
                sprite.node.position = Logic.lerpPos(sprite.node.position, this.node.position, dt * (5 + i * 20));
            }
        }
    }
}
