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
		HIDE: 0, NORMAL: 1, PLAYER: 2, CLEAR: 3, NORMAL_BOSS: 4, CLEAR_MERCHANT: 5, CLEAR_END: 6, CLAER_BOSS: 7, NORMAL_LOOT: 8
	}
	size: number = 0;
	map: cc.Node[][];

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		cc.director.on(EventConstant.CHANGE_MIMIMAP, (event) => {
			this.changeMap(event.detail.x, event.detail.y);
		});
		this.size = Logic.level + 2;
		let offset = RectDungeon.LEVEL_5 - Logic.level;
		offset = Math.round(offset / 2);
		this.map = new Array();
		for (let i = 0; i < this.size; i++) {
			this.map[i] = new Array();
			for (let j = 0; j < this.size; j++) {
				let node = cc.instantiate(this.miniTile);
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
				let isFound = Logic.mapManger.rectDungeon.map[i][j].isFound;
				let state = Logic.mapManger.rectDungeon.map[i][j].state;
				let roomType = Logic.mapManger.rectDungeon.map[i][j].roomType;
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
					}

					if (state == RectRoom.STATE_CLEAR) {
						this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLEAR);
						if (roomType == RectDungeon.BOSS_ROOM) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLAER_BOSS);
						}
						if (roomType == RectDungeon.END_ROOM) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLEAR_END);
						}
						if (roomType == RectDungeon.MERCHANT_ROOM) {
							this.map[i][j].color = this.getColor(MiniMap.ColorLevel.CLEAR_MERCHANT);
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
			case MiniMap.ColorLevel.NORMAL_BOSS:
				color = new cc.Color(128, 0, 128);//紫色
				break;
			case MiniMap.ColorLevel.NORMAL_LOOT:
				color = new cc.Color(255, 215, 0);//黄金
				break;
			case MiniMap.ColorLevel.CLAER_BOSS:
				color = new cc.Color(75, 0, 130);//靛青
				break;
			case MiniMap.ColorLevel.CLEAR_END:
				color = new cc.Color(176,196,222);//淡钢蓝
				break;
			case MiniMap.ColorLevel.CLEAR_MERCHANT:
				color = new cc.Color(139, 69, 19);//马鞍棕色
				break;
		}

		return color;
	}

	// update (dt) {}
}
