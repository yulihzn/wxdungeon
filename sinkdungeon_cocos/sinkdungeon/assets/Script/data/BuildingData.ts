import DataUtils from '../utils/DataUtils'
import CommonData from './CommonData'
import EquipmentData from './EquipmentData'
import ItemData from './ItemData'

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class BuildingData {
    defaultPos: cc.Vec3 //默认下标
    position: cc.Vec3 //当前位置
    isOpen = false //宝箱是否打开或者建筑物是否触发或者家具已经打开
    quality = 1 //宝箱品质
    equipdata: EquipmentData //携带装备数据
    itemdata: ItemData //携带物品数据
    price = 60 //商品价格
    shopType = 0 //0:装备 1:物品
    isSaled = false //是否卖出
    maxHealth = 1 //最大生命,默认1
    currentHealth = 1 //当前生命,默认1
    generatorList: string[] = []
    generatorCount = 0
    generatorInterval = 0
    breakEquipItems: string = '' //被破坏掉落 weapon001,0.5#item002,1 名称，概率，#号隔开
    interact = 0 //是否可以互动拾取
    rollover = 0 //是否翻倒
    nameCn: string = ''
    nameEn: string = ''
    id = '' //id
    resName: string = '' //资源名
    scale = 1 //贴图缩放
    collider = '' //碰撞 x,y,w,h,z
    spritePos = '' //贴图位置 x,y
    z = 0 //浮空高度
    breakZ = 0 //破损后的z
    stairsX = 0 //高度纵向分割
    stairsY = 0 //高度横向分割
    stairsZ = 0 //分割高度
    custom = false //自定义,为true不读取预设参数
    info = ''
    desc = ''
    valueCopy(data: BuildingData) {
        if (!data) {
            return
        }
        DataUtils.baseCopy(this, data, true)
        this.defaultPos = data.defaultPos ? cc.v3(data.defaultPos.x, data.defaultPos.y) : cc.v3(0, 0)
        this.position = data.position ? cc.v3(data.position.x, data.position.y) : cc.v3(0, 0)
        if (data.equipdata) {
            this.equipdata = new EquipmentData()
            this.equipdata.valueCopy(data.equipdata)
        }
        if (data.itemdata) {
            this.itemdata = new ItemData()
            this.itemdata.valueCopy(data.itemdata)
        }
        this.quality = data.quality ? data.quality : 1
        this.generatorList = []
        if (data.generatorList) {
            this.generatorList = data.generatorList
        }
    }
    clone(): BuildingData {
        let data = new BuildingData()
        data.valueCopy(this)
        // data.defaultPos=this.defaultPos;
        // data.position=this.position;
        // data.isOpen=this.isOpen;
        // data.quality=this.quality;
        // if(this.equipdata){
        //     data.equipdata = new EquipmentData();
        //     data.equipdata.valueCopy(this.equipdata);
        // }
        // if(this.itemdata){
        //     data.itemdata = new ItemData();
        //     data.itemdata.valueCopy(this.itemdata);
        // }
        // data.price = this.price;
        // data.shopType = this.shopType;
        // data.isSaled = this.isSaled;
        // data.maxHealth = this.maxHealth;
        // data.currentHealth = this.currentHealth;
        // data.generatorInterval = this.generatorInterval;
        // data.generatorCount = this.generatorCount;
        // data.generatorList = this.generatorList;
        // data.interact = this.interact;
        // data.rollover = this.rollover;
        return data
    }
}
