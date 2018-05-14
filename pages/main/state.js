var Global = require("../../global.js")
/**状态
 */
var StateType = {
  BLEED: 0,
  POISON: 1,
  FIRE:2,
  ICE:3,
  DIZZ:4,
  CURSE:5,
}
function getState(id){
  switch(id){
    case StateType.BLEED: return createState(id, "流血", "每回合-1生命值", "bleed.png",3,
    function (logic) { logic.updateLife(-1) },);
    case StateType.POISON: return createState(id, "中毒", "每回合-1生命值", "poison.png", 3,
      function (logic) { logic.updateLife(-1) }, );
    case StateType.FIRE: return createState(id, "燃烧", "每回合-1生命值", "fire.png", 3,
      function (logic) { logic.updateLife(-1)}, );
    case StateType.ICE: return createState(id, "冰冻", "每回合-1生命值", "ice.png", 3,
      function (logic) { logic.updateLife(-1)}, );
    case StateType.DIZZ: return createState(id, "眩晕", "无法闪避", "dizz.png", 3,
      function (logic) { }, );
    case StateType.CURSE: return createState(id, "诅咒", "基础攻击力减5", "curse.png", 3,
      function (logic) {  }, function (logic) { logic.addExtraAttack(-5); },function (logic) { logic.addExtraAttack(5); });
  }
  return null;
}
function loadState(oldstate){
  var state = getState(oldstate.id);
  state.id = oldstate.id;
  state.title = oldstate.title;
  state.content = oldstate.content;
  state.count = oldstate.count;
  return state;
}
/**
 * id 名称，描述，图片，次数（-1为无限) ，触发，开始，结束
 */
function createState(id, title, content, src, count, trigger,begin,end) {
  var state = new Object();
  state.id = id;
  state.title = title;
  state.content = content;
  state.src = Global.STATE_DIR + src;
  state.count = count;
  state.trigger = trigger;
  state.begin = begin;
  state.end = end;
  return state;
}
module.exports = {
  createState: createState,
  getState: getState,
  loadState:loadState,
  StateType: StateType,
}