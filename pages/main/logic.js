const Global = require('../../global.js');
var Tile = require('../main/tile.js');
var Item = require("../main/item.js");
var mapjs = require("../main/map.js");
var playerjs = require("../main/player.js");
var questjs = require("../main/quest.js")
var eventjs = require("../main/event.js");
var itemjs = require("../main/item.js");
var State = require("../main/state.js");
const util = require('../../utils/util.js');
var map = mapjs.Map();
var player = playerjs.Player();
var questManager = questjs.QuestManager();
var event = eventjs.Event();
var currItemList = [];
var currStateList = [];
//物品触发条件 现在，翻转，下一层
const ItemTrigger = { NOW: 0, FLIP: 1, CLICK: 2, NEXT: 3, USE: 4 }
//是否在加载
var isLoading = false;
var clickPosition = -1;
//是否有存档
var hasSave = "0";
/**
 * 逻辑交互
 * 主要处理逻辑部分，main用来处理页面更新
 * 逻辑顺序
 * 初始化：
 * 关卡事件选取默认，player的位置为4，生命为5，道具列表和状态列表为空，关卡为1，地图为无事件普通生成状态，更新视图
 * 正常加载关卡逻辑：
 * 关卡事件列表根据关卡选出一个事件，地图根据玩家位置和事件生成对应地图，处理关卡事件配置相关环境和即时情况，根据事件、玩家物品触发效果，根据事件和物品、玩家状态触发效果
 * 点击处理逻辑：
 * 点击卡片，事件执行，地图状态修改，玩家位置修改，根据事件、玩家物品触发效果，根据事件和物品、玩家状态触发效果,执行卡片事件，事件执行，地图状态修改，玩家位置修改，根据事件、玩家物品触发效果，根据事件和物品、玩家状态触发效果
 * 几个环节：
 * 进入关卡，点击卡片时，点击卡片后
 * 
 */
var Logic = function () {
  var that = this;
  var init = function () {
    that.reset();
  }
  that.reset = function () {
    hasSave = wx.getStorageSync("hasSave")
    if (hasSave == "1") {
      that.loadSave()
    } else {
      player.reset();
      currItemList = [];
      currStateList = [];
      map.resetMap();
    }
    that.updateUI();
  };
  that.loadSave = function () {
    player.data = wx.getStorageSync("player");
    currItemList = wx.getStorageSync("currItemList");
    currStateList = wx.getStorageSync("currStateList");
    map.data = wx.getStorageSync("map");
    map.loadMap();
    for (var i = 0; i < currStateList.length; i++) {
      currStateList[i] = State.loadState(currStateList[i]);
    }
    for (var i = 0; i < currItemList.length; i++) {
      currItemList[i] = Item.loadItem(currItemList[i]);
    }
  }
  that.save = function () {
    hasSave = "1";
    wx.setStorageSync("hasSave", hasSave)
    wx.setStorageSync("player", player.data)
    wx.setStorageSync("map", map.data)
    wx.setStorageSync("currItemList", currItemList)
    wx.setStorageSync("currStateList", currStateList)
  }
  /**
  * 处理翻转逻辑
  */
  that.onFlip = function (index) {
    if (isLoading) { return; }
    if (!map.isAvailablePosition(index)) { return; }
    clickPosition = index;
    var t = map.data.list[index];
    map.data.playerPosition = index;
    var isNotFliped = t.state == 0;
    t.state = 1;
    if (isNotFliped) {
      that.updateStates();//更新状态
      if (t.flip) { t.flip(that); }
    } else {
      if (t.click) { t.click(that); }
    }
    that.updateUI();
  };
  /**替换tile */
  that.replaceTile = function (index, tileType) {
    map.data.list[index] = Tile.getTile(tileType);
    map.data.list[index].state = 1;
  }
  /**清空tile */
  that.clearClickTile = function () {
    if (clickPosition < 0 || clickPosition >= map.data.list.length) { return; }
    map.data.list[clickPosition] = Tile.getTile(Tile.Type.EMPTY);
    map.data.list[clickPosition].state = 1;
    console.log("clear:" + clickPosition);
  }
  /**改变tile图标 */
  that.changeClickTileSrc = function () {
    if (clickPosition < 0 || clickPosition >= map.data.list.length) { return; }
    var item = Item.getItem(map.data.list[clickPosition].itemIdList[0]);
    map.data.list[clickPosition].src = item.tilesrc;
    var list = currItemList;
    var isCopy = false;
    for (var i = 0; i < list.length; i++) {
      if (item.id == list[i].id) {
        isCopy = true;
        break;
      }
    }
    if (!isCopy) { map.data.list[clickPosition].src = item.tilesrc; } else { that.clearClickTile() }
  }
  /**显示物品 */
  that.showItem = function () {
    if (clickPosition < 0 || clickPosition >= map.data.list.length) { return; }
    var item = Item.getItem(map.data.list[clickPosition].itemIdList[0]);
    var list = currItemList;
    var isCopy = false;
    for (var i = 0; i < list.length; i++) {
      if (item.id == list[i].id && item.count == -1) {
        isCopy = true;
      }
    }
    if (!isCopy) { that.showItemDialog(item, 0, 1); }
  },
    /**下一层 */
    that.toNextLevel = function () {
      that.delayTask(function () {
        if (map.data.level >= 100) {
          wx.showModal({
            title: 'YOU WIN',
            content: 'congratulations~',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.reset();
              }
            }
          })
          return;
        }
        that.updateLife(+1);
        map.data.level++;
        map.createMap();
        that.triggerItemList(ItemTrigger.NEXT, -1, Tile.Type.EXIT);
      }, 500);
    };
  /**延迟任务 */
  that.delayTask = function (task, timeout) {
    isLoading = true;
    setTimeout(function () {
      isLoading = false;
      task();
      that.updateUI();
    }, timeout);
  }
  that.itemNOW = function (id) {
    that.triggerItemList(ItemTrigger.NOW, id, -1)
  }
  that.itemFLIP = function (tileType) {
    that.triggerItemList(ItemTrigger.FLIP, -1, -1)
  }
  that.itemCLICK = function (tileType) {
    that.triggerItemList(ItemTrigger.CLICK, -1, -1)
  }
  that.itemNEXT = function () {
    that.triggerItemList(ItemTrigger.NEXT, -1, Tile.Type.EXIT)
  }
  that.itemUSE = function (id) {
    that.triggerItemList(ItemTrigger.USE, id, -1);
  }
  /**触发物品 触发类型 物品id 触发tile类型*/
  that.triggerItemList = function (triggerType, id, tileType) {
    for (var i = 0; i < currItemList.length; i++) {
      var item = currItemList[i];
      if (triggerType == ItemTrigger.NOW && id == item.id) {
        if (item.now) { item.now(that); }
      }
      if (triggerType == ItemTrigger.FLIP) {
        if (item.flip) { item.flip(that, tileType); }
      }
      if (triggerType == ItemTrigger.CLICK) {
        if (item.click) { item.click(that, tileType); }
      }
      if (triggerType == ItemTrigger.NEXT) {
        if (item.next) { item.next(that); }
      }
      if (triggerType == ItemTrigger.USE && id == item.id) {
        if (item.use) { item.use(that); }
      }
    }
  };
  that.triggerStateList = function () {
    for (var i = 0; i < currStateList.length; i++) {
      var state = currStateList[i];
      if (state.trigger) { state.trigger(that); }
    }
  },
    that.onLevel = function () { };
  /**是否在执行耗时任务 */
  that.getIsLoading = function () { return isLoading };
  /**更新ui */
  that.updateUI = function () {
    var width = 95 + player.data.maxlife;
    if (width > 600) {
      width = 600;
    }
    var percent = player.data.life / player.data.maxlife * 100;
    if (percent > 100) { percent = 100 };
    var exppercent = player.data.exp / player.data.expmax * 100;
    if (exppercent > 100) { exppercent = 100 };
    var m = new Map();
    m.set("tileList", map.data.list);
    m.set("level", map.data.level);
    m.set("playerPosition", map.data.playerPosition);
    m.set("currItemList", currItemList);
    m.set("currStateList", currStateList);
    m.set("healthbarWidth", width + "rpx");
    m.set("healthbarPercent", percent);
    m.set("healthtext", player.data.life + "/" + player.data.maxlife);
    m.set("attack", player.data.attack + "-" + player.data.attackmax);
    m.set("attackextra", player.data.attackextra);
    m.set("expbarPercent", exppercent);
    m.set("exptext", player.data.exp + "/" + player.data.expmax)
    m.set("explevel", "Lv：" + player.data.level);
    m.set("money", player.data.money)
    if (getMainPage()) {
      getMainPage().updateUI(m);
    }
  };
  /**更新生命 */
  that.updateLife = function (add) {
    player.data.life += add;
    var life = player.updateLife();
    if (life < 1) {
      this.gameOver();
    }
  }
  that.addExtraAttack = function (add) {
    player.data.attackextra += add;
  }
  that.updateMoney = function (add) {
    if (add < 0) {
      player.data.money += util.getRandomInt(1, 10);
    } else {
      player.data.money += add;
    }
  }
  /**更新经验条 */
  that.updateExp = function (add) {
    player.data.exp += add;
    var isLevelUp = player.data.updateExp();
    if (isLevelUp) {
      that.updateLife(player.data.maxlife);
      player.data.attack += 1;
      player.data.attackmax += 1;
    }
  }

  /**game over */
  that.gameOver = function () {
    wx.showModal({
      title: 'YOU DIE',
      content: 'At Level : ' + map.level,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          hasSave = "0";
          wx.setStorageSync("hasSave", hasSave)
          that.reset();
        }
      }
    })
  }

  /**显示战斗界面 */
  that.showBattleSheet = function (finish, tile, level) {
    getMainPage().battleview.show(level, tile, function (t) {
      switch (t) {
        case 0: that.updateLife(-tile.damage); tile.life -= player.data.attack; break;
        case 1: if (player.data.attack + player.data.attackextra > 0) { tile.life -= player.data.attack + player.data.attackextra }; break;
        case 2: tile.life -= player.data.attackmax; break;
        case 3: tile.life -= player.data.attackmax * 2; break;
      }
      if (tile.life > 0) {
        if (finish) { finish(t); }
      } else {
        getMainPage().battleview.hide();
        if (tile.die) { tile.die(that); }
      }
      that.updateUI();
    });
  }
  that.toast = function (msg) {
    wx.showToast({
      title: msg,
      icon: "none",
    })
  }
  that.setKillStore = function (flag) {
    map.isKillStore = flag;
  }
  /**显示对话界面 */
  that.showTalkDialog = function (tile, talkType) {
    getMainPage().openDialog(tile, that, talkType);
  }

  /**
   * 物品对话框，showType：1:获取 2：展示 3：使用
   */
  that.showItemDialog = function (item, index, showType) {
    var ok = "接受";
    var cancel = "放弃";
    var showOnly = false;
    if (showType == 1) { }
    if (showType == 2) { showOnly = true; ok = "关闭"; }
    if (showType == 3) { ok = "使用"; cancel = "关闭" }

    wx.showModal({
      title: item.title,
      content: item.content,
      confirmText: ok,
      cancelText: cancel,
      showCancel: !showOnly,
      success: function (res) {
        if (res.confirm) {
          if (showType == 1) {
            that.addItem(item);
          } else if (showType == 3) {
            that.useItem(index);
          }
        } else if (res.cancel) {
        }
      }
    })
  };
  /**添加状态 */
  that.addState = function (stateId) {
    var state = State.getState(stateId);
    var isCopy = false;
    for (var i = 0; i < currStateList.length; i++) {
      if (state.id == currStateList[i].id) {
        if (state.count == -1) {
          return;
        } else if (state.count > 0) {
          isCopy = true;
          currStateList[i].count++;
        }
      }
    }
    if (!isCopy) {
      currStateList.unshift(state);
      if (state.begin) { state.begin(that) }
    }
    that.updateUI();
  }
  /**移除指定状态 */
  that.removeTheStates = function (stateId) {
    var i = currStateList.length;
    while (i--) {
      if (currStateList[i].id == stateId) {
        if (currStateList[i].end) { currStateList[i].end(that) }
        currStateList.splice(i, 1);
      }
    }
    that.updateUI();
  }
  /**移除失效的状态 */
  that.removeInvalidStates = function () {
    var i = currStateList.length;
    while (i--) {
      if (currStateList[i].count == 0) {
        if (currStateList[i].end) { currStateList[i].end(that) }
        currStateList.splice(i, 1);
      }
    }
  }
  that.removeAllStates = function () {
    currStateList = [];
    that.updateUI();
  }
  /**更新状态 */
  that.updateStates = function () {
    var i = currStateList.length;
    while (i--) {
      if (currStateList[i].count == -1) {
        continue;
      } else if (currStateList[i].count > 0) {
        currStateList[i].count--;
      }
      currStateList[i].trigger(that);
    }
    that.removeInvalidStates();
  }
  /**
 * 添加物品
 */
  that.addItem = function (item) {
    var isCopy = false;
    for (var i = 0; i < currItemList.length; i++) {
      if (item.id == currItemList[i].id) {
        if (item.count == -1) {
          return;
        } else if (item.count > 0) {
          isCopy = true;
          currItemList[i].count++;
        }
      }
    }
    if (!isCopy) {
      currItemList.unshift(item);
    }
    that.itemNOW(item.id);
    that.clearClickTile();
    that.updateUI();
  }


  /**使用物品 */
  that.useItem = function (index) {
    var item = currItemList[index];
    that.itemUSE(item.id);
    if (item.count > 0) {
      item.count--;
    }
    if (item.count == 0) {
      currItemList.splice(index, 1);
    }
    that.updateUI();
  }
  /**点击物品 */
  that.tapItem = function (index) {
    if (index < 0 || currItemList.length == 0) { return; }
    var list = currItemList;
    if (list[index].count == -1) {
      that.showItemDialog(list[index], index, 2);
    } else if (list[index].count > 0) {
      that.showItemDialog(list[index], index, 3);
    }
    that.updateUI();
  }
  /**获取main页面实例 */
  var getMainPage = function () {
    var obs = getCurrentPages();
    if (obs.length > 0) {
      var main = obs[obs.length - 1];
      if (main.route == "pages/main/main") {
        return main;
      }
    }
    return null;
  }
  init();
  return that;
}
module.exports = {
  Logic, Logic
}