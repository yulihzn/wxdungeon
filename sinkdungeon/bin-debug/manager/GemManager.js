var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GemManager = (function () {
    function GemManager() {
        this.list = new Array();
    }
    GemManager.prototype.getGem = function (type) {
        var gem;
        for (var i = 0; i < this.list.length; i++) {
            gem = this.list[i];
            if (!gem.visible) {
                gem.setId(type);
                return gem;
            }
        }
        gem = new Gem(type);
        this.list.push(gem);
        return gem;
    };
    GemManager.GEM01 = 1;
    GemManager.GEM02 = 2;
    GemManager.GEM03 = 3;
    GemManager.GEM04 = 4;
    return GemManager;
}());
__reflect(GemManager.prototype, "GemManager");
