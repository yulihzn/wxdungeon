import AreaOfEffect from '../actor/AreaOfEffect'
import Actor from '../base/Actor'
import CCollider from '../collider/CCollider'
import AreaOfEffectData from '../data/AreaOfEffectData'
import BulletData from '../data/BulletData'
import DamageData from '../data/DamageData'
import EquipmentData from '../data/EquipmentData'
import FromData from '../data/FromData'
import GameWorldSystem from '../ecs/system/GameWorldSystem'
import Bullet from '../item/Bullet'
import Laser from '../item/Laser'
import InventoryManager from '../manager/InventoryManager'
import ActorUtils from '../utils/ActorUtils'
import AudioPlayer from '../utils/AudioPlayer'
import IndexZ from '../utils/IndexZ'
import NodeKey from '../utils/NodeKey'
import Utils from '../utils/Utils'
import Controller from './Controller'
import Dungeon from './Dungeon'
import Logic from './Logic'
import Player from './Player'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//发射器
const { ccclass, property } = cc._decorator

@ccclass
export default class Shooter extends cc.Component {
    static DefAULT_SPEED = 300
    static readonly ARC_EX_NUM_8 = 80
    static readonly ARC_EX_NUM_16 = 99
    @property(cc.Prefab)
    bullet: cc.Prefab = null
    @property(cc.Prefab)
    laser: cc.Prefab = null
    @property
    isAI: boolean = false
    actor: Actor = null
    isFromPlayer = false
    dungeon: Dungeon = null
    //只有赋值才代表是玩家真正的shooter
    player: Player = null
    isEx = false //是否是额外shooter，额外shooter不耗子弹，伤害也按子弹来
    private graphics: cc.Graphics

    private bulletPool: cc.NodePool
    private laserPool: cc.NodePool
    isAutoAim = true
    bulletName: string = ''
    sprite: cc.Node
    data: EquipmentData = new EquipmentData()
    private hv: cc.Vec2 = cc.v2(1, 0)
    isAiming = false //是否在瞄准
    //玩家远程伤害
    remoteDamagePlayer = new DamageData()
    from: FromData = new FromData()
    isBuilding = false
    anim: cc.Animation
    private aoePools: { [key: string]: cc.NodePool } = {}
    private aimTargetMap = new Map<number, boolean>()
    private sensorTargetMap = new Map<number, boolean>()
    private ignoreMap = new Map<number, boolean>()
    public defaultPos = cc.v3(0, 0)
    ignoreEmptyWall = false
    shootBaseHeight = 0

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics)
        this.bulletPool = new cc.NodePool(Bullet)
        this.laserPool = new cc.NodePool(Laser)
        this.sprite = this.node.getChildByName('sprite')
        this.anim = this.getComponent(cc.Animation)
        let aimArr = [CCollider.TAG.BOSS, CCollider.TAG.BUILDING, CCollider.TAG.ENERGY_SHIELD, CCollider.TAG.WALL, CCollider.TAG.WALL_TOP]
        for (let key of aimArr) {
            this.aimTargetMap.set(key, true)
        }

        this.initIgnoreMap(this.getParentNode().getComponent(Actor))
    }
    public init() {}
    private initIgnoreMap(actor: Actor) {
        if (!actor) {
            return false
        }
        let arr = actor.node.getComponentsInChildren(CCollider)
        if (arr && arr.length > 0) {
            for (let c of arr) {
                this.ignoreMap.set(c.id, true)
            }
        }
        return true
    }
    playWalk(isPlay: boolean) {
        if (!this.anim) {
            return
        }
        if (isPlay) {
            this.anim.play('ShooterWalk')
        } else {
            this.anim.pause()
            this.sprite.y = 0
        }
    }
    changeRes(resName: string, subfix?: string) {
        if (!this.sprite) {
            this.sprite = this.node.getChildByName('sprite')
        }
        if (!this.sprite) {
            return
        }
        let spriteFrame = this.getSpriteFrameByName(resName, subfix)
        this.sprite.getComponent(cc.Sprite).spriteFrame = spriteFrame
        if (!this.isBuilding) {
            this.sprite.width = spriteFrame.getOriginalSize().width * 1.5
            this.sprite.height = spriteFrame.getOriginalSize().height * 1.5
            this.sprite.anchorX = 0.2
            if (this.data.far == 1) {
                this.sprite.width = this.sprite.width * 2
                this.sprite.height = this.sprite.height * 2
                this.sprite.anchorX = 0.5
            }
        }
    }
    changeResColor(color: cc.Color) {
        this.sprite.color = color
    }
    private getSpriteFrameByName(resName: string, subfix?: string): cc.SpriteFrame {
        let spriteFrame = Logic.spriteFrameRes(resName + subfix)
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName + 'anim0')
        }
        if (!spriteFrame) {
            spriteFrame = Logic.spriteFrameRes(resName)
        }
        return spriteFrame
    }
    get Hv() {
        return this.hv
    }
    setHv(hv: cc.Vec2) {
        if (!this.isAI && Controller.isMouseMode()) {
            return
        }
        this.hv = hv
        let pos = this.hasNearEnemy()
        if (!pos.equals(cc.Vec3.ZERO)) {
            this.hv = cc.v2(pos)
        }
        this.rotateCollider(cc.v2(this.hv.x, this.hv.y))
    }
    getAoeNode(prefab: cc.Prefab, usePool: boolean) {
        let temp: cc.Node = null
        if (!this.aoePools[prefab.name]) {
            this.aoePools[prefab.name] = new cc.NodePool(AreaOfEffect)
        }
        if (this.aoePools[prefab.name] && this.aoePools[prefab.name].size() > 0 && usePool) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            temp = this.aoePools[prefab.name].get()
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!temp || temp.active) {
            temp = cc.instantiate(prefab)
        }
        temp.opacity = 255
        temp.active = true
        return temp
    }

    destroyAoePrefab(nodeKey: NodeKey) {
        if (!nodeKey) {
            return
        }
        if (!this.aoePools[nodeKey.key]) {
            this.aoePools[nodeKey.key] = new cc.NodePool(AreaOfEffect)
        }
        nodeKey.node.active = false
        if (this.aoePools[nodeKey.key]) {
            this.aoePools[nodeKey.key].put(nodeKey.node)
        }
    }
    public fireAoe(prefab: cc.Prefab, aoeData: AreaOfEffectData, defaultPos?: cc.Vec3, angleOffset?: number, killCallBack?: Function, usePool?: boolean): AreaOfEffect {
        if (!this.dungeon) {
            return null
        }
        if (!angleOffset) {
            angleOffset = 0
        }
        let aoe = this.getAoeNode(prefab, usePool).getComponent(AreaOfEffect)
        if (aoe) {
            let pos = this.node.convertToWorldSpaceAR(defaultPos ? defaultPos : cc.v3(0, 0))
            pos = this.dungeon.node.convertToNodeSpaceAR(pos)
            aoe.show(this.dungeon.node, pos, this.hv, angleOffset, aoeData, killCallBack, usePool, (node: cc.Node) => {
                if (usePool) {
                    node.active = false
                    this.destroyAoePrefab(new NodeKey(prefab.name, node))
                }
            })
        }
        return aoe
    }
    /**
     * 更新通用aoe效果
     * @param aoe
     * @param spriteFrames
     * @param repeatForever
     * @param isFaceRight
     * @param scale
     * @param color
     * @param isFade
     * @returns
     */
    public updateCustomAoe(
        aoe: AreaOfEffect,
        spriteFrames: cc.SpriteFrame[],
        repeatForever: boolean,
        isFaceRight: boolean,
        scale: number,
        color?: cc.Color,
        opacity?: number,
        isFade?: boolean,
        isFilpY?: boolean
    ) {
        if (!aoe.node.getChildByName('sprite') || !aoe.node.getChildByName('sprite').getComponent(cc.Sprite)) {
            return
        }

        let sprite = aoe.node.getChildByName('sprite').getComponent(cc.Sprite)
        let collider = aoe.getComponent(CCollider)
        if (spriteFrames.length > 0) {
            let spriteframe = spriteFrames[0]
            sprite.node.width = spriteframe.getOriginalSize().width
            sprite.node.height = spriteframe.getOriginalSize().height
            sprite.node.opacity = opacity ?? 255
            sprite.node.stopAllActions()
            if (color) {
                sprite.node.color = color
            }
            sprite.node.scaleX = isFaceRight ? scale : -scale
            sprite.node.scaleY = isFilpY ? -scale : scale
            collider.w = sprite.node.width * scale * 0.75
            collider.h = sprite.node.height * scale * 0.75
        }
        let tween = cc.tween()
        for (let spriteFrame of spriteFrames) {
            tween.then(
                cc
                    .tween()
                    .call(() => {
                        sprite.spriteFrame = spriteFrame
                    })
                    .delay(0.2)
            )
        }
        if (repeatForever) {
            cc.tween(sprite.node).repeatForever(tween).start()
        } else {
            let fade = cc.tween().to(0.2, { opacity: isFade ? 0 : 255 })
            cc.tween(sprite.node)
                .then(tween)
                .then(fade)
                .call(() => {
                    sprite.spriteFrame = null
                })
                .start()
        }
    }

    /**
     * 发射子弹
     * @param angleOffset 偏转角度
     * @param defaultPos  发射点
     * @param bulletArcExNum 同时发射数目
     * @param bulletLineExNum 发射次数
     * @param prefab 子弹销毁附带aoe
     * @param aoeData aoe数据
     */
    public fireBullet(angleOffset?: number, defaultPos?: cc.Vec3, bulletArcExNum?: number, bulletLineExNum?: number, prefab?: cc.Prefab, aoeData?: AreaOfEffectData) {
        if (defaultPos) {
            this.defaultPos = defaultPos.clone()
        }

        if (this.data.isLineAim == 1 && this.graphics) {
            this.aimTargetLine(angleOffset, defaultPos, bulletArcExNum, bulletLineExNum, prefab, aoeData)
        } else {
            this.fireBulletDo(angleOffset, defaultPos, bulletArcExNum, bulletLineExNum, prefab, aoeData, '')
        }
    }
    /**
     * 分裂子弹，仅限子弹类调用
     * @param splitBulletType 分裂子弹类型
     * @param angleOffset 偏转角度
     * @param defaultPos 发射位置
     * @param bulletArcExNum 同时发射数目
     * @param bulletLineExNum 发射次数
     * @param prefab 子弹销毁附带aoe
     * @param aoeData aoe数据
     */
    public fireSplitBullet(
        splitBulletType: string,
        angleOffset: number,
        defaultPos: cc.Vec3,
        bulletArcExNum: number,
        bulletLineExNum: number,
        prefab?: cc.Prefab,
        aoeData?: AreaOfEffectData
    ) {
        this.fireBulletDo(angleOffset, defaultPos, bulletArcExNum, bulletLineExNum, prefab, aoeData, splitBulletType)
    }
    private fireBulletDo(
        angleOffset: number,
        defaultPos: cc.Vec3,
        bulletArcExNum: number,
        bulletLineExNum: number,
        prefab: cc.Prefab,
        aoeData: AreaOfEffectData,
        splitBulletType: string
    ) {
        if (this.sprite && splitBulletType.length < 1) {
            this.sprite.stopAllActions()
            this.sprite.position = cc.Vec3.ZERO
            cc.tween(this.sprite)
                .call(() => {
                    this.changeRes(this.data.img, 'anim1')
                })
                .by(0.1, { position: cc.v3(10, 0) })
                .call(() => {
                    this.changeRes(this.data.img, 'anim2')
                })
                .by(0.05, { position: cc.v3(-5, 0) })
                .by(0.05, { position: cc.v3(0, 0) })
                .call(() => {
                    this.changeRes(this.data.img, 'anim0')
                })
                .start()
        }

        if (!angleOffset) {
            angleOffset = 0
        }
        if (!this.dungeon) {
            return
        }
        if (splitBulletType.length < 1 && !this.isAI && !this.isEx && this.player.inventoryManager.equips[InventoryManager.REMOTE].equipmetType != InventoryManager.REMOTE) {
            return
        }
        if (splitBulletType.length < 1) {
            if (this.data.remoteAudio && this.data.remoteAudio.length > 0) {
                AudioPlayer.play(this.data.remoteAudio)
            } else {
                AudioPlayer.play(AudioPlayer.SHOOT)
            }
        }
        let isCircle = false
        let bulletType = splitBulletType.length > 0 ? splitBulletType : this.data.bulletType
        let finalBulletArcExNum = (bulletArcExNum ? bulletArcExNum : 0) + (splitBulletType.length > 0 ? 0 : this.data.bulletArcExNum)
        let angles = [
            10, -10, 20, -20, 30, -30, 40, -40, 50, -50, 60, -60, -70, -70, 80, -80, 90, -90, 100, -100, 110, -110, 120, -120, 130, -130, 140, -140, 150, -150, 160, -160, 170,
            -170, 180, -180
        ]
        if (finalBulletArcExNum > angles.length) {
            //大于默认度数数组为16方向
            angles = [0, 20, 45, 65, 90, 110, 135, 155, 180, 200, 225, 245, 270, 290, 315, 335]
            //为80的时候是个八方向
            if (finalBulletArcExNum == Shooter.ARC_EX_NUM_8) {
                angles = [0, 45, 90, 135, 180, 225, 270, 315, 335]
            }
            isCircle = true
        } else {
            this.fire(bulletType, angleOffset, this.hv.clone(), defaultPos, this.data.bulletArcOffsetX, prefab, aoeData)
        }
        this.fireArcBullet(bulletType, defaultPos, finalBulletArcExNum, prefab, aoeData, angles, this.data.bulletArcOffsetX)
        this.fireLineBullet(bulletType, angleOffset, defaultPos, finalBulletArcExNum, bulletLineExNum, prefab, aoeData, angles, isCircle, this.data.bulletArcOffsetX)
    }
    private fireArcBullet(
        bulletType: string,
        defaultPos: cc.Vec3,
        bulletArcExNum: number,
        prefab: cc.Prefab,
        aoeData: AreaOfEffectData,
        angles: number[],
        bulletArcOffsetX: number
    ): void {
        if (bulletArcExNum <= 0) {
            return
        }
        for (let i = 0; i < bulletArcExNum; i++) {
            if (i < angles.length) {
                this.fire(bulletType, angles[i], this.hv.clone(), defaultPos, bulletArcOffsetX, prefab, aoeData)
            }
        }
    }
    private fireLineBullet(
        bulletType: string,
        angleOffset: number,
        defaultPos: cc.Vec3,
        bulletArcExNum: number,
        bulletLineExNum: number,
        prefab: cc.Prefab,
        aoeData: AreaOfEffectData,
        angles: number[],
        isCircle: boolean,
        bulletArcOffsetX: number
    ): void {
        let exNum = bulletLineExNum ? this.data.bulletLineExNum + bulletLineExNum : this.data.bulletLineExNum
        if (exNum == 0) {
            return
        }
        this.schedule(
            () => {
                if (!isCircle) {
                    this.fire(bulletType, angleOffset, this.hv.clone(), defaultPos, bulletArcOffsetX, prefab, aoeData)
                }
                this.fireArcBullet(bulletType, defaultPos, bulletArcExNum, prefab, aoeData, angles, bulletArcOffsetX)
            },
            this.data.bulletLineInterval > 0 ? this.data.bulletLineInterval : 0.2,
            exNum,
            0
        )
    }

    /**
     * 发射子弹
     * @param prefab 预制
     * @param pool 线程池
     * @param angleOffset 角度
     * @param hv 方向向量
     * @param defaultPos 初始位置默认cc.v3(0, 0)
     */
    private fire(bulletType: string, angleOffset: number, hv: cc.Vec2, defaultPos: cc.Vec3, bulletArcOffsetX: number, aoePrefab: cc.Prefab, aoeData: AreaOfEffectData) {
        let bulletData = Logic.bullets[bulletType]
        let prefab = this.bullet
        let pool = this.bulletPool
        let isLaser = bulletData.isLaser > 0
        if (isLaser) {
            prefab = this.laser
            pool = this.laserPool
        }
        let bulletPrefab: cc.Node = null
        if (pool.size() > 0) {
            // 通过 size 接口判断对象池中是否有空闲的对象
            bulletPrefab = pool.get()
        }
        // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
        if (!bulletPrefab || bulletPrefab.active) {
            bulletPrefab = cc.instantiate(prefab)
        }

        let pos = this.getFireBasePos(defaultPos, bulletArcOffsetX, angleOffset, this.shootBaseHeight)
        bulletPrefab.parent = this.dungeon.node
        bulletPrefab.scaleX = 1
        bulletPrefab.scaleY = 1
        bulletPrefab.active = true
        if (isLaser) {
            bulletPrefab.position = cc.v3(pos.x, pos.y + this.shootBaseHeight)
            this.showLaser(angleOffset, hv, bulletPrefab, bulletData, cc.v3(pos.x, pos.y + this.shootBaseHeight), pos.z + this.shootBaseHeight)
        } else {
            bulletPrefab.position = cc.v3(pos.x, pos.y + this.shootBaseHeight)
            this.showBullet(angleOffset, hv, bulletPrefab, bulletData, cc.v3(pos.x, pos.y + this.shootBaseHeight), pos.z + this.shootBaseHeight, aoePrefab, aoeData)
        }
    }
    getFireBasePos(defaultPos?: cc.Vec3, bulletArcOffsetX?: number, angleOffset?: number, shootBaseHeight?: number) {
        let p = cc.v3(0, 0)
        if (defaultPos) {
            p = defaultPos.clone()
            if (bulletArcOffsetX && bulletArcOffsetX != 0) {
                p.addSelf(cc.v3(cc.v2(bulletArcOffsetX, 0).rotateSelf((angleOffset ?? 0 * Math.PI) / 180)))
            }
        }
        let pos = this.node.convertToWorldSpaceAR(p)
        let z = this.getParentNode().convertToNodeSpaceAR(pos).y
        if (z < 0) {
            z = 0
        }
        pos = this.dungeon.node.convertToNodeSpaceAR(pos)
        if (shootBaseHeight && shootBaseHeight < z) {
            z = shootBaseHeight
            pos.y -= z
        } else {
            pos.y = this.getParentNode().y
        }
        pos.z = z
        return pos
    }

    private showBullet(
        angleOffset: number,
        hv: cc.Vec2,
        bulletPrefab: cc.Node,
        data: BulletData,
        startPos: cc.Vec3,
        zHeight: number,
        aoePrefab: cc.Prefab,
        aoeData: AreaOfEffectData
    ) {
        let bullet = bulletPrefab.getComponent(Bullet)
        bullet.entity.Transform.position = startPos
        bullet.shooter = this
        bullet.node.scaleY = this.node.scaleX > 0 ? 1 : -1
        bullet.node.zIndex = IndexZ.OVERHEAD
        bullet.isFromPlayer = !this.isAI || this.isFromPlayer
        bullet.dungeon = this.dungeon
        bullet.ignoreEmptyWall = this.ignoreEmptyWall
        let bd = new BulletData()
        bd.valueCopy(data)
        if (bullet.isFromPlayer && this.player && !this.isEx) {
            bd.damage.physicalDamage = this.remoteDamagePlayer.physicalDamage
            bd.damage.isCriticalStrike = this.remoteDamagePlayer.isCriticalStrike
        }
        bd.size += this.data.bulletSize
        bd.speed += this.data.bulletExSpeed
        if (bd.speed + this.data.bulletExSpeed > 0.5) {
            bd.speed += this.data.bulletExSpeed
        }
        bd.from.valueCopy(this.from)
        bullet.changeBullet(bd, zHeight)
        this.bulletName = bullet.name + bd.resName
        bullet.enabled = true
        bullet.aoeData.valueCopy(aoeData)
        bullet.aoePrefab = aoePrefab
        bullet.showBullet(cc.v2(cc.v2(hv).rotateSelf((angleOffset * Math.PI) / 180)).normalize())
    }
    private showLaser(angleOffset: number, hv: cc.Vec2, bulletPrefab: cc.Node, data: BulletData, startPos: cc.Vec3, zHeight: number) {
        let laser = bulletPrefab.getComponent(Laser)
        laser.entity.Transform.position = startPos
        laser.shooter = this
        laser.node.scaleY = this.node.scaleX > 0 ? 1 : -1
        laser.node.zIndex = IndexZ.OVERHEAD
        laser.isFromPlayer = !this.isAI || this.isFromPlayer
        laser.dungeon = this.dungeon
        let bd = new BulletData()
        bd.valueCopy(data)
        if (laser.isFromPlayer && this.player && !this.isEx) {
            bd.damage.physicalDamage = this.remoteDamagePlayer.physicalDamage
            bd.damage.isCriticalStrike = this.remoteDamagePlayer.isCriticalStrike
        }
        bd.size += this.data.bulletSize
        bd.speed += this.data.bulletExSpeed
        if (bd.speed + this.data.bulletExSpeed > 0.5) {
            bd.speed += this.data.bulletExSpeed
        }
        bd.from.valueCopy(this.from)
        laser.changeBullet(bd, zHeight)
        this.bulletName = laser.name + bd.resName
        laser.enabled = true
        laser.fire(cc.v2(hv).rotateSelf((angleOffset * Math.PI) / 180), angleOffset)
    }
    public addDestroyBullet(bulletNode: cc.Node, isLaser?: boolean) {
        bulletNode.active = false
        this.destroyBullet(bulletNode, isLaser)
    }
    private destroyBullet(bulletNode: cc.Node, isLaser?: boolean) {
        if (isLaser) {
            if (this.laserPool && bulletNode) {
                this.laserPool.put(bulletNode)
            }
        } else {
            if (this.bulletPool && bulletNode) {
                this.bulletPool.put(bulletNode)
            }
        }
    }

    start() {}
    private drawLine(color: cc.Color, range: number, width: number) {
        if (!this.graphics) {
            return
        }
        this.graphics.clear()
        this.graphics.fillColor = color
        this.graphics.circle(0, 0, width / 2 + 1)
        this.graphics.circle(range, 0, width / 2 + 1)
        this.graphics.rect(0, -width / 2, range, width)
        this.graphics.fill()
    }
    private getRayCastPoint(range?: number, startPos?: cc.Vec3): cc.Vec3 {
        let s = startPos ? startPos : cc.v3(0, 0)
        let r = range ? range : 3000
        let p = cc.v3(r, 0)
        let p1 = this.node.convertToWorldSpaceAR(s)
        let p2 = this.node.convertToWorldSpaceAR(p)
        if (this.isFromPlayer && this.sensorTargetMap.has(CCollider.TAG.ENERGY_SHIELD)) {
            this.sensorTargetMap.delete(CCollider.TAG.ENERGY_SHIELD)
        } else {
            this.sensorTargetMap.set(CCollider.TAG.ENERGY_SHIELD, true)
        }
        let result = GameWorldSystem.colliderSystem.nearestRayCast(cc.v2(p1), cc.v2(p2), this.actor.entity.Transform.z, 32, this.aimTargetMap, this.sensorTargetMap, this.ignoreMap)
        if (result) {
            p = this.node.convertToNodeSpaceAR(cc.v3(result.point))
        }
        return p
    }

    //线性瞄准
    private aimTargetLine(angleOffset: number, defaultPos: cc.Vec3, bulletArcExNum: number, bulletLineExNum: number, prefab: cc.Prefab, aoeData: AreaOfEffectData) {
        if (this.isAiming) {
            return
        }
        this.isAiming = true
        if (!this.graphics) {
            return
        }
        let width = 0
        let p = this.getRayCastPoint(3000, defaultPos)
        let isOver = false
        let fun = () => {
            if (width < 1 && isOver) {
                this.fireBulletDo(angleOffset, defaultPos, bulletArcExNum, bulletLineExNum, prefab, aoeData, '')
                this.unschedule(fun)
                this.graphics.clear()
                this.isAiming = false
            } else {
                this.drawLine(cc.color(255, 0, 0, 200), p.x, width)
            }
            if (width > 10 && !isOver) {
                isOver = true
            } else if (isOver) {
                width -= 1
            } else {
                width += 1
            }
        }
        this.schedule(fun, 0.02, 30)
    }
    private drawArc(angle: number) {
        if (!this.graphics) {
            return
        }
        this.graphics.clear()
        if (angle < 0) {
            return
        }
        let r = 1000
        let startAngle = (-angle * 2 * Math.PI) / 360
        let endAngle = (angle * 2 * Math.PI) / 360
        let startPos = cc.v3(r * Math.cos(startAngle), r * Math.sin(startAngle))
        let endPos = cc.v3(r * Math.cos(endAngle), r * Math.sin(endAngle))
        this.graphics.arc(0, 0, r, 2 * Math.PI - startAngle, 2 * Math.PI - endAngle)
        this.graphics.fill()
        this.graphics.moveTo(0, 0)
        this.graphics.lineTo(startPos.x, startPos.y)
        this.graphics.lineTo(endPos.x, endPos.y)
        this.graphics.close()
        this.graphics.fill()
    }

    updateLogic(dt: number) {
        if (!this.isAI && Controller.isMouseMode() && Controller.mousePos && this.dungeon) {
            let p = cc.v2(this.dungeon.node.convertToWorldSpaceAR(this.player.node.position))
            let pos = Controller.mousePos.add(cc.v2(this.dungeon.mainCamera.node.position)).sub(p).normalize()
            if (!pos.equals(cc.Vec2.ZERO)) {
                this.hv = pos
                this.rotateCollider(cc.v2(this.hv.x, this.hv.y))
            }
        }
    }
    public getParentNode(): cc.Node {
        if (this.actor) {
            return this.actor.node
        } else {
            return this.node.parent
        }
    }
    private hasNearEnemy() {
        if (!this.isAutoAim) {
            return cc.Vec3.ZERO
        }
        //ai手动寻找目标不检测转向，这里只针对玩家
        if (!this.isAI && this.dungeon) {
            return ActorUtils.getDirectionFromNearestEnemy(this.player.node.position, this.isAI, this.dungeon, false, 600)
        }
        return cc.Vec3.ZERO
    }
    private rotateCollider(direction: cc.Vec2) {
        if (direction.equals(cc.Vec2.ZERO)) {
            return
        }
        //设置缩放方向
        let sx = Math.abs(this.node.scaleX)
        this.node.scaleX = this.getParentNode().scaleX > 0 ? sx : -sx
        let sy = Math.abs(this.node.scaleY)
        this.node.scaleY = this.node.scaleX < 0 ? -sy : sy
        //设置旋转角度
        this.node.angle = Utils.getRotateAngle(direction, this.node.scaleX < 0)
    }
}
