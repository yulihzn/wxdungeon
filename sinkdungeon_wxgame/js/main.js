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
        _this.data = new ItemData();
        _this.posIndex = new egret.Point();
        //使用次数是否为无限
        _this.isInfinity = false;
        _this.type = type;
        _this.init();
        return _this;
    }
    Item.prototype.init = function () {
        this.itemSprite = new egret.Sprite();
        this.width = 64;
        this.height = 64;
        this.anchorOffsetX = 32;
        this.anchorOffsetY = 32;
        this.item = new egret.Bitmap(RES.getRes(this.type));
        this.item.smoothing = false;
        this.itemSprite.width = this.item.width;
        this.itemSprite.height = this.item.height;
        this.itemSprite.anchorOffsetX = this.item.width / 2;
        this.itemSprite.anchorOffsetY = this.item.height;
        this.shadow = new egret.Bitmap(RES.getRes("shadow"));
        this.shadow.smoothing = false;
        this.itemSprite.x = 32;
        this.itemSprite.y = 8;
        this.shadow.anchorOffsetX = this.shadow.width / 2;
        this.shadow.anchorOffsetY = this.shadow.height / 2;
        this.shadow.x = 32;
        this.shadow.y = 32;
        this.shadow.alpha = 0.3;
        this.shadow.scaleX = 1;
        this.shadow.scaleY = 1;
        this.addChild(this.shadow);
        this.addChild(this.itemSprite);
        this.itemSprite.addChild(this.item);
        var y = this.itemSprite.y;
        egret.Tween.get(this.itemSprite, { loop: true })
            .to({ scaleX: 0.5, y: y + 8 }, 1000)
            .to({ scaleX: 0, y: y }, 1000)
            .to({ scaleX: 0.5, y: y + 8 }, 1000)
            .to({ scaleX: 1, y: y }, 1000);
        this.visible = false;
    };
    Object.defineProperty(Item.prototype, "Data", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    Item.prototype.getType = function () {
        return this.type;
    };
    Item.prototype.getItem = function () {
        return this.item;
    };
    Object.defineProperty(Item.prototype, "IsInfinity", {
        get: function () {
            return this.isInfinity;
        },
        enumerable: true,
        configurable: true
    });
    Item.prototype.taken = function (finish) {
        var _this = this;
        if (!this.visible || !this.canTaken) {
            return false;
        }
        this.canTaken = false;
        egret.Tween.removeTweens(this.itemSprite);
        this.itemSprite.scaleX = 1;
        this.itemSprite.alpha = 1;
        egret.Tween.get(this.itemSprite)
            .to({ scaleX: 2, scaleY: 2, y: this.itemSprite.y - 128 }, 500)
            .to({ alpha: 0 }, 100).call(function () {
            _this.visible = false;
            if (finish) {
                finish();
            }
        });
        return true;
    };
    Item.prototype.show = function () {
        egret.Tween.removeTweens(this.itemSprite);
        this.itemSprite.x = 32;
        this.itemSprite.y = 8;
        this.itemSprite.scaleX = 1;
        this.itemSprite.scaleY = 1;
        this.itemSprite.alpha = 1;
        this.visible = true;
        this.canTaken = true;
        var y = this.itemSprite.y;
        egret.Tween.get(this.itemSprite, { loop: true })
            .to({ scaleX: 0.5, y: y + 8 }, 1000)
            .to({ scaleX: 0, y: y }, 1000)
            .to({ scaleX: 0.5, y: y + 8 }, 1000)
            .to({ scaleX: 1, y: y }, 1000);
    };
    Item.prototype.hide = function () {
        this.canTaken = false;
        egret.Tween.removeTweens(this.itemSprite);
        this.visible = false;
    };
    /**被动触发 */
    Item.prototype.passiveUse = function () {
    };
    Item.prototype.changeRes = function (type) {
        this.type = type;
        this.item.texture = RES.getRes(this.type);
    };
    return Item;
}(egret.DisplayObjectContainer));
__reflect(Item.prototype, "Item");
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(type) {
        var _this = _super.call(this) || this;
        _this.tag = 'monster';
        _this.walking = false;
        _this.isdead = false;
        _this.currentHealth = 2;
        _this.maxHealth = 2;
        _this.damage = 1;
        _this.posIndex = new egret.Point();
        _this.type = 'empty';
        _this.type = type;
        _this.init();
        return _this;
    }
    Monster.prototype.init = function () {
        this.character = new egret.Bitmap(RES.getRes(this.type));
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
        this.astarGrid = new AstarGrid(Logic.SIZE, Logic.SIZE);
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
        this.currentHealth = this.maxHealth;
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
                _this.healthBar.visible = false;
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
        egret.Tween.get(this, { onChange: function () { } }).to({ x: px, y: py }, 200).call(function () {
            if (_this.isdead) {
                _this.visible = false;
            }
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
        if (tile.floor.visible) {
            this.posIndex = target;
        }
        var p = Logic.getInMapPos(this.posIndex);
        this.walk(p.x, p.y, tile.floor.visible);
        if (!tile.floor.visible) {
            this.move(this.posIndex, dungeon);
        }
    };
    Monster.prototype.monsterAction = function (monsters, player, dungeon) {
        var _this = this;
        if (this.isDying()) {
            return;
        }
        var endIndex = new egret.Point(player.pos.x, player.pos.y);
        if (Math.abs(player.pos.x - this.posIndex.x) > 1 && Math.abs(player.pos.y - this.posIndex.y) > 1) {
            endIndex.x = Logic.getRandomNum(0, 8);
            endIndex.y = Logic.getRandomNum(0, 8);
        }
        var targetPos = this.getNextStep(this.posIndex, endIndex);
        var dir = 4;
        if (targetPos.y != this.posIndex.y) {
            dir = targetPos.y - this.posIndex.y < 0 ? 0 : 1;
        }
        if (targetPos.x != this.posIndex.x) {
            dir = targetPos.x - this.posIndex.x < 0 ? 2 : 3;
        }
        if (Logic.isPointEquals(targetPos, player.pos)) {
            this.attack(dir, function () {
                if (targetPos.x == player.pos.x && targetPos.y == player.pos.y) {
                    Logic.eventHandler.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: _this.damage });
                }
            });
        }
        else if (!dungeon.map[targetPos.x][targetPos.y].isBreakingNow) {
            var hasOther = false;
            for (var _i = 0, monsters_1 = monsters; _i < monsters_1.length; _i++) {
                var m = monsters_1[_i];
                if (Logic.isPointEquals(m.posIndex, targetPos)) {
                    hasOther = true;
                    break;
                }
            }
            if (!hasOther) {
                this.move(targetPos, dungeon);
            }
        }
    };
    Monster.prototype.getNextStep = function (startIndex, endIndex) {
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
    return Monster;
}(egret.DisplayObjectContainer));
__reflect(Monster.prototype, "Monster");
var ItemManager = (function (_super) {
    __extends(ItemManager, _super);
    function ItemManager() {
        var _this = _super.call(this) || this;
        _this.itemMap = {};
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    ItemManager.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    };
    ItemManager.getItem = function (resName) {
        var item;
        switch (resName) {
            case ItemConstants.GEM_GREEN:
            case ItemConstants.GEM_YELLOW:
            case ItemConstants.GEM_PURPLE:
            case ItemConstants.GEM_RED:
                item = new Gem(resName);
                break;
            case ItemConstants.CAPSULE_RED:
                item = new Capsule(resName);
                break;
            case ItemConstants.CAPSULE_BLUE:
                item = new Capsule(resName);
                break;
            case ItemConstants.WEAPON_SWORD:
                item = new Sword(resName);
                break;
            case ItemConstants.WEAPON_SHIELD:
                item = new Shield(resName);
                break;
        }
        return item;
    };
    ItemManager.prototype.addItem = function (resName, posIndex) {
        var item = ItemManager.getItem(resName);
        var old = this.itemMap["x=" + posIndex.x + "y=" + posIndex.y];
        if (old && old.parent) {
            old.parent.removeChild(old);
            this.itemMap["x=" + posIndex.x + "y=" + posIndex.y] = null;
        }
        if (item) {
            item.posIndex = new egret.Point(posIndex.x, posIndex.y);
            item.x = Logic.mapX + posIndex.x * Tile.WIDTH;
            item.y = Logic.mapY + posIndex.y * Tile.HEIGHT;
            this.itemMap["x=" + posIndex.x + "y=" + posIndex.y] = item;
            this.addChild(item);
        }
        return item;
    };
    ItemManager.prototype.getItem = function (posIndex) {
        return this.itemMap["x=" + posIndex.x + "y=" + posIndex.y];
    };
    ItemManager.prototype.removeAllItems = function () {
        for (var key in this.itemMap) {
            var item = this.itemMap[key];
            if (item && item.parent) {
                item.parent.removeChild(item);
            }
            this.itemMap[key] = null;
        }
    };
    return ItemManager;
}(egret.DisplayObjectContainer));
__reflect(ItemManager.prototype, "ItemManager");
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
        this.secondsText.text = "Lv.1";
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
        _this.currentHealth = 10;
        _this.maxHealth = 10;
        _this.attackNumber = 1;
        _this.pos = new egret.Point();
        _this.init();
        return _this;
    }
    Player.prototype.init = function () {
        this.playerSprite = new egret.Sprite();
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
        this.playerSprite.addChild(this.player);
        this.addChild(this.playerSprite);
        this.addChild(this.playerShadow);
        this.playerSprite.addChild(this.item);
    };
    Player.prototype.changeItemRes = function (texRes) {
        if (!texRes) {
            texRes = ItemConstants.EMPTY;
        }
        var item = ItemManager.getItem(texRes);
        if (item) {
            this.item.texture = item.getItem().texture;
            this.item.scaleX = item.getItem().scaleX;
            this.item.scaleY = item.getItem().scaleY;
        }
        else {
            this.item.texture = null;
            this.item.scaleX = 1;
            this.item.scaleY = 1;
        }
        this.item.visible = true;
        this.item.alpha = 1;
        this.item.anchorOffsetX = this.item.width / 2;
        this.item.anchorOffsetY = this.item.height;
        this.item.rotation = 0;
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
        egret.Tween.removeTweens(this.playerSprite);
        egret.Tween.removeTweens(this);
        this.parent.setChildIndex(this, 100);
        this.playerSprite.scaleX = 1;
        this.playerSprite.scaleY = 1;
        this.playerSprite.visible = true;
        this.playerSprite.alpha = 1;
        this.playerSprite.x = 0;
        this.playerSprite.y = 0;
        this.item.alpha = 1;
        this.item.visible = true;
        this.item.anchorOffsetX = this.item.width / 2;
        this.item.anchorOffsetY = this.item.height;
        this.item.x = -this.player.width * 5 / 2;
        this.item.y = -40;
        this.playerSprite.rotation = 0;
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
        this.currentHealth = 0;
        this.item.texture = null;
        this.playerShadow.visible = false;
        if (isFall) {
            egret.Tween.get(this.playerSprite).to({ y: 32, scaleX: 0.5, scaleY: 0.5 }, 200).call(function () {
                _this.parent.setChildIndex(_this, 0);
            }).to({ scaleX: 0.2, scaleY: 0.2, y: 100 }, 100).call(function () {
                _this.playerSprite.alpha = 0;
                _this.player.texture = RES.getRes("player00" + Logic.getRandomNum(1, 3));
            });
        }
        else {
            egret.Tween.get(this.item).to({ rotation: 90, y: -100 }, 100).to({ alpha: 0 }, 200);
            egret.Tween.get(this.playerSprite).to({ rotation: 90 }, 100).to({ rotation: 70 }, 50).to({ rotation: 90 }, 100).to({ alpha: 0 }, 100).call(function () {
                _this.playerSprite.alpha = 0;
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
        egret.Tween.get(this.playerSprite, { loop: true })
            .to({ rotation: ro, y: this.playerSprite.y + offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25)
            .to({ rotation: -ro, y: this.playerSprite.y - offsetY }, 25)
            .to({ rotation: 0, y: 0 }, 25);
        egret.Tween.get(this, { onChange: function () { } }).to({ x: px, y: py }, 200).call(function () {
            egret.Tween.removeTweens(_this.playerSprite);
            _this.playerSprite.rotation = 0;
            _this.playerSprite.y = 0;
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
            Logic.eventHandler.dispatchEventWith(LogicEvent.GAMEOVER);
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
        egret.Tween.get(this.playerSprite).to({ x: x, y: y }, 100).call(function () {
            if (finish) {
                finish();
            }
        }).to({ x: 0, y: 0 }, 100);
    };
    //01234 top bottom left right middle
    Player.prototype.move = function (dir, dungeon) {
        if (this.isWalking() || this.isDying()) {
            return false;
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
        this.parent.setChildIndex(this, 1000);
        var tile = dungeon.map[this.pos.x][this.pos.y];
        var p = Logic.getInMapPos(this.pos);
        this.walk(p.x, p.y, dir, tile.floor.visible);
        var index = Math.floor(Logic.SIZE / 2);
        if (!tile.floor.visible) {
            Logic.eventHandler.dispatchEventWith(LogicEvent.GAMEOVER);
        }
        if (tile.floor.visible) {
            egret.setTimeout(function () {
                tile.breakTile(true);
            }, this, 1000);
        }
        if (this.pos.x == dungeon.portal.posIndex.x
            && this.pos.y == dungeon.portal.posIndex.y
            && dungeon.portal.isGateOpen()) {
            Logic.eventHandler.dispatchEventWith(LogicEvent.DUNGEON_NEXTLEVEL, false, { level: ++dungeon.level });
        }
        return true;
    };
    Player.prototype.useItem = function () {
        var _this = this;
        egret.Tween.get(this.item).to({ scaleX: 2, scaleY: 2, alpha: 0 }, 1000).call(function () {
            _this.changeItemRes(RES.getRes(ItemConstants.EMPTY));
        });
    };
    return Player;
}(egret.DisplayObjectContainer));
__reflect(Player.prototype, "Player");
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(x, y) {
        var _this = _super.call(this) || this;
        _this.isBreakingNow = false;
        _this.isLooping = true;
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
    // public addItem(item: Item): Tile {
    // 	if(this.item){
    // 		this.removeChild(this.item)
    // 	}
    // 	this.item = item;
    // 	this.addChildAt(this.item, 1000);
    // 	return this;
    // }
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
    Tile.prototype.breakTile = function (isLooping) {
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
                Logic.eventHandler.dispatchEventWith(LogicEvent.DUNGEON_BREAKTILE, false, _this.posIndex);
            }).wait(1000).call(function () {
                if (isLooping) {
                    _this.showTile();
                }
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
var ItemData = (function () {
    function ItemData() {
        this.damage = 0;
        this.health = 0;
        this.defence = 0;
    }
    return ItemData;
}());
__reflect(ItemData.prototype, "ItemData");
var InventoryEvent = (function (_super) {
    __extends(InventoryEvent, _super);
    function InventoryEvent(type, bubbles, cancelable, data) {
        var _this = _super.call(this, type, bubbles, cancelable, data) || this;
        _this.index = 0;
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
    LogicEvent.OPEN_GATE = "OPEN_GATE";
    LogicEvent.ADD_MONSTER = "ADD_MONSTER";
    return LogicEvent;
}(egret.Event));
__reflect(LogicEvent.prototype, "LogicEvent");
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
var Capsule = (function (_super) {
    __extends(Capsule, _super);
    function Capsule(type) {
        return _super.call(this, type) || this;
    }
    Capsule.prototype.isAutoPicking = function () {
        return false;
    };
    Capsule.prototype.use = function () {
        Logic.eventHandler.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: -1 });
    };
    Capsule.prototype.taken = function (finish) {
        if (_super.prototype.taken.call(this, finish)) {
            //tile所在的dungeon发消息
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
    Gem.prototype.isAutoPicking = function () {
        return true;
    };
    Gem.prototype.use = function () {
        var score = parseInt(this.type.substring(this.type.length - 2, this.type.length));
        Logic.eventHandler.dispatchEventWith(LogicEvent.GET_GEM, false, { score: score * 10 });
    };
    Gem.prototype.taken = function (finish) {
        if (_super.prototype.taken.call(this, finish)) {
            //tile所在的dungeon发消息
            this.use();
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
    ItemConstants.GEM_GREEN = 'gem01';
    ItemConstants.GEM_YELLOW = 'gem02';
    ItemConstants.GEM_PURPLE = 'gem03';
    ItemConstants.GEM_RED = 'gem04';
    ItemConstants.WEAPON_SWORD = 'weapon001';
    ItemConstants.WEAPON_SHIELD = 'weapon002';
    return ItemConstants;
}());
__reflect(ItemConstants.prototype, "ItemConstants");
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
        this.itemManager = new ItemManager();
        this.addChild(this.itemManager);
        this.addBoss();
        this.drawMap();
        this.setChildIndex(this.itemManager, 1000);
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
        this.floorLayer = new egret.Sprite();
        this.addChild(this.floorLayer);
        for (var i = 0; i < Logic.SIZE; i++) {
            this.map[i] = new Array(i);
            for (var j = 0; j < Logic.SIZE; j++) {
                var t = new Tile(i, j);
                t.x = Logic.mapX + i * Tile.WIDTH;
                t.y = Logic.mapY + j * Tile.HEIGHT;
                this.map[i][j] = t;
                this.floorLayer.addChild(this.map[i][j]);
                var index = Math.floor(Logic.SIZE / 2);
                if (index == i && index == j) {
                    this.portal = new Portal(i, j);
                    t.addBuilding(this.portal);
                    this.portal.show();
                }
                if (!(index == i && index == j)) {
                    this.addItem(new egret.Point(i, j));
                }
                this.randomArr[i * Logic.SIZE + j] = new egret.Point(i, j);
            }
        }
    };
    Dungeon.prototype.addBoss = function () {
        this.boss = new Boss();
        this.addChild(this.boss);
        this.boss.resetBoss();
    };
    Dungeon.prototype.shakeFloor = function () {
        egret.Tween.get(this.floorLayer, { loop: true })
            .to({ y: 5 }, 25)
            .to({ y: 0 }, 25)
            .to({ y: -5 }, 25)
            .to({ y: 0 }, 25);
    };
    Dungeon.prototype.showBoss = function () {
        var _this = this;
        if (!Logic.isBossLevel(this.level)) {
            return;
        }
        egret.Tween.get(this).call(function () {
            _this.shakeFloor();
        }).wait(1000).call(function () {
            egret.Tween.removeTweens(_this.floorLayer);
        }).wait(1000).call(function () {
            _this.shakeFloor();
        }).wait(1000).call(function () {
            egret.Tween.removeTweens(_this.floorLayer);
        }).wait(1000).call(function () {
            _this.shakeFloor();
        }).wait(1000).call(function () {
            egret.Tween.removeTweens(_this.floorLayer);
        }).call(function () {
            _this.breakHalfTiles();
            _this.boss.showBoss();
        });
    };
    Dungeon.prototype.breakHalfTiles = function () {
        for (var i = 0; i < Logic.SIZE; i++) {
            for (var j = 0; j < 4; j++) {
                var t = this.map[i][j];
                t.breakTile(false);
            }
        }
    };
    Dungeon.prototype.resetGame = function (level) {
        this.level = level;
        var index = Math.floor(Logic.SIZE / 2);
        this.itemManager.removeAllItems();
        for (var i = 0; i < Logic.SIZE; i++) {
            for (var j = 0; j < Logic.SIZE; j++) {
                var t = this.map[i][j];
                egret.Tween.removeTweens(t.floor);
                t.showTile();
                if (!(index == i && index == j)) {
                    this.addItem(new egret.Point(i, j));
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
        // this.gemTimer.reset();
        // this.gemTimer.start();
        Logic.eventHandler.dispatchEventWith(LogicEvent.UI_REFRESHTEXT);
        this.boss.resetBoss();
        this.showBoss();
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
        // this.gemTimer = new egret.Timer(5000);
        // this.gemTimer.addEventListener(egret.TimerEvent.TIMER, this.addGem, this);
    };
    Dungeon.prototype.addGem = function () {
        var x = this.getRandomNum(0, Logic.SIZE - 1);
        var y = this.getRandomNum(0, Logic.SIZE - 1);
        var tile = this.map[x][y];
        var olditem = this.itemManager.getItem(new egret.Point(x, y));
        if (!(olditem && olditem.visible)) {
            this.addItem(new egret.Point(x, y));
        }
    };
    Dungeon.prototype.addItem = function (p) {
        var rand = Math.random();
        if (rand < 0.1) {
            this.itemManager.addItem("gem0" + this.getRandomNum(1, 4), p).show();
        }
        else if (rand >= 0.1 && rand < 0.102) {
            this.itemManager.addItem(ItemConstants.WEAPON_SHIELD, p).show();
        }
        else if (rand >= 0.102 && rand < 0.104) {
            this.itemManager.addItem(ItemConstants.WEAPON_SWORD, p).show();
        }
        else if (rand >= 0.104 && rand < 0.11) {
            this.itemManager.addItem(ItemConstants.CAPSULE_RED, p).show();
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
        tile.breakTile(false);
    };
    Dungeon.prototype.getRandomNum = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    };
    return Dungeon;
}(egret.Stage));
__reflect(Dungeon.prototype, "Dungeon");
var Shield = (function (_super) {
    __extends(Shield, _super);
    function Shield(type) {
        var _this = _super.call(this, type) || this;
        _this.isInfinity = true;
        _this.item.scaleX = 2;
        _this.item.scaleY = 2;
        _this.data.defence = 1;
        return _this;
    }
    Shield.prototype.isAutoPicking = function () {
        return false;
    };
    Shield.prototype.use = function () {
        Logic.eventHandler.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: -1 });
    };
    Shield.prototype.taken = function (finish) {
        if (_super.prototype.taken.call(this, finish)) {
            //tile所在的dungeon发消息
            return true;
        }
        return false;
    };
    return Shield;
}(Item));
__reflect(Shield.prototype, "Shield");
var Sword = (function (_super) {
    __extends(Sword, _super);
    function Sword(type) {
        var _this = _super.call(this, type) || this;
        _this.isInfinity = true;
        _this.item.scaleX = 2;
        _this.item.scaleY = 2;
        _this.data.damage = 1;
        return _this;
    }
    Sword.prototype.isAutoPicking = function () {
        return false;
    };
    Sword.prototype.use = function () {
        Logic.eventHandler.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: -1 });
    };
    Sword.prototype.taken = function (finish) {
        if (_super.prototype.taken.call(this, finish)) {
            //tile所在的dungeon发消息
            return true;
        }
        return false;
    };
    return Sword;
}(Item));
__reflect(Sword.prototype, "Sword");
var Boss = (function (_super) {
    __extends(Boss, _super);
    function Boss() {
        var _this = _super.call(this) || this;
        _this.currentHealth = 20;
        _this.maxHealth = 20;
        _this.damage = 1;
        _this.isShow = false;
        _this.isDead = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.init, _this);
        return _this;
    }
    Boss.prototype.init = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
        this.bossBitmap = new egret.Bitmap(RES.getRes('boss001'));
        this.bossBitmap.smoothing = false;
        this.bossBitmap.anchorOffsetX = this.bossBitmap.width / 2;
        this.bossBitmap.anchorOffsetY = this.bossBitmap.height;
        this.bossBitmap.scaleX = 20;
        this.bossBitmap.scaleY = 20;
        this.hands = new Array();
        var data = RES.getRes('bosshand_json');
        var tex = RES.getRes('bosshand_png');
        var fac = new egret.MovieClipDataFactory(data, tex);
        for (var i = 0; i < 4; i++) {
            var anim = new egret.MovieClip(fac.generateMovieClipData('bosshandswip'));
            anim.smoothing = false;
            anim.x = -this.bossBitmap.width / 2 * 20 + this.bossBitmap.width * i / 3 * 20;
            anim.scaleX = 16;
            anim.scaleY = 16;
            if (i == 2 || i == 3) {
                anim.skewY = 180;
            }
            if (i == 1 || i == 2) {
                anim.scaleX = 15;
                anim.scaleY = 15;
            }
            anim.rotation = 180;
            this.addChild(anim);
            anim.play(-1);
            this.hands.push(anim);
        }
        this.addChild(this.bossBitmap);
        this.healthBar = new HealthBar();
        this.addChild(this.healthBar);
        this.healthBar.x = -this.bossBitmap.width / 2 * 20;
        this.healthBar.y = -this.bossBitmap.height * 20 - 32;
        this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
        this.bullet = new Bullet(4, 2);
        this.parent.addChild(this.bullet);
        this.addFrontHands();
    };
    Boss.prototype.addFrontHands = function () {
        this.frontHands = new Array();
        var index = Math.floor(Logic.SIZE / 2);
        for (var i = 0; i < 4; i++) {
            var hand = new egret.Bitmap(RES.getRes('boss001hand'));
            hand.smoothing = false;
            hand.scaleX = 4;
            hand.scaleY = 4;
            if (i == 0 || i == 1) {
                hand.skewY = 180;
            }
            var p = Logic.getInMapPos(new egret.Point(index - 1 + i, index - 1));
            hand.x = p.x;
            hand.y = p.y;
            this.parent.addChild(hand);
            this.frontHands.push(hand);
        }
    };
    /**是否是boss区域 */
    Boss.prototype.isBossZone = function (target) {
        return target.y < 4 && target.x != 0 && target.x != 8;
    };
    Boss.prototype.takeDamage = function (damage) {
        this.currentHealth -= damage;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
        if (this.currentHealth < 1) {
            this.die();
        }
        this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
    };
    Boss.prototype.die = function () {
        var _this = this;
        this.isDead = true;
        var index = Math.floor(Logic.SIZE / 2);
        var p = Logic.getInMapPos(new egret.Point(index, Logic.SIZE));
        egret.Tween.get(this).to({ y: p.y - 64, alpha: 0 }, 3000).call(function () {
            _this.resetBoss();
            Logic.eventHandler.dispatchEventWith(LogicEvent.OPEN_GATE);
        });
    };
    Boss.prototype.resetBoss = function () {
        var index = Math.floor(Logic.SIZE / 2);
        var p = Logic.getInMapPos(new egret.Point(index, Logic.SIZE));
        this.alpha = 0;
        this.x = p.x;
        this.y = p.y - 128;
        this.visible = false;
        this.isShow = false;
        this.isDead = true;
        this.bullet.parent.setChildIndex(this.bullet, 1000);
    };
    Boss.prototype.showBoss = function () {
        var _this = this;
        this.resetBoss();
        var index = Math.floor(Logic.SIZE / 2);
        var p = Logic.getInMapPos(new egret.Point(index, index - 1));
        this.visible = true;
        egret.Tween.get(this).to({ y: p.y, alpha: 1 }, 3000).call(function () {
            _this.isDead = false;
            _this.isShow = true;
        });
    };
    Boss.prototype.fire = function (perMove) {
        this.bullet.fire(1, perMove);
    };
    return Boss;
}(egret.DisplayObjectContainer));
__reflect(Boss.prototype, "Boss");
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(x, y) {
        var _this = _super.call(this) || this;
        //穿过一格需要的时间
        _this.speed = 100;
        _this.damage = 2;
        _this.posIndex = new egret.Point(x, y);
        _this.originIndex = new egret.Point(x, y);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Bullet.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var p = Logic.getInMapPos(this.originIndex);
        this.x = p.x;
        this.y = p.y;
        this.bitmap = new egret.Bitmap(RES.getRes(BulletConstants.BUBBLE));
        this.bitmap.anchorOffsetX = this.bitmap.width / 2;
        this.bitmap.anchorOffsetY = this.bitmap.height / 2;
        this.bitmap.scaleX = 1;
        this.bitmap.scaleY = 1;
        this.addChild(this.bitmap);
        this.visible = false;
    };
    Bullet.prototype.fire = function (dir, perMove) {
        var _this = this;
        if (this.visible) {
            return;
        }
        //top bottom left right
        var offsetX = 0;
        var offsetY = 0;
        switch (dir) {
            case 0:
                offsetY = -Tile.WIDTH;
                break;
            case 1:
                offsetY = Tile.WIDTH;
                break;
            case 2:
                offsetX = -Tile.HEIGHT;
                break;
            case 3:
                offsetX = Tile.HEIGHT;
                break;
        }
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.bitmap);
        this.visible = true;
        var p = Logic.getInMapPos(this.originIndex);
        this.x = p.x;
        this.y = p.y;
        this.posIndex.x = this.originIndex.x;
        this.posIndex.y = this.originIndex.y;
        egret.Tween.get(this.bitmap, { loop: true })
            .to({ x: 5 }, 25)
            .to({ x: 0 }, 25)
            .to({ x: -5 }, 25)
            .to({ x: 0 }, 25);
        egret.Tween.get(this.bitmap).to({ scaleX: 2, scaleY: 2 }, 500).call(function () {
            egret.Tween.removeTweens(_this.bitmap);
            egret.Tween.get(_this.bitmap, { loop: true })
                .to({ scaleX: 2, scaleY: 2 }, 25)
                .to({ scaleX: 1.5, scaleY: 1.5 }, 25)
                .to({ scaleX: 2.5, scaleY: 2.5 }, 25)
                .to({ scaleX: 2, scaleY: 2 }, 25);
            _this.fly(dir, offsetX, offsetY, perMove);
        });
    };
    Bullet.prototype.fly = function (dir, offsetX, offsetY, perMove) {
        var _this = this;
        var p1 = Logic.getInMapPos(new egret.Point(0, 0));
        var p2 = Logic.getInMapPos(new egret.Point(8, 8));
        egret.Tween.get(this).to({ x: this.x + offsetX, y: this.y + offsetY }, this.speed).call(function () {
            if (_this.x < p1.x || _this.x > p2.x || _this.y < p1.y || _this.y > p2.y) {
                _this.visible = false;
                return;
            }
            switch (dir) {
                case 0:
                    _this.posIndex.y -= 1;
                    break;
                case 1:
                    _this.posIndex.y += 1;
                    break;
                case 2:
                    _this.posIndex.x -= 1;
                    break;
                case 3:
                    _this.posIndex.x += 1;
                    ;
                    break;
            }
            if (perMove) {
                perMove();
            }
            _this.fly(dir, offsetX, offsetY, perMove);
        });
    };
    Bullet.prototype.hit = function () {
        Logic.eventHandler.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: this.damage });
        this.visible = false;
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.bitmap);
    };
    return Bullet;
}(egret.Sprite));
__reflect(Bullet.prototype, "Bullet");
var BulletConstants = (function () {
    function BulletConstants() {
    }
    BulletConstants.BUBBLE = 'bullet001';
    return BulletConstants;
}());
__reflect(BulletConstants.prototype, "BulletConstants");
var Anubis = (function (_super) {
    __extends(Anubis, _super);
    function Anubis() {
        var _this = _super.call(this, NpcConstants.MONSTER_ANUBIS) || this;
        _this.maxHealth = 3;
        _this.currentHealth = 3;
        _this.damage = 2;
        _this.healthBar.refreshHealth(_this.currentHealth, _this.maxHealth);
        return _this;
    }
    return Anubis;
}(Monster));
__reflect(Anubis.prototype, "Anubis");
var Goblin = (function (_super) {
    __extends(Goblin, _super);
    function Goblin() {
        var _this = _super.call(this, NpcConstants.MONSTER_GOBLIN) || this;
        _this.maxHealth = 1;
        _this.currentHealth = 1;
        _this.damage = 1;
        _this.healthBar.refreshHealth(_this.currentHealth, _this.maxHealth);
        return _this;
    }
    return Goblin;
}(Monster));
__reflect(Goblin.prototype, "Goblin");
var Logic = (function (_super) {
    __extends(Logic, _super);
    function Logic(main) {
        var _this = _super.call(this) || this;
        _this.level = 1;
        _this.score = 0;
        _this.isGameover = false;
        _this.monsterReswpanPoints = {};
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
        this.npcLayer = new egret.Sprite();
        this.addChild(this.npcLayer);
        this.controllerPad = new ControllerPad();
        this.controllerPad.x = this.stage.width / 2;
        this.controllerPad.y = 800;
        this.addChild(this.controllerPad);
        this.controllerPad.addEventListener(PadtapEvent.PADTAP, this.tapPad, this);
        Logic.eventHandler.addEventListener(LogicEvent.UI_REFRESHTEXT, this.refreshText, this);
        Logic.eventHandler.addEventListener(LogicEvent.DUNGEON_NEXTLEVEL, this.loadNextLevelEvent, this);
        Logic.eventHandler.addEventListener(LogicEvent.GET_GEM, this.getGemEvent, this);
        Logic.eventHandler.addEventListener(LogicEvent.DUNGEON_BREAKTILE, this.breakTileFinishEvent, this);
        Logic.eventHandler.addEventListener(LogicEvent.GAMEOVER, this.gameOver, this);
        Logic.eventHandler.addEventListener(LogicEvent.DAMAGE_PLAYER, this.damagePlayerEvent, this);
        Logic.eventHandler.addEventListener(LogicEvent.OPEN_GATE, this.openGateEvent, this);
        Logic.eventHandler.addEventListener(LogicEvent.ADD_MONSTER, this.addMonsterEvent, this);
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
        this.addPlayer();
        this.addMonsters();
        this.addTimer();
        this.sortNpcLayer();
    };
    Logic.prototype.openGateEvent = function (evt) {
        this.dungeon.portal.openGate();
    };
    Logic.prototype.sortNpcLayer = function () {
        var num = this.npcLayer.numChildren;
        var arr = new Array(num);
        for (var i = 0; i < num; i++) {
            arr[i] = this.npcLayer.getChildAt(i);
        }
        arr.sort(function (c1, c2) {
            return c1.y - c2.y;
        });
        for (var i = 0; i < num; i++) {
            this.npcLayer.setChildIndex(arr[i], 1000);
        }
    };
    Logic.prototype.addTimer = function () {
        this.monsterTimer = new egret.Timer(1000);
        this.monsterTimer.addEventListener(egret.TimerEvent.TIMER, this.monsterActions, this);
        this.monsterTimer.start();
    };
    Logic.prototype.monsterActions = function () {
        var _this = this;
        var count = 0;
        for (var _i = 0, _a = this.monsters; _i < _a.length; _i++) {
            var monster = _a[_i];
            monster.monsterAction(this.monsters, this.player, this.dungeon);
            if (monster.isDying()) {
                count++;
            }
        }
        if (this.monsters.length > 0 && count >= this.monsters.length) {
            if (!Logic.isBossLevel(this.level)) {
                this.dungeon.portal.openGate();
            }
            // this.dungeon.gemTimer.stop();
        }
        this.sortNpcLayer();
        if (Logic.isBossLevel(this.level) && this.dungeon.boss.isShow && !this.dungeon.boss.isDead) {
            this.dungeon.boss.fire(function () {
                if (Logic.isPointEquals(_this.dungeon.boss.bullet.posIndex, _this.player.pos)) {
                    _this.dungeon.boss.bullet.hit();
                }
            });
        }
    };
    Logic.prototype.addPlayer = function () {
        this.player = new Player();
        var index = Math.floor(Logic.SIZE / 2);
        this.player.pos.x = index;
        this.player.pos.y = index;
        var p = Logic.getInMapPos(this.player.pos);
        this.player.x = p.x;
        this.player.y = p.y;
        this.npcLayer.addChild(this.player);
        this.healthBar.refreshHealth(this.player.currentHealth, this.player.maxHealth);
    };
    Logic.prototype.addMonsters = function () {
        this.monsters = new Array();
        var levelcount = 1;
        this.monsterReswpanPoints['0,0'] = NpcConstants.MONSTER_GOBLIN;
        this.monsterReswpanPoints['0,8'] = NpcConstants.MONSTER_GOBLIN;
        this.monsterReswpanPoints['8,0'] = NpcConstants.MONSTER_MUMMY;
        this.monsterReswpanPoints['8,8'] = NpcConstants.MONSTER_ANUBIS;
        this.monsterReswpanPoints['0,4'] = NpcConstants.MONSTER_GOBLIN;
        this.monsterReswpanPoints['4,0'] = NpcConstants.MONSTER_GOBLIN;
        this.monsterReswpanPoints['8,4'] = NpcConstants.MONSTER_MUMMY;
        this.monsterReswpanPoints['4,8'] = NpcConstants.MONSTER_ANUBIS;
        for (var p in this.monsterReswpanPoints) {
            if (levelcount++ > this.level || Logic.isBossLevel(this.level)) {
                break;
            }
            var arr = p.split(',');
            this.addMonster(NpcManager.getNpc(this.monsterReswpanPoints[p]), new egret.Point(parseInt(arr[0]), parseInt(arr[1])));
        }
    };
    Logic.isBossLevel = function (level) {
        return level == Logic.BOSS_LEVEL_1;
    };
    Logic.prototype.addMonsterEvent = function (evt) {
        this.addMonster(NpcManager.getNpc(evt.data.resName), evt.data.p);
    };
    Logic.prototype.addMonster = function (monster, pos) {
        monster.posIndex.x = pos.x;
        monster.posIndex.y = pos.y;
        var p = Logic.getInMapPos(monster.posIndex);
        monster.x = p.x;
        monster.y = p.y;
        this.npcLayer.addChild(monster);
        this.monsters.push(monster);
    };
    Logic.getInMapPos = function (pos) {
        var x = Logic.mapX + pos.x * Tile.WIDTH;
        var y = Logic.mapY + pos.y * Tile.WIDTH;
        return new egret.Point(x, y);
    };
    Logic.prototype.breakTileFinishEvent = function (evt) {
        if (Logic.isPointEquals(this.player.pos, evt.data)) {
            this.gameOver();
        }
        for (var _i = 0, _a = this.monsters; _i < _a.length; _i++) {
            var monster = _a[_i];
            if (monster.posIndex.x == evt.data.x && monster.posIndex.y == evt.data.y) {
                monster.move(monster.posIndex, this.dungeon);
            }
        }
    };
    Logic.prototype.refreshText = function (evt) {
        this.main.refreshScoreText("" + this.score);
        // this.main.refreshSecondsText(`Target:${this.dungeon.level * Logic.SCORE_BASE}        Lv.${this.dungeon.level}`)
        this.main.refreshSecondsText("Lv." + this.dungeon.level);
    };
    /**造成伤害事件 */
    Logic.prototype.damagePlayerEvent = function (evt) {
        this.damagePlayer(evt.data.damage);
    };
    /**造成伤害 */
    Logic.prototype.damagePlayer = function (damage) {
        var currentritem = ItemManager.getItem(this.inventoryBar.CurrentItemRes);
        var defence = 0;
        if (currentritem && damage > 0) {
            defence = currentritem.Data.defence;
            if (defence > 0 && defence < 1) {
                defence = Math.random() < defence ? 1 : 0;
            }
            damage -= defence;
            if (damage < 0) {
                damage = 0;
            }
        }
        this.player.takeDamage(damage);
        this.healthBar.refreshHealth(this.player.currentHealth, this.player.maxHealth);
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
        //使用
        if (evt.dir == 4) {
            var tile = this.dungeon.map[pos.x][pos.y];
            var olditem = this.dungeon.itemManager.getItem(pos);
            if (olditem && !olditem.isAutoPicking()) {
                this.takeItem(olditem, pos);
            }
            else if (!olditem || !olditem.visible) {
                var item = ItemManager.getItem(this.inventoryBar.CurrentItemRes);
                //使用物品次数为0的时候消失
                if (item) {
                    item.use();
                    if (!item.IsInfinity) {
                        this.inventoryBar.changeItem(ItemConstants.EMPTY, true);
                        this.player.useItem();
                    }
                }
            }
        }
        //攻击
        var isAttack = false;
        var _loop_2 = function (monster) {
            isAttack = Logic.isPointEquals(pos, monster.posIndex) && !monster.isDying();
            if (isAttack) {
                this_2.player.attack(evt.dir, function () {
                    if (Logic.isPointEquals(pos, monster.posIndex)) {
                        var currentritem = ItemManager.getItem(_this.inventoryBar.CurrentItemRes);
                        var damage = 0;
                        if (currentritem) {
                            damage = currentritem.Data.damage;
                        }
                        monster.takeDamage(_this.player.attackNumber + damage);
                    }
                });
                return "break";
            }
        };
        var this_2 = this;
        for (var _i = 0, _a = this.monsters; _i < _a.length; _i++) {
            var monster = _a[_i];
            var state_1 = _loop_2(monster);
            if (state_1 === "break")
                break;
        }
        var isBossAttack = false;
        isBossAttack = Logic.isBossLevel(this.level) && this.dungeon.boss.isBossZone(pos);
        if (isBossAttack && this.dungeon.boss.isShow) {
            this.player.attack(evt.dir, function () {
                var currentritem = ItemManager.getItem(_this.inventoryBar.CurrentItemRes);
                var damage = 0;
                if (currentritem) {
                    damage = currentritem.Data.damage;
                }
                _this.dungeon.boss.takeDamage(_this.player.attackNumber + damage);
            });
        }
        //行走
        if (!isAttack && !isBossAttack) {
            if (this.player.move(evt.dir, this.dungeon)) {
                this.sortNpcLayer();
                var olditem = this.dungeon.itemManager.getItem(this.player.pos);
                if (olditem && (olditem.isAutoPicking())) {
                    olditem.taken(function () { });
                }
            }
        }
    };
    Logic.prototype.takeItem = function (item, pos) {
        var _this = this;
        item.taken(function () {
            _this.dungeon.itemManager.addItem(_this.inventoryBar.getItemRes(_this.inventoryBar.getEmptyIndex()), pos);
            _this.inventoryBar.changeItem(item.getType());
            _this.player.changeItemRes(_this.inventoryBar.CurrentItemRes);
            if (_this.dungeon.itemManager.getItem(pos)) {
                _this.dungeon.itemManager.getItem(pos).show();
            }
        });
    };
    Logic.prototype.loadNextLevelEvent = function (evt) {
        var _this = this;
        this.level = evt.data.level;
        this.main.loadingNextDialog.show(this.level, function () {
            _this.isGameover = false;
            _this.player.resetPlayer();
            for (var _i = 0, _a = _this.monsters; _i < _a.length; _i++) {
                var monster = _a[_i];
                if (monster.parent) {
                    monster.parent.removeChild(monster);
                }
            }
            _this.addMonsters();
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
        this.inventoryBar.clearItems();
        //让角色原地走一步触发死亡,防止走路清空动画
        this.player.move(-1, this.dungeon);
        this.main.gameoverDialog.show(this.dungeon.level, this.score);
        this.monsterTimer.stop();
        this.score = 0;
    };
    Logic.prototype.getGemEvent = function (evt) {
        this.score += evt.data.score;
        // if (this.score / Logic.SCORE_BASE >= this.dungeon.level) {
        // 	this.score = Logic.SCORE_BASE * this.dungeon.level;
        // 	this.dungeon.portal.openGate();
        // }
        this.main.refreshScoreText("" + this.score);
    };
    Logic.prototype.tapInventory = function (evt) {
        this.player.changeItemRes(this.inventoryBar.CurrentItemRes);
    };
    Logic.getRandomNum = function (min, max) {
        return min + Math.round(Math.random() * (max - min));
    };
    Logic.isPointEquals = function (p1, p2) {
        return p1.x == p2.x && p1.y == p2.y;
    };
    Logic.SIZE = 9;
    Logic.SCORE_BASE = 200;
    Logic.eventHandler = new egret.Sprite();
    Logic.BOSS_LEVEL_1 = 2;
    //地图左上角坐标
    Logic.mapX = 0;
    Logic.mapY = 0;
    return Logic;
}(egret.Stage));
__reflect(Logic.prototype, "Logic");
var Mummy = (function (_super) {
    __extends(Mummy, _super);
    function Mummy() {
        var _this = _super.call(this, NpcConstants.MONSTER_MUMMY) || this;
        _this.maxHealth = 2;
        _this.currentHealth = 2;
        _this.healthBar.refreshHealth(_this.currentHealth, _this.maxHealth);
        return _this;
    }
    return Mummy;
}(Monster));
__reflect(Mummy.prototype, "Mummy");
var NpcConstants = (function () {
    function NpcConstants() {
    }
    NpcConstants.MONSTER_GOBLIN = 'monster001';
    NpcConstants.MONSTER_MUMMY = 'monster002';
    NpcConstants.MONSTER_ANUBIS = 'monster003';
    return NpcConstants;
}());
__reflect(NpcConstants.prototype, "NpcConstants");
var NpcManager = (function () {
    function NpcManager() {
    }
    NpcManager.getNpc = function (resName) {
        var monster;
        switch (resName) {
            case NpcConstants.MONSTER_GOBLIN:
                monster = new Goblin();
                break;
            case NpcConstants.MONSTER_MUMMY:
                monster = new Mummy();
                break;
            case NpcConstants.MONSTER_ANUBIS:
                monster = new Anubis();
                break;
        }
        return monster;
    };
    return NpcManager;
}());
__reflect(NpcManager.prototype, "NpcManager");
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
        this.textScore = new egret.TextField();
        this.addChild(this.textScore);
        this.textScore.alpha = 0;
        this.textScore.textAlign = egret.HorizontalAlign.CENTER;
        this.textScore.size = 70;
        this.textScore.width = this.stage.width;
        this.textScore.textColor = 0xffd700;
        this.textScore.x = 0;
        this.textScore.y = this.stage.height / 2 - 400;
        this.textScore.text = '0';
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
    GameoverDialog.prototype.show = function (level, score) {
        var _this = this;
        this.bg.alpha = 0;
        this.textTips.text = ' you die\n Lv.' + level;
        this.textTips.scaleX = 1;
        this.textTips.scaleY = 1;
        this.textTips.y = this.stage.height / 2 - 200;
        this.textTips.alpha = 0;
        this.textScore.text = "score:" + score;
        this.textScore.scaleX = 1;
        this.textScore.scaleY = 1;
        this.textScore.y = this.stage.height / 2 - 400;
        this.textScore.alpha = 0;
        this.textRetry.alpha = 0;
        this.textRetry.touchEnabled = true;
        this.visible = true;
        egret.Tween.get(this.bg).to({ alpha: 1 }, 1000);
        egret.Tween.get(this.textTips).wait(200).to({ y: this.textTips.y + 20, alpha: 1 }, 1000);
        egret.Tween.get(this.textScore).wait(200).to({ y: this.textScore.y + 20, alpha: 1 }, 1000);
        egret.Tween.get(this.textRetry).wait(1000).to({ alpha: 1 }, 1000).call(function () {
            _this.textRetry.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.retry, _this);
        });
    };
    GameoverDialog.prototype.retry = function () {
        this.visible = false;
        this.textRetry.touchEnabled = false;
        this.textRetry.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.retry, this);
        Logic.eventHandler.dispatchEventWith(LogicEvent.DUNGEON_NEXTLEVEL, false, { level: 1 });
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
        _this.itemBitmaps = new Array();
        _this.currentIndex = 0;
        _this.inventoryItems = new Array(4);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    InventoryBar.prototype.onAddToStage = function () {
        var _this = this;
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var _loop_3 = function (i) {
            var tab = new egret.Bitmap(RES.getRes("tabbackground"));
            tab.smoothing = false;
            tab.anchorOffsetX = tab.width / 2;
            tab.anchorOffsetY = tab.height / 2;
            tab.y = tab.height * i + 10;
            tab.touchEnabled = true;
            tab.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { _this.tapTab(i); }, this_3);
            this_3.addChild(tab);
        };
        var this_3 = this;
        for (var i = 0; i < this.SIZE; i++) {
            _loop_3(i);
        }
        for (var i = 0; i < this.SIZE; i++) {
            var item = new egret.Bitmap(RES.getRes("tabbackground"));
            item.smoothing = false;
            item.anchorOffsetX = item.width / 2;
            item.anchorOffsetY = item.height / 2;
            item.y = item.height * i + 10;
            this.itemBitmaps.push(item);
            this.addChild(item);
        }
        this.tabselect = new egret.Bitmap(RES.getRes("tabselect"));
        this.tabselect.smoothing = false;
        this.tabselect.anchorOffsetX = this.tabselect.width / 2;
        this.tabselect.anchorOffsetY = this.tabselect.height / 2;
        this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
        this.addChild(this.tabselect);
    };
    InventoryBar.prototype.clearItems = function () {
        this.inventoryItems = new Array(4);
        for (var i = 0; i < this.SIZE; i++) {
            this.itemBitmaps[i].texture = null;
        }
    };
    InventoryBar.prototype.getEmptyIndex = function () {
        var hasIndex = this.currentIndex;
        if (!this.inventoryItems[hasIndex] || this.inventoryItems[hasIndex] == ItemConstants.EMPTY) {
            return hasIndex;
        }
        //是否还有空余格子
        for (var i = 0; i < this.inventoryItems.length; i++) {
            if (!this.inventoryItems[i] || this.inventoryItems[i] == ItemConstants.EMPTY) {
                hasIndex = i;
                break;
            }
        }
        return hasIndex;
    };
    /**true，替换道具 */
    InventoryBar.prototype.changeItem = function (itemRes, isUse) {
        if (!itemRes) {
            itemRes = ItemConstants.EMPTY;
        }
        var index = isUse ? this.currentIndex : this.getEmptyIndex();
        this.refreshItem(index, itemRes);
    };
    InventoryBar.prototype.refreshItem = function (index, itemRes) {
        this.itemBitmaps[index].texture = RES.getRes(itemRes);
        this.itemBitmaps[index].scaleX = 0.25;
        this.itemBitmaps[index].scaleY = 0.25;
        this.inventoryItems[index] = itemRes;
    };
    InventoryBar.prototype.tapTab = function (index) {
        this.currentIndex = index;
        this.tabselect.y = this.tabselect.height * this.currentIndex + 10;
        var inventoryEvent = new InventoryEvent(InventoryEvent.TABTAP);
        inventoryEvent.index = index;
        this.dispatchEvent(inventoryEvent);
    };
    Object.defineProperty(InventoryBar.prototype, "CurrentItemRes", {
        get: function () {
            return this.inventoryItems[this.currentIndex];
        },
        enumerable: true,
        configurable: true
    });
    InventoryBar.prototype.getItemRes = function (index) {
        if (index > this.SIZE - 1 || index < 0) {
            return ItemConstants.EMPTY;
        }
        return this.inventoryItems[index];
    };
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