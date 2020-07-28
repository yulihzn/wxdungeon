import Dungeon from "../Dungeon";
import Logic from "../Logic";
import Random from "../Utils/Random";
import FootBoard from "../Building/FootBoard";
import IndexZ from "../Utils/IndexZ";
import Saw from "../Building/Saw";
import Emplacement from "../Building/Emplacement";
import DecorationFloor from "../Building/DecorationFloor";
import Chest from "../Building/Chest";
import Box from "../Building/Box";
import Decorate from "../Building/Decorate";
import ShopTable from "../Building/ShopTable";
import FallStone from "../Building/FallStone";
import MagicLightening from "../Building/MagicLightening";
import HitBuilding from "../Building/HitBuilding";


// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildingManager extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // update (dt) {}

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    wall: cc.Prefab = null;
    @property(cc.Prefab)
    trap: cc.Prefab = null;
    @property(cc.Prefab)
    fallStone: cc.Prefab = null;
    @property(cc.Prefab)
    lighteningFall: cc.Prefab = null;
    @property(cc.Prefab)
    emplacement: cc.Prefab = null;
    @property(cc.Prefab)
    footboard: cc.Prefab = null;
    @property(cc.Prefab)
    chest: cc.Prefab = null;
    @property(cc.Prefab)
    box: cc.Prefab = null;
    @property(cc.Prefab)
    decorate: cc.Prefab = null;
    @property(cc.Prefab)
    shop: cc.Prefab = null;
    @property(cc.Prefab)
    shoptable: cc.Prefab = null;
    @property(cc.Prefab)
    portal: cc.Prefab = null;
    @property(cc.Prefab)
    hitBuilding: cc.Prefab = null;
    @property(cc.Prefab)
    bed: cc.Prefab = null;
    @property(cc.Prefab)
    campFire: cc.Prefab = null;
    @property(cc.Prefab)
    tarotTable: cc.Prefab = null;
    @property(cc.Prefab)
    saw: cc.Prefab = null;
    @property(cc.Prefab)
    floorDecoration: cc.Prefab = null;
    footboards: FootBoard[] = new Array();//踏板列表

    private isThe(mapStr: string, typeStr: string): boolean {
        let isequal = mapStr.indexOf(typeStr) != -1;
        return isequal;
    }
    private addBuilding(prefab: cc.Prefab, indexPos: cc.Vec3): cc.Node {
        let building = cc.instantiate(prefab);
        building.parent = this.node;
        building.position = Dungeon.getPosInMap(indexPos);
        building.zIndex = IndexZ.getActorZIndex(building.position);
        return building;
    }
    public addBuildingsFromMap(dungeon: Dungeon, mapDataStr: string, indexPos: cc.Vec3) {
        if (this.isThe(mapDataStr, '#')) {
            //生成墙
            this.addBuilding(this.wall, indexPos).opacity = 255;
        } else if (mapDataStr == 'T0') {
            //生成陷阱
            this.addBuilding(this.trap, indexPos);
        } else if (mapDataStr == 'X0') {
            //生成电锯,占据5个格子
            let saw = this.addBuilding(this.saw, indexPos);
            saw.getComponent(Saw).setPos(indexPos);
        } else if (this.isThe(mapDataStr, 'E')) {
            //生成炮台
            let em = this.addBuilding(this.emplacement, indexPos).getComponent(Emplacement);
            em.setDirType(mapDataStr);
            em.dungeon = dungeon;
        } else if (mapDataStr == 'F0') {
            //生成落石
            this.addFallStone(Dungeon.getPosInMap(indexPos), false);
        } else if (mapDataStr == 'F1') {
            //生成落雷
            this.addLighteningFall(Dungeon.getPosInMap(indexPos), true, true, true);
        } else if (this.isThe(mapDataStr, '+')) {
            //生成装饰
            if (this.isThe(mapDataStr, '+0')) {
                //生成营火
                let camp = this.addBuilding(this.campFire, indexPos);
                camp.parent = this.node;
                let shadow = camp.getChildByName('sprite').getChildByName('shadow');
                shadow.position = Dungeon.getPosInMap(indexPos);
                shadow.position = cc.v3(shadow.position.x, shadow.position.y + 40);
                shadow.parent = this.node;
                shadow.zIndex = IndexZ.FLOOR;
                let fallentree = camp.getChildByName('sprite').getChildByName('fallentree');
                fallentree.position = Dungeon.getPosInMap(indexPos);
                fallentree.position = cc.v3(shadow.position.x, shadow.position.y + 40);
                fallentree.parent = this.node;
                fallentree.zIndex = IndexZ.getActorZIndex(fallentree.position);
                fallentree.setScale(6, 4);
            } else if (this.isThe(mapDataStr, '+1')) {
                if (Logic.level == 0) {
                    let bed = this.addBuilding(this.bed, indexPos);
                    bed.scale = 6;
                    bed.zIndex = IndexZ.OVERHEAD;
                }
            } else if (this.isThe(mapDataStr, '+2')) {
                if (Logic.level == 0) {
                    let arrow = this.addBuilding(this.floorDecoration, indexPos);
                    arrow.zIndex = IndexZ.FLOOR;
                    arrow.getComponent(DecorationFloor).changeRes('exitarrow');
                }
            } else {
                let fd = this.addBuilding(this.floorDecoration, indexPos);
                fd.zIndex = IndexZ.FLOOR;
                let df = fd.getComponent(DecorationFloor);
                if (this.isThe(mapDataStr, '++')) {
                    df.changeRes('exitarrow');
                } else {
                    df.changeRes('dev');
                }
            }
        } else if (mapDataStr == '@@') {
            //生成踏板
            let foot = this.addBuilding(this.footboard, indexPos);
            foot.zIndex = IndexZ.FLOOR;
            this.footboards.push(foot.getComponent(FootBoard));
        } else if (mapDataStr == 'Q0') {
            //生成塔罗
            this.addBuilding(this.tarotTable, indexPos);
        } else if (mapDataStr == 'C0') {
            //生成宝箱 房间清理的情况下箱子是打开的
            let chest = this.addBuilding(this.chest, indexPos);
            let c = chest.getComponent(Chest)
            c.seDefaultPos(indexPos);
            let rand = Random.rand();
            let quality = 1;
            if (rand > 0.5 && rand < 0.7) {
                quality = 2;
            } else if (rand > 0.7 && rand < 0.8) {
                quality = 3;
            } else if (rand > 0.8 && rand < 0.85) {
                quality = 4;
            }
            c.setQuality(quality, false);
            let saveChest = Logic.mapManager.getCurrentMapBuilding(c.data.defaultPos);
            if (saveChest) {
                c.setQuality(saveChest.quality, saveChest.isOpen);
            } else {
                Logic.mapManager.setCurrentBuildingData(c.data);
            }
        } else if (this.isThe(mapDataStr, 'B')) {
            //生成木盒子 并且根据之前记录的位置放置
            let box = this.addBuilding(this.box, indexPos);
            let b = box.getComponent(Box)
            b.setDefaultPos(indexPos);
            //生成植物
            if (this.isThe(mapDataStr, 'B1')) {
                b.boxType = Box.PLANT;
            }
            //设置对应存档盒子的位置
            let saveBox = Logic.mapManager.getCurrentMapBuilding(b.data.defaultPos);
            if (saveBox) {
                b.node.position = saveBox.position.clone();
            } else {
                Logic.mapManager.setCurrentBuildingData(b.data);
            }
        } else if (this.isThe(mapDataStr, 'D')) {
            //生成可破坏装饰 并且根据之前记录的位置放置
            let decorate = this.addBuilding(this.decorate, indexPos);
            let d = decorate.getComponent(Decorate);
            d.setDefaultPos(indexPos);
            d.decorateType = parseInt(mapDataStr[1]);
            //设置对应存档盒子的位置
            let saveBox = Logic.mapManager.getCurrentMapBuilding(d.data.defaultPos);
            if (saveBox) {
                d.node.position = saveBox.position.clone();
                if (saveBox.currentHealth < 1) {
                    d.reset();
                }
            } else {
                Logic.mapManager.setCurrentBuildingData(d.data);
            }
        } else if (this.isThe(mapDataStr, 'H')) {
            //生成可打击建筑
            let hitBuilding = this.addBuilding(this.hitBuilding, indexPos);
            let h = hitBuilding.getComponent(HitBuilding);
            h.setDefaultPos(indexPos);
            h.init(dungeon, 'car', '', 'shield003', 5, 5);
            let saveHit = Logic.mapManager.getCurrentMapBuilding(h.data.defaultPos);
            if (saveHit) {
                h.init(dungeon, 'car', '', 'shield001', 5, saveHit.currentHealth);
            } else {
                Logic.mapManager.setCurrentBuildingData(h.data);
            }
        } else if (mapDataStr == 'S0') {
            //生成商店
            let table = this.addBuilding(this.shoptable, indexPos);
            let ta = table.getComponent(ShopTable);
            ta.setDefaultPos(indexPos);
            ta.data.shopType = Random.rand() > 0.1 ? ShopTable.EQUIPMENT : ShopTable.ITEM;
            let saveTable = Logic.mapManager.getCurrentMapBuilding(ta.data.defaultPos);
            if (saveTable) {
                if (saveTable.equipdata) {
                    ta.data.equipdata = saveTable.equipdata.clone();
                }
                if (saveTable.itemdata) {
                    ta.data.itemdata = saveTable.itemdata.clone();
                }
                ta.data.isSaled = saveTable.isSaled;
                ta.data.shopType = saveTable.shopType;
                ta.data.price = saveTable.price;
                ta.showItem();
            } else {
                ta.showItem();
                Logic.mapManager.setCurrentBuildingData(ta.data);
            }
        } else if (mapDataStr == 'S1') {
            //生成店主
            this.addBuilding(this.shop, indexPos);
        }
    }
    /**掉落石头 */
    addFallStone(pos: cc.Vec3, isAuto: boolean, withFire?: boolean) {
        if (!this.fallStone) {
            return;
        }
        let stone = cc.instantiate(this.fallStone);
        let stoneScript = stone.getComponent(FallStone);
        stoneScript.isAuto = isAuto;
        stone.parent = this.node;
        stone.position = pos;
        stone.zIndex = IndexZ.FLOOR;
        if (stoneScript.isAuto) {
            stoneScript.fall(withFire);
        }

    }
    /**落雷 */
    addLighteningFall(pos: cc.Vec3, isTrigger: boolean, needPrepare: boolean, showArea: boolean, damagePoint?: number) {
        if (!this.lighteningFall) {
            return;
        }
        let fall = cc.instantiate(this.lighteningFall);
        let fallScript = fall.getComponent(MagicLightening);
        fall.parent = this.node;
        fall.position = pos;
        fall.zIndex = IndexZ.FLOOR;
        fallScript.isTrigger = isTrigger;
        if (!fallScript.isTrigger) {
            fallScript.fall(needPrepare, showArea, damagePoint);
        }
    }

}
