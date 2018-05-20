class Dungeon extends egret.Stage {
	public SIZE: number = 9;
	public map: egret.Bitmap[][] = new Array();
	public player: egret.Bitmap;
	private originX: number;
	private originY: number;
	private playerPos: egret.Point = new egret.Point();
	private dirs:egret.Bitmap[] = new Array(4);


	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.drawMap();
		this.addPlayer();
		this.addController();
	}
	private drawMap(): void {
		this.map = new Array();
		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;
		let tile = new egret.Bitmap(RES.getRes("tile_png"));
		this.originX = stageW / 2 -  Math.floor(this.SIZE / 2) * tile.width;
		this.originY = 200;
		for (let i = 0; i < this.SIZE; i++) {
			this.map[i] = new Array(i);
			for (let j = 0; j < this.SIZE; j++) {
				let t = new egret.Bitmap(RES.getRes("tile_png"));
				t.anchorOffsetX=t.width/2;
				t.$anchorOffsetY=t.height/2;
				t.x = this.originX + i * t.width;
				t.y = this.originY + j * t.height;
				this.map[i][j] = t;
				this.addChild(this.map[i][j]);
			}
		}

	}
	private addPlayer(): void {
		this.player = new egret.Bitmap(RES.getRes("player_png"));
		let index = Math.floor(this.SIZE / 2)
		this.playerPos.x = index;
		this.playerPos.y = index;
		this.player.anchorOffsetX = this.player.width/2;
		this.player.anchorOffsetY = this.player.height;
		this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
		this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;
		this.addChild(this.player);
	}
	private addController(): void {
		//0:top,1:bottom,2:left,3:right
		let top = new egret.Bitmap(RES.getRes("controller_png"));
		let bottom = new egret.Bitmap(RES.getRes("controller_png"));
		let left = new egret.Bitmap(RES.getRes("controller_png"));
		let right = new egret.Bitmap(RES.getRes("controller_png"));
		for(let i = 0;i < this.dirs.length;i++){
			this.dirs[i] = new egret.Bitmap(RES.getRes("controller_png"));
			this.dirs[i].touchEnabled = true;
			this.dirs[i].alpha = 0.5;
			this.dirs[i].anchorOffsetX = this.dirs[i].width/2;
			this.dirs[i].anchorOffsetY = this.dirs[i].height/2;
			this.dirs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.movePlayer(i) }, this)
			this.addChild(this.dirs[i]);
		}
		this.dirs[0].rotation = -90;
		this.dirs[1].rotation = 90;
		this.dirs[2].rotation = 180;
		
		let index = Math.floor(this.SIZE / 2)
		let cx = this.map[index][index].x;
		let cy = this.map[this.SIZE-1][this.SIZE-1].y+96;
		this.dirs[0].x = cx;
		this.dirs[0].y = cy;
		this.dirs[1].x = cx;
		this.dirs[1].y = cy+256;
		this.dirs[2].x = cx-128;
		this.dirs[2].y = cy+128;
		this.dirs[3].x = cx+128;
		this.dirs[3].y = cy+128;
		
	}
	private movePlayer(dir: number) {
		switch (dir) {
			case 0:
				if (this.playerPos.y - 1 >= 0) {
					this.playerPos.y--;
				}
				break;
			case 1:
				if (this.playerPos.y + 1 < this.SIZE) {
					this.playerPos.y++;
				}
				break;
			case 2:
				if (this.playerPos.x - 1 >= 0) {
					this.playerPos.x--;
				}
				break;
			case 3: if (this.playerPos.x + 1 < this.SIZE) {
				this.playerPos.x++;
			}
				break;
		}
		this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
		this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;
	}
}