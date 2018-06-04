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
var Logic = (function (_super) {
    __extends(Logic, _super);
    function Logic(main) {
        var _this = _super.call(this) || this;
        _this.level = 1;
        _this.gemManager = new GemManager();
        _this.score = 0;
        _this.main = main;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Logic.prototype.onAddToStage = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        Logic.mapX = stageW / 2 - Math.floor(Logic.SIZE / 2) * Tile.WIDTH;
        Logic.mapY = 200;
        this.dungeon = new Dungeon();
        this.addChild(this.dungeon);
        this.controllerPad = new ControllerPad();
        this.controllerPad.x = this.stage.width / 2;
        this.controllerPad.y = 800;
        this.addChild(this.controllerPad);
        this.controllerPad.addEventListener(PadtapEvent.PADTAP, this.tapPad, this);
        this.dungeon.addEventListener(LogicEvent.UI_REFRESHTEXT, this.refreshText, this);
        this.main.addEventListener(LogicEvent.DUNGEON_NEXTLEVEL, this.loadNextLevel, this);
        this.dungeon.addEventListener(LogicEvent.DUNGEON_NEXTLEVEL, this.loadNextLevel, this);
        this.dungeon.addEventListener(LogicEvent.GAMEOVER, this.gameOver, this);
        this.dungeon.addEventListener(LogicEvent.GET_GEM, this.getGem, this);
    };
    Logic.getInMapPos = function (pos) {
        var x = Logic.mapX + pos.x * Tile.WIDTH;
        var y = Logic.mapY + pos.y * Tile.WIDTH;
        return new egret.Point(x, y);
    };
    Logic.prototype.refreshText = function (evt) {
        this.main.refreshScoreText("" + this.score);
        this.main.refreshSecondsText("Target:" + this.dungeon.level * Logic.SCORE_BASE + "        Lv." + this.dungeon.level);
    };
    Logic.prototype.tapPad = function (evt) {
        this.dungeon.player.move(evt.dir, this.dungeon);
    };
    Logic.prototype.loadNextLevel = function (evt) {
        var _this = this;
        this.level = evt.data.level;
        this.main.loadingNextDialog.show(this.level, function () {
            _this.dungeon.resetGame(_this.level);
        });
    };
    Logic.prototype.gameOver = function () {
        this.score = 0;
        this.main.gameoverDialog.show(this.dungeon.level);
    };
    Logic.prototype.getGem = function (evt) {
        this.score += evt.data.score;
        if (this.score / Logic.SCORE_BASE >= this.dungeon.level) {
            this.score = Logic.SCORE_BASE * this.dungeon.level;
            this.dungeon.portal.openGate();
        }
        this.main.refreshScoreText("" + this.score);
    };
    Logic.getRandomNum = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    };
    Logic.SIZE = 9;
    Logic.SCORE_BASE = 200;
    //地图左上角坐标
    Logic.mapX = 0;
    Logic.mapY = 0;
    return Logic;
}(egret.Stage));
__reflect(Logic.prototype, "Logic");
