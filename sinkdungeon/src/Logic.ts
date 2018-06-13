class Logic extends egret.Stage {
	public static readonly SIZE: number = 9;
	public static readonly SCORE_BASE: number = 200;
	public static eventHandler: egret.Sprite = new egret.Sprite();
	//地图左上角坐标
	public static mapX = 0;
	public static mapY = 0;
	private main: Main;
	private controllerPad: ControllerPad;
	private dungeon: Dungeon;
	private level: number = 1;
	private score: number = 0;
	private player: Player;
	private isGameover: boolean = false;
	private monsters: Monster[];
	private monsterTimer: egret.Timer;
	private inventoryBar: InventoryBar;
	private healthBar: HealthBar;
	private npcLayer: egret.Sprite;
	public monsterReswpanPoints: { [key: string]: string } = {}
	public constructor(main: Main) {
		super();
		this.main = main;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;
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
	}
	private sortNpcLayer(): void {
		let num = this.npcLayer.numChildren;
		let arr = new Array(num);
		for (let i = 0; i < num; i++) {
			arr[i] = this.npcLayer.getChildAt(i);
		}
		arr.sort((c1: egret.DisplayObject, c2: egret.DisplayObject) => {
			return c1.y - c2.y;
		})
		for (let i = 0; i < num; i++) {
			this.npcLayer.setChildIndex(arr[i], 1000);
		}
	}

	private addTimer(): void {
		this.monsterTimer = new egret.Timer(1000);
		this.monsterTimer.addEventListener(egret.TimerEvent.TIMER, this.monsterActions, this);
		this.monsterTimer.start();
	}
	private monsterActions() {
		let count = 0;
		for (let monster of this.monsters) {
			monster.monsterAction(this.monsters, this.player, this.dungeon);
			if (monster.isDying()) {
				count++;
			}
		}
		if (this.monsters.length > 0 && count >= this.monsters.length) {
			this.dungeon.portal.openGate();
			// this.dungeon.gemTimer.stop();
		}
		this.sortNpcLayer();
	}

	private addPlayer(): void {
		this.player = new Player();
		let index = Math.floor(Logic.SIZE / 2)
		this.player.pos.x = index;
		this.player.pos.y = index;
		let p = Logic.getInMapPos(this.player.pos);
		this.player.x = p.x;
		this.player.y = p.y;
		this.npcLayer.addChild(this.player);
		this.healthBar.refreshHealth(this.player.currentHealth, this.player.maxHealth);
	}
	private addMonsters(): void {
		this.monsters = new Array();
		let levelcount = 1;
		this.monsterReswpanPoints['0,0'] = NpcConstants.MONSTER_GOBLIN;
		this.monsterReswpanPoints['0,8'] = NpcConstants.MONSTER_GOBLIN;
		this.monsterReswpanPoints['8,0'] = NpcConstants.MONSTER_MUMMY;
		this.monsterReswpanPoints['8,8'] = NpcConstants.MONSTER_ANUBIS;
		this.monsterReswpanPoints['0,4'] = NpcConstants.MONSTER_GOBLIN;
		this.monsterReswpanPoints['4,0'] = NpcConstants.MONSTER_GOBLIN;
		this.monsterReswpanPoints['8,4'] = NpcConstants.MONSTER_MUMMY;
		this.monsterReswpanPoints['4,8'] = NpcConstants.MONSTER_ANUBIS;
		for (let p in this.monsterReswpanPoints) {
			if (levelcount++ > this.level) {
				break;
			}
			let arr = p.split(',');
			this.addMonster(NpcManager.getNpc(this.monsterReswpanPoints[p]), new egret.Point(parseInt(arr[0]), parseInt(arr[1])));
		}
	}
	private addMonster(monster: Monster, pos: egret.Point) {
		monster.posIndex.x = pos.x;
		monster.posIndex.y = pos.y;
		let p = Logic.getInMapPos(monster.posIndex);
		monster.x = p.x;
		monster.y = p.y;
		this.npcLayer.addChild(monster);
		this.monsters.push(monster);
	}
	public static getInMapPos(pos: egret.Point): egret.Point {
		let x = Logic.mapX + pos.x * Tile.WIDTH;
		let y = Logic.mapY + pos.y * Tile.WIDTH;
		return new egret.Point(x, y);
	}
	private breakTileFinishEvent(evt: LogicEvent): void {
		if (Logic.isPointEquals(this.player.pos, evt.data)) {
			this.gameOver();
		}

		for (let monster of this.monsters) {
			if (monster.posIndex.x == evt.data.x && monster.posIndex.y == evt.data.y) {
				monster.move(monster.posIndex, this.dungeon);
			}
		}
	}
	private refreshText(evt: LogicEvent): void {
		this.main.refreshScoreText(`${this.score}`);
		// this.main.refreshSecondsText(`Target:${this.dungeon.level * Logic.SCORE_BASE}        Lv.${this.dungeon.level}`)
		this.main.refreshSecondsText(`Lv.${this.dungeon.level}`);
	}
	/**造成伤害事件 */
	private damagePlayerEvent(evt: LogicEvent): void {
		this.damagePlayer(evt.data.damage);
	}
	/**造成伤害 */
	private damagePlayer(damage: number): void {
		let currentritem = ItemManager.getItem(this.inventoryBar.CurrentItemRes);
		let defence = 0;
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
	}
	private tapPad(evt: PadtapEvent): void {
		let pos = new egret.Point(this.player.pos.x, this.player.pos.y);
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
			case 3: if (pos.x + 1 < Logic.SIZE) {
				pos.x++;
			}
				break;
			case 4:
				break;
			default: break;

		}
		if (evt.dir == 4) {
			let tile = this.dungeon.map[pos.x][pos.y];
			let olditem = this.dungeon.itemManager.getItem(pos);
			if (olditem && !olditem.isAutoPicking()) {
				olditem.taken(() => {
					this.dungeon.itemManager.addItem(this.inventoryBar.getItemRes(this.inventoryBar.getEmptyIndex()), pos)
					this.inventoryBar.changeItem(olditem.getType());
					this.player.changeItemRes(this.inventoryBar.CurrentItemRes);
					if (this.dungeon.itemManager.getItem(pos)) {
						this.dungeon.itemManager.getItem(pos).show();
					}
				});

			} else if (!olditem || !olditem.visible) {
				let itemRes = this.inventoryBar.CurrentItemRes;
				let p = new egret.Point(-1, -1);
				this.dungeon.itemManager.addItem(itemRes, p)
				let item = this.dungeon.itemManager.getItem(p)
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
		let isAttack = false;
		for (let monster of this.monsters) {
			isAttack = Logic.isPointEquals(pos, monster.posIndex) && !monster.isDying();
			if (isAttack) {
				this.player.attack(evt.dir, () => {
					if (Logic.isPointEquals(pos, monster.posIndex)) {
						let currentritem = ItemManager.getItem(this.inventoryBar.CurrentItemRes);
						let damage = 0;
						if (currentritem) {
							damage = currentritem.Data.damage;
						}
						monster.takeDamage(this.player.attackNumber + damage);
					}
				});
				break;
			}
		}
		if (!isAttack) {
			if (this.player.move(evt.dir, this.dungeon)) {
				let olditem = this.dungeon.itemManager.getItem(this.player.pos);
				if (olditem && (olditem.isAutoPicking())) {
					olditem.taken(() => { });
				}
			}

			this.sortNpcLayer();
		}

	}
	private loadNextLevelEvent(evt: LogicEvent): void {
		this.level = evt.data.level;
		this.main.loadingNextDialog.show(this.level, () => {
			this.isGameover = false;
			this.player.resetPlayer();
			for (let monster of this.monsters) {
				if (monster.parent) {
					monster.parent.removeChild(monster);
				}
			}
			this.addMonsters();
			this.dungeon.resetGame(this.level);
			this.healthBar.refreshHealth(this.player.currentHealth, this.player.maxHealth);
			this.monsterTimer.start();
		})
	}
	private gameOver(): void {
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
	}

	private getGemEvent(evt: LogicEvent): void {
		this.score += evt.data.score;
		// if (this.score / Logic.SCORE_BASE >= this.dungeon.level) {
		// 	this.score = Logic.SCORE_BASE * this.dungeon.level;
		// 	this.dungeon.portal.openGate();
		// }
		this.main.refreshScoreText("" + this.score);
	}
	private tapInventory(evt: InventoryEvent): void {
		this.player.changeItemRes(this.inventoryBar.CurrentItemRes);
	}
	public static getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
	}
	public static isPointEquals(p1: egret.Point, p2: egret.Point): boolean {
		return p1.x == p2.x && p1.y == p2.y;
	}
}