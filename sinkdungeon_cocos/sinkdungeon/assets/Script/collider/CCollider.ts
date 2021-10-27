// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ActorEntity from "../ecs/entity/ActorEntity";
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
        LIGHT: 20//光线 特殊的一种类型，不做碰撞检测
    })
    @property({ type: CCollider.TAG, displayName: 'Collider Tag' })
    tag: number = CCollider.TAG.DEFAULT;

    @property
    offsetX: number = 0;
    @property
    offsetY: number = 0;

    @property({ type: CCollider.TYPE, displayName: 'Shape Type' })
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
    w: number = 128;
    @property({
        visible: function () {
            return this.type == CCollider.TYPE.RECT
        }
    })
    h: number = 128;

    @property
    sensor: boolean = false;
    @property
    isStatic: boolean = false;
    @property
    isChild = false;

    @property({ type: [CCollider.TAG], displayName: 'Target Tag' })
    targetTagList: number[] = [];
    @property({
        type: [CCollider.TAG], displayName: 'Ignore Tag', visible: function () {
            return this.targetTagList.length < 1;
        }
    })
    ignoreTagList: number[] = [];


    //当前已经碰撞过的物体
    inColliders: { [key: string]: boolean } = {};
    id: string = CCollider.genNonDuplicateID();
    //同一个物体下的碰撞需要忽略
    groupId: string = '';
    //该碰撞体的实体类，如果有会计算物理部分
    entity: ActorEntity;
    //指定匹配碰撞类型，如果为空则匹配所有，如果不为空则只匹配map里的tag
    targetTags: Map<number, boolean> = new Map();
    //指定忽略的碰撞类型
    ignoreTags: Map<number, boolean> = new Map();

    private _center:cc.Vec3;
    private _aabb:cc.Rect;
    private _radius:number;
    private _points:cc.Vec2[] = [];
    isRotate = false;

    set size(s: cc.Size) {
        this.w = s.width;
        this.h = s.height;
    }
    set offset(o: cc.Vec2) {
        this.offsetX = o.x;
        this.offsetY = o.y;
    }
    get offset() {
        return cc.v2(this.offsetX, this.offsetY);
    }
    get w_radius() {
        return this._radius;
    }
    get w_center() {
        return cc.v2(this._center);
    }
    get points(){
        return this._points;
    }
    private onContactListener: OnContactListener;
    public setOnContactListener(onContactListener: OnContactListener) {
        this.onContactListener = onContactListener;
    }
    setEntityNode(node: cc.Node) {
        this.entity.NodeRender.node = node;
    }
    public fixCenterAndScale(){
        let parent = this.entity.NodeRender.node;
        if(!parent){
            cc.log(`${this.id} the entity node is undefined`);
            return;
        }
        let offset = cc.v3(this.offsetX,this.offsetY);
        this._center = parent.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v3(this.offsetX,this.offsetY)));
        
        let woffset = this.node.convertToWorldSpaceAR(offset);
        this._radius = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.radius,0))).sub(woffset).mag();
        let wlen = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.w,0))).sub(woffset).mag();
        let hlen = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.h,0))).sub(woffset).mag();
        if(this.isCircle){
            this.isRotate = false;
            this._points = [];
            this._aabb = cc.rect(this._center.x-this._radius,this._center.y-this._radius,this._radius*2,this._radius*2);
        }else{
            this._aabb = cc.rect(this._center.x-wlen/2,this._center.y-hlen/2,wlen,hlen);
            let p0 = this.node.convertToWorldSpaceAR(offset.add(cc.v3(-this.w,-this.h)));
            let p1 = this.node.convertToWorldSpaceAR(offset.add(cc.v3(-this.w,this.h)));
            let p2 = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.w,this.h)));
            let p3 = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.w,-this.h)));
            this.isRotate = p0.x!=p1.x;
            this._points = [cc.v2(p0),cc.v2(p1),cc.v2(p2),cc.v2(p3)];
        }

    }
   
    /**
     * 更新子碰撞在根节点的位置
     */
    updateChildOffset() {
       
    }
    onLoad() {
        for (let t of this.targetTagList) {
            this.targetTags.set(t, true);
        }
        for (let i of this.targetTagList) {
            this.ignoreTags.set(i, true);
        }
    }

    contact(other: CCollider) {
        if (this.inColliders[other.id]) {
            if (this.onContactListener) {
                this.onContactListener.onColliderStay(other, this);
            }
        } else {
            this.inColliders[other.id] = true;
            if (this.onContactListener) {
                this.onContactListener.onColliderEnter(other, this);
            }
        }
        if (this.entity && other.entity && !this.sensor && !other.sensor && !this.isStatic) {
            if (!this.isStatic) {
                let x = this.entity.Transform.position.x - other.entity.Transform.position.x;
                let y = this.entity.Transform.position.y - other.entity.Transform.position.y;
                let w = 0;
                let h = 0;
                let offset = 5;
                if (this.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.RECT) {
                    //矩形
                    let aabb1 = this.Aabb;
                    let aabb2 = other.Aabb;
                    w = aabb1.width / 2 + aabb2.width / 2 + offset;
                    h = aabb1.height / 2 + aabb2.height / 2 + offset;
                } else if (this.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.CIRCLE) {
                    //圆形
                    w = this.w_radius + other.w_radius + offset;
                    h = this.w_radius + other.w_radius + offset;
                } else if (this.type == CCollider.TYPE.RECT && other.type == CCollider.TYPE.CIRCLE) {
                    //矩形圆形
                    let aabb1 = this.Aabb;
                    w = aabb1.width / 2 + other.w_radius + offset;
                    h = aabb1.height / 2 + other.w_radius + offset;
                } else if (this.type == CCollider.TYPE.CIRCLE && other.type == CCollider.TYPE.RECT) {
                    //圆形矩形
                    let aabb2 = other.Aabb;
                    w = this.w_radius + aabb2.width / 2 + offset;
                    h = this.w_radius + aabb2.height / 2 + offset;
                }
                if (Math.abs(x) > Math.abs(y)) {
                    if (Math.abs(x) < w) {
                        this.entity.Transform.position.x = other.entity.Transform.position.x + (x > 0 ? w : -w);
                        if (this.entity.NodeRender.node) {
                            this.entity.NodeRender.node.setPosition(this.entity.Transform.position);
                        }
                    }
                } else if (Math.abs(y) < h) {
                    this.entity.Transform.position.y = other.entity.Transform.position.y + (y > 0 ? h : -h);
                    if (this.entity.NodeRender.node) {
                        this.entity.NodeRender.node.setPosition(this.entity.Transform.position);
                    }
                }
            }
        }

    }
    exit(other: CCollider) {
        if (this.inColliders[other.id]) {
            this.inColliders[other.id] = false;
            if (this.onContactListener) {
                this.onContactListener.onColliderExit(other, this);
            }
        }

    }
    get Aabb(): cc.Rect {
        return this._aabb;
    }
    get isCircle(){
        return this.type == CCollider.TYPE.CIRCLE;
    }

    // LIFE-CYCLE CALLBACKS:

    start() {

    }

    static genNonDuplicateID(): string {
        return Number(Random.rand().toString().substr(3, 16) + Date.now()).toString(36);
    }
}
