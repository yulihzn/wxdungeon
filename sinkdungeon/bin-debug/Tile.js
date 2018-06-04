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
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(x, y) {
        var _this = _super.call(this) || this;
        _this.isLooping = false;
        _this.posIndex = new egret.Point(x, y);
        _this.init();
        return _this;
    }
    Tile.prototype.init = function () {
        var t = new egret.Bitmap(RES.getRes("tile"));
        this.width = Tile.WIDTH;
        this.height = Tile.WIDTH;
        t.anchorOffsetX = Tile.WIDTH / 2;
        t.anchorOffsetY = Tile.WIDTH / 2;
        t.scaleX = 1;
        t.scaleY = 1;
        this.floor = t;
        this.addChild(this.floor);
    };
    Tile.prototype.addItem = function (item) {
        this.item = item;
        this.addChildAt(this.item, 1000);
        return this;
    };
    Tile.prototype.addBuilding = function (building) {
        this.building = building;
        this.addChild(this.building);
        return this;
    };
    Tile.prototype.showTile = function () {
        var _this = this;
        this.floor.alpha = 0;
        this.floor.scaleX = 1;
        this.floor.scaleY = 1;
        this.floor.x = 0;
        this.floor.y = 0;
        this.floor.visible = true;
        egret.Tween.get(this.floor).to({ alpha: 1 }, 200).wait(1000).call(function () {
            if (_this.isLooping) {
                _this.breakTile();
            }
        });
    };
    Tile.prototype.breakTile = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var y = _this.floor.y;
            if (_this.posIndex.x == Math.floor(Logic.SIZE / 2) && _this.posIndex.y == Math.floor(Logic.SIZE / 2)) {
                return;
            }
            egret.Tween.get(_this.floor, { loop: true })
                .to({ y: y + 5 }, 25)
                .to({ y: y }, 25)
                .to({ y: y - 5 }, 25)
                .to({ y: y }, 25);
            egret.Tween.get(_this.floor).wait(2000).call(function () {
                egret.Tween.removeTweens(_this.floor);
                egret.Tween.get(_this.floor).to({ scaleX: 0.7, scaleY: 0.7 }, 700).to({ alpha: 0 }, 300).call(function () {
                    _this.floor.visible = false;
                    resolve(_this.posIndex);
                }).wait(1000).call(function () {
                    if (_this.isLooping) {
                        _this.showTile();
                    }
                });
            });
        });
    };
    Tile.WIDTH = 64;
    Tile.HEIGHT = 64;
    return Tile;
}(egret.DisplayObjectContainer));
__reflect(Tile.prototype, "Tile");
