var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Building = (function (_super) {
    __extends(Building, _super);
    function Building() {
        var _this = _super.call(this) || this;
        _this.isblock = false;
        return _this;
    }
    return Building;
}(egret.DisplayObjectContainer));
__reflect(Building.prototype, "Building");
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(type) {
        var _this = _super.call(this) || this;
        _this.type = ItemConstants.EMPTY;
        _this.canTaken = false;
        _this.type = type;
        _this.init();
        return _this;
    }
    Item.prototype.getType = function () {
        return this.type;
    };
    Item.prototype.getItem = function () {
        return this.item;
    };
    Item.prototype.taken = function () {
        var _this = this;
        if (!this.visible || !this.canTaken) {
            return false;
        }
        this.canTaken = false;
        egret.Tween.removeTweens(this.item);
        this.item.scaleX = 1;
        this.item.alpha = 1;
        egret.Tween.get(this.item)
            .to({ scaleX: 2, scaleY: 2, y: this.item.y - 128 }, 500)
            .to({ alpha: 0 }, 100).call(function () {
            _this.visible = false;
        });
        return true;
    };
    Item.prototype.show = function () {
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
    Item.prototype.hide = function () {
        this.canTaken = false;
        egret.Tween.removeTweens(this.item);
        this.item.scaleX = 1;
        this.visible = false;
    };
    return Item;
}(egret.DisplayObjectContainer));
__reflect(Item.prototype, "Item");
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
var Logic = (function (_super) {
    __extends(Logic, _super);
    function Logic(main) {
        var _this = _super.call(this) || this;
        _this.level = 1;
        _this.score = 0;
        _this.isGameover = false;
        _this.main = main;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Logic.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
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
        this.addEventListener(LogicEvent.DUNGEON_NEXTLEVEL, this.loadNextLevel, this);
        this.addEventListener(LogicEvent.GAMEOVER, this.gameOver, this);
        this.dungeon.addEventListener(LogicEvent.GET_GEM, this.getGem, this);
        this.dungeon.addEventListener(LogicEvent.DUNGEON_BREAKTILE, this.breakTileFinish, this);
        this.addEventListener(LogicEvent.DAMAGE_PLAYER, this.damagePlayer, this);
        this.inventoryBar = new InventoryBar();
        this.addChild(this.inventoryBar);
        this.inventoryBar.x = 50;
        this.inventoryBar.y = 800;
        this.inventoryBar.scaleX = 4;
        this.inventoryBar.scaleY = 4;
        this.inventoryBar.addEventListener(InventoryEvent.TABTAP, this.tapInventory, this);
        this.healthBar = new HealthBar();
        this.addChild(this.healthBar);
        this.healthBar.x = 50;
        this.healthBar.y = 30;
        this.healthBar.scaleX = 2;
        this.healthBar.scaleY = 2;
        this.addAstar();
        this.addPlayer();
        this.addMonster();
        this.addTimer();
        this.player.changeItemRes(RES.getRes(this.inventoryBar.CurrentStrRes));
    };
    Logic.prototype.addTimer = function () {
        this.monsterTimer = new egret.Timer(10000);
        this.monsterTimer.addEventListener(egret.TimerEvent.TIMER, this.monsterAction, this);
        this.monsterTimer.start();
    };
    Logic.prototype.monsterAction = function () {
        var _this = this;
        if (this.monster.isDying()) {
            return;
        }
        var endIndex = new egret.Point(this.player.pos.x, this.player.pos.y);
        if (Math.abs(this.player.pos.x - this.monster.posIndex.x) > 1 && Math.abs(this.player.pos.y - this.monster.posIndex.y) > 1) {
            endIndex.x = Logic.getRandomNum(0, 8);
            endIndex.y = Logic.getRandomNum(0, 8);
        }
        var targetPos = this.getNextStep(this.monster.posIndex, endIndex);
        var dir = 4;
        if (targetPos.y != this.monster.posIndex.y) {
            dir = targetPos.y - this.monster.posIndex.y < 0 ? 0 : 1;
        }
        if (targetPos.x != this.monster.posIndex.x) {
            dir = targetPos.x - this.monster.posIndex.x < 0 ? 2 : 3;
        }
        if (targetPos.x == this.player.pos.x && targetPos.y == this.player.pos.y) {
            this.monster.attack(dir, function () {
                if (targetPos.x == _this.player.pos.x && targetPos.y == _this.player.pos.y) {
                    _this.player.takeDamage(1);
                    _this.healthBar.refreshHealth(_this.player.currentHealth, _this.player.maxHealth);
                }
            });
        }
        else if (!this.dungeon.map[targetPos.x][targetPos.y].isBreakingNow) {
            this.monster.move(targetPos, this.dungeon);
        }
    };
    Logic.prototype.addAstar = function () {
        this.astarGrid = new AstarGrid(Logic.SIZE, Logic.SIZE);
    };
    Logic.prototype.getNextStep = function (startIndex, endIndex) {
        var p = new egret.Point(startIndex.x, startIndex.y);
        this.astarGrid.setStartNode(startIndex.x, startIndex.y);
        this.astarGrid.setEndNode(endIndex.x, endIndex.y);
        var aStar = new AstarMap();
        if (aStar.findPath(this.astarGrid)) {
            var path = aStar.path;
            if (path.length > 1) {
                p.x = path[1].x;
                p.y = path[1].y;
            }
        }
        return p;
    };
    Logic.prototype.addPlayer = function () {
        this.player = new Player();
        var index = Math.floor(Logic.SIZE / 2);
        this.player.pos.x = index;
        this.player.pos.y = index;
        var p = Logic.getInMapPos(this.player.pos);
        this.player.x = p.x;
        this.player.y = p.y;
        this.addChild(this.player);
    };
    Logic.prototype.addMonster = function () {
        this.monster = new Monster();
        var x = 7;
        var y = 4;
        this.monster.posIndex.x = x;
        this.monster.posIndex.y = y;
        var p = Logic.getInMapPos(this.monster.posIndex);
        this.monster.x = p.x;
        this.monster.y = p.y;
        this.addChild(this.monster);
    };
    Logic.getInMapPos = function (pos) {
        var x = Logic.mapX + pos.x * Tile.WIDTH;
        var y = Logic.mapY + pos.y * Tile.WIDTH;
        return new egret.Point(x, y);
    };
    Logic.prototype.breakTileFinish = function (evt) {
        if (this.player.pos.x == evt.data.x && this.player.pos.y == evt.data.y) {
            this.gameOver();
        }
        if (this.monster.posIndex.x == evt.data.x && this.monster.posIndex.y == evt.data.y) {
            this.monster.move(this.monster.posIndex, this.dungeon);
        }
    };
    Logic.prototype.refreshText = function (evt) {
        this.main.refreshScoreText("" + this.score);
        this.main.refreshSecondsText("Target:" + this.dungeon.level * Logic.SCORE_BASE + "        Lv." + this.dungeon.level);
    };
    Logic.prototype.damagePlayer = function (evt) {
        this.player.takeDamage(evt.data.damage);
    };
    Logic.prototype.tapPad = function (evt) {
        var _this = this;
        var pos = new egret.Point(this.player.pos.x, this.player.pos.y);
        switch (evt.dir) {
            case 0:
                if (pos.y - 1 >= 0) {
                    pos.y--;
                }
                break;
            case 1:
                if (pos.y + 1 < Logic.SIZE) {
                    pos.y++;
                }
                break;
            case 2:
                if (pos.x - 1 >= 0) {
                    pos.x--;
                }
                break;
            case 3:
                if (pos.x + 1 < Logic.SIZE) {
                    pos.x++;
                }
                break;
            case 4:
                break;
            default: break;
        }
        if (evt.dir == 4) {
            var tile = this.dungeon.map[pos.x][pos.y];
            if (tile.item && !tile.item.isAutoPicking()) {
                tile.item.taken();
                this.player.changeItemRes(tile.item.getItem().texture);
                this.inventoryBar.changeItem(this.inventoryBar.CurrentIndex, tile.item.getType());
            }
        }
        if (pos.x == this.monster.posIndex.x && pos.y == this.monster.posIndex.y && !this.monster.isDying()) {
            this.player.attack(evt.dir, function () {
                if (pos.x == _this.monster.posIndex.x && pos.y == _this.monster.posIndex.y) {
                    _this.monster.takeDamage(_this.player.attackNumber);
                }
            });
        }
        else {
            this.player.move(evt.dir, this.dungeon);
        }
    };
    Logic.prototype.loadNextLevel = function (evt) {
        var _this = this;
        this.level = evt.data.level;
        this.main.loadingNextDialog.show(this.level, function () {
            _this.isGameover = false;
            _this.player.resetPlayer();
            _this.monster.resetCharacter(Logic.getRandomNum(0, 8), Logic.getRandomNum(0, 8));
            _this.dungeon.resetGame(_this.level);
            _this.healthBar.refreshHealth(_this.player.currentHealth, _this.player.maxHealth);
            _this.monsterTimer.start();
        });
    };
    Logic.prototype.gameOver = function () {
        if (this.isGameover) {
            return;
        }
        this.isGameover = true;
        this.score = 0;
        //让角色原地走一步触发死亡,防止走路清空动画
        this.player.move(-1, this.dungeon);
        this.main.gameoverDialog.show(this.dungeon.level);
        this.monsterTimer.stop();
    };
    Logic.prototype.getGem = function (evt) {
        this.score += evt.data.score;
        if (this.score / Logic.SCORE_BASE >= this.dungeon.level) {
            this.score = Logic.SCORE_BASE * this.dungeon.level;
            this.dungeon.portal.openGate();
        }
        this.main.refreshScoreText("" + this.score);
    };
    Logic.prototype.tapInventory = function (evt) {
        var resStr = evt.resStr;
        this.player.changeItemRes(RES.getRes(resStr));
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
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        this.startAnimation(result);
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 4:
                        userInfo = _a.sent();
                        console.log(userInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var bg = new egret.Shape();
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        bg.graphics.beginFill(0x333333, 1);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        this.addChild(bg);
        var logic = new Logic(this);
        this.addChild(logic);
        this.addSecondsText();
        this.addScoreText();
        this.loadingNextDialog = new LoadingNextDialog();
        this.addChild(this.loadingNextDialog);
        this.gameoverDialog = new GameoverDialog();
        this.addChild(this.gameoverDialog);
    };
    Main.prototype.addSecondsText = function () {
        this.secondsText = new egret.TextField();
        this.addChild(this.secondsText);
        this.secondsText.alpha = 1;
        this.secondsText.textAlign = egret.HorizontalAlign.CENTER;
        this.secondsText.size = 30;
        this.secondsText.textColor = 0xffffff;
        this.secondsText.x = 50;
        this.secondsText.y = 60;
        this.secondsText.text = "Target:" + Logic.SCORE_BASE + "        Lv.1";
    };
    Main.prototype.addScoreText = function () {
        this.scoreText = new egret.TextField();
        this.addChild(this.scoreText);
        this.scoreText.alpha = 1;
        this.scoreText.textAlign = egret.HorizontalAlign.CENTER;
        this.scoreText.size = 40;
        this.scoreText.textColor = 0xffd700;
        this.scoreText.x = 50;
        this.scoreText.y = 100;
        this.scoreText.text = "0";
    };
    Main.prototype.refreshSecondsText = function (text) {
        this.secondsText.text = text;
    };
    Main.prototype.refreshScoreText = function (text) {
        this.scoreText.text = text;
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
var DebugPlatform = (function () {
    function DebugPlatform() {
    }
    DebugPlatform.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { nickName: "username" }];
            });
        });
    };
    DebugPlatform.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DebugPlatform;
}());
__reflect(DebugPlatform.prototype, "DebugPlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new DebugPlatform();
}
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        _this.tag = 'player';
        _this.walking = false;
        _this.isdead = false;
        _this.currentHealth = 3;
        _this.maxHealth = 3;
        _this.attackNumber = 1;
        _this.pos = new egret.Point();
        _this.init();
        return _this;
    }
    Player.prototype.init = function () {
        this.player = new egret.Bitmap(RES.getRes("player00" + Logic.getRandomNum(1, 3)));
        this.player.smoothing = false;
        this.playerShadow = new egret.Bitmap(RES.getRes("shadow"));
        this.playerShadow.smoothing = false;
        this.item = new egret.Bitmap();
        this.item.smoothing = false;
        this.player.anchorOffsetX = this.player.width / 2;
        this.player.anchorOffsetY = this.player.height;
        this.player.x = 0;
        this.player.y = 0;
        this.player.scaleX = 5;
        this.player.scaleY = 5;
        this.playerShadow.anchorOffsetX = this.playerShadow.width / 2;
        this.playerShadow.anchorOffsetY = this.playerShadow.height / 2;
        this.playerShadow.x = 0;
        this.playerShadow.y = 0;
        this.playerShadow.alpha = 0.3;
        this.playerShadow.scaleX = 2;
        this.playerShadow.scaleY = 2;
        this.addChild(this.player);
        this.addChild(this.playerShadow);
        this.addChild(this.item);
    };
    Player.prototype.changeItemRes = function (tex) {
        this.item.texture = tex;
        this.item.anchorOffsetX = this.item.width / 2;
        this.item.anchorOffsetY = this.item.height;
        this.item.x = -this.player.width * 5 / 2;
        this.item.y = -40;
    };
    Player.prototype.isWalking = function () {
        return this.walking;
    };
    Player.prototype.isDying = function () {
        return this.isdead;
    };
    Player.prototype.resetPlayer = function () {
        egret.Tween.removeTweens(this.player);
        egret.Tween.removeTweens(this);
        this.parent.setChildIndex(this, 100);
        this.player.scaleX = 5;
        this.player.scaleY = 5;
        this.player.visible = true;
        this.player.alpha = 1;
        this.player.x = 0;
        this.player.y = 0;
        this.item.alpha = 1;
        this.item.x = -this.player.width / 2;
        this.item.y = -50;
        this.player.rotation = 0;
        this.playerShadow.visible = true;
        this.isdead = false;
        this.walking = false;
        if (this.currentHealth < 1) {
            this.currentHealth = this.maxHealth;
        }
        var index = Math.floor(Logic.SIZE / 2);
        this.pos.x = index;
        this.pos.y = index;
        var p = Logic.getInMapPos(this.pos);
        this.x = p.x;
        this.y = p.y;
    };
    Player.prototype.die = function (isFall) {
        var _this = this;
        if (this.isdead) {
            return;
        }
        this.isdead = true;
        this.playerShadow.visible = false;
        if (isFall) {
            egret.Tween.get(this.player).to({ y: 32, scaleX: 2.5, scaleY: 2.5 }, 200).call(function () {
                _this.parent.setChildIndex(_this, 0);
            }).to({ scaleX: 1, scaleY: 1, y: 100 }, 100).call(function () {
                _this.player.alpha = 0;
                _this.player.texture = RES.getRes("player00" + Logic.getRandomNum(1, 3));
            });
        }
        else {
            egret.Tween.get(this.item).to({ rotation: 90, y: -100 }, 100).to({ alpha: 0 }, 200);
            egret.Tween.get(this.player).to({ rotation: 90 }, 100).to({ rotation: 70 }, 50).to({ rotation: 90 }, 100).to({ alpha: 0 }, 100).call(function () {
                _this.player.alpha = 0;
                _this.player.texture = RES.getRes("player00" + Logic.getRandomNum(1, 3));
            });
        }
    };
    Player.prototype.walk = function (px, py, dir, reachable) {
        var _this = this;
        if (this.walking) {
            console.log("cant");
            return;
        }
        this.walking = true;
        var offsetY = 10;
        var ro = 10;
        if (dir == 1 || dir == 3) {
            offsetY = -offsetY;
            ro = -ro;
        }
        egret.Tween.get(this.player, { loop: true })
            .to({ rotation: ro, y: this.player.y + offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25)
            .to({ rotation: -ro, y: this.player.y - offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25);
        egret.Tween.get(this, { onChange: function () { } }).to({ x: px, y: py }, 200).call(function () {
            egret.Tween.removeTweens(_this.player);
            _this.player.rotation = 0;
            _this.player.y = 0;
            _this.walking = false;
            if (!reachable) {
                _this.die(true);
            }
        });
    };
    Player.prototype.takeDamage = function (damage) {
        this.currentHealth -= damage;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        if (this.currentHealth < 1) {
            this.die(false);
            this.parent.dispatchEventWith(LogicEvent.GAMEOVER);
        }
    };
    Player.prototype.attack = function (dir, finish) {
        var x = 0;
        var y = 0;
        switch (dir) {
            case 0:
                y -= 40;
                break;
            case 1:
                y += 40;
                break;
            case 2:
                x -= 40;
                break;
            case 3:
                x += 40;
                break;
            case 4: break;
        }
        egret.Tween.get(this.player).to({ x: x, y: y }, 100).call(function () {
            if (finish) {
                finish();
            }
        }).to({ x: 0, y: 0 }, 100);
    };
    //01234 top bottom left right middle
    Player.prototype.move = function (dir, dungeon) {
        if (this.isWalking() || this.isDying()) {
            return;
        }
        console.log('walking');
        switch (dir) {
            case 0:
                if (this.pos.y - 1 >= 0) {
                    this.pos.y--;
                }
                break;
            case 1:
                if (this.pos.y + 1 < Logic.SIZE) {
                    this.pos.y++;
                }
                break;
            case 2:
                if (this.pos.x - 1 >= 0) {
                    this.pos.x--;
                }
                break;
            case 3:
                if (this.pos.x + 1 < Logic.SIZE) {
                    this.pos.x++;
                }
                break;
            case 4:
                break;
            default: break;
        }
        var tile = dungeon.map[this.pos.x][this.pos.y];
        var p = Logic.getInMapPos(this.pos);
        this.walk(p.x, p.y, dir, tile.floor.visible);
        var index = Math.floor(Logic.SIZE / 2);
        if (!tile.floor.visible) {
            this.parent.dispatchEventWith(LogicEvent.GAMEOVER);
        }
        if (tile.floor.visible) {
            egret.setTimeout(function () {
                tile.breakTile();
            }, this, 1000);
        }
        if (tile.item && (tile.item.isAutoPicking())) {
            tile.item.taken();
        }
        if (this.pos.x == dungeon.portal.posIndex.x
            && this.pos.y == dungeon.portal.posIndex.y
            && dungeon.portal.isGateOpen()) {
            this.parent.dispatchEventWith(LogicEvent.DUNGEON_NEXTLEVEL, false, { level: ++dungeon.level });
        }
    };
    return Player;
}(egret.DisplayObjectContainer));
__reflect(Player.prototype, "Player");
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(x, y) {
        var _this = _super.call(this) || this;
        _this.isBreakingNow = false;
        _this.posIndex = new egret.Point(x, y);
        _this.init();
        return _this;
    }
    Tile.prototype.init = function () {
        var t = new egret.Bitmap(RES.getRes("tile"));
        t.smoothing = false;
        this.width = Tile.WIDTH;
        this.height = Tile.WIDTH;
        t.anchorOffsetX = t.width / 2;
        t.anchorOffsetY = t.height / 2;
        t.scaleX = 4;
        t.scaleY = 4;
        this.floor = t;
        this.addChild(this.floor);
    };
    Tile.prototype.addItem = function (item) {
        this.item = item;
        this.addChildAt(this.item, 1000);
        return this;
    };
    Tile.prototype.addBuilding = function (building) {
        this.building = building;
        this.addChild(this.building);
        return this;
    };
    Tile.prototype.showTile = function () {
        var _this = this;
        this.floor.alpha = 0;
        this.floor.scaleX = 4;
        this.floor.scaleY = 4;
        this.floor.x = 0;
        this.floor.y = 0;
        this.floor.visible = true;
        egret.Tween.get(this.floor).to({ alpha: 1 }, 200).wait(1000).call(function () {
            _this.isBreakingNow = false;
        });
    };
    Tile.prototype.breakTile = function () {
        var _this = this;
        //当前tile没有建筑可见，开始塌陷
        if (this.building && this.building.visible || this.isBreakingNow) {
            return;
        }
        this.isBreakingNow = true;
        var y = this.floor.y;
        egret.Tween.get(this.floor, { loop: true })
            .to({ y: y + 5 }, 25)
            .to({ y: y }, 25)
            .to({ y: y - 5 }, 25)
            .to({ y: y }, 25);
        egret.Tween.get(this.floor).wait(2000).call(function () {
            egret.Tween.removeTweens(_this.floor);
            egret.Tween.get(_this.floor).to({ scaleX: 3, scaleY: 3 }, 700).to({ alpha: 0 }, 300).call(function () {
                _this.floor.visible = false;
                _this.parent.dispatchEventWith(LogicEvent.DUNGEON_BREAKTILE, false, _this.posIndex);
            }).wait(1000).call(function () {
                _this.showTile();
            });
        });
    };
    Tile.WIDTH = 64;
    Tile.HEIGHT = 64;
    return Tile;
}(egret.DisplayObjectContainer));
__reflect(Tile.prototype, "Tile");
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
            this_1.dirs[i].smoothing = false;
            this_1.dirs[i].touchEnabled = true;
            this_1.dirs[i].alpha = 0.5;
            this_1.dirs[i].anchorOffsetX = this_1.dirs[i].width / 2;
            this_1.dirs[i].anchorOffsetY = this_1.dirs[i].height / 2;
            this_1.dirs[i].scaleX = 8;
            this_1.dirs[i].scaleY = 8;
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
        this.dirs[2].x = cx - 128 - 32;
        this.dirs[2].y = cy + 128;
        this.dirs[3].x = cx + 128 + 32;
        this.dirs[3].y = cy + 128;
        this.centerButton = new egret.Bitmap(RES.getRes("controllerbuttonnormal"));
        this.centerButton.smoothing = false;
        this.centerButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.tapPad(4); }, this);
        this.centerButton.touchEnabled = true;
        this.centerButton.alpha = 0.5;
        this.centerButton.anchorOffsetX = this.centerButton.width / 2;
        this.centerButton.anchorOffsetY = this.centerButton.height / 2;
        this.centerButton.scaleX = 8;
        this.centerButton.scaleY = 8;
        this.centerButton.x = cx;
        this.centerButton.y = cy + 128;
        this.addChild(this.centerButton);
    };
    ControllerPad.prototype.tapPad = function (dir) {
        var _this = this;
        var padtapEvent = new PadtapEvent(PadtapEvent.PADTAP);
        padtapEvent.dir = dir;
        this.dispatchEvent(padtapEvent);
        if (dir == 4) {
            egret.Tween.get(this.centerButton).call(function () {
                _this.centerButton.texture = RES.getRes("controllerbuttonpress");
            }).wait(100).call(function () {
                _this.centerButton.texture = RES.getRes("controllerbuttonnormal");
            });
        }
    };
    return ControllerPad;
}(egret.DisplayObjectContainer));
__reflect(ControllerPad.prototype, "ControllerPad");
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
        this.width = 16;
        this.height = 16;
        this.anchorOffsetX = 8;
        this.anchorOffsetY = 8;
        this.gate = new egret.Bitmap(RES.getRes("portal"));
        this.gate.smoothing = false;
        this.light = new egret.Bitmap(RES.getRes("portallight"));
        this.light.smoothing = false;
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
            .to({ alpha: 1, scaleX: 4, scaleY: 4 }, 500).call(function () {
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
var InventoryEvent = (function (_super) {
    __extends(InventoryEvent, _super);
    function InventoryEvent(type, bubbles, cancelable, data) {
        var _this = _super.call(this, type, bubbles, cancelable, data) || this;
        _this.index = 0;
        _this.resStr = '';
        return _this;
    }
    InventoryEvent.TABTAP = "TABTAP";
    return InventoryEvent;
}(egret.Event));
__reflect(InventoryEvent.prototype, "InventoryEvent");
var LogicEvent = (function (_super) {
    __extends(LogicEvent, _super);
    function LogicEvent(type, bubbles, cancelable, data) {
        return _super.call(this, type, bubbles, cancelable, data) || this;
    }
    LogicEvent.LOGIC = "LOGIC";
    LogicEvent.GAMEOVER = "LOGIC_GAMEOVER";
    LogicEvent.DUNGEON_NEXTLEVEL = "DUNGEON_NEXTLEVEL";
    LogicEvent.DUNGEON_BREAKTILE = "DUNGEON_BREAKTILE";
    LogicEvent.UI_REFRESHTEXT = "UI_REFRESHTEXT";
    LogicEvent.GET_GEM = "GET_GEM";
    LogicEvent.PLAYER_MOVE = "PLAYER_MOVE";
    LogicEvent.GET_ITEM = "GET_ITEM";
    LogicEvent.DAMAGE_PLAYER = "DAMAGE_PLAYER";
    return LogicEvent;
}(egret.Event));
__reflect(LogicEvent.prototype, "LogicEvent");
var Dungeon = (function (_super) {
    __extends(Dungeon, _super);
    function Dungeon() {
        var _this = _super.call(this) || this;
        _this.SUCCESS_NUMBER = 15;
        _this.map = new Array();
        // public player: Player;
        _this.dirs = new Array(4);
        _this.level = 1;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Dungeon.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        this.drawBg();
        this.drawMap();
        // this.addPlayer();
        this.addTimer();
        this.resetGame(this.level);
    };
    Dungeon.prototype.drawBg = function () {
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x000000, 0.90);
        bg.graphics.drawRect(Logic.mapX - Tile.WIDTH / 2, Logic.mapY - Tile.HEIGHT / 2, Tile.WIDTH * Logic.SIZE, Tile.WIDTH * Logic.SIZE);
        bg.graphics.endFill();
        this.addChild(bg);
        var shadow = new egret.Shape();
        shadow.x = Logic.mapX - Tile.WIDTH / 2;
        shadow.y = Logic.mapY - Tile.WIDTH / 2;
        shadow.width = Tile.WIDTH * Logic.SIZE;
        shadow.height = Tile.WIDTH * Logic.SIZE;
        shadow.graphics.beginFill(0x000000, 1);
        shadow.graphics.drawRect(0, 0, shadow.width, shadow.height);
        shadow.graphics.endFill();
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
                t.addItem(new Gem("gem0" + this.getRandomNum(1, 4)));
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
                t.showTile();
                t.item.hide();
                if (!(index == i && index == j)) {
                    if (this.getRandomNum(0, 10) > 5) {
                        t.item.changeRes("gem0" + this.getRandomNum(1, 4));
                        t.item.show();
                    }
                }
                this.randomArr[i * Logic.SIZE + j] = new egret.Point(i, j);
            }
        }
        this.portal.closeGate();
        // this.player.resetPlayer();
        // this.player.pos.x = index;
        // this.player.pos.y = index;
        // let p = Logic.getInMapPos(this.player.pos);
        // this.player.x = p.x;
        // this.player.y = p.y;
        var delay = 200 - level * 10;
        if (delay < 100) {
            delay = 100;
        }
        // this.timer.delay = delay;
        // this.timer.reset();
        // this.timer.start();
        this.gemTimer.reset();
        this.gemTimer.start();
        this.dispatchEventWith(LogicEvent.UI_REFRESHTEXT);
    };
    // private addPlayer(): void {
    // 	this.player = new Player();
    // 	let index = Math.floor(Logic.SIZE / 2)
    // 	this.player.pos.x = index;
    // 	this.player.pos.y = index;
    // 	let p = Logic.getInMapPos(this.player.pos);
    // 	this.player.x = p.x;
    // 	this.player.y = p.y;
    // 	this.addChild(this.player);
    // }
    Dungeon.prototype.addTimer = function () {
        // this.timer = new egret.Timer(200 - this.level * 10);
        // this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
        this.gemTimer = new egret.Timer(5000);
        this.gemTimer.addEventListener(egret.TimerEvent.TIMER, this.addGem, this);
    };
    Dungeon.prototype.addGem = function () {
        var x = this.getRandomNum(0, Logic.SIZE - 1);
        var y = this.getRandomNum(0, Logic.SIZE - 1);
        var tile = this.map[x][y];
        if (tile.item && !tile.item.visible) {
            tile.item.changeRes("gem0" + this.getRandomNum(1, 4));
            tile.item.show();
        }
    };
    Dungeon.prototype.breakTile = function () {
        if (this.randomArr.length < 1) {
            return;
        }
        //发送breaktile消息
        var index = this.getRandomNum(0, this.randomArr.length - 1);
        var p = this.randomArr[index];
        var tile = this.map[p.x][p.y];
        this.randomArr.splice(index, 1);
        tile.breakTile();
    };
    Dungeon.prototype.getRandomNum = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    };
    return Dungeon;
}(egret.Stage));
__reflect(Dungeon.prototype, "Dungeon");
var Capsule = (function (_super) {
    __extends(Capsule, _super);
    function Capsule(type) {
        return _super.call(this, type) || this;
    }
    Capsule.prototype.init = function () {
        this.width = 64;
        this.height = 64;
        this.anchorOffsetX = 32;
        this.anchorOffsetY = 32;
        this.item = new egret.Bitmap(RES.getRes(this.type));
        this.item.smoothing = false;
        this.shadow = new egret.Bitmap(RES.getRes("shadow"));
        this.shadow.smoothing = false;
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
    Capsule.prototype.changeRes = function (type) {
        this.type = type;
        this.item.texture = RES.getRes(this.type);
    };
    Capsule.prototype.getType = function () {
        return this.type;
    };
    Capsule.prototype.isAutoPicking = function () {
        return false;
    };
    Capsule.prototype.taken = function () {
        if (_super.prototype.taken.call(this)) {
            //tile所在的dungeon发消息
            this.parent.parent.dispatchEventWith(LogicEvent.GET_ITEM, false, { itemtype: this.type });
            return true;
        }
        return false;
    };
    return Capsule;
}(Item));
__reflect(Capsule.prototype, "Capsule");
var Gem = (function (_super) {
    __extends(Gem, _super);
    function Gem(type) {
        return _super.call(this, type) || this;
    }
    Gem.prototype.init = function () {
        this.width = 64;
        this.height = 64;
        this.anchorOffsetX = 32;
        this.anchorOffsetY = 32;
        this.item = new egret.Bitmap(RES.getRes(this.type));
        this.item.smoothing = false;
        this.shadow = new egret.Bitmap(RES.getRes("shadow"));
        this.shadow.smoothing = false;
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
    Gem.prototype.changeRes = function (type) {
        this.type = type;
        this.item.texture = RES.getRes(this.type);
    };
    Gem.prototype.isAutoPicking = function () {
        return true;
    };
    Gem.prototype.taken = function () {
        if (_super.prototype.taken.call(this)) {
            //tile所在的dungeon发消息
            this.parent.parent.dispatchEventWith(LogicEvent.GET_GEM, false, { score: 1 * 10 });
            return true;
        }
        return false;
    };
    return Gem;
}(Item));
__reflect(Gem.prototype, "Gem");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
var ItemConstants = (function () {
    function ItemConstants() {
    }
    ItemConstants.EMPTY = 'empty';
    ItemConstants.CAPSULE_RED = 'capsule001';
    ItemConstants.CAPSULE_BLUE = 'capsule002';
    return ItemConstants;
}());
__reflect(ItemConstants.prototype, "ItemConstants");
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        var _this = _super.call(this) || this;
        _this.tag = 'monster';
        _this.walking = false;
        _this.isdead = false;
        _this.currentHealth = 2;
        _this.maxHealth = 2;
        _this.posIndex = new egret.Point();
        _this.init();
        return _this;
    }
    Monster.prototype.init = function () {
        this.character = new egret.Bitmap(RES.getRes("monster00" + Logic.getRandomNum(1, 3)));
        this.character.smoothing = false;
        this.characterShadow = new egret.Bitmap(RES.getRes("shadow"));
        this.characterShadow.smoothing = false;
        var index = 0;
        this.character.anchorOffsetX = this.character.width / 2;
        this.character.anchorOffsetY = this.character.height;
        this.character.x = 0;
        this.character.y = 0;
        this.character.scaleX = 5;
        this.character.scaleY = 5;
        this.characterShadow.anchorOffsetX = this.characterShadow.width / 2;
        this.characterShadow.anchorOffsetY = this.characterShadow.height / 2;
        this.characterShadow.x = 0;
        this.characterShadow.y = 0;
        this.characterShadow.alpha = 0.3;
        this.characterShadow.scaleX = 2;
        this.characterShadow.scaleY = 2;
        this.addChild(this.character);
        this.addChild(this.characterShadow);
        this.healthBar = new HealthBar();
        this.addChild(this.healthBar);
        this.healthBar.x = 0;
        this.healthBar.y = -103;
    };
    Monster.prototype.attack = function (dir, finish) {
        var x = 0;
        var y = 0;
        switch (dir) {
            case 0:
                y -= 40;
                break;
            case 1:
                y += 40;
                break;
            case 2:
                x -= 40;
                break;
            case 3:
                x += 40;
                break;
            case 4: break;
        }
        egret.Tween.get(this.character).to({ x: x, y: y }, 100).call(function () {
            if (finish) {
                finish();
            }
        }).to({ x: 0, y: 0 }, 100);
    };
    Monster.prototype.isWalking = function () {
        return this.walking;
    };
    Monster.prototype.isDying = function () {
        return this.isdead;
    };
    Monster.prototype.resetCharacter = function (indexX, indexY) {
        egret.Tween.removeTweens(this.character);
        egret.Tween.removeTweens(this);
        this.parent.setChildIndex(this, 100);
        this.character.scaleX = 5;
        this.character.scaleY = 5;
        this.character.visible = true;
        this.character.alpha = 1;
        this.character.x = 0;
        this.character.y = 0;
        this.character.rotation = 0;
        this.characterShadow.visible = true;
        this.isdead = false;
        this.walking = false;
        this.currentHealth = 2;
        this.maxHealth = 2;
        this.healthBar.visible = true;
        this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
        this.posIndex.x = indexX;
        this.posIndex.y = indexY;
        var p = Logic.getInMapPos(this.posIndex);
        this.x = p.x;
        this.y = p.y;
    };
    Monster.prototype.die = function (isFall) {
        var _this = this;
        if (this.isdead) {
            return;
        }
        this.isdead = true;
        this.characterShadow.visible = false;
        if (isFall) {
            egret.Tween.get(this.character).to({ y: 32, scaleX: 2.5, scaleY: 2.5 }, 200).call(function () {
                _this.parent.setChildIndex(_this, 0);
            }).to({ scaleX: 1, scaleY: 1, y: 100 }, 100).call(function () {
                _this.character.alpha = 0;
                _this.character.texture = RES.getRes("monster00" + Logic.getRandomNum(1, 3));
            });
        }
        else {
            egret.Tween.get(this.character).to({ rotation: 90 }, 100).to({ rotation: 70 }, 50).to({ rotation: 90 }, 100).to({ alpha: 0 }, 100).call(function () {
                _this.character.alpha = 0;
                _this.healthBar.visible = false;
                _this.character.texture = RES.getRes("monster00" + Logic.getRandomNum(1, 3));
            });
        }
    };
    Monster.prototype.walk = function (px, py, reachable) {
        var _this = this;
        if (this.walking) {
            console.log("cant");
            return;
        }
        this.walking = true;
        var offsetY = 10;
        var ro = 10;
        egret.Tween.get(this.character, { loop: true })
            .to({ rotation: ro, y: this.character.y + offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25)
            .to({ rotation: -ro, y: this.character.y - offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25);
        egret.Tween.get(this, { onChange: function () { } }).to({
            x: px, y: py
        }, 200).call(function () {
            egret.Tween.removeTweens(_this.character);
            _this.character.rotation = 0;
            _this.character.y = 0;
            _this.walking = false;
            if (!reachable) {
                _this.die(true);
            }
        });
    };
    Monster.prototype.takeDamage = function (damage) {
        this.currentHealth -= damage;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        if (this.currentHealth < 1) {
            this.die(false);
        }
        this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
    };
    //01234 top bottom left right middle
    Monster.prototype.move = function (target, dungeon) {
        if (this.isWalking() || this.isDying()) {
            return;
        }
        var tile = dungeon.map[target.x][target.y];
        if (tile.building && tile.building.visible && tile.building.isblock) {
            return;
        }
        if (tile.floor.visible)
            this.posIndex = target;
        var p = Logic.getInMapPos(target);
        this.walk(p.x, p.y, tile.floor.visible);
        if (!tile.floor.visible) {
            this.move(this.posIndex, dungeon);
        }
    };
    return Monster;
}(egret.DisplayObjectContainer));
__reflect(Monster.prototype, "Monster");
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
var HealthBar = (function (_super) {
    __extends(HealthBar, _super);
    function HealthBar() {
        var _this = _super.call(this) || this;
        _this.currentHealth = 3;
        _this.maxHealth = 3;
        _this.hearts = new Array();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    HealthBar.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.refreshHealth(this.currentHealth, this.maxHealth);
    };
    HealthBar.prototype.refreshHealth = function (currentHealth, maxHealth) {
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
        this.removeChildren();
        this.hearts = new Array();
        for (var i = 0; i < this.maxHealth; i++) {
            var heart = new egret.Bitmap(RES.getRes("heart"));
            heart.smoothing = false;
            heart.anchorOffsetX = heart.width / 2;
            heart.anchorOffsetY = heart.height / 2;
            heart.x = heart.width * i;
            if (i >= this.currentHealth) {
                heart.texture = RES.getRes("heartempty");
            }
            this.hearts.push(heart);
            this.addChild(heart);
        }
    };
    return HealthBar;
}(egret.DisplayObjectContainer));
__reflect(HealthBar.prototype, "HealthBar");
var InventoryBar = (function (_super) {
    __extends(InventoryBar, _super);
    function InventoryBar() {
        var _this = _super.call(this) || this;
        _this.SIZE = 4;
        _this.items = new Array();
        _this.currentIndex = 0;
        _this.itemStrs = new Array();
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    InventoryBar.prototype.onAddToStage = function () {
        var _this = this;
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var _loop_2 = function (i) {
            var tab = new egret.Bitmap(RES.getRes("tabbackground"));
            tab.smoothing = false;
            tab.anchorOffsetX = tab.width / 2;
            tab.anchorOffsetY = tab.height / 2;
            tab.y = tab.height * i + 10;
            tab.touchEnabled = true;
            tab.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.tapTab(i); }, this_2);
            this_2.addChild(tab);
        };
        var this_2 = this;
        for (var i = 0; i < this.SIZE; i++) {
            _loop_2(i);
        }
        for (var i = 0; i < this.SIZE; i++) {
            var item = new egret.Bitmap(RES.getRes("tabbackground"));
            item.smoothing = false;
            item.anchorOffsetX = item.width / 2;
            item.anchorOffsetY = item.height / 2;
            item.y = item.height * i + 10;
            this.items.push(item);
            this.addChild(item);
        }
        this.tabselect = new egret.Bitmap(RES.getRes("tabselect"));
        this.tabselect.smoothing = false;
        this.tabselect.anchorOffsetX = this.tabselect.width / 2;
        this.tabselect.anchorOffsetY = this.tabselect.height / 2;
        this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
        this.addChild(this.tabselect);
        this.itemStrs = [ItemConstants.CAPSULE_BLUE, ItemConstants.CAPSULE_RED, ItemConstants.CAPSULE_BLUE, ItemConstants.EMPTY];
        for (var i = 0; i < this.itemStrs.length; i++) {
            this.items[i].texture = RES.getRes(this.itemStrs[i]);
            this.items[i].scaleX = 0.25;
            this.items[i].scaleY = 0.25;
        }
    };
    InventoryBar.prototype.changeItem = function (index, resStr) {
        if (!resStr) {
            resStr = "ItemConstants.EMPTY";
        }
        if (!index || index < 0 || index >= this.SIZE) {
            return;
        }
        this.itemStrs[index] = resStr;
        this.items[index].texture = RES.getRes(resStr);
        this.items[index].scaleX = 0.25;
        this.items[index].scaleY = 0.25;
    };
    InventoryBar.prototype.tapTab = function (index) {
        this.currentIndex = index;
        this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
        var inventoryEvent = new InventoryEvent(InventoryEvent.TABTAP);
        inventoryEvent.index = index;
        inventoryEvent.resStr = this.itemStrs[index];
        this.dispatchEvent(inventoryEvent);
    };
    Object.defineProperty(InventoryBar.prototype, "CurrentStrRes", {
        get: function () {
            return this.itemStrs[this.currentIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InventoryBar.prototype, "CurrentIndex", {
        get: function () {
            return this.currentIndex;
        },
        enumerable: true,
        configurable: true
    });
    return InventoryBar;
}(egret.DisplayObjectContainer));
__reflect(InventoryBar.prototype, "InventoryBar");
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
var AstarGrid = (function () {
    function AstarGrid(numCols, numRows) {
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = [];
        for (var i = 0; i < numCols; i++) {
            this._nodes[i] = [];
            for (var j = 0; j < numRows; j++) {
                this._nodes[i][j] = new AstarNode(i, j);
                this.setWalkable(i, j, true);
            }
        }
    }
    AstarGrid.prototype.getNode = function (x, y) {
        return this._nodes[x][y];
    };
    AstarGrid.prototype.setEndNode = function (x, y) {
        this._endNode = this._nodes[x][y];
    };
    AstarGrid.prototype.setStartNode = function (x, y) {
        this._startNode = this._nodes[x][y];
    };
    AstarGrid.prototype.setWalkable = function (x, y, value) {
        this._nodes[x][y].walkable = value;
    };
    Object.defineProperty(AstarGrid.prototype, "endNode", {
        get: function () {
            return this._endNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AstarGrid.prototype, "numCols", {
        get: function () {
            return this._numCols;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AstarGrid.prototype, "numRows", {
        get: function () {
            return this._numRows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AstarGrid.prototype, "startNode", {
        get: function () {
            return this._startNode;
        },
        enumerable: true,
        configurable: true
    });
    return AstarGrid;
}());
__reflect(AstarGrid.prototype, "AstarGrid");
var AstarMap = (function () {
    function AstarMap() {
        this._straightCost = 1.0; //上下左右走的代价
        this._diagCost = Math.SQRT2; //斜着走的代价 
        //this._heuristic = this.manhattan;  
        //this._heuristic = this.euclidian;
        this._heuristic = this.diagonal;
    }
    //寻路
    AstarMap.prototype.findPath = function (grid) {
        this._grid = grid;
        this._open = [];
        this._closed = [];
        this._startNode = this._grid.startNode;
        this._endNode = this._grid.endNode;
        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;
        return this.search();
    };
    //查找路径
    AstarMap.prototype.search = function () {
        var node = this._startNode;
        while (node != this._endNode) {
            var startX = Math.max(0, node.x - 1);
            var endX = Math.min(this._grid.numCols - 1, node.x + 1);
            var startY = Math.max(0, node.y - 1);
            var endY = Math.min(this._grid.numRows - 1, node.y + 1);
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    //不让斜着走
                    if (i != node.x && j != node.y) {
                        continue;
                    }
                    var test = this._grid.getNode(i, j);
                    if (test == node ||
                        !test.walkable ||
                        !this._grid.getNode(node.x, test.y).walkable ||
                        !this._grid.getNode(test.x, node.y).walkable) {
                        continue;
                    }
                    var cost = this._straightCost;
                    if (!((node.x == test.x) || (node.y == test.y))) {
                        cost = this._diagCost;
                    }
                    var g = node.g + cost * test.costMultiplier;
                    var h = this._heuristic(test);
                    var f = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        this._open.push(test);
                    }
                }
            }
            for (var o = 0; o < this._open.length; o++) {
            }
            this._closed.push(node);
            if (this._open.length == 0) {
                console.log("AStar >> no path found");
                return false;
            }
            var openLen = this._open.length;
            for (var m = 0; m < openLen; m++) {
                for (var n = m + 1; n < openLen; n++) {
                    if (this._open[m].f > this._open[n].f) {
                        var temp = this._open[m];
                        this._open[m] = this._open[n];
                        this._open[n] = temp;
                    }
                }
            }
            node = this._open.shift();
        }
        this.buildPath();
        return true;
    };
    //获取路径
    AstarMap.prototype.buildPath = function () {
        this._path = new Array();
        var node = this._endNode;
        this._path.push(node);
        while (node != this._startNode) {
            node = node.parent;
            this._path.unshift(node);
        }
    };
    Object.defineProperty(AstarMap.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    //是否待检查
    AstarMap.prototype.isOpen = function (node) {
        for (var i = 0; i < this._open.length; i++) {
            if (this._open[i] == node) {
                return true;
            }
        }
        return false;
    };
    //是否已检查
    AstarMap.prototype.isClosed = function (node) {
        for (var i = 0; i < this._closed.length; i++) {
            if (this._closed[i] == node) {
                return true;
            }
        }
        return false;
    };
    //曼哈顿算法
    AstarMap.prototype.manhattan = function (node) {
        return Math.abs(node.x - this._endNode.x) * this._straightCost + Math.abs(node.y + this._endNode.y) * this._straightCost;
    };
    AstarMap.prototype.euclidian = function (node) {
        var dx = node.x - this._endNode.x;
        var dy = node.y - this._endNode.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    };
    AstarMap.prototype.diagonal = function (node) {
        var dx = Math.abs(node.x - this._endNode.x);
        var dy = Math.abs(node.y - this._endNode.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    };
    Object.defineProperty(AstarMap.prototype, "visited", {
        get: function () {
            return this._closed.concat(this._open);
        },
        enumerable: true,
        configurable: true
    });
    return AstarMap;
}());
__reflect(AstarMap.prototype, "AstarMap");
var AstarNode = (function () {
    function AstarNode(x, y) {
        this.walkable = true;
        this.costMultiplier = 1.0;
        this.x = x;
        this.y = y;
    }
    return AstarNode;
}());
__reflect(AstarNode.prototype, "AstarNode");
;window.Main = Main;