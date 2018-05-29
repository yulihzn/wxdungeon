class Dungeon extends egret.Stage {
	public readonly SIZE: number = 9;
	public readonly SUCCESS_NUMBER: number = 15;
	public map: Tile[][] = new Array(); 4
	public player: Player;
	private originX: number;
	private originY: number;
	private playerPos: egret.Point = new egret.Point();
	private dirs: egret.Bitmap[] = new Array(4);
	private playerShadow: egret.Bitmap;
	private randomArr: egret.Point[];
	//地板定时器
	private timer: egret.Timer;
	private gemTimer: egret.Timer;

	public successNumber: number = this.SUCCESS_NUMBER;
	public level: number = 1;
	private isReseting: boolean = false;

	public portal: Portal;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;
		let tile = new egret.Bitmap(RES.getRes("tile_png"));
		this.originX = stageW / 2 - Math.floor(this.SIZE / 2) * tile.width;
		this.originY = 200;

		this.drawBg();
		this.drawMap();
		this.addPlayer();
		this.addTimer();
	}
	private drawBg(): void {
		let tile = new egret.Bitmap(RES.getRes("tile_png"));
		let bg = new egret.Shape();
		bg.graphics.beginFill(0x000000, 0.90);
		bg.graphics.drawRect(this.originX - tile.width / 2, this.originY - tile.height / 2, tile.width * this.SIZE, tile.width * this.SIZE);
		bg.graphics.endFill();
		this.addChild(bg);
		let shadow = new egret.Bitmap(RES.getRes("shadow_png"));
		shadow.x = this.originX - tile.width / 2;
		shadow.y = this.originY - tile.height / 2;
		shadow.width = tile.width * this.SIZE;
		shadow.height = tile.width * this.SIZE;
		shadow.alpha = 0.9;
		this.addChild(shadow);
	}
	private drawMap(): void {
		this.randomArr = new Array();
		this.map = new Array();

		for (let i = 0; i < this.SIZE; i++) {
			this.map[i] = new Array(i);
			for (let j = 0; j < this.SIZE; j++) {
				let t = new Tile(i, j);
				t.x = this.originX + i * t.width;
				t.y = this.originY + j * t.height;
				this.map[i][j] = t;
				this.addChild(this.map[i][j]);
				let index = Math.floor(this.SIZE / 2)
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
				this.randomArr[i * this.SIZE + j] = new egret.Point(i, j);
			}
		}

	}

	public resetGame(level: number): void {

		this.level = level;
		if (level == 1) {
			this.successNumber = this.SUCCESS_NUMBER;
		} else {
			this.successNumber -= 1;
		}
		if (this.successNumber < 5) {
			this.successNumber = 5;
		}
		let index = Math.floor(this.SIZE / 2)
		for (let i = 0; i < this.SIZE; i++) {
			for (let j = 0; j < this.SIZE; j++) {
				let t = this.map[i][j];
				egret.Tween.removeTweens(t.floor);
				t.showTile();
				if (!(index == i && index == j)) {
					if (this.getRandomNum(0, 10) > 5) {
						t.item.setId(this.getRandomNum(1, 4));
						t.item.show();
					}
				}
				this.randomArr[i * this.SIZE + j] = new egret.Point(i, j);
			}
		}
		this.portal.closeGate();
		this.player.resetPlayer();
		this.playerPos.x = index;
		this.playerPos.y = index;
		this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
		this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;

		let delay = 200 - level * 10;
		if (delay < 100) {
			delay = 100;
		}
		this.timer.delay = delay;
		this.isReseting = false;
		this.timer.reset();
		this.timer.start();
		this.gemTimer.reset();
		this.gemTimer.start();
		this.dispatchEventWith(LogicEvent.UI_REFRESHTEXT, false, { tileNum: this.randomArr.length });
	}
	private addPlayer(): void {
		this.player = new Player();
		let index = Math.floor(this.SIZE / 2)
		this.playerPos.x = index;
		this.playerPos.y = index;
		this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
		this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;
		this.addChild(this.player);
	}
	/**
	 *  移动玩家
	 */
	public movePlayer(dir: number) {
		if (this.player.isWalking() || this.player.isDying()) {
			return;
		}
		console.log('walking')
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
			default: break;

		}
		let px = this.map[this.playerPos.x][this.playerPos.y].x;
		let py = this.map[this.playerPos.x][this.playerPos.y].y;
		this.player.walk(px, py, dir, this.map[this.playerPos.x][this.playerPos.y].floor.visible);
		if (!this.map[this.playerPos.x][this.playerPos.y].floor.visible) {
			this.gameOver();
		}
		if (this.map[this.playerPos.x][this.playerPos.y].item) {
			this.map[this.playerPos.x][this.playerPos.y].item.taken();
		}
		if (this.playerPos.x == this.portal.posIndex.x && this.playerPos.y == this.portal.posIndex.y && this.portal.isGateOpen()) {
			if (!this.isReseting) {
				this.isReseting = true;
				egret.setTimeout(() => { this.resetGame(++this.level); }, this, 1000)
			}
		}

	}
	private addTimer(): void {
		this.timer = new egret.Timer(200 - this.level * 10);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
		this.timer.start();
		this.gemTimer = new egret.Timer(5000);
		this.gemTimer.addEventListener(egret.TimerEvent.TIMER, this.addGem, this);
		this.gemTimer.start();
	}
	private addGem(): void {
		let index = this.getRandomNum(0, this.randomArr.length - 1);
		let p = this.randomArr[index];
		let tile = this.map[p.x][p.y];
		if (tile.item && !tile.item.visible) {
			tile.item.setId(this.getRandomNum(1, 4));
			tile.item.show();
		}
	}

	private breakTile(): void {

		//发送breaktile消息
		let index = this.getRandomNum(0, this.randomArr.length - 1);
		let p = this.randomArr[index];
		let tile = this.map[p.x][p.y];
		// this.randomArr.splice(index, 1);
		if (tile.floor.visible) {
			this.dispatchEventWith(LogicEvent.DUNGEON_BREAKTILE, false, { tileNum: this.randomArr.length });
			tile.breakTile(() => {
				if (this.playerPos.x == p.x && this.playerPos.y == p.y) {
					this.gameOver();
				}
			});
		} else {
			egret.setTimeout(() => {
				tile.showTile();
			}, this, this.getRandomNum(500, 1000))
		}


	}

	private getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
	}

	private gameOver(): void {
		console.log('gameover');
		this.timer.stop();
		//让角色原地走一步触发死亡,防止走路清空动画
		this.movePlayer(-1);
		// egret.setTimeout(() => { this.resetGame(1); }, this, 3000)
		this.dispatchEventWith(LogicEvent.GAMEOVER);

	}


}