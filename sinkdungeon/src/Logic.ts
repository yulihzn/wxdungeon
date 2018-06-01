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
	private gemManager: GemManager = new GemManager();
	private score: number = 0;

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
		this.dungeon.addEventListener(LogicEvent.DUNGEON_NEXTLEVEL, this.loadNextLevel, this);
		this.dungeon.addEventListener(LogicEvent.GAMEOVER, this.gameOver, this);
		this.dungeon.addEventListener(LogicEvent.GET_GEM, this.getGem, this);
		
	}
	public static getInMapPos(pos: egret.Point): egret.Point {
		let x = Logic.mapX + pos.x * Tile.WIDTH;
		let y =Logic.mapY+ pos.y * Tile.WIDTH;
		return new egret.Point(x, y);
	}
	private refreshText(evt: LogicEvent): void {
		this.main.refreshScoreText(`${this.score}`);
		this.main.refreshSecondsText(`Target:${this.dungeon.level*Logic.SCORE_BASE}        Lv.${this.dungeon.level}`)
	}
	private tapPad(evt: PadtapEvent): void {
		this.dungeon.player.move(evt.dir,this.dungeon)
	}
	private loadNextLevel(evt: LogicEvent): void {
		this.level = evt.data.level;
		this.main.loadingNextDialog.show(this.level, () => {
			this.dungeon.resetGame(this.level)
		})
	}
	private gameOver(): void {
		this.score = 0;
		this.main.gameoverDialog.show(this.dungeon.level);
	}

	private getGem(evt: LogicEvent): void {
		this.score += evt.data.score;
		if (this.score / Logic.SCORE_BASE >= this.dungeon.level) {
			this.score = Logic.SCORE_BASE*this.dungeon.level;
			this.dungeon.portal.openGate();
		}
		this.main.refreshScoreText("" + this.score);
	}
}