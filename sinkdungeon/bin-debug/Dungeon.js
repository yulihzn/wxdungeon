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
var Dungeon = (function (_super) {
    __extends(Dungeon, _super);
    function Dungeon() {
        var _this = _super.call(this) || this;
        _this.SIZE = 9;
        _this.map = new Array();
        _this.drawMap();
        return _this;
    }
    Dungeon.prototype.drawMap = function () {
        this.map = new Array();
        var imgLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, this.imgLoadHandler, this);
        imgLoader.load("resource/assets/tile.png");
    };
    Dungeon.prototype.imgLoadHandler = function (evt) {
        var loader = evt.currentTarget;
        var texture = new egret.Texture();
        texture._setBitmapData(loader.data);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var tile = new egret.Bitmap(texture);
        var originX = stageW / 2 - this.SIZE / 2 * tile.width;
        var originY = stageH - this.SIZE * tile.height - 100;
        for (var i = 0; i < this.SIZE; i++) {
            this.map[i] = new Array(i);
            for (var j = 0; j < this.SIZE; j++) {
                var t = new egret.Bitmap(texture);
                t.x = originX + i * t.width;
                t.y = originY + j * t.height;
                this.map[i][j] = t;
                this.addChild(this.map[i][j]);
            }
        }
    };
    return Dungeon;
}(egret.Stage));
__reflect(Dungeon.prototype, "Dungeon");
//# sourceMappingURL=Dungeon.js.map