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
        PLAYER_INTERACT: 21,//玩家触碰范围用来触发交互
        INTERACT: 22//触碰范围用来触发
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
    density: number = 0;
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
    inColliders: Map<number, boolean> = new Map();
    id: number = CCollider.genNonDuplicateID();
    //同一个物体下的碰撞需要忽略
    groupId: number;
    //该碰撞体的实体类，如果有会计算物理部分
    entity: ActorEntity;
    //指定匹配碰撞类型，如果为空则匹配所有，如果不为空则只匹配map里的tag
    targetTags: Map<number, boolean> = new Map();
    //指定忽略的碰撞类型
    ignoreTags: Map<number, boolean> = new Map();

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
                let ps = [];
                let tp0 = this._points[0].clone();
                let startIndex = 0;
                for (let i = 1; i < this._points.length; i++) {
                    if (this._points[i].x < tp0.x) {
                        tp0 = this._points[i].clone();
                        startIndex = i;
                    }
                }
                for (let i = startIndex; i < this._points.length; i++) {
                    ps.push(this._points[i].clone());
                }
                for (let i = 0; i < startIndex; i++) {
                    ps.push(this._points[i].clone());
                }
                let w = Math.abs(ps[0].x - ps[2].x);
                let h = Math.abs(ps[1].y - ps[3].y);
                this._aabb = cc.rect(ps[0].x, ps[1].y < ps[3].y ? ps[1].y : ps[3].y, w, h);
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
            if (isRemove) {
                this.targetTags.delete(tag);
            } else {
                this.targetTags.set(tag, true);
            }
        }
    }
    /**添加碰撞忽略tag */
    public setIgnoreTags(tags: number[], isRemove?: boolean) {
        for (let tag of tags) {
            if (isRemove) {
                this.ignoreTags.delete(tag);
            } else {
                this.ignoreTags.set(tag, true);
            }
        }
    }


    contact(other: CCollider, dt: number) {
        if (this.onContactListener) {
            this.onContactListener.onColliderPreSolve(other, this);
        }
        if (this._disableOnce || other.disabledOnce) {
            return;
        }
        if (this.inColliders.has(other.id)) {
            this.isStaying = true;
            if (this.onContactListener) {
                this.onContactListener.onColliderStay(other, this);
            }
        } else {
            this.inColliders.set(other.id, true);
            if (this.onContactListener) {
                this.onContactListener.onColliderEnter(other, this);
            }
        }
        if (this.entity && other.entity && !this.sensor && !other.sensor && !this.isStatic) {
            //目前只考虑不旋转矩形和矩形之间的碰撞，碰撞时根据双方的位置和碰撞体的宽高抵消当前碰撞面的向量
            //比较双方同一侧的坐标位置情况来决定方向，然后给对应方向增加斥力
            //四个点是以左下角开始顺时针
            let ps1 = this.points;
            let ps2 = other.points;
            let isLeft = ps1[0].x < ps2[0].x;
            let isRight = ps1[2].x > ps2[2].x;
            let isTop = ps1[1].y > ps2[1].y;
            let isBottom = ps1[0].y < ps2[0].y;
            cc.log(`isLeft:${isLeft},isRight:${isRight},isTop:${isTop},isBottom:${isBottom}`);
            if (isLeft) {
                let offset = ps1[3].x - ps2[0].x;
                if (offset > 0) {
                    this.entity.Transform.position.x -= offset;
                }
            } else if (isRight) {
                let offset = ps2[3].x - ps1[0].x;
                if (offset > 0) {
                    this.entity.Transform.position.x += offset;
                }
            }
            if (isTop) {
                let offset = ps2[1].y - ps1[0].y;
                if (offset > 0) {
                    this.entity.Transform.position.y += offset;
                }
            } else if (isBottom) {
                let offset = ps1[1].y - ps2[0].y;
                if (offset > 0) {
                    this.entity.Transform.position.y -= offset;
                }
            }
            if (this.entity.NodeRender.node) {
                this.entity.NodeRender.node.setPosition(this.entity.Transform.position);
            }

        }

    }
    exit(other: CCollider) {
        if (this.inColliders.has(other.id)) {
            this.inColliders.delete(other.id);
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
        graphics.strokeColor = cc.color(255, 0, 0, 160);
        let aabb = this.Aabb;
        let p = graphics.node.convertToNodeSpaceAR(cc.v3(aabb.x, aabb.y));
        let p0 = graphics.node.convertToNodeSpaceAR(cc.v3(0, 0));
        let pw = graphics.node.convertToNodeSpaceAR(cc.v3(aabb.width, 0));
        let ph = graphics.node.convertToNodeSpaceAR(cc.v3(aabb.height, 0));
        graphics.rect(p.x, p.y, pw.sub(p0).mag(), ph.sub(p0).mag());
        graphics.stroke();
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

    static genNonDuplicateID(): number {
        return Number(~~(Random.rand() * 1000000) + Date.now());
    }
}
