class Dungeon extends egret.Stage {
	public readonly SUCCESS_NUMBER: number = 15;
	public map: Tile[][] = new Array();
	// public player: Player;
	private dirs: egret.Bitmap[] = new Array(4);
	private randomArr: egret.Point[];
	//地板定时器
	private timer: egret.Timer;
	private gemTimer: egret.Timer;

	public level: number = 1;

	public portal: Portal;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;

		this.drawBg();
		this.drawMap();
		// this.addPlayer();
		this.addTimer();
		this.resetGame(this.level);

	}
	
	private drawBg(): void {
		let bg = new egret.Shape();
		bg.graphics.beginFill(0x000000, 0.90);
		bg.graphics.drawRect(Logic.mapX - Tile.WIDTH / 2, Logic.mapY - Tile.HEIGHT / 2,Tile.WIDTH * Logic.SIZE, Tile.WIDTH * Logic.SIZE);
		bg.graphics.endFill();
		this.addChild(bg);
		let shadow = new egret.Bitmap(RES.getRes("shadow"));
		shadow.x = Logic.mapX - Tile.WIDTH / 2;
		shadow.y = Logic.mapY - Tile.WIDTH / 2;
		shadow.width = Tile.WIDTH * Logic.SIZE;
		shadow.height = Tile.WIDTH * Logic.SIZE;
		shadow.alpha = 0.9;
		this.addChild(shadow);
	}
	private drawMap(): void {
		this.randomArr = new Array();
		this.map = new Array();

		for (let i = 0; i < Logic.SIZE; i++) {
			this.map[i] = new Array(i);
			for (let j = 0; j < Logic.SIZE; j++) {
				let t = new Tile(i, j);
				t.x = Logic.mapX + i * Tile.WIDTH;
				t.y = Logic.mapY + j * Tile.HEIGHT;
				this.map[i][j] = t;
				this.addChild(this.map[i][j]);
				let index = Math.floor(Logic.SIZE / 2)
				if (index == i && index == j) {
					this.portal = new Portal(i, j);
					t.addBuilding(this.portal);
					this.portal.show();
				}
				t.addItem(new Gem(this.getRandomNum(1, 4)));
				if (!(index == i && index == j)) {
					if (this.getRandomNum(0, 10) > 5) {
						t.item.show();
					}
				}
				this.randomArr[i * Logic.SIZE + j] = new egret.Point(i, j);
			}
		}
	}

	public resetGame(level: number): void {
		this.level = level;
		let index = Math.floor(Logic.SIZE / 2);
		for (let i = 0; i < Logic.SIZE; i++) {
			for (let j = 0; j < Logic.SIZE; j++) {
				let t = this.map[i][j];
				egret.Tween.removeTweens(t.floor);
				t.showTile(false);
				t.item.hide();
				if (!(index == i && index == j)) {
					if (this.getRandomNum(0, 10) > 5) {
						t.item.changeRes(this.getRandomNum(1, 4));
						t.item.show();
					}
				}
				this.randomArr[i * Logic.SIZE + j] = new egret.Point(i, j);
			}
		}
		this.portal.closeGate();
		// this.player.resetPlayer();
		// this.player.pos.x = index;
		// this.player.pos.y = index;
		// let p = Logic.getInMapPos(this.player.pos);
		// this.player.x = p.x;
		// this.player.y = p.y;

		let delay = 200 - level * 10;
		if (delay < 100) {
			delay = 100;
		}
		this.timer.delay = delay;
		this.timer.reset();
		this.timer.start();
		this.gemTimer.reset();
		this.gemTimer.start();
		this.dispatchEventWith(LogicEvent.UI_REFRESHTEXT);
	}
	// private addPlayer(): void {
	// 	this.player = new Player();
	// 	let index = Math.floor(Logic.SIZE / 2)
	// 	this.player.pos.x = index;
	// 	this.player.pos.y = index;
	// 	let p = Logic.getInMapPos(this.player.pos);
	// 	this.player.x = p.x;
	// 	this.player.y = p.y;
	// 	this.addChild(this.player);
	// }
	
	private addTimer(): void {
		this.timer = new egret.Timer(200 - this.level * 10);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
		this.gemTimer = new egret.Timer(5000);
		this.gemTimer.addEventListener(egret.TimerEvent.TIMER, this.addGem, this);
	}
	private addGem(): void {
		let x = this.getRandomNum(0, Logic.SIZE - 1);
		let y = this.getRandomNum(0, Logic.SIZE - 1);
		let tile = this.map[x][y];
		if (tile.item && !tile.item.visible) {
			tile.item.changeRes(this.getRandomNum(1, 4));
			tile.item.show();
		}
	}
	
	private breakTile(): void {
		if (this.randomArr.length < 1) {
			return;
		}
		//发送breaktile消息
		let index = this.getRandomNum(0, this.randomArr.length - 1);

		let p = this.randomArr[index];
		let tile = this.map[p.x][p.y];
		this.randomArr.splice(index, 1);
		tile.breakTile(true);


	}

	private getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
	}

}