/**任务系统 
 * 触发条件：翻开，点击，对话，使用道具，战斗，进入下一关
 * 完成条件：击杀怪物，进入某层，拾取物品，对话
 * 完成奖励：金币，道具，回复
 * 难度：击杀的数量，物品的数量
*/
var QuestManager = function(){
  var that = this;
  that.questList = [];
  that.addQuest = function (quest){
    
  }
  that.removeQuest = function (id){
  }
  that.update = function(){
    
  }
  
  return that;
}

function createQuest(id, title, content, nextId, targetCount, begin,finish) {
  var quest = new Object();
  quest.id = id;
  quest.title = title;
  quest.content = content;
  return quest;
}
module.exports = {
  QuestManager: QuestManager,
}