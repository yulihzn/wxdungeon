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
var Dungeon = (function (_super) {
    __extends(Dungeon, _super);
    function Dungeon() {
        var _this = _super.call(this) || this;
        _this.SIZE = 9;
        _this.map = new Array();
        _this.playerPos = new egret.Point();
        _this.dirs = new Array(4);
        _this.secondsCount = 0;
        _this.successNumber = 50;
        _this.level = 1;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Dungeon.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.drawMap();
        this.addPlayer();
        this.addController();
        this.addSecondsText();
        this.addTimer();
    };
    Dungeon.prototype.drawMap = function () {
        this.randomArr = new Array();
        this.map = new Array();
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        var tile = new egret.Bitmap(RES.getRes("tile_png"));
        this.originX = stageW / 2 - Math.floor(this.SIZE / 2) * tile.width;
        this.originY = 200;
        for (var i = 0; i < this.SIZE; i++) {
            this.map[i] = new Array(i);
            for (var j = 0; j < this.SIZE; j++) {
                var t = new egret.Bitmap(RES.getRes("tile_png"));
                t.anchorOffsetX = t.width / 2;
                t.anchorOffsetY = t.height / 2;
                t.scaleX = 1;
                t.scaleY = 1;
                t.x = this.originX + i * t.width;
                t.y = this.originY + j * t.height;
                this.map[i][j] = t;
                this.addChild(this.map[i][j]);
                this.randomArr[i * this.SIZE + j] = new egret.Point(i, j);
            }
        }
    };
    Dungeon.prototype.resetGame = function (level) {
        this.level = level;
        this.successNumber -= 2;
        if (this.successNumber < 1) {
            this.successNumber = 1;
        }
        for (var i = 0; i < this.SIZE; i++) {
            for (var j = 0; j < this.SIZE; j++) {
                var t = this.map[i][j];
                t.scaleX = 1;
                t.scaleY = 1;
                t.alpha = 1;
                t.visible = true;
                t.x = this.originX + i * t.width;
                t.y = this.originY + j * t.height;
                egret.Tween.removeTweens(t);
                this.randomArr[i * this.SIZE + j] = new egret.Point(i, j);
            }
        }
        var index = Math.floor(this.SIZE / 2);
        this.player.resetPlayer();
        this.playerPos.x = index;
        this.playerPos.y = index;
        this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
        this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;
        this.secondsText.text = 'Target:' + this.successNumber + '    LV.:' + this.level;
        this.timer.delay = 500 - level * 10;
        this.timer.reset();
        this.timer.start();
        // this.secondsCounter.reset();
        this.secondsCount = 0;
        // this.secondsCounter.start();
    };
    Dungeon.prototype.addPlayer = function () {
        this.player = new Player();
        var index = Math.floor(this.SIZE / 2);
        this.playerPos.x = index;
        this.playerPos.y = index;
        this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
        this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;
        this.addChild(this.player);
    };
    Dungeon.prototype.addController = function () {
        var _this = this;
        //0:top,1:bottom,2:left,3:right
        var top = new egret.Bitmap(RES.getRes("controller_png"));
        var bottom = new egret.Bitmap(RES.getRes("controller_png"));
        var left = new egret.Bitmap(RES.getRes("controller_png"));
        var right = new egret.Bitmap(RES.getRes("controller_png"));
        var _loop_1 = function (i) {
            this_1.dirs[i] = new egret.Bitmap(RES.getRes("controller_png"));
            this_1.dirs[i].touchEnabled = true;
            this_1.dirs[i].alpha = 0.5;
            this_1.dirs[i].anchorOffsetX = this_1.dirs[i].width / 2;
            this_1.dirs[i].anchorOffsetY = this_1.dirs[i].height / 2;
            this_1.dirs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.movePlayer(i); }, this_1);
            this_1.addChild(this_1.dirs[i]);
        };
        var this_1 = this;
        for (var i = 0; i < this.dirs.length; i++) {
            _loop_1(i);
        }
        this.dirs[0].rotation = -90;
        this.dirs[1].rotation = 90;
        this.dirs[2].rotation = 180;
        var index = Math.floor(this.SIZE / 2);
        var cx = this.map[index][index].x;
        var cy = this.map[this.SIZE - 1][this.SIZE - 1].y + 96;
        this.dirs[0].x = cx;
        this.dirs[0].y = cy;
        this.dirs[1].x = cx;
        this.dirs[1].y = cy + 256;
        this.dirs[2].x = cx - 128;
        this.dirs[2].y = cy + 128;
        this.dirs[3].x = cx + 128;
        this.dirs[3].y = cy + 128;
    };
    Dungeon.prototype.movePlayer = function (dir) {
        if (this.player.isWalking() || this.player.isDying()) {
            return;
        }
        console.log('walking');
        switch (dir) {
            case 0:
                if (this.playerPos.y - 1 >= 0) {
                    this.playerPos.y--;
                }
                break;
            case 1:
                if (this.playerPos.y + 1 < this.SIZE) {
                    this.playerPos.y++;
                }
                break;
            case 2:
                if (this.playerPos.x - 1 >= 0) {
                    this.playerPos.x--;
                }
                break;
            case 3:
                if (this.playerPos.x + 1 < this.SIZE) {
                    this.playerPos.x++;
                }
                break;
        }
        if (!this.map[this.playerPos.x][this.playerPos.y].visible) {
            this.gameOver();
        }
        var px = this.map[this.playerPos.x][this.playerPos.y].x;
        var py = this.map[this.playerPos.x][this.playerPos.y].y;
        this.player.walk(px, py, dir);
    };
    Dungeon.prototype.addTimer = function () {
        this.timer = new egret.Timer(500 - this.level * 10, this.SIZE * this.SIZE);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
        this.timer.start();
        this.secondsCounter = new egret.Timer(1000, this.SIZE * this.SIZE);
        this.secondsCounter.addEventListener(egret.TimerEvent.TIMER, this.textCount, this);
        // this.secondsCounter.start();
    };
    Dungeon.prototype.textCount = function () {
        this.secondsText.text = 'TIME:' + (this.secondsCount++) + '         LV.:' + this.level;
    };
    Dungeon.prototype.breakTile = function () {
        var _this = this;
        if (this.randomArr.length <= this.successNumber) {
            console.log('finish');
            if (this.randomArr.length == this.successNumber) {
                egret.Tween.get(this).wait(1000).call(function () {
                    _this.resetGame(++_this.level);
                });
            }
            return;
        }
        this.secondsText.text = 'Target:' + this.successNumber + '         LV.:' + this.level;
        var index = this.getRandomNum(0, this.randomArr.length - 1);
        var p = this.randomArr[index];
        var tile = this.map[p.x][p.y];
        var y = tile.y;
        egret.Tween.get(tile, { loop: true })
            .to({ y: y + 5 }, 25)
            .to({ y: y }, 25)
            .to({ y: y - 5 }, 25)
            .to({ y: y }, 25);
        egret.Tween.get(tile).wait(2000).call(function () {
            egret.Tween.removeTweens(tile);
            egret.Tween.get(tile).to({ scaleX: 0.7, scaleY: 0.7 }, 700).to({ alpha: 0 }, 300).call(function () {
                _this.map[p.x][p.y].visible = false;
                if (!_this.map[_this.playerPos.x][_this.playerPos.y].visible) {
                    _this.gameOver();
                }
            });
        });
        this.randomArr.splice(index, 1);
    };
    Dungeon.prototype.getRandomNum = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    };
    Dungeon.prototype.gameOver = function () {
        var _this = this;
        console.log('gameover');
        this.timer.stop();
        this.secondsCounter.stop();
        this.player.die();
        egret.Tween.get(this).wait(3000).call(function () {
            _this.resetGame(1);
        });
    };
    Dungeon.prototype.addSecondsText = function () {
        this.secondsCount = 0;
        this.secondsText = new egret.TextField();
        this.addChild(this.secondsText);
        this.secondsText.alpha = 1;
        this.secondsText.textAlign = egret.HorizontalAlign.CENTER;
        this.secondsText.size = 40;
        this.secondsText.textColor = 0xffd700;
        this.secondsText.x = 50;
        this.secondsText.y = 50;
        this.secondsText.text = 'TIME:' + this.secondsCount + '    LV.:' + this.level;
    };
    return Dungeon;
}(egret.Stage));
__reflect(Dungeon.prototype, "Dungeon");
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
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        // let sky = this.createBitmapByName("bg_jpg");
        // this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        // sky.width = stageW;
        // sky.height = stageH;
        // let topMask = new egret.Shape();
        // topMask.graphics.beginFill(0x000000, 0.5);
        // topMask.graphics.drawRect(0, 0, stageW, 172);
        // topMask.graphics.endFill();
        // topMask.y = 33;
        // this.addChild(topMask);
        // let icon = this.createBitmapByName("egret_icon_png");
        // this.addChild(icon);
        // icon.x = 26;
        // icon.y = 33;
        // let line = new egret.Shape();
        // line.graphics.lineStyle(2, 0xffffff);
        // line.graphics.moveTo(0, 0);
        // line.graphics.lineTo(0, 117);
        // line.graphics.endFill();
        // line.x = 172;
        // line.y = 61;
        // this.addChild(line);
        // let colorLabel = new egret.TextField();
        // colorLabel.textColor = 0xffffff;
        // colorLabel.width = stageW - 172;
        // colorLabel.textAlign = "center";
        // colorLabel.text = "Hello Egret";
        // colorLabel.size = 24;
        // colorLabel.x = 172;
        // colorLabel.y = 80;
        // this.addChild(colorLabel);
        // let textfield = new egret.TextField();
        // this.addChild(textfield);
        // textfield.alpha = 0;
        // textfield.width = stageW - 172;
        // textfield.textAlign = egret.HorizontalAlign.CENTER;
        // textfield.size = 24;
        // textfield.textColor = 0xffffff;
        // textfield.x = 172;
        // textfield.y = 135;
        // this.textfield = textfield;
        var dungeon = new Dungeon();
        this.addChild(dungeon);
        // let player = this.createBitmapByName("player_png");
        // this.addChild(player);
        // let index = Math.floor(dungeon.SIZE/2)
        // player.x = dungeon.map[index][index].x;
        // player.y = dungeon.map[index][index].y;
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
        _this.walking = false;
        _this.isdead = false;
        _this.init();
        return _this;
    }
    Player.prototype.init = function () {
        this.player = new egret.Bitmap(RES.getRes("player_png"));
        this.playerShadow = new egret.Bitmap(RES.getRes("shadow_png"));
        var index = 0;
        this.player.anchorOffsetX = this.player.width / 2;
        this.player.anchorOffsetY = this.player.height;
        this.player.x = 0;
        this.player.y = 0;
        this.playerShadow.anchorOffsetX = this.playerShadow.width / 2;
        this.playerShadow.anchorOffsetY = this.playerShadow.height / 2;
        this.playerShadow.x = 0;
        this.playerShadow.y = 0;
        this.playerShadow.alpha = 0.3;
        this.playerShadow.scaleX = 2;
        this.playerShadow.scaleY = 2;
        this.addChild(this.player);
        this.addChild(this.playerShadow);
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
        this.player.scaleX = 1;
        this.player.scaleY = 1;
        this.player.visible = true;
        this.player.alpha = 1;
        this.player.x = 0;
        this.player.y = 0;
        this.playerShadow.visible = true;
        this.isdead = false;
        this.walking = false;
    };
    Player.prototype.die = function () {
        var _this = this;
        this.isdead = true;
        this.playerShadow.visible = false;
        egret.Tween.get(this.player).to({ y: 32, scaleX: 0.5, scaleY: 0.5 }, 200).call(function () {
            _this.parent.setChildIndex(_this, 0);
        }).to({ scaleX: 0.2, scaleY: 0.2, y: 100 }, 100).call(function () { _this.player.alpha = 0; });
    };
    Player.prototype.walk = function (px, py, dir) {
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
        });
    };
    return Player;
}(egret.DisplayObjectContainer));
__reflect(Player.prototype, "Player");
;window.Main = Main;