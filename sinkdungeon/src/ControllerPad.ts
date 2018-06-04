class ControllerPad extends egret.DisplayObjectContainer {
	private dirs: egret.Bitmap[] = new Array(4);
	private centerButton: egret.Bitmap;
	public constructor() {
		super();
		this.init();
	}
	private init(): void {
		//0:top,1:bottom,2:left,3:right

		for (let i = 0; i < this.dirs.length; i++) {
			this.dirs[i] = new egret.Bitmap(RES.getRes("controller"));
			this.dirs[i].touchEnabled = true;
			this.dirs[i].alpha = 0.5;
			this.dirs[i].anchorOffsetX = this.dirs[i].width / 2;
			this.dirs[i].anchorOffsetY = this.dirs[i].height / 2;
			this.dirs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.tapPad(i) }, this)
			this.addChild(this.dirs[i]);
		}
		this.dirs[0].rotation = -90;
		this.dirs[1].rotation = 90;
		this.dirs[2].rotation = 180;

		let cx = 0;
		let cy = 0;
		this.dirs[0].x = cx;
		this.dirs[0].y = cy;
		this.dirs[1].x = cx;
		this.dirs[1].y = cy + 256;
		this.dirs[2].x = cx - 128;
		this.dirs[2].y = cy + 128;
		this.dirs[3].x = cx + 128;
		this.dirs[3].y = cy + 128;
		this.centerButton = new egret.Bitmap(RES.getRes("controllerbuttonnormal"));
		this.centerButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.tapPad(4) }, this);
		this.centerButton.touchEnabled = true;
		this.centerButton.alpha = 0.5;
		this.centerButton.anchorOffsetX = this.centerButton.width / 2;
		this.centerButton.anchorOffsetY = this.centerButton.height / 2;
		this.centerButton.x = cx;
		this.centerButton.y = cy+128;
		this.addChild(this.centerButton);
	}
	private tapPad(dir: number): void {
		let padtapEvent = new PadtapEvent(PadtapEvent.PADTAP);
		padtapEvent.dir = dir;
		this.dispatchEvent(padtapEvent);
		if(dir == 4){
			egret.Tween.get(this.centerButton).call(()=>{
				this.centerButton.texture = RES.getRes("controllerbuttonpress");
			}).wait(100).call(()=>{
				this.centerButton.texture = RES.getRes("controllerbuttonnormal");
			})
		}
	}
}