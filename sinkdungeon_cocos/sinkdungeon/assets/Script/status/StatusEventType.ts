export enum StatusEventType {
    INIT,//初始化
    DIED,//濒死
    ITEM_ADD,//物品
    ITEM_REMOVE,//物品
    ITEM_TICK,//物品
    ITEM_USE,//物品
    MELEE_ATTACK,//近战
    MELEE_COMBO,//近战
    MELEE_KILL,//近战
    REMOTE_ATTACK,//远程
    REMOTE_HIT,//远程
    REMOTE_KILL,//远程
    REMOTE_COMBO,//远程
    SKILL_START,//技能
    SKILL_END,//技能
    SKILL_TICK,//技能
    TAKE_DAMAGE,//受伤
    DODGE,//闪避
    BLOCK,//格挡
    PRARRY,//弹反
    AOE_HIT,//aoe命中
    AOE_ADD,//aoe
    AOE_REMOVE,//aoe
    AOE_TICK,//aoe
    AOE_KILL,//aoe
    STATUS_KILL,//状态
    STANDSTILL,//静止
    MOVE,//移动
    DREAM_OUT,//梦境值耗尽
    DREAM_FULL,//梦境值
    HEALTH_OUT,//生命值
    HEALTH_FULL,//生命值
    HEALTH_HALF,//生命值
    DISPEL,//驱散


}