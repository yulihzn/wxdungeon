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
        _this.SUCCESS_NUMBER = 15;
        _this.map = new Array();
        _this.dirs = new Array(4);
        _this.level = 1;
        _this.isGameover = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Dungeon.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        this.drawBg();
        this.drawMap();
        this.addPlayer();
        this.addTimer();
        this.resetGame(this.level);
    };
    Dungeon.prototype.drawBg = function () {
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x000000, 0.90);
        bg.graphics.drawRect(Logic.mapX - Tile.WIDTH / 2, Logic.mapY - Tile.HEIGHT / 2, Tile.WIDTH * Logic.SIZE, Tile.WIDTH * Logic.SIZE);
        bg.graphics.endFill();
        this.addChild(bg);
        var shadow = new egret.Bitmap(RES.getRes("shadow"));
        shadow.x = Logic.mapX - Tile.WIDTH / 2;
        shadow.y = Logic.mapY - Tile.WIDTH / 2;
        shadow.width = Tile.WIDTH * Logic.SIZE;
        shadow.height = Tile.WIDTH * Logic.SIZE;
        shadow.alpha = 0.9;
        this.addChild(shadow);
    };
    Dungeon.prototype.drawMap = function () {
        this.randomArr = new Array();
        this.map = new Array();
        for (var i = 0; i < Logic.SIZE; i++) {
            this.map[i] = new Array(i);
            for (var j = 0; j < Logic.SIZE; j++) {
                var t = new Tile(i, j);
                t.x = Logic.mapX + i * Tile.WIDTH;
                t.y = Logic.mapY + j * Tile.HEIGHT;
                this.map[i][j] = t;
                this.addChild(this.map[i][j]);
                var index = Math.floor(Logic.SIZE / 2);
                if (index == i && index == j) {
                    this.portal = new Portal(i, j);
                    t.addBuilding(this.portal);
                    this.portal.show();
                }
                t.addItem(new Gem(this.getRandomNum(1, 4)));
                if (!(index == i && index == j)) {
                    if (this.getRandomNum(0, 10) > 5) {
                        t.item.show();
                    }
                }
                this.randomArr[i * Logic.SIZE + j] = new egret.Point(i, j);
            }
        }
    };
    Dungeon.prototype.resetGame = function (level) {
        this.level = level;
        var index = Math.floor(Logic.SIZE / 2);
        for (var i = 0; i < Logic.SIZE; i++) {
            for (var j = 0; j < Logic.SIZE; j++) {
                var t = this.map[i][j];
                egret.Tween.removeTweens(t.floor);
                t.isLooping = false;
                t.showTile();
                t.item.hide();
                if (!(index == i && index == j)) {
                    if (this.getRandomNum(0, 10) > 5) {
                        t.item.setId(this.getRandomNum(1, 4));
                        t.item.show();
                    }
                }
                this.randomArr[i * Logic.SIZE + j] = new egret.Point(i, j);
            }
        }
        this.portal.closeGate();
        this.player.resetPlayer();
        this.player.pos.x = index;
        this.player.pos.y = index;
        var p = Logic.getInMapPos(this.player.pos);
        this.player.x = p.x;
        this.player.y = p.y;
        var delay = 200 - level * 10;
        if (delay < 100) {
            delay = 100;
        }
        this.timer.delay = delay;
        this.isGameover = false;
        this.timer.reset();
        this.timer.start();
        this.gemTimer.reset();
        this.gemTimer.start();
        this.dispatchEventWith(LogicEvent.UI_REFRESHTEXT);
    };
    Dungeon.prototype.addPlayer = function () {
        this.player = new Player();
        var index = Math.floor(Logic.SIZE / 2);
        this.player.pos.x = index;
        this.player.pos.y = index;
        var p = Logic.getInMapPos(this.player.pos);
        this.player.x = p.x;
        this.player.y = p.y;
        this.addChild(this.player);
    };
    Dungeon.prototype.addTimer = function () {
        this.timer = new egret.Timer(200 - this.level * 10);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
        this.gemTimer = new egret.Timer(5000);
        this.gemTimer.addEventListener(egret.TimerEvent.TIMER, this.addGem, this);
    };
    Dungeon.prototype.addGem = function () {
        var x = this.getRandomNum(0, Logic.SIZE - 1);
        var y = this.getRandomNum(0, Logic.SIZE - 1);
        var tile = this.map[x][y];
        if (tile.item && !tile.item.visible) {
            tile.item.setId(this.getRandomNum(1, 4));
            tile.item.show();
        }
    };
    // private breakTileFinish(evt: LogicEvent): void {
    // 	if (this.player.pos.x == evt.data.x && this.player.pos.y == evt.data.y) {
    // 		this.gameOver();
    // 	}
    // }
    Dungeon.prototype.breakTile = function () {
        var _this = this;
        if (this.randomArr.length < 1) {
            return;
        }
        //发送breaktile消息
        var index = this.getRandomNum(0, this.randomArr.length - 1);
        var p = this.randomArr[index];
        var tile = this.map[p.x][p.y];
        this.randomArr.splice(index, 1);
        tile.isLooping = true;
        tile.breakTile().then(function (posIndex) {
            if (_this.player.pos.x == posIndex.x && posIndex.y == posIndex.y) {
                _this.gameOver();
            }
        });
    };
    Dungeon.prototype.getRandomNum = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    };
    Dungeon.prototype.gameOver = function () {
        console.log('gameover');
        if (this.isGameover) {
            return;
        }
        //让角色原地走一步触发死亡,防止走路清空动画
        this.player.move(-1, this);
        // egret.setTimeout(() => { this.resetGame(1); }, this, 3000)
        this.dispatchEventWith(LogicEvent.GAMEOVER);
        this.isGameover = true;
    };
    return Dungeon;
}(egret.Stage));
__reflect(Dungeon.prototype, "Dungeon");
