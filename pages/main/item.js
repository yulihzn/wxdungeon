var Tile = require('../main/tile.js');
var Global = require("../../global.js")
var ItemType = {
  GLASSES: 0,
  GOLDAPPLE: 1,
  KNIFE:2,
}

function getItem(id) {
  switch (id) {
    case ItemType.GLASSES:
      return createItem(id, "黑框眼镜", "你感受到生命的流逝（-1生命值，进入下一层不回复生命，以后每次回血+2）", "glasses.png", -1,
        function (logic) {
          logic.updateLife(-1);
        },
        function (logic, tileType) {
        },
        function (logic, tileType) {
          if (tileType == Tile.Type.GOOD) {
            logic.updateLife(+1);
          }
        },
        function (logic) {
          logic.updateLife(-1);
        },
        function (logic) {
          
        });
    case ItemType.GOLDAPPLE:
      return createItem(id, "金苹果", "万物皆虚，万事皆允（+1生命值,进入下一层回复生命+1）", "goldapple.png", 1,
        function (logic) {
          logic.updateLife(+1);
        },
        function (logic, tileType) {
        },
        function (logic, tileType) {
        },
        function (logic) {
          logic.updateLife(+1);
        },
        function (logic) {
          logic.updateLife(+1);
        });
    case ItemType.KNIFE:
      return createItem(id, "毒刃", "我的这把刀是涂满了毒药的毒刃（+2攻击力，可投掷，立即造成30点伤害）", "knife.png", 1,
        function (logic) {
        },
        function (logic, tileType) {
        },
        function (logic, tileType) {
        },
        function (logic) {
        },
        function (logic) {
        });
  }
}
function loadItem(oldItem){
  var item = getItem(oldItem.id);
  item.title = oldItem.title;
  item.content = oldItem.content;
  item.count = oldItem.count;
  return item;
}
/**
 * id 名称，描述，图片，次数（-1为无限) 获取，翻转，点击，下一层，使用
 */
function createItem(id, title, content, src, count, now, flip, click, next, use) {
  var item = new Object();
  item.id = id;
  item.title = title;
  item.content = content;
  item.src = Global.ITEM_DIR + src;
  item.tilesrc = Global.TILE_DIR + src;//tile对应图片
  item.count = count;
  item.now = now;
  item.flip = flip;
  item.click = click;
  item.next = next;
  item.use = use;
  return item;
}

module.exports = {
  createItem: createItem,
  loadItem:loadItem,
  getItem: getItem,
}