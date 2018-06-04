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
var LoadingNextDialog = (function (_super) {
    __extends(LoadingNextDialog, _super);
    function LoadingNextDialog() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    LoadingNextDialog.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.bg = new egret.Shape();
        this.addChild(this.bg);
        this.bg.alpha = 0;
        this.bg.graphics.beginFill(0x000000, 1);
        this.bg.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
        this.bg.graphics.endFill();
        this.textTips = new egret.TextField();
        this.addChild(this.textTips);
        this.textTips.alpha = 0;
        this.textTips.textAlign = egret.HorizontalAlign.CENTER;
        this.textTips.size = 70;
        this.textTips.width = this.stage.width;
        this.textTips.textColor = 0xffffff;
        this.textTips.x = 0;
        this.textTips.y = this.stage.height / 2 - 200;
        this.textTips.text = 'Level ';
    };
    LoadingNextDialog.prototype.show = function (level, finish) {
        var _this = this;
        this.alpha = 1;
        this.bg.alpha = 0;
        this.textTips.text = 'Level ' + level;
        this.textTips.scaleX = 1;
        this.textTips.scaleY = 1;
        this.textTips.y = this.stage.height / 2 - 200;
        this.textTips.alpha = 0;
        this.visible = true;
        egret.Tween.get(this.bg).to({ alpha: 1 }, 500);
        egret.Tween.get(this.textTips).wait(200).to({ y: this.textTips.y + 20, alpha: 1 }, 500).wait(200).call(function () {
            egret.Tween.get(_this).to({ alpha: 0 }, 200);
            if (finish) {
                finish();
            }
        });
    };
    return LoadingNextDialog;
}(egret.DisplayObjectContainer));
__reflect(LoadingNextDialog.prototype, "LoadingNextDialog");
