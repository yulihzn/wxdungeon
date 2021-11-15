import AreaOfEffect from "../actor/AreaOfEffect";
import AreaOfEffectData from "../data/AreaOfEffectData";
import Logic from "../logic/Logic";
import CCollider from "../collider/CCollider";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//AOE管理器
const { ccclass, property } = cc._decorator;

@ccclass
export default class AoeManager extends cc.Component {

    @property(cc.Prefab)
    aoe: cc.Prefab = null;
    clear(): void {
    }

    public addSpriteFramesAoe(parentNode:cc.Node,pos: cc.Vec3, aoeData: AreaOfEffectData, spriteFrameNames: string[], repeatForever: boolean,isFaceRight:boolean) {
        let aoe = cc.instantiate(this.aoe);
        pos.y += 32;
        let sprite = aoe.getChildByName('sprite').getComponent(cc.Sprite);
        let collider = aoe.getComponent(CCollider);
        if (spriteFrameNames.length > 0) {
            let spriteframe = Logic.spriteFrameRes(spriteFrameNames[0]);
            sprite.node.width = spriteframe.getOriginalSize().width;
            sprite.node.height = spriteframe.getOriginalSize().height;
            sprite.node.scale = 4;
            sprite.node.scaleX = isFaceRight ? 4 : -4;
            collider.w = sprite.node.width * 3;
            collider.h = sprite.node.height * 3;
        }
        let tween = cc.tween();
        for (let name of spriteFrameNames) {
            tween.then(cc.tween().delay(0.2).call(() => {
                sprite.spriteFrame = Logic.spriteFrameRes(name);
            }));
        }
        if (repeatForever) {
            cc.tween(aoe).repeatForever(tween).start();
        } else {
            cc.tween(aoe).then(tween).delay(0.2).call(() => {
                sprite.spriteFrame = null;
            }).start();
        }
        let areaScript = aoe.getComponent(AreaOfEffect);
        areaScript.show(parentNode, pos, cc.v3(1, 0), 0, aoeData);
    }
    
}
