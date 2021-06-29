import Actor from "../Base/Actor";
import EnergyShield from "../Building/EnergyShield";
import AvatarData from "../Data/AvatarData";
import DamageData from "../Data/DamageData";
import TalentData from "../Data/TalentData";
import { EventHelper } from "../EventHelper";
import Logic from "../Logic";
import CoolDownView from "../UI/CoolDownView";
import Talent from "./Talent";

/**
 * 组织技能管理器
 * 组织技能cd很长，但是效果很明显
 * 通用技能点：cd减短 范围变大 持续时间增加 伤害增加 数量变多
 * 
 * 幽光守护：幽光屏障cd 120s
 * 原地生成一个魔法能量罩阻挡远程伤害，初始能量为50，范围200玩家在光罩里被攻击伤害由光罩承受，外部远程伤害也会计算在光罩的能量里
 * 当玩家在多个光罩叠加里，会选择其中一个来扣除，当能量不足以承受当前的伤害光罩会破碎
 * 在光罩里释放职业技能会有对应的效果
 * perk点：
 * 阔大光罩的范围 400 600 800
 * 增加光罩的能量  200 500 1000
 * 增加可以释放的光罩数量 冷却会读多个 1 2 3
 * 进入光罩附加debuff每5s会被冰冻减速、诅咒 、中毒、燃烧、短暂眩晕中选一个
 * 
 * 能量罩是永久的，但是承受一定攻击会被打破
 * 翠金科技：狂化试剂 cd 120s
 * 注射翠金提炼的试剂变狂化，15s提高移动速度100攻击速度100，防御血量攻击为当前的1.5倍但是只能空手近战，
 * 时间结束会进入一个同等时间的虚弱状态移动速度攻击速度下降100且被诅咒
 * 狂化的时候释放职业技能会有对应的效果
 * perk点：
 * 延长狂化时间 30  60 90 
 * 延长狂化强度 200% 250% 300%
 * 攻击附带debuff冰冻减速、诅咒 、中毒、燃烧、短暂眩晕中选一个
 * 宝藏猎人：
 * 弥世逐流: 召唤宠物，如果宠物存在会激活对应宠物的技能
 *  弥世逐流在选择角色的时候会多一个选择宠物的选项，
 * 考虑有橘猫，柯基，金刚鹦鹉，橘子鱼，黄金蟒，天竺鼠，巴西龟，变色龙，刺猬，火玫瑰蜘蛛，安哥拉兔，科尔鸭，巴马香猪
 * 在现实里，宠物都是在睡觉的
 * 对应家具，猫舍，狗屋，鸟笼，浴缸，宠物笼，可以投食，对应宠物会发叫声和对应动画
 * 宠物属性随玩家等级增强，拥有一个主动技能和一个被动技能
 * 
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class OrganizationTalent extends Talent {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    hv: cc.Vec3;
    energyShieldList: EnergyShield[] = [];

    onLoad() {
    }

    changePerformance(): void {
    }
    init(data: TalentData) {
        super.init(data);
        this.coolDownId = CoolDownView.ORGANIZATION;
        let storePointMax = 1;
        if (this.player.data.AvatarData.organizationIndex == AvatarData.GURAD) {
            storePointMax = 1 + Math.floor(Logic.playerData.OilGoldData.level / 5);
        }
        this.initCoolDown(data,storePointMax);
    }
    protected doSkill() {
        if (this.player.data.AvatarData.organizationIndex == AvatarData.GURAD) {
            if (this.energyShieldList.length > this.talentSkill.StorePointMax) {
                let s = this.energyShieldList.pop();
                s.isShow = false;
                if (s && s.isValid) {
                    s.destroy();
                }
            }
            let shield = this.player.dungeon.buildingManager.addEnergyShield(this.player);
            if (shield) {
                this.energyShieldList.push(shield);
                this.scheduleOnce(()=>{
                    this.talentSkill.IsExcuting = false;
                },1)
            }
        }
    }

    takeDamage(damageData: DamageData, actor?: Actor) {
        let success = this.energyShieldBlock(damageData);
        return success;
    }

    energyShieldBlock(damageData: DamageData) {
        for (let i = this.energyShieldList.length - 1; i >= 0; i--) {
            let shield = this.energyShieldList[i];
            if (shield.node && shield.node.isValid) {
                return shield.isShow && shield.checkTargetIn(this.player.node) && shield.takeDamage(damageData);
            } else {
                this.energyShieldList.splice(i, 1);
            }
        }
        return false;
    }

    checkTimeDelay = 0;
    isCheckTimeDelay(dt: number): boolean {
        this.checkTimeDelay += dt;
        if (this.checkTimeDelay > 1) {
            this.checkTimeDelay = 0;
            return true;
        }
        return false;
    }

}