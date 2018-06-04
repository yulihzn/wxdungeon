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
var ControllerPad = (function (_super) {
    __extends(ControllerPad, _super);
    function ControllerPad() {
        var _this = _super.call(this) || this;
        _this.dirs = new Array(4);
        _this.init();
        return _this;
    }
    ControllerPad.prototype.init = function () {
        //0:top,1:bottom,2:left,3:right
        var _this = this;
        var _loop_1 = function (i) {
            this_1.dirs[i] = new egret.Bitmap(RES.getRes("controller"));
            this_1.dirs[i].touchEnabled = true;
            this_1.dirs[i].alpha = 0.5;
            this_1.dirs[i].anchorOffsetX = this_1.dirs[i].width / 2;
            this_1.dirs[i].anchorOffsetY = this_1.dirs[i].height / 2;
            this_1.dirs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.tapPad(i); }, this_1);
            this_1.addChild(this_1.dirs[i]);
        };
        var this_1 = this;
        for (var i = 0; i < this.dirs.length; i++) {
            _loop_1(i);
        }
        this.dirs[0].rotation = -90;
        this.dirs[1].rotation = 90;
        this.dirs[2].rotation = 180;
        var cx = 0;
        var cy = 0;
        this.dirs[0].x = cx;
        this.dirs[0].y = cy;
        this.dirs[1].x = cx;
        this.dirs[1].y = cy + 256;
        this.dirs[2].x = cx - 128;
        this.dirs[2].y = cy + 128;
        this.dirs[3].x = cx + 128;
        this.dirs[3].y = cy + 128;
    };
    ControllerPad.prototype.tapPad = function (dir) {
        var padtapEvent = new PadtapEvent(PadtapEvent.PADTAP);
        padtapEvent.dir = dir;
        this.dispatchEvent(padtapEvent);
    };
    return ControllerPad;
}(egret.DisplayObjectContainer));
__reflect(ControllerPad.prototype, "ControllerPad");
