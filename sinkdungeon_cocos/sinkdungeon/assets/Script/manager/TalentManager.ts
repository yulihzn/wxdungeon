/**
 * 技能管理器
 *
 * 技能分类
 * 组织技能 四大流派提供的技能，完成派系任务获得，只能有一个主动
 * 职业技能 偏向于符合职业特点的技能，只能有一个主动
 * 装备和物品技能，可以有多个，但是只能有一个主动
 * 翠金技能 每次升级能够学习的技能，偏向于超能力，类似大招
 */
const { ccclass, property } = cc._decorator
@ccclass
export default class TalentManager extends cc.Component {}
