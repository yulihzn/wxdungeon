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
        LIGHT: 20,//光线 特殊的一种类型，不做碰撞检测
        PLAYER_INTERACT: 21//玩家触碰范围用来触发一些显示内容
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
    ignoreSameTag = false;

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
    targetTags: Map<string, boolean> = new Map();
    //指定忽略的碰撞类型
    ignoreTags: Map<string, boolean> = new Map();

    private isStaying = false;
    private _center: cc.Vec3;
    private _aabb: cc.Rect;
    private _radius: number;
    private _points: cc.Vec2[] = [];
    isRotate = false;
    private _disableOnce = false;
    set disabledOnce(disabledOnce: boolean) {
        this._disableOnce = disabledOnce;
    }
    get disabledOnce() {
        return this._disableOnce;
    }

    setSize(s: cc.Size) {
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
    get points() {
        return this._points;
    }
    private onContactListener: OnContactListener;
    public setOnContactListener(onContactListener: OnContactListener) {
        this.onContactListener = onContactListener;
    }
    setEntityNode(node: cc.Node) {
        this.entity.NodeRender.node = node;
    }
    public fixCenterAndScale() {
        this.isStaying = false;
        let offset = cc.v3(this.offsetX, this.offsetY);
        this._center = this.node.convertToWorldSpaceAR(cc.v3(this.offsetX, this.offsetY));

        let woffset = this.node.convertToWorldSpaceAR(offset);
        this._radius = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.radius, 0))).sub(woffset).mag();
        let wlen = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.w, 0))).sub(woffset).mag();
        let hlen = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.h, 0))).sub(woffset).mag();
        if (this.isCircle) {
            this.isRotate = false;
            this._points = [];
            this._aabb = cc.rect(this._center.x - this._radius, this._center.y - this._radius, this._radius * 2, this._radius * 2);
        } else {
            this._aabb = cc.rect(this._center.x - wlen / 2, this._center.y - hlen / 2, wlen, hlen);
            let p0 = this.node.convertToWorldSpaceAR(offset.add(cc.v3(-this.w / 2, -this.h / 2)));
            let p1 = this.node.convertToWorldSpaceAR(offset.add(cc.v3(-this.w / 2, this.h / 2)));
            let p2 = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.w / 2, this.h / 2)));
            let p3 = this.node.convertToWorldSpaceAR(offset.add(cc.v3(this.w / 2, -this.h / 2)));
            this.isRotate = p0.x != p1.x;
            this._points = [cc.v2(p0), cc.v2(p1), cc.v2(p2), cc.v2(p3)];
            if (this.isRotate) {
                let w1 = Math.abs(p0.x-p2.x);
                let w2 = Math.abs(p1.x-p3.x);
                let h1 = Math.abs(p0.y-p2.y);
                let h2 = Math.abs(p1.y-p3.y);
                let w = w1>w2?w1:w2;
                let h = h1>h2?h1:h2;
                
                this._aabb = cc.rect(this._center.x - this._radius, this._center.y - this._radius, this._radius * 2, this._radius * 2);
            }
        }
    }

    /**
     * 更新子碰撞在根节点的位置
     */
    updateChildOffset() {

    }
    onLoad() {
        this.setTargetTags(this.targetTagList);
        this.setIgnoreTags(this.ignoreTagList);
    }
    /**添加碰撞目标tag */
    public setTargetTags(tags: number[], isRemove?: boolean) {
        for (let tag of tags) {
            this.targetTags.set(`tag${tag}`, isRemove ? false : true);
        }
    }
    /**添加碰撞忽略tag */
    public setIgnoreTags(tags: number[], isRemove?: boolean) {
        for (let tag of tags) {
            this.ignoreTags.set(`tag${tag}`, isRemove ? false : true);
        }
    }


    contact(other: CCollider) {
        if (this.onContactListener) {
            this.onContactListener.onColliderPreSolve(other, this);
        }
        if (this._disableOnce || other.disabledOnce) {
            return;
        }
        if (this.inColliders[other.id]) {
            this.isStaying = true;
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
            this.disabledOnce = false;
            if (this.onContactListener) {
                this.onContactListener.onColliderExit(other, this);
            }
        }

    }
    drawDebug(graphics: cc.Graphics) {
        if (!graphics) {
            return;
        }
        graphics.strokeColor = cc.color(255, 255, 255, 160);
        graphics.fillColor = cc.color(255, 255, 255, 60);
        graphics.lineWidth = 8;
        if (this.type == CCollider.TYPE.CIRCLE) {
            let r1 = graphics.node.convertToNodeSpaceAR(cc.v3(this.w_radius, 0));
            let r2 = graphics.node.convertToNodeSpaceAR(cc.v3(0, 0));
            let center = graphics.node.convertToNodeSpaceAR(this.w_center);
            graphics.circle(center.x, center.y, r1.sub(r2).mag());
            if (this.isStaying) {
                graphics.fill();
            }
            graphics.stroke();
        } else {
            let p0 = graphics.node.convertToNodeSpaceAR(this.points[0]);
            graphics.moveTo(p0.x, p0.y);
            for (let i = 1; i < this.points.length; i++) {
                let p = graphics.node.convertToNodeSpaceAR(this.points[i]);
                graphics.lineTo(p.x, p.y);
            }
            graphics.close();
            if (this.isStaying) {
                graphics.fill();
            }
            graphics.stroke();
        }
    }
    get Aabb(): cc.Rect {
        return this._aabb;
    }
    get isCircle() {
        return this.type == CCollider.TYPE.CIRCLE;
    }

    // LIFE-CYCLE CALLBACKS:

    start() {

    }

    static genNonDuplicateID(): string {
        return Number(Random.rand().toString().substr(3, 16) + Date.now()).toString(36);
    }
}
