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

	public constructor(main: Main) {
		super();
		this.main = main;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
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
		this.addAstar();
		this.addPlayer();
		this.addMonster();
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
	private tapPad(evt: PadtapEvent): void {
		this.player.move(evt.dir, this.dungeon)
		egret.setTimeout(() => {
			let endIndex = new egret.Point(this.player.pos.x, this.player.pos.y);
			if (Math.abs(this.player.pos.x - this.monster.posIndex.x) > 1 || Math.abs(this.player.pos.y - this.monster.posIndex.y) > 1) {
				endIndex.x = Logic.getRandomNum(0, 8);
				endIndex.y = Logic.getRandomNum(0, 8);
			}
			this.monster.move(this.getNextStep(this.monster.posIndex, endIndex), this.dungeon);
		}, this, 1000);
	}
	private loadNextLevel(evt: LogicEvent): void {
		this.level = evt.data.level;
		this.main.loadingNextDialog.show(this.level, () => {
			this.isGameover = false;
			this.player.resetPlayer();
			this.monster.resetCharacter(this.monster.posIndex.x, this.monster.posIndex.y);
			this.dungeon.resetGame(this.level);
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
	}

	private getGem(evt: LogicEvent): void {
		this.score += evt.data.score;
		if (this.score / Logic.SCORE_BASE >= this.dungeon.level) {
			this.score = Logic.SCORE_BASE * this.dungeon.level;
			this.dungeon.portal.openGate();
		}
		this.main.refreshScoreText("" + this.score);
	}
	public static getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
	}
}