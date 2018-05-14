//默认生命
const DEFAULT_LIFE = 100;
const DEFAULT_ATTACK = 1;
const DEFAULT_ATTACKMAX = 2;
const DEFAULT_EXP = 0;
const DEFAULT_EXPMAX = 3;

var Player = function () {
  var that = this;
  that.data = {
    //当前生命
    life: DEFAULT_LIFE,
    //最大生命
    maxlife: DEFAULT_LIFE,
    //攻击力
    attack: DEFAULT_ATTACK,
    //最大攻击力
    attackmax: DEFAULT_ATTACKMAX,
    //额外攻击力
    attackextra: 0,
    //经验
    exp: DEFAULT_EXP,
    expmax: DEFAULT_EXPMAX,
    //等级
    level: 1,
    isDizz: false,
    //玩家位置
    playerPosition: 4,
    money: 0,
  }
  that.reset = function () {
    that.data.playerPosition = 4;
    that.data.life = DEFAULT_LIFE;
  }
  that.updateLife = function () {
    if (that.data.life < 1) {
      that.data.life = 0;
    }
    if (that.data.life > that.data.maxlife) {
      that.data.maxlife++;
      that.data.life = that.data.maxlife;
    }
    return that.data.life;
  }
  that.updateExp = function () {
    var extra = that.data.exp - that.data.expmax;
    if (extra >= 0) {
      that.data.level++;
      that.data.exp = 0;
      that.data.expmax = that.expmax + 8;
      return true;
    }
    return false;
  }
  return that;
}
module.exports = {
  Player: Player,
}