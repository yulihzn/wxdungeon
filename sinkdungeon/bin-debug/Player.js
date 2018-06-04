var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.walking = false;
        _this.isdead = false;
        _this.health = 1;
        _this.pos = new egret.Point();
        _this.init();
        return _this;
    }
    Player.prototype.init = function () {
        this.player = new egret.Bitmap(RES.getRes("player00" + Logic.getRandomNum(1, 6)));
        this.playerShadow = new egret.Bitmap(RES.getRes("shadow"));
        var index = 0;
        this.player.anchorOffsetX = this.player.width / 2;
        this.player.anchorOffsetY = this.player.height;
        this.player.x = 0;
        this.player.y = 0;
        this.playerShadow.anchorOffsetX = this.playerShadow.width / 2;
        this.playerShadow.anchorOffsetY = this.playerShadow.height / 2;
        this.playerShadow.x = 0;
        this.playerShadow.y = 0;
        this.playerShadow.alpha = 0.3;
        this.playerShadow.scaleX = 2;
        this.playerShadow.scaleY = 2;
        this.addChild(this.player);
        this.addChild(this.playerShadow);
    };
    Player.prototype.isWalking = function () {
        return this.walking;
    };
    Player.prototype.isDying = function () {
        return this.isdead;
    };
    Player.prototype.resetPlayer = function () {
        egret.Tween.removeTweens(this.player);
        egret.Tween.removeTweens(this);
        this.parent.setChildIndex(this, 100);
        this.player.scaleX = 1;
        this.player.scaleY = 1;
        this.player.visible = true;
        this.player.alpha = 1;
        this.player.x = 0;
        this.player.y = 0;
        this.playerShadow.visible = true;
        this.isdead = false;
        this.walking = false;
    };
    Player.prototype.die = function () {
        var _this = this;
        if (this.isdead) {
            return;
        }
        this.isdead = true;
        this.playerShadow.visible = false;
        egret.Tween.get(this.player).to({ y: 32, scaleX: 0.5, scaleY: 0.5 }, 200).call(function () {
            _this.parent.setChildIndex(_this, 0);
        }).to({ scaleX: 0.2, scaleY: 0.2, y: 100 }, 100).call(function () { _this.player.alpha = 0; });
    };
    Player.prototype.walk = function (px, py, dir, reachable) {
        var _this = this;
        if (this.walking) {
            console.log("cant");
            return;
        }
        this.walking = true;
        var offsetY = 10;
        var ro = 10;
        if (dir == 1 || dir == 3) {
            offsetY = -offsetY;
            ro = -ro;
        }
        egret.Tween.get(this.player, { loop: true })
            .to({ rotation: ro, y: this.player.y + offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25)
            .to({ rotation: -ro, y: this.player.y - offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25);
        egret.Tween.get(this, { onChange: function () { } }).to({
            x: px, y: py
        }, 200).call(function () {
            egret.Tween.removeTweens(_this.player);
            _this.player.rotation = 0;
            _this.player.y = 0;
            _this.walking = false;
            if (!reachable) {
                _this.die();
            }
        });
    };
    Player.prototype.takeDamage = function (damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.die();
        }
    };
    Player.prototype.move = function (dir, dungeon) {
        if (this.isWalking() || this.isDying()) {
            return;
        }
        console.log('walking');
        switch (dir) {
            case 0:
                if (this.pos.y - 1 >= 0) {
                    this.pos.y--;
                }
                break;
            case 1:
                if (this.pos.y + 1 < Logic.SIZE) {
                    this.pos.y++;
                }
                break;
            case 2:
                if (this.pos.x - 1 >= 0) {
                    this.pos.x--;
                }
                break;
            case 3:
                if (this.pos.x + 1 < Logic.SIZE) {
                    this.pos.x++;
                }
                break;
            default: break;
        }
        var tile = dungeon.map[this.pos.x][this.pos.y];
        var p = Logic.getInMapPos(this.pos);
        this.walk(p.x, p.y, dir, tile.floor.visible);
        if (!tile.floor.visible) {
            dungeon.gameOver();
        }
        if (tile.item) {
            tile.item.taken();
        }
        if (this.pos.x == dungeon.portal.posIndex.x
            && this.pos.y == dungeon.portal.posIndex.y
            && dungeon.portal.isGateOpen()) {
            this.dispatchEventWith(LogicEvent.DUNGEON_NEXTLEVEL, false, { level: ++dungeon.level });
        }
    };
    return Player;
}(egret.DisplayObjectContainer));
__reflect(Player.prototype, "Player");
