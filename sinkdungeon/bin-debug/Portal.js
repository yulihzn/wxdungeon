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
var Portal = (function (_super) {
    __extends(Portal, _super);
    function Portal(x, y) {
        var _this = _super.call(this) || this;
        _this.isOpen = false;
        _this.posIndex = new egret.Point(x, y);
        _this.init();
        return _this;
    }
    Portal.prototype.getType = function () {
        return this.type;
    };
    Portal.prototype.init = function () {
        this.width = 64;
        this.height = 64;
        this.anchorOffsetX = 32;
        this.anchorOffsetY = 32;
        this.gate = new egret.Bitmap(RES.getRes("portal"));
        this.light = new egret.Bitmap(RES.getRes("portallight"));
        var index = 0;
        this.gate.anchorOffsetX = this.gate.width / 2;
        this.gate.anchorOffsetY = this.gate.height / 2;
        this.gate.x = this.width / 2;
        this.gate.y = this.height / 2;
        this.light.anchorOffsetX = this.light.width / 2;
        this.light.anchorOffsetY = this.light.height / 2;
        this.light.x = this.width / 2;
        this.light.y = 0;
        this.light.alpha = 0.75;
        this.light.scaleX = 1;
        this.light.scaleY = 1;
        this.addChild(this.gate);
        this.addChild(this.light);
        this.isOpen = false;
        this.visible = false;
        egret.Tween.get(this.light, { loop: true })
            .to({ skewX: 5, skewY: -2 }, 1000)
            .to({ skewX: 0, skewY: 0 }, 1000)
            .to({ skewX: -5, skewY: 2 }, 1000)
            .to({ skewX: 0, skewY: 0 }, 1000);
    };
    Portal.prototype.show = function () {
        this.alpha = 0;
        this.scaleX = 0.1;
        this.scaleY = 0.1;
        this.light.scaleX = 0.1;
        this.light.scaleY = 0.1;
        this.visible = true;
        this.isOpen = false;
        egret.Tween.get(this)
            .to({ alpha: 1, scaleX: 1, scaleY: 1 }, 500).call(function () {
        });
    };
    Portal.prototype.closeGate = function () {
        if (!this.visible || !this.isOpen) {
            return;
        }
        this.isOpen = false;
        egret.Tween.get(this.light)
            .to({ scaleY: 0.1 }, 500).to({ scaleX: 0.1 }, 200).call(function () {
        });
    };
    Portal.prototype.openGate = function () {
        if (!this.visible || this.isOpen) {
            return;
        }
        this.isOpen = true;
        egret.Tween.get(this.light).to({ scaleX: 1 }, 500).to({ scaleY: 1 }, 200).call(function () {
        });
    };
    Portal.prototype.isGateOpen = function () {
        return this.isOpen;
    };
    return Portal;
}(Building));
__reflect(Portal.prototype, "Portal");
