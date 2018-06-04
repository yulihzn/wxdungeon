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
var GameoverDialog = (function (_super) {
    __extends(GameoverDialog, _super);
    function GameoverDialog() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    GameoverDialog.prototype.onAddToStage = function () {
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
        this.textTips.textColor = 0xff0000;
        this.textTips.x = 0;
        this.textTips.y = this.stage.height / 2 - 200;
        this.textTips.text = 'you die';
        this.textRetry = new egret.TextField();
        this.addChild(this.textRetry);
        this.textRetry.alpha = 0;
        this.textRetry.textAlign = egret.HorizontalAlign.CENTER;
        this.textRetry.size = 50;
        this.textRetry.textColor = 0xffffff;
        this.textRetry.width = this.stage.width;
        this.textRetry.y = this.stage.height / 2 + 200;
        this.textRetry.text = 'play again';
        this.textRetry.bold = true;
    };
    GameoverDialog.prototype.show = function (level) {
        var _this = this;
        this.bg.alpha = 0;
        this.textTips.text = ' you die\n Lv.' + level;
        this.textTips.scaleX = 1;
        this.textTips.scaleY = 1;
        this.textTips.y = this.stage.height / 2 - 200;
        this.textTips.alpha = 0;
        this.textRetry.alpha = 0;
        this.textRetry.touchEnabled = true;
        this.visible = true;
        egret.Tween.get(this.bg).to({ alpha: 1 }, 1000);
        egret.Tween.get(this.textTips).wait(200).to({ y: this.textTips.y + 20, alpha: 1 }, 1000);
        egret.Tween.get(this.textRetry).wait(1000).to({ alpha: 1 }, 1000).call(function () {
            _this.textRetry.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.retry, _this);
        });
    };
    GameoverDialog.prototype.retry = function () {
        this.visible = false;
        this.textRetry.touchEnabled = false;
        this.textRetry.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.retry, this);
        this.parent.dispatchEventWith(LogicEvent.DUNGEON_NEXTLEVEL, false, { level: 1 });
    };
    return GameoverDialog;
}(egret.DisplayObjectContainer));
__reflect(GameoverDialog.prototype, "GameoverDialog");
