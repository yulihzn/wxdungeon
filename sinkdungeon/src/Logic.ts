class Logic extends egret.DisplayObjectContainer {
	private main: Main;
	private controllerPad: ControllerPad;
	private dungeon: Dungeon;
	private level: number = 1;

	public constructor(main: Main) {
		super();
		this.main = main;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.dungeon = new Dungeon();
		this.addChild(this.dungeon);
		this.controllerPad = new ControllerPad();
		this.controllerPad.x = this.stage.width / 2;
		this.controllerPad.y = 800;
		this.addChild(this.controllerPad);
		this.controllerPad.addEventListener(PadtapEvent.PADTAP, this.tapPad, this);
		this.dungeon.addEventListener(LogicEvent.DUNGEON_BREAKTILE, this.refreshText, this);
		this.dungeon.addEventListener(LogicEvent.DUNGEON_NEXTLEVEL, this.refreshText, this);
	}
	private refreshText(evt: LogicEvent): void {
		this.main.refreshSecondsText('Target:' + this.dungeon.successNumber + '    Tiles:' + evt.data + '    LV.' + this.dungeon.level)
	}
	private tapPad(evt: PadtapEvent): void {
		this.dungeon.movePlayer(evt.dir)
	}
}