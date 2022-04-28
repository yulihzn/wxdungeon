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
    zHeight = 32
    @property
    bounce: number = 0;
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
    baseChangedCount = 0;
    private _disableOnce = false;
    set disabledOnce(disabledOnce: boolean) {
        this._disableOnce = disabledOnce;
    }
    get disabledOnce() {
        return this._disableOnce;
    }

    setSize(s: cc.Size, zHeight?: number) {
        this.w = s.width;
        this.h = s.height;
        if (zHeight) {
            this.zHeight = zHeight;
        }
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
    get z() {
        return this.entity.Transform.z;
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
        this.baseChangedCount = 0;
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
            this._points = [cc.v2(p0), cc.v2(p1), cc.v2(p2), cc.v2(p3)];
            this.isRotate = p0.x != p1.x;
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

    isOnOtherSurface(other: CCollider) {
        return this.z == other.z + other.zHeight;
    }
    isBelowOther(other: CCollider) {
        return this.z + this.zHeight < other.z;
    }
    isAboveOther(other: CCollider) {
        return this.z >= other.z + other.zHeight;
    }
    isHeightNotCollid(other: CCollider) {
        return this.isBelowOther(other) || this.isAboveOther(other);
    }
    preSolve(other: CCollider, dt: number) {
        if (this.isHeightNotCollid(other)) {
            return;
        }
        if (this.onContactListener) {
            this.onContactListener.onColliderPreSolve(other, this);
        }
    }
    contact(other: CCollider, dt: number) {
        if (this._disableOnce || other.disabledOnce || this.isHeightNotCollid(other)) {
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


    }
    physicTest(other: CCollider, dt: number) {
        if (this._disableOnce || other.disabledOnce || !this.entity || !other.entity
            || this.sensor || other.sensor || this.isStatic) {
            return;
        }
        //目前只考虑不旋转矩形和矩形之间的碰撞，碰撞时根据双方的位置和碰撞体的宽高抵消当前碰撞面的向量
        //比较双方同一侧的坐标位置情况来决定方向，然后给对应方向增加斥力
        //四个点是以左下角开始顺时针的最小包围盒
        let tps = this._points;
        let ops = other._points;
        if (this.isRotate || this.type == CCollider.TYPE.CIRCLE || this.node.scaleX < 0 || this.node.scaleY < 0) {
            tps = [cc.v2(this.Aabb.x, this.Aabb.y)
                , cc.v2(this.Aabb.x, this.Aabb.y + this.Aabb.height)
                , cc.v2(this.Aabb.x + this.Aabb.width, this.Aabb.y + this.Aabb.height)
                , cc.v2(this.Aabb.x + this.Aabb.width, this.Aabb.y)];
        }
        if (other.isRotate || other.type == CCollider.TYPE.CIRCLE || other.node.scaleX < 0 || other.node.scaleY < 0) {
            ops = [cc.v2(other.Aabb.x, other.Aabb.y)
                , cc.v2(other.Aabb.x, other.Aabb.y + other.Aabb.height)
                , cc.v2(other.Aabb.x + other.Aabb.width, other.Aabb.y + other.Aabb.height)
                , cc.v2(other.Aabb.x + other.Aabb.width, other.Aabb.y)];
        }
        let w1 = tps[3].x - tps[0].x;//自身宽度
        let w2 = ops[3].x - ops[0].x;//目标宽度
        let h1 = tps[1].y - tps[0].y;//自身高度
        let h2 = ops[1].y - ops[0].y//目标高度
        let center1 = cc.v2(tps[0].x + w1 / 2, tps[0].y + h1 / 2);//自身中点
        let center2 = cc.v2(ops[0].x + w2 / 2, ops[0].y + h2 / 2);//目标中点
        let rect1 = cc.rect(tps[0].x, tps[0].y, w1, h1);//自身包围盒
        let rect2 = cc.rect(ops[0].x, ops[0].y, w2, h2);//目标包围盒
        // let isLeft = tps[0].x < ops[0].x && tps[3].x > ops[0].x;//左下角在目标左下角的左边且右下角在目标左下角的右边
        // let isRight = tps[2].x > ops[2].x && tps[0].x < ops[3].x;//右上角在目标右上角的右边且左下角在目标右下角的左边
        // let isTop = tps[1].y > ops[1].y && tps[0].y < ops[1].y;//左上角在目标左上角的上面且左下角在目标左上角的下面
        // let isBottom = tps[0].y < ops[0].y && tps[1].y > ops[0].y;//左下角在目标左下角的下面且左上角在目标左下角的上面
        let isLeft = tps[0].x < ops[0].x;
        let isRight = tps[2].x > ops[2].x;
        let isTop = tps[1].y > ops[1].y;
        let isBottom = tps[0].y < ops[0].y;
        let pos = this.entity.Move.linearVelocity.clone();
        let offset = this.bounce > 0 ? this.bounce : 10;
        let lenVertical = Math.abs(center1.y - center2.y);//两者中心位置的纵向距离
        let lenHorizonal = Math.abs(center1.x - center2.x);//两者中心位置的横向距离
        let offsetVertical = (h1 + h2) / 2 - lenVertical;//两者纵向重合部分的长度
        let offsetHorizonal = (w1 + w2) / 2 - lenHorizonal;//两者横向重合部分的长度
        //两者包围盒互相包含对方中点的时候添加一个反向斥力
        if (rect1.contains(center2) || rect2.contains(center1)) {
            if (this.isAboveOther(other)) {
                //上方
                this.entity.Transform.base = other.z + other.zHeight;
                this.baseChangedCount++;
            } else if (this.isBelowOther(other)) {
                //下方
            } else {
                pos = center1.sub(center2).normalizeSelf().mul(offset);
            }
        } else {

            if (!this.isHeightNotCollid(other)) {
                if (isLeft && pos.x >= 0 && offsetHorizonal > 0 && offsetHorizonal < offsetVertical) {
                    pos.x = -offset;
                } else if (isRight && pos.x <= 0 && offsetHorizonal > 0 && offsetHorizonal < offsetVertical) {
                    pos.x = offset;
                } else if (isTop && pos.y <= 0 && offsetVertical > 0 && offsetHorizonal > offsetVertical) {
                    pos.y = offset;
                } else if (isBottom && pos.y >= 0 && offsetVertical > 0 && offsetHorizonal > offsetVertical) {
                    pos.y = -offset;
                }
            } else if (this.isAboveOther(other) && this.entity.Transform.base <= other.z + other.zHeight) {
                this.entity.Transform.base = other.z + other.zHeight;
                this.baseChangedCount++;
            }

            // if(isLeft||isRight){
            //     //如果左下角在目标左上角的下面且左上角在目标左上角的下面
            //     if(tps[0].y>ops[0].y&&tps[1].y<ops[1].y||tps[0].y<ops[0].y&&tps[1].y>ops[1].y){
            //         pos = cc.v2(isLeft?-offset:offset,pos.y);
            //         //如果重合的横向长度大于0且横向小于纵向
            //     }else if(offsetHorizonal>0&&offsetHorizonal<offsetVertical){
            //         pos = cc.v2(isLeft?-offset:offset,0);
            //     }
            // }
            // if(isTop||isBottom){
            //     if(tps[0].x>ops[0].x&&tps[3].x<ops[3].x||tps[0].x<ops[0].x&&tps[3].x>ops[3].x){
            //         pos = cc.v2(0,isTop?offset:-offset);
            //     }else if(offsetVertical>0&&offsetHorizonal>offsetVertical){
            //         pos = cc.v2(0,isTop?offset:-offset);
            //     }
            // }
        }
        this.entity.Move.linearVelocity = pos;

        // if (this.entity.NodeRender.node) {
        //     if (isLeft) {
        //         this.entity.Transform.position.x -= offsetHorizonal;
        //         this.entity.NodeRender.node.setPosition(this.entity.Transform.position);
        //     } else if (isRight) {
        //         this.entity.Transform.position.x += offsetHorizonal;
        //         this.entity.NodeRender.node.setPosition(this.entity.Transform.position);
        //     } else if (isTop) {
        //         this.entity.Transform.position.y += offsetVertical;
        //         this.entity.NodeRender.node.setPosition(this.entity.Transform.position);
        //     } else if (isBottom) {
        //         this.entity.Transform.position.y -= offsetVertical;
        //         this.entity.NodeRender.node.setPosition(this.entity.Transform.position);
        //     }
        // }
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
        graphics.lineWidth = 4;
        let center = graphics.node.convertToNodeSpaceAR(this.w_center);
        if (this.type == CCollider.TYPE.CIRCLE) {
            let r1 = graphics.node.convertToNodeSpaceAR(cc.v3(this.w_radius, 0));
            let r2 = graphics.node.convertToNodeSpaceAR(cc.v3(0, 0));
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
        let nw = pw.sub(p0).mag();
        let nh = ph.sub(p0).mag();
        graphics.rect(p.x, p.y, nw, nh);
        graphics.stroke();
        if (!this.sensor) {
            let zh = graphics.node.convertToNodeSpaceAR(cc.v3(this.zHeight, 0));
            let nzh = zh.sub(p0).mag();
            graphics.strokeColor = cc.color(0, 0, 255, 40);
            graphics.moveTo(p.x + nw * 0.25, p.y);
            graphics.lineTo(p.x + nw * 0.25, p.y + nzh);
            graphics.stroke();
            graphics.strokeColor = cc.color(0, 255, 0, 40);
            graphics.moveTo(p.x + nw * 0.75, p.y + nh);
            graphics.lineTo(p.x + nw * 0.75, p.y + nh + nzh);
            graphics.stroke();
            graphics.strokeColor = cc.color(0, 255, 255, 40);
            graphics.moveTo(p.x + nw * 0.25, p.y + nzh);
            graphics.lineTo(p.x + nw * 0.75, p.y + nh + nzh);
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

    static genNonDuplicateID(): number {
        return Number(~~(Random.rand() * 1000000) + Date.now());
    }
}
