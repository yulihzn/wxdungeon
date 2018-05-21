class Logic extends egret.DisplayObjectContainer{
	private  main : Main;
	private controllerPad : ControllerPad;
	private dungeon:Dungeon;
	public constructor(main:Main) {
		super();
		this.main = main;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage():void{
		this.dungeon = new Dungeon();
        this.addChild(this.dungeon);
		this.controllerPad = new ControllerPad();
		this.controllerPad.x = this.stage.width/2;
		this.controllerPad.y = 800;
		this.addChild(this.controllerPad);
		this.controllerPad.addEventListener(PadtapEvent.PADTAP, this.tapPad, this);
		
	}
	private tapPad(evt:PadtapEvent):void{
		 this.dungeon.movePlayer(evt.dir)
	}
}