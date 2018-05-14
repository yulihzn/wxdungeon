var State = require('../main/state.js');
var Global = require("../../global.js")
const ItemTrigger = { NOW: 0, FLIP: 1, NEXT: 2 }
if (typeof Type == "undefined") {
  var Type = {
    EMPTY: 0,
    GOOD: 1,
    BAD: 2,
    EXIT: 3,
    ITEM: 4,
    CHEST: 5,
    MONSTER_SLIME: 2000,
    MONSTER_WOLF: 2001,
    MONSTER_GOBLIN: 2002,
    MONSTER_SKELETON: 2003,
    TRAP_THORN: 1000,
    TRAP_BLEED: 1001,
    TRAP_POISON: 1002,
    TRAP_FIRE: 1003,
    TRAP_ICE: 1004,
    TRAP_STONE: 1005,
    STORE: 16,
    STORE_DARK: 17,//只有水獭
    STORE_SWORD: 18,//只有老板
    STORE_NEW: 19,//新的围巾和水獭
    COIN: 20,

  }
}

function getTile(tileType,data) {
  switch (tileType) {
    case Type.EMPTY: return createTile(" ", "", 0, 0, tileType, "tile.png",
      function (logic) { },
      function (logic) { console.log("emptyclick!") },
      function (logic) { });

    case Type.GOOD: return createTile("+1", "", 0, 0, tileType, "good.png",
      function (logic) { }
      , function (logic) { logic.updateLife(+1); logic.itemCLICK(Type.GOOD); logic.clearClickTile(); logic.updateStates(); }
      , function (logic) { });

    case Type.BAD: return createTile("-1", "", 0, 0, tileType, "tile.png",
      function (logic) { logic.updateLife(-1); logic.itemFLIP(Type.BAD); },
      function (logic) { logic.clearClickTile() },
      function (logic) { });

    case Type.ITEM: return createTile("?", "", tileType, 0, 0,"tile.png",
      function (logic) { logic.changeClickTileSrc(); },
      function (logic) { logic.showItem(); }, function (logic) { });

    case Type.EXIT: return createTile("NextLevel", "", 0, 0, tileType, "exit.png",
      function (logic) { },
      function (logic) { logic.toNextLevel(); logic.updateStates(); }, function (logic) { });

    case Type.MONSTER_SLIME: return createTile("老鼠", "吱吱吱", 2, 1,tileType, "rat.png",
      function (logic) { },
      function (logic) { logic.showTalkDialog(this, 0) },
      function (logic) { logic.showBattleSheet(function (t) { }, this, 4); },
      function (logic) { logic.updateExp(1); logic.itemCLICK(Type.BAD); logic.updateStates(); logic.clearClickTile(); });

    case Type.MONSTER_WOLF: return createTile("豺狼", "嗷呜~~~", 3, 2,tileType, "wolf.png",
      function (logic) { },
      function (logic) { logic.showTalkDialog(this, 0) },
      function (logic) { logic.showBattleSheet(function (t) { }, this, 5); },
      function (logic) { logic.updateExp(1); logic.itemCLICK(Type.BAD); logic.updateStates(); logic.clearClickTile(); });

    case Type.MONSTER_GOBLIN: return createTile("哥布林", "我要拿你的头盖骨当碗使！", 4, 3, tileType, "goblin.png",
      function (logic) { },
      function (logic) { logic.showTalkDialog(this, 0) },
      function (logic) { logic.showBattleSheet(function (t) { }, this, 6);},
      function (logic) { logic.updateExp(2); logic.itemCLICK(Type.BAD); logic.updateStates(); logic.clearClickTile(); });

    case Type.MONSTER_SKELETON: return createTile("骷髅士兵", "。。。", 5, 5, tileType, "skeleton.png",
      function (logic) { },
      function (logic) { logic.showTalkDialog(this, 0) },
      function (logic) { logic.showBattleSheet(function (t) { }, this, 7); },
      function (logic) { logic.updateExp(3); logic.itemCLICK(Type.BAD); logic.updateStates(); logic.clearClickTile(); });

    case Type.TRAP_THORN: return createTile("尖刺", "掉进陷阱了", 0, 1, tileType, "thorn.png",
      function (logic) { logic.updateLife(-1); logic.toast(this.content); logic.itemCLICK(Type.BAD); });

    case Type.TRAP_POISON: return createTile("毒气", "有毒", 0, 1, tileType, "posion.png",
      function (logic) { logic.updateLife(-1); logic.toast(this.content); logic.addState(State.StateType.CURSE); logic.itemCLICK(Type.BAD); });

    case Type.TRAP_BLEED: return createTile("捕兽夹", "踩到捕兽夹了", 0, 1, tileType, "trap.png",
      function (logic) { logic.updateLife(-1); logic.toast(this.content);logic.addState(State.StateType.BLEED); logic.itemCLICK(Type.BAD); });

    case Type.TRAP_FIRE: return createTile("火焰", "被火焰喷射到了", 0, 1, tileType, "fire.png",
      function (logic) { logic.updateLife(-1); logic.toast(this.content); logic.addState(State.StateType.FIRE); logic.itemCLICK(Type.BAD); });

    case Type.TRAP_ICE: return createTile("冰霜", "手指头都要冻下来了", 0, 1,tileType, "ice.png",
      function (logic) { logic.updateLife(-1); logic.toast(this.content); logic.addState(State.StateType.ICE); logic.itemCLICK(Type.BAD); });

    case Type.TRAP_STONE: return createTile("落石", "一块大石头砸了下来", 0, 1, tileType, "stone.png",
      function (logic) {
        logic.updateLife(-1);
        logic.toast(this.content);
        logic.addState(State.StateType.DIZZ);
        logic.itemFLIP(Type.BAD);
        logic.clearClickTile();
      });

    case Type.STORE: return createTile("商店老板", "", 5, 20, tileType, "store.png",
      function (logic) { },
      function (logic) { logic.showTalkDialog(this, 2) });

    case Type.STORE_DARK: return createTile("大水獭", "", 6, 10, tileType, "store_dark.png",
      function (logic) { },
      function (logic) { logic.showTalkDialog(this, 3) },
      function (logic) { logic.showBattleSheet(function (t) { }, this, 9);},
      function (logic) { logic.updateExp(1); logic.itemCLICK(Type.BAD); logic.updateStates(); logic.clearClickTile(); });

    case Type.STORE_SWORD: return createTile("商店老板", "", 6, 20, tileType, "store_sword.png",
      function (logic) { },
      function (logic) { logic.showTalkDialog(this, 4) },
      function (logic) { logic.showBattleSheet(function (t){}, this,9); },
      function (logic) { logic.updateExp(1); logic.itemCLICK(Type.BAD); logic.updateStates(); logic.clearClickTile(); });

    case Type.STORE_NEW: return createTile("商店老板", "", 6, 20, tileType, "store_new.png",
      function (logic) { },
      function (logic) { logic.showTalkDialog(this, 5) });
    case Type.COIN: return createTile("金币", "", 0, 0, tileType, "coin.png",
      function (logic) { },
      function (logic) { logic.clearClickTile(); logic.updateMoney(-1); });

  }
  return createTile("", "", 0, 0, tileType, "tile.png", function (logic) { });
};
function loadTile(oldtile){
  var tile = getTile(oldtile.tileType);
  tile.text = oldtile.text;
  tile.state = oldtile.state;
  tile.content = oldtile.content;
  tile.life = oldtile.life;
  tile.damage = oldtile.damage;
  tile.tileType = oldtile.tileType;
  tile.itemIdList = oldtile.itemIdList;//掉落物品id列表
  return tile;
}
/**
 * 名字，描述，生命，伤害，类型，图片，翻转，点击，战斗，死亡
 */
function createTile(text, content, life, damage, tileType, src, flip, click, battle,die) {
  var tile = new Object();
  tile.text = text;
  tile.state = 0;
  tile.content = content;
  tile.life = life;
  tile.damage = damage;
  tile.tileType = tileType;
  tile.src = Global.TILE_DIR +src;
  tile.flip = flip;//func
  tile.click = click;//func
  tile.battle = battle;//func
  tile.die = die;//func
  tile.itemIdList = [];//掉落物品id列表
  tile.getText = function () {
    return this.text;
  }
  tile.getState = function () {
    return this.state;
  }
  tile.getTileType = function () {
    return this.tileType;
  }
  tile.getColor = function () {
    return this.color;
  }
  return tile;
};

/**
 * 获取随机int值<< <<
 */
function getRandomInt(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
module.exports = {
  createTile: createTile,
  getTile: getTile,
  loadTile:loadTile,
  getRandomInt: getRandomInt,
  Type: Type,
}