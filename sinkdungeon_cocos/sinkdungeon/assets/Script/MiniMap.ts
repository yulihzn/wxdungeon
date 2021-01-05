import Logic from "./Logic";
import RectDungeon from "./Rect/RectDungeon";
import RectRoom from "./Rect/RectRoom";
import { EventHelper } from "./EventHelper";
import RoomType from "./Rect/RoomType";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniMap extends cc.Component {
	@property(cc.Prefab)
	miniTile: cc.Prefab = null;
	static ColorLevel = {
		EMPTY: -1, HIDE: 0, NORMAL: 1, PLAYER: 2, CLEAR: 3, NORMAL_BOSS: 4, CLEAR_PUZZLE: 5, CLEAR_END: 6, CLEAR_BOSS: 7, NORMAL_LOOT: 8, CLEAR_LOOT: 9,
		NORMAL_START: 10, NORMAL_END: 11, NORMAL_REST: 12, NORMAL_PREPARE: 13, NORMAL_TEST: 14, NORMAL_PUZZLE: 15, NORMAL_MERCHANT: 16, CLEAR_MERCHANT: 17
	}
	width: number = 0;
	height: number = 0;
	map: cc.Node[][];

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		cc.director.on(EventHelper.CHANGE_MINIMAP, (event) => {
			this.changeMap(event.detail.x, event.detail.y);
		});
		this.width = Logic.mapManager.rectDungeon.map.length;
		this.height = Logic.mapManager.rectDungeon.map[0].length;

		this.map = new Array();
		for (let i = 0; i < this.width; i++) {
			this.map[i] = new Array();
			for (let j = 0; j < this.height; j++) {
				let node = cc.instantiate(this.miniTile);
				node.group = 'ui'
				this.map[i][j] = node;
				this.map[i][j].parent = this.node;
				this.map[i][j].position = cc.v3(i * node.width, j * node.height);
				this.map[i][j].color = cc.Color.BLACK;
				this.map[i][j].opacity = 0;
			}
		}
	}

	start() {

	}
	changeMap(x: number, y: number): void {
		let levelData = Logic.worldLoader.getCurrentLevelData();
		if (!this.map) {
			return;
		}
		for (let j = 0; j < this.height; j++) {
			for (let i = 0; i < this.width; i++) {
				// let isFound = Logic.mapManager.rectDungeon.map[i][j].isFound();
				let isFound = true;
				let state = Logic.mapManager.rectDungeon.map[i][j].state;
				let roomType = Logic.mapManager.rectDungeon.map[i][j].roomType;
				if(levelData.minimap[i][j]){
					this.map[i][j].getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`minimap${levelData.minimap[i][j]}`)
				}
				if(levelData.minimaplock[i][j]){
					this.map[i][j].getChildByName('lock').getComponent(cc.Sprite).spriteFrame = Logic.spriteFrameRes(`minimaplock${levelData.minimaplock[i][j]}`)
				}else{
					this.map[i][j].getChildByName('lock').getComponent(cc.Sprite).spriteFrame = null;
				}
				this.map[i][j].color = this.getColor(MiniMap.ColorLevel.HIDE);
				if (isFound) {
					this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL);
					this.map[i][j].opacity = 255;
					let isClear = state == RectRoom.STATE_CLEAR;

					this.map[i][j].color = this.getColor(isClear ? MiniMap.ColorLevel.CLEAR : MiniMap.ColorLevel.NORMAL);
					this.getMapColor(i, j, roomType, RoomType.EMPTY_ROOM, isClear
						, MiniMap.ColorLevel.EMPTY, MiniMap.ColorLevel.EMPTY);
					this.getMapColor(i, j, roomType, RoomType.BOSS_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_BOSS, MiniMap.ColorLevel.CLEAR_BOSS);
					this.getMapColor(i, j, roomType, RoomType.LOOT_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_LOOT, MiniMap.ColorLevel.CLEAR_LOOT);
					this.getMapColor(i, j, roomType, RoomType.MERCHANT_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_MERCHANT, MiniMap.ColorLevel.CLEAR_MERCHANT);
					this.getMapColor(i, j, roomType, RoomType.START_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_START, MiniMap.ColorLevel.NORMAL_START);
					this.getMapColor(i, j, roomType, RoomType.END_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_END, MiniMap.ColorLevel.CLEAR_END);
					this.getMapColor(i, j, roomType, RoomType.ELITE_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_PUZZLE, MiniMap.ColorLevel.CLEAR_PUZZLE);
					this.getMapColor(i, j, roomType, RoomType.REST_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_REST, MiniMap.ColorLevel.NORMAL_REST);
					this.getMapColor(i, j, roomType, RoomType.PREPARE_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_PREPARE, MiniMap.ColorLevel.NORMAL_PREPARE);
					this.getMapColor(i, j, roomType, RoomType.TEST_ROOM, isClear
						, MiniMap.ColorLevel.NORMAL_TEST, MiniMap.ColorLevel.NORMAL_TEST);
					if (roomType == RoomType.START_ROOM) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL_START);
					}
					if (i == x && j == y) {
						this.map[x][y].color = this.getColor(MiniMap.ColorLevel.PLAYER);
					}
				}
			}
		}
	}
	getMapColor(i: number, j: number, roomType: RoomType, roomTypeType: RoomType, isClear: boolean, typeNormal: number, typeClear: number) {
		if (roomType.isEqual(roomTypeType)) {
			this.map[i][j].color = this.getColor(isClear ? typeClear : typeNormal);
		}
	}
	getColor(t: number): cc.Color {
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
	getMixColor(color1: cc.Color, color2: cc.Color): cc.Color {
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
