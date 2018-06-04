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
/**
 * 方向键点击事件
 */
var PadtapEvent = (function (_super) {
    __extends(PadtapEvent, _super);
    function PadtapEvent(type, bubbles, cancelable, data) {
        var _this = _super.call(this, type, bubbles, cancelable, data) || this;
        _this.dir = -1;
        return _this;
    }
    PadtapEvent.PADTAP = "padtap";
    return PadtapEvent;
}(egret.Event));
__reflect(PadtapEvent.prototype, "PadtapEvent");
