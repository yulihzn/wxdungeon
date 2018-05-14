var Tile = require('../main/tile.js');

var Map = function () {
  var that = this;
  that.data = {
    //当前关卡
    level:1,
    //玩家位置
    playerPosition:4,
    //出口位置
    exitPosition:0,
    //是否杀死水獭
    isKillStore:false,
    list:[],
  }
  
  that.resetMap = function () {
    that.data.playerPosition = 4;
    that.data.exitPosition = 0;
    that.data.list = [];
    that.data.level = 1;
    that.createMap();
  }
  that.createMap = function () {
    var unAvailablePositions = that.getUnAvailablePositions(that.data.playerPosition);
    that.data.exitPosition = unAvailablePositions[Tile.getRandomInt(0, unAvailablePositions.length - 1)];
    var hasItem = false;
    for (var i = 0; i < 9; i++) {
      var t = Tile.getTile(Tile.Type.EMPTY);
      var rand = Math.random();
      if (rand < 0.15) {
        t = Tile.getTile(Tile.Type.GOOD);
      }
      if (rand >= 0.15 && rand < 0.3) {
        t = Tile.getTile(Tile.getRandomInt(1002, 1002));
      }
      if (rand >= 0.3 && rand < 0.5) {
        t = Tile.getTile(Tile.getRandomInt(2000, 2003));
      }
      if(rand >= 0.5&& rand < 0.7){
        t = Tile.getTile(Tile.Type.COIN);
      }
      if (rand >= 0.7 && rand < 0.95&&!hasItem) {
        hasItem = true;
        t = Tile.getTile(Tile.Type.ITEM);
        t.itemIdList = [Tile.getRandomInt(0, 2)];
      }
      that.data.list[i] = t;
    }
    that.data.list[that.data.exitPosition] = Tile.getTile(Tile.Type.EXIT);
    that.data.list[that.data.playerPosition] = Tile.getTile(Tile.Type.EMPTY);
    if (that.data.level == 1){
      that.data.list[that.data.playerPosition] = Tile.getTile(Tile.Type.STORE);
    }
    if (that.data.level == 2) {
      that.data.list[that.data.playerPosition] = Tile.getTile(Tile.Type.STORE_DARK);
    }
    if (that.data.level == 3) {
      if (that.data.isKillStore){
        that.data.list[that.data.playerPosition] = Tile.getTile(Tile.Type.STORE_SWORD);
      }else{
        that.data.list[that.data.playerPosition] = Tile.getTile(Tile.Type.STORE_NEW);
      }
    }
    that.data.list[that.data.playerPosition].state = 1;
  }
  that.loadMap = function(){
    for (var i = 0; i < that.data.list.length;i++){
      that.data.list[i] = Tile.loadTile(that.data.list[i]);
    }
  }
  that.isAvailablePosition = function (position) {
    if (that.data.list[position].state != 0
      || that.data.list[that.getTopPosition(position)].state != 0
      || that.data.list[that.getBottomPosition(position)].state != 0
      || that.data.list[that.getLeftPosition(position)].state != 0
      || that.data.list[that.getRightPosition(position)].state != 0){
        return true;
      }
    return false;
  }
  /**
   * 9 9 9 9 9
   * 9 0 1 2 9
   * 9 3 4 5 9
   * 9 6 7 8 9
   * 9 9 9 9 9
   */
  that.getTopPosition = function(position){
    var value = position - 3;
    if (value < 0) { value = position;}
    return value;
  }
  that.getBottomPosition = function (position) {
    var value = position + 3;
    if (value > 8) { value = position; }
    return value;
  }
  that.getLeftPosition = function (position) {
    var value = position - 1;
    if (position % 3 == 0) { value = position; }
    return value;
  }
  that.getRightPosition = function (position) {
    var value = position + 1;
    if ((position - 2) % 3 == 0) { value = position; }
    return value;
  }
  that.getTargetNearPosition = function(target){
    
  }
  /**
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
  that.getAvailablePositions = function (position) {
    if (position == 0) { return [1, 3] };
    if (position == 1) { return [0, 2, 4] };
    if (position == 2) { return [1, 5] };
    if (position == 3) { return [0, 4, 6] };
    if (position == 4) { return [1, 3, 5, 7] };
    if (position == 5) { return [2, 4, 8] };
    if (position == 6) { return [3, 7] };
    if (position == 7) { return [4, 6, 8] };
    if (position == 8) { return [5, 7] };
    return [];
  }
  that.getUnAvailablePositions = function (position) {
    if (position == 0) { return [2, 4, 5, 6, 7, 8] };
    if (position == 1) { return [3, 5, 6, 7, 8] };
    if (position == 2) { return [0, 3, 4, 6, 7, 8] };
    if (position == 3) { return [1, 2, 5, 7, 8] };
    if (position == 4) { return [0, 2, 6, 8] };
    if (position == 5) { return [0, 1, 3, 6, 7] };
    if (position == 6) { return [0, 1, 2, 4, 5, 8] };
    if (position == 7) { return [0, 1, 2, 3, 5] };
    if (position == 8) { return [0, 1, 2, 3, 4, 6] };
    return [];
  }
  return that;
}

module.exports = {
  Map: Map,
}