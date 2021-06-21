import Actor from "../Base/Actor";
import DamageData from "../Data/DamageData";
import { EventHelper } from "../EventHelper";
import Talent from "./Talent";

/**
 * 组织技能管理器
 * 通用技能点：cd减短 范围变大 持续时间增加 伤害增加 数量变多
 * 
 * 幽光守护：幽光屏障
 * 生成一个魔法能量罩阻挡远程伤害
 * 翠金科技：狂化试剂
 * 注射翠金提炼的试剂变狂化，短时间提高速度攻击防御血量但是只能空手近战，时间结束会进入短暂虚弱状态
 * 宝藏猎人：
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class OrganizationTalent extends Talent {
    

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    hv: cc.Vec3;
    onLoad() {
    }

    changePerformance(): void {
    }
    protected doSkill() {
        switch (this.activeTalentData.resName) {
            case Talent.TALENT_000:break;
        }
    }

    takeDamage(damageData: DamageData, actor?: Actor) {

    }
    
    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 10) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }
  
}