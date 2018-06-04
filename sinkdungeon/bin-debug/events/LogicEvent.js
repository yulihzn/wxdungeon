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
var LogicEvent = (function (_super) {
    __extends(LogicEvent, _super);
    function LogicEvent(type, bubbles, cancelable, data) {
        return _super.call(this, type, bubbles, cancelable, data) || this;
    }
    LogicEvent.LOGIC = "LOGIC";
    LogicEvent.GAMEOVER = "LOGIC_GAMEOVER";
    LogicEvent.DUNGEON_NEXTLEVEL = "DUNGEON_NEXTLEVEL";
    LogicEvent.UI_REFRESHTEXT = "UI_REFRESHTEXT";
    LogicEvent.GET_GEM = "GET_GEM";
    LogicEvent.PLAYER_MOVE = "PLAYER_MOVE";
    return LogicEvent;
}(egret.Event));
__reflect(LogicEvent.prototype, "LogicEvent");
