import Logic from "./Logic";
import RectDungeon from "./Rect/RectDungeon";
import RectRoom from "./Rect/RectRoom";
import { EventConstant } from "./EventConstant";

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
		HIDE: 0, NORMAL: 1, PLAYER: 2, CLEAR: 3, NORMAL_BOSS: 4, CLEAR_PUZZLE: 5, CLEAR_END: 6, CLEAR_BOSS: 7, NORMAL_LOOT: 8, CLEAR_LOOT: 9,
		NORMAL_START: 10, NORMAL_END: 11,NORMAL_POKER:12,NORMAL_TAROT:13,NORMAL_TEST:14
	}
	size: number = 0;
	map: cc.Node[][];
	private level:number = 1;

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		cc.director.on(EventConstant.CHANGE_MINIMAP, (event) => {
			this.changeMap(event.detail.x, event.detail.y);
		});
		this.level = Logic.level<1?1:Logic.level;
		this.size = this.level + 2;
		if(this.size < 3){
			this.size = 3;
		}
		this.map = new Array();
		for (let i = 0; i < this.size; i++) {
			this.map[i] = new Array();
			for (let j = 0; j < this.size; j++) {
				let node = cc.instantiate(this.miniTile);
				node.group = 'ui'
				this.map[i][j] = node;
				this.map[i][j].parent = this.node;
				this.map[i][j].position = cc.v2(i * node.width, j * node.height);
				this.map[i][j].color = cc.Color.BLACK;
				this.map[i][j].opacity = 0;
			}
		}
	}

	start() {

	}
	changeMap(x: number, y: number): void {
		if (!this.map) {
			return;
		}
		for (let j = 0; j < this.size; j++) {
			for (let i = 0; i < this.size; i++) {
				let isFound = Logic.mapManager.rectDungeon.map[i][j].isFound;
				let state = Logic.mapManager.rectDungeon.map[i][j].state;
				let roomType = Logic.mapManager.rectDungeon.map[i][j].roomType;
				let primary = Logic.mapManager.rectDungeon.map[i][j].isPrimary;
				this.map[i][j].color = this.getColor(MiniMap.ColorLevel.HIDE);
				if (isFound) {
					this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL);
					this.map[i][j].opacity = 255;
					
					if (state == RectRoom.STATE_SLEEP || state == RectRoom.STATE_ACTIVE) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL);
						if (roomType == RectDungeon.BOSS_ROOM) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL_BOSS);
						}
						if (roomType == RectDungeon.LOOT_ROOM) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL_LOOT);
						}
						if (roomType == RectDungeon.END_ROOM && Logic.level!=RectDungeon.LEVEL_3 && Logic.level!=RectDungeon.LEVEL_5) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL_END);
						}
					}
					if (roomType == RectDungeon.START_ROOM) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL_START);
					}
					if (roomType == RectDungeon.PUZZLE_ROOM) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLEAR_PUZZLE);
					}
					if (roomType == RectDungeon.POKER_ROOM) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL_POKER);
					}
					if (roomType == RectDungeon.TAROT_ROOM) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL_TAROT);
					}
					if (roomType == RectDungeon.TEST_ROOM) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.NORMAL_TEST);
					}
					if (state == RectRoom.STATE_CLEAR) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLEAR);
						if (roomType == RectDungeon.BOSS_ROOM) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLEAR_BOSS);
						}
						if (roomType == RectDungeon.END_ROOM&& Logic.level!=RectDungeon.LEVEL_3&& Logic.level!=RectDungeon.LEVEL_5) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLEAR_END);
						}
						if (roomType == RectDungeon.LOOT_ROOM) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLEAR_LOOT);
						}
					}
					
					if (i == x && j == y) {
						this.map[x][y].color = this.getColor(MiniMap.ColorLevel.PLAYER);
					}
				}
			}
		}
	}
	getColor(t: number): cc.Color {
		let color = new cc.Color(0, 0, 0);
		switch (t) {
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
			case MiniMap.ColorLevel.NORMAL_POKER:
				color = new cc.Color(139, 69, 19);//马鞍棕色
				break;
			case MiniMap.ColorLevel.NORMAL_TAROT:
				color = new cc.Color(255,165,0);//橙色
				break;
			case MiniMap.ColorLevel.NORMAL_TEST:
				color = new cc.Color(238,130,238);//紫罗兰
				break;
			case MiniMap.ColorLevel.CLEAR_LOOT:
				color = new cc.Color(240, 230, 140);//浅黄
				break;
			case MiniMap.ColorLevel.CLEAR_BOSS:
				color = new cc.Color(75, 0, 130);//靛青
				break;
			case MiniMap.ColorLevel.CLEAR_END:
				color = new cc.Color(176, 196, 222);//淡钢蓝
				break;
			case MiniMap.ColorLevel.CLEAR_PUZZLE:
				color = new cc.Color(128, 0, 128);//紫色
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
