class Logic extends egret.Stage {
	public static readonly SIZE: number = 9;
	public static readonly SCORE_BASE: number = 200;
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
	private monster: Monster;
	private astarGrid: AstarGrid;
	private monsterTimer: egret.Timer;
	private inventoryBar: InventoryBar;
	private healthBar: HealthBar;

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
	}
	private addTimer(): void {
		this.monsterTimer = new egret.Timer(10000);
		this.monsterTimer.addEventListener(egret.TimerEvent.TIMER, this.monsterAction, this);
		this.monsterTimer.start();
	}
	private monsterAction() {
		if (this.monster.isDying()) {
			return;
		}
		let endIndex = new egret.Point(this.player.pos.x, this.player.pos.y);
		if (Math.abs(this.player.pos.x - this.monster.posIndex.x) > 1 && Math.abs(this.player.pos.y - this.monster.posIndex.y) > 1) {
			endIndex.x = Logic.getRandomNum(0, 8);
			endIndex.y = Logic.getRandomNum(0, 8);
		}
		let targetPos = this.getNextStep(this.monster.posIndex, endIndex);
		let dir = 4;
		if (targetPos.y != this.monster.posIndex.y) {
			dir = targetPos.y - this.monster.posIndex.y < 0 ? 0 : 1;
		}
		if (targetPos.x != this.monster.posIndex.x) {
			dir = targetPos.x - this.monster.posIndex.x < 0 ? 2 : 3;
		}
		if (targetPos.x == this.player.pos.x && targetPos.y == this.player.pos.y) {
			this.monster.attack(dir, () => {
				if (targetPos.x == this.player.pos.x && targetPos.y == this.player.pos.y) {
					this.player.takeDamage(1);
					this.healthBar.refreshHealth(this.player.currentHealth, this.player.maxHealth);
				}
			});
		} else if (!this.dungeon.map[targetPos.x][targetPos.y].isBreakingNow) {
			this.monster.move(targetPos, this.dungeon);
		}
	}
	private addAstar(): void {
		this.astarGrid = new AstarGrid(Logic.SIZE, Logic.SIZE);

	}
	private getNextStep(startIndex: egret.Point, endIndex: egret.Point): egret.Point {
		let p = new egret.Point(startIndex.x, startIndex.y);
		this.astarGrid.setStartNode(startIndex.x, startIndex.y);
		this.astarGrid.setEndNode(endIndex.x, endIndex.y);
		let aStar: AstarMap = new AstarMap();
		if (aStar.findPath(this.astarGrid)) {
			let path = aStar.path;
			if (path.length > 1) {
				p.x = path[1].x;
				p.y = path[1].y;
			}
		}
		return p;
	}
	private addPlayer(): void {
		this.player = new Player();
		let index = Math.floor(Logic.SIZE / 2)
		this.player.pos.x = index;
		this.player.pos.y = index;
		let p = Logic.getInMapPos(this.player.pos);
		this.player.x = p.x;
		this.player.y = p.y;
		this.addChild(this.player);
	}
	private addMonster(): void {
		this.monster = new Monster();
		let x = 7;
		let y = 4;
		this.monster.posIndex.x = x;
		this.monster.posIndex.y = y;
		let p = Logic.getInMapPos(this.monster.posIndex);
		this.monster.x = p.x;
		this.monster.y = p.y;
		this.addChild(this.monster);
	}
	public static getInMapPos(pos: egret.Point): egret.Point {
		let x = Logic.mapX + pos.x * Tile.WIDTH;
		let y = Logic.mapY + pos.y * Tile.WIDTH;
		return new egret.Point(x, y);
	}
	private breakTileFinish(evt: LogicEvent): void {
		if (this.player.pos.x == evt.data.x && this.player.pos.y == evt.data.y) {
			this.gameOver();
		}
		if (this.monster.posIndex.x == evt.data.x && this.monster.posIndex.y == evt.data.y) {
			this.monster.move(this.monster.posIndex, this.dungeon);
		}
	}
	private refreshText(evt: LogicEvent): void {
		this.main.refreshScoreText(`${this.score}`);
		this.main.refreshSecondsText(`Target:${this.dungeon.level * Logic.SCORE_BASE}        Lv.${this.dungeon.level}`)
	}
	private damagePlayer(evt: LogicEvent): void {
		this.player.takeDamage(evt.data.damage);
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
			if (tile.item && !tile.item.isAutoPicking()) {
				tile.item.taken();
				this.player.changeItemRes(tile.item.getItem().texture);
				this.inventoryBar.changeItem(this.inventoryBar.CurrentIndex,tile.item.getType())
			}
		}
		if (pos.x == this.monster.posIndex.x && pos.y == this.monster.posIndex.y && !this.monster.isDying()) {
			this.player.attack(evt.dir, () => {
				if (pos.x == this.monster.posIndex.x && pos.y == this.monster.posIndex.y) {
					this.monster.takeDamage(this.player.attackNumber);
				}
			});
		} else {
			this.player.move(evt.dir, this.dungeon)
		}
	}
	private loadNextLevel(evt: LogicEvent): void {
		this.level = evt.data.level;
		this.main.loadingNextDialog.show(this.level, () => {
			this.isGameover = false;
			this.player.resetPlayer();
			this.monster.resetCharacter(Logic.getRandomNum(0, 8), Logic.getRandomNum(0, 8));
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
		this.score = 0;
		//让角色原地走一步触发死亡,防止走路清空动画
		this.player.move(-1, this.dungeon);
		this.main.gameoverDialog.show(this.dungeon.level);
		this.monsterTimer.stop();
	}

	private getGem(evt: LogicEvent): void {
		this.score += evt.data.score;
		if (this.score / Logic.SCORE_BASE >= this.dungeon.level) {
			this.score = Logic.SCORE_BASE * this.dungeon.level;
			this.dungeon.portal.openGate();
		}
		this.main.refreshScoreText("" + this.score);
	}
	private tapInventory(evt: InventoryEvent): void {
		let resStr = evt.resStr;
		this.player.changeItemRes(RES.getRes(resStr));

	}
	public static getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
	}
}