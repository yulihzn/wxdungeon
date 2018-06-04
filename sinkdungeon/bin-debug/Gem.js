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
var Gem = (function (_super) {
    __extends(Gem, _super);
    function Gem(type) {
        var _this = _super.call(this) || this;
        _this.canTaken = false;
        _this.type = type;
        _this.init();
        return _this;
    }
    Gem.prototype.setId = function (type) {
        this.type = type;
        this.item.texture = RES.getRes("gem0" + this.type);
    };
    Gem.prototype.getType = function () {
        return this.type;
    };
    Gem.prototype.init = function () {
        this.width = 64;
        this.height = 64;
        this.anchorOffsetX = 32;
        this.anchorOffsetY = 32;
        this.item = new egret.Bitmap(RES.getRes("gem0" + this.type));
        this.shadow = new egret.Bitmap(RES.getRes("shadow"));
        var index = 0;
        this.item.anchorOffsetX = this.item.width / 2;
        this.item.anchorOffsetY = this.item.height / 2;
        this.item.x = 32;
        this.item.y = 16;
        this.shadow.anchorOffsetX = this.shadow.width / 2;
        this.shadow.anchorOffsetY = this.shadow.height / 2;
        this.shadow.x = 32;
        this.shadow.y = 32;
        this.shadow.alpha = 0.3;
        this.shadow.scaleX = 1;
        this.shadow.scaleY = 1;
        this.addChild(this.shadow);
        this.addChild(this.item);
        var y = this.item.y;
        egret.Tween.get(this.item, { loop: true })
            .to({ scaleX: 0.5, y: y + 8 }, 1000)
            .to({ scaleX: 0, y: y }, 1000)
            .to({ scaleX: 0.5, y: y + 8 }, 1000)
            .to({ scaleX: 1, y: y }, 1000);
        this.visible = false;
    };
    Gem.prototype.show = function () {
        egret.Tween.removeTweens(this.item);
        this.item.x = 32;
        this.item.y = 16;
        this.item.scaleX = 1;
        this.item.scaleY = 1;
        this.item.alpha = 1;
        this.visible = true;
        this.canTaken = true;
        var y = this.item.y;
        egret.Tween.get(this.item, { loop: true })
            .to({ scaleX: 0.5, y: y + 8 }, 1000)
            .to({ scaleX: 0, y: y }, 1000)
            .to({ scaleX: 0.5, y: y + 8 }, 1000)
            .to({ scaleX: 1, y: y }, 1000);
    };
    Gem.prototype.hide = function () {
        this.canTaken = false;
        egret.Tween.removeTweens(this.item);
        this.item.scaleX = 1;
        this.visible = false;
    };
    Gem.prototype.taken = function () {
        var _this = this;
        if (!this.visible || !this.canTaken) {
            return;
        }
        this.canTaken = false;
        this.parent.parent.dispatchEventWith(LogicEvent.GET_GEM, false, { score: this.type * 10 });
        egret.Tween.removeTweens(this.item);
        this.item.scaleX = 1;
        this.item.alpha = 1;
        egret.Tween.get(this.item)
            .to({ scaleX: 2, scaleY: 2, y: this.item.y - 128 }, 500)
            .to({ alpha: 0 }, 100).call(function () {
            _this.visible = false;
        });
    };
    return Gem;
}(egret.DisplayObjectContainer));
__reflect(Gem.prototype, "Gem");
