/**
 * 碰撞tag,该枚举只能新增不能更改
 */
export enum ColliderTag{
    DEFAULT=0,//默认
    WALL=1,//墙
    GOODNONPLAYER=2,//好的npc
    PLAYER=3,//玩家（唯一）
    NONPLAYER=4,//敌人或者坏的npc
    BOSS_ATTACK=5,//boss攻击部分
    BOSS=6,//头目
    BULLET=7,//子弹
    BUILDING=8,//建筑
    AOE=9,//范围效果
    ITEM=10,//物品
    EQUIPMENT=11,//装备
    COIN=12,//金币
    TIPS=13,//提示
    MELEE=14//近战武器
}