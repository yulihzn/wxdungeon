// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Random from "../utils/Random";
import OnContactListener from "./OnContactListener";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CCollider extends cc.Component {
    static readonly TYPE = cc.Enum({
        CIRCLE: 0,
        RECT: 1
    })
    static readonly GROUP = cc.Enum({
        DEFAULT: 0,
        ACTOR: 1
    })
    static readonly TAG = cc.Enum({
        DEFAULT: 0,//默认
        WALL: 1,//墙
        WALL_TOP: 2,
        PLAYER: 3,//玩家（唯一）
        PLAYER_HIT: 4,
        NONPLAYER: 5,//敌人或者坏的npc
        NONPLAYER_HIT: 6,
        GOODNONPLAYER: 7,//好的npc
        GOODNONPLAYER_HIT: 8,//好的npc
        BOSS: 9,//头目
        BOSS_HIT: 10,//boss攻击部分
        BULLET: 11,//子弹
        BUILDING: 12,//建筑
        AOE: 13,//范围效果
        ITEM: 14,//物品
        EQUIPMENT: 15,//装备
        COIN: 16,//金币
        TIPS: 17,//提示
        WARTER: 18,//水墙
        ENERGY_SHIELD: 19,//能量罩
        LIGHT: 20//光线
    })
    @property({ type: CCollider.TAG, displayName: '碰撞分组' })
    tag: number = CCollider.TAG.DEFAULT;

    @property(cc.Vec2)
    offset: cc.Vec2 = cc.Vec2.ZERO;

    @property({ type: CCollider.TYPE, displayName: '组件类型' })
    type: number = CCollider.TYPE.RECT;
    @property({
        visible: function () {
            return this.type == CCollider.TYPE.CIRCLE
        }
    })
    radius: number = 64;

    @property({
        visible: function () {
            return this.type == CCollider.TYPE.RECT
        }
    })
    size: cc.Size = cc.size(128, 128);

    @property
    sensor: boolean = false;

    pos: cc.Vec3 = cc.Vec3.ZERO;//碰撞体在统一的坐标系下的位置
    inColliders: { [key: string]: boolean } = {};
    uuid: string = CCollider.genNonDuplicateID();

    private onContactListener: OnContactListener;
    public setOnContactListener(onContactListener: OnContactListener) {
        this.onContactListener = onContactListener;
    }

    contact(other: CCollider) {
        if (this.inColliders[other.uuid]) {
            if (this.onContactListener) {
                this.onContactListener.onColliderStay(other, this);
            }
        } else {
            this.inColliders[other.uuid] = true;
            if (this.onContactListener) {
                this.onContactListener.onColliderEnter(other, this);
            }
        }

    }
    exit(other: CCollider) {
        if (this.inColliders[other.uuid]) {
            this.inColliders[other.uuid] = false;
            if (this.onContactListener) {
                this.onContactListener.onColliderExit(other, this);
            }
        }

    }
    get Aabb(): cc.Rect {
        return cc.rect(this.pos.x + this.offset.x, this.pos.y + this.offset.y, this.size.width * this.node.scale, this.size.height * this.node.scale);
    }

    // LIFE-CYCLE CALLBACKS:


    start() {

    }

    // update (dt) {}
    static genNonDuplicateID(): string {
        return Number(Random.rand().toString().substr(3, 16) + Date.now()).toString(36);
    }
}
