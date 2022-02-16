// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Logic from "../logic/Logic";
import BuildingManager from "../manager/BuildingManager";
import RectRoom from "../rect/RectRoom";
import RoomType from "../rect/RoomType";
import MiniMap from "./MiniMap";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniTile extends cc.Component {

    @property(cc.Node)
    layer: cc.Node = null;
    @property(cc.Sprite)
    deathSign: cc.Sprite = null;
    @property(cc.Sprite)
    sign: cc.Sprite = null;
    @property(cc.Sprite)
    lock:cc.Sprite = null;
    @property(cc.Node)
    bg: cc.Node = null;
    graphics: cc.Graphics;
    x: number;
    y: number;
    needDetails = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.graphics = this.getComponent(cc.Graphics);
    }

    start() {

    }
    init(x: number, y: number, needDetails: boolean) {
        this.x = x;
        this.y = y;
        this.needDetails = needDetails;
        this.initMap();
    }
    private isFirstEqual(mapStr: string, typeStr: string) {
        let isequal = mapStr[0] == typeStr;
        return isequal;
    }
    private initMap(): void {
        let levelData = Logic.worldLoader.getCurrentLevelData();
        let groundOilGoldData = Logic.groundOilGoldData.clone();
        let currentPos = cc.v3(Logic.mapManager.getCurrentRoom().x, Logic.mapManager.getCurrentRoom().y);
        let isFound = true;
        if (this.x < 0 || this.y < 0 || this.x > Logic.mapManager.rectDungeon.map.length - 1 || this.y > Logic.mapManager.rectDungeon.map[0].length - 1) {
            this.node.opacity = 0;
            return;
        }
        let rectroom = Logic.mapManager.rectDungeon.map[this.x][this.y];
        if (!rectroom) {
            this.node.opacity = 0;
            return;
        }
        this.node.opacity = 255;
        let state = rectroom.state;
        let roomType = rectroom.roomType;
        if (levelData.minimap[this.x][this.y]) {
            this.lock.spriteFrame = Logic.spriteFrameRes(`minimaplock${levelData.minimaplock[this.x][this.y]}`)
        } else {
            this.lock.spriteFrame = null;
        }
        if (groundOilGoldData.chapter == Logic.chapterIndex && groundOilGoldData.level == Logic.level
            && groundOilGoldData.x == rectroom.x
            && groundOilGoldData.y == rectroom.y && groundOilGoldData.value > 0) {
            this.deathSign.node.active = true;
        } else {
            this.deathSign.node.active = false;
        }
        this.bg.color = this.getColor(MiniMap.ColorLevel.HIDE);
        if (isFound) {
            this.bg.color = this.getColor(MiniMap.ColorLevel.NORMAL);
            this.bg.opacity = 180;
            let isClear = state == RectRoom.STATE_CLEAR;
            this.bg.color = this.getColor(isClear ? MiniMap.ColorLevel.CLEAR : MiniMap.ColorLevel.NORMAL);
            this.getMapColor(roomType, RoomType.EMPTY_ROOM, isClear
                , MiniMap.ColorLevel.EMPTY, MiniMap.ColorLevel.EMPTY);
            this.getMapColor(roomType, RoomType.BOSS_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_BOSS, MiniMap.ColorLevel.CLEAR_BOSS);
            this.getMapColor(roomType, RoomType.LOOT_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_LOOT, MiniMap.ColorLevel.CLEAR_LOOT);
            this.getMapColor(roomType, RoomType.MERCHANT_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_MERCHANT, MiniMap.ColorLevel.CLEAR_MERCHANT);
            this.getMapColor(roomType, RoomType.START_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_START, MiniMap.ColorLevel.NORMAL_START);
            this.getMapColor(roomType, RoomType.END_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_END, MiniMap.ColorLevel.CLEAR_END);
            this.getMapColor(roomType, RoomType.ELITE_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_PUZZLE, MiniMap.ColorLevel.CLEAR_PUZZLE);
            this.getMapColor(roomType, RoomType.REST_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_REST, MiniMap.ColorLevel.NORMAL_REST);
            this.getMapColor(roomType, RoomType.PREPARE_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_PREPARE, MiniMap.ColorLevel.NORMAL_PREPARE);
            this.getMapColor(roomType, RoomType.TEST_ROOM, isClear
                , MiniMap.ColorLevel.NORMAL_TEST, MiniMap.ColorLevel.NORMAL_TEST);
            if (roomType == RoomType.START_ROOM) {
                this.bg.color = this.getColor(MiniMap.ColorLevel.NORMAL_START);
            }
            if (this.x == currentPos.x && this.y == currentPos.y) {
                this.bg.color = this.getColor(MiniMap.ColorLevel.PLAYER);
            }
        }
        this.drawMap();
    }
    private drawMap() {
        if (!this.needDetails) {
            return;
        }
        let levelData = Logic.worldLoader.getCurrentLevelData();
        let map = levelData.getRoomMap(this.x, this.y);
        if (map.length < 1) {
            return;
        }
        let tileSize = this.node.width / levelData.roomWidth;
        let width = map.length;
        let height = map[0].length;
        let alpha = 200;
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                let mapDataStr = map[i][j];
                if (this.isFirstEqual(mapDataStr, '#')) {
                    this.graphics.fillColor = cc.color(119, 136, 153, alpha);//浅灰色
                } else if (this.isFirstEqual(mapDataStr, '*')) {
                    this.graphics.fillColor = cc.color(33, 33, 33, alpha);//灰色
                } else if (this.isFirstEqual(mapDataStr, '~')) {
                    this.graphics.fillColor = cc.color(0, 128, 128, alpha);//水鸭色
                } else if (mapDataStr == '@S') {
                    this.graphics.fillColor = cc.color(0, 255, 0, alpha);//酸橙色
                } else if (this.isFirstEqual(mapDataStr, 'D')) {
                    let dir = BuildingManager.getDoorDir(mapDataStr);
                    let isLock = dir > 7 && dir < 12;
                    this.graphics.fillColor = cc.color(240, 248, 255, alpha);//爱丽丝蓝
                    if (isLock) {
                        this.graphics.fillColor = cc.color(255, 69, 0, alpha);//橙红色
                    }
                } else if (this.isFirstEqual(mapDataStr, 'E')) {
                    this.graphics.fillColor = cc.color(60, 179, 113, alpha);//春天的绿色	
                } else if (this.isFirstEqual(mapDataStr, 'P')) {
                    this.graphics.fillColor = cc.color(32, 178, 170, alpha);//浅海洋绿
                }
                if (!this.isFirstEqual(mapDataStr, '-')) {
                    this.graphics.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
                }
            }
        }
    }
    getMapColor(roomType: RoomType, roomTypeType: RoomType, isClear: boolean, typeNormal: number, typeClear: number) {
        if (roomType.isEqual(roomTypeType)) {
            this.node.color = this.getColor(isClear ? typeClear : typeNormal);
        }
    }
    private getColor(t: number): cc.Color {
        let color = new cc.Color(0, 0, 0);
        switch (t) {
            case MiniMap.ColorLevel.EMPTY:
                color = new cc.Color(0, 0, 0);//透明
                break;
            case MiniMap.ColorLevel.HIDE:
                color = new cc.Color(0, 0, 0);//黑色
                break;
            case MiniMap.ColorLevel.NORMAL:
                color = new cc.Color(128, 128, 128);//灰色
                break;
            case MiniMap.ColorLevel.CLEAR:
                color = new cc.Color(255, 255, 255);//白色
                break;
            case MiniMap.ColorLevel.PLAYER:
                color = new cc.Color(0, 255, 0);//绿色
                break;
            case MiniMap.ColorLevel.NORMAL_START:
                color = new cc.Color(144, 238, 144);//浅绿
                break;
            case MiniMap.ColorLevel.NORMAL_END:
                color = new cc.Color(100, 149, 237);//矢车菊的蓝色
                break;
            case MiniMap.ColorLevel.NORMAL_BOSS:
                color = new cc.Color(128, 0, 128);//紫色
                break;
            case MiniMap.ColorLevel.NORMAL_LOOT:
                color = new cc.Color(255, 215, 0);//黄金
                break;
            case MiniMap.ColorLevel.NORMAL_MERCHANT:
                color = new cc.Color(255, 215, 0);//黄金
                break;
            case MiniMap.ColorLevel.NORMAL_REST:
                color = new cc.Color(139, 69, 19);//马鞍棕色
                break;
            case MiniMap.ColorLevel.NORMAL_PREPARE:
                color = new cc.Color(255, 165, 0);//橙色
                break;
            case MiniMap.ColorLevel.NORMAL_TEST:
                color = new cc.Color(238, 130, 238);//紫罗兰
                break;
            case MiniMap.ColorLevel.NORMAL_PUZZLE:
                color = new cc.Color(128, 0, 128);//紫色
                break;
            case MiniMap.ColorLevel.CLEAR_LOOT:
                color = new cc.Color(240, 230, 140);//浅黄
                break;
            case MiniMap.ColorLevel.CLEAR_MERCHANT:
                color = new cc.Color(240, 230, 140);//浅黄
                break;
            case MiniMap.ColorLevel.CLEAR_BOSS:
                color = new cc.Color(75, 0, 130);//靛青
                break;
            case MiniMap.ColorLevel.CLEAR_END:
                color = new cc.Color(176, 196, 222);//淡钢蓝
                break;
            case MiniMap.ColorLevel.CLEAR_PUZZLE:
                color = new cc.Color(75, 0, 130);//靛青
                break;
        }

        return color;
    }
    private getMixColor(color1: cc.Color, color2: cc.Color): cc.Color {
        let c1 = color1.clone();
        let c2 = color2.clone();
        let c3 = cc.color();
        let r = c1.getR() + c2.getR();
        let g = c1.getG() + c2.getG();
        let b = c1.getB() + c2.getB();

        c3.setR(r > 255 ? 255 : r);
        c3.setG(g > 255 ? 255 : g);
        c3.setB(b > 255 ? 255 : b);
        return c3;
    }
    // update (dt) {}
}
