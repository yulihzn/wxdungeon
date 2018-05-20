class Dungeon extends egret.Stage {
	public SIZE: number = 9;
	public map: egret.Bitmap[][] = new Array();
	public player: Player;
	private originX: number;
	private originY: number;
	private playerPos: egret.Point = new egret.Point();
	private dirs: egret.Bitmap[] = new Array(4);
	private playerShadow: egret.Bitmap;
	private randomArr: egret.Point[];
	private timer: egret.Timer;
	private secondsCounter: egret.Timer;
	private secondsText: egret.TextField;
	private secondsCount: number = 0;

	private successNumber: number = 50;
	private level: number = 1;
	private isReseting: boolean = false;
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.drawMap();
		this.addPlayer();
		this.addController();
		this.addSecondsText();
		this.addTimer();
	}
	private drawMap(): void {
		this.randomArr = new Array();
		this.map = new Array();
		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;
		let tile = new egret.Bitmap(RES.getRes("tile_png"));
		this.originX = stageW / 2 - Math.floor(this.SIZE / 2) * tile.width;
		this.originY = 200;
		for (let i = 0; i < this.SIZE; i++) {
			this.map[i] = new Array(i);
			for (let j = 0; j < this.SIZE; j++) {
				let t = new egret.Bitmap(RES.getRes("tile_png"));
				t.anchorOffsetX = t.width / 2;
				t.anchorOffsetY = t.height / 2;
				t.scaleX = 1;
				t.scaleY = 1;
				t.x = this.originX + i * t.width;
				t.y = this.originY + j * t.height;
				this.map[i][j] = t;
				this.addChild(this.map[i][j]);

				this.randomArr[i * this.SIZE + j] = new egret.Point(i, j);
			}
		}

	}
	private resetGame(level: number): void {

		this.level = level;
		if (level == 1) {
			this.successNumber = 50;
		} else {
			this.successNumber -= 2;
		}
		if (this.successNumber < 1) {
			this.successNumber = 1;
		}
		for (let i = 0; i < this.SIZE; i++) {
			for (let j = 0; j < this.SIZE; j++) {
				let t = this.map[i][j];
				t.scaleX = 1;
				t.scaleY = 1;
				t.alpha = 1;
				t.visible = true;
				t.x = this.originX + i * t.width;
				t.y = this.originY + j * t.height;
				egret.Tween.removeTweens(t);
				this.randomArr[i * this.SIZE + j] = new egret.Point(i, j);
			}
		}
		let index = Math.floor(this.SIZE / 2)
		this.player.resetPlayer();
		this.playerPos.x = index;
		this.playerPos.y = index;
		this.player.x = this.map[this.playerPos.x][this.playerPos.y].x;
		this.player.y = this.map[this.playerPos.x][this.playerPos.y].y;

		this.secondsText.text = 'Target:' + this.successNumber + '    LV.:' + this.level;
		this.timer.delay = 500 - level * 10
		this.timer.reset();
		this.timer.start();
		// this.secondsCounter.reset();
		this.secondsCount = 0;
		// this.secondsCounter.start();
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
	private addController(): void {
		//0:top,1:bottom,2:left,3:right
		let top = new egret.Bitmap(RES.getRes("controller_png"));
		let bottom = new egret.Bitmap(RES.getRes("controller_png"));
		let left = new egret.Bitmap(RES.getRes("controller_png"));
		let right = new egret.Bitmap(RES.getRes("controller_png"));
		for (let i = 0; i < this.dirs.length; i++) {
			this.dirs[i] = new egret.Bitmap(RES.getRes("controller_png"));
			this.dirs[i].touchEnabled = true;
			this.dirs[i].alpha = 0.5;
			this.dirs[i].anchorOffsetX = this.dirs[i].width / 2;
			this.dirs[i].anchorOffsetY = this.dirs[i].height / 2;
			this.dirs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, () => { this.movePlayer(i) }, this)
			this.addChild(this.dirs[i]);
		}
		this.dirs[0].rotation = -90;
		this.dirs[1].rotation = 90;
		this.dirs[2].rotation = 180;

		let index = Math.floor(this.SIZE / 2)
		let cx = this.map[index][index].x;
		let cy = this.map[this.SIZE - 1][this.SIZE - 1].y + 96;
		this.dirs[0].x = cx;
		this.dirs[0].y = cy;
		this.dirs[1].x = cx;
		this.dirs[1].y = cy + 256;
		this.dirs[2].x = cx - 128;
		this.dirs[2].y = cy + 128;
		this.dirs[3].x = cx + 128;
		this.dirs[3].y = cy + 128;

	}
	private movePlayer(dir: number) {
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
		}
		if (!this.map[this.playerPos.x][this.playerPos.y].visible) {
			this.gameOver();
		}
		let px = this.map[this.playerPos.x][this.playerPos.y].x;
		let py = this.map[this.playerPos.x][this.playerPos.y].y;
		this.player.walk(px, py, dir);
	}
	private addTimer(): void {
		this.timer = new egret.Timer(500 - this.level * 10, this.SIZE * this.SIZE);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
		this.timer.start();
		this.secondsCounter = new egret.Timer(1000, this.SIZE * this.SIZE);
		this.secondsCounter.addEventListener(egret.TimerEvent.TIMER, this.textCount, this);
		// this.secondsCounter.start();


	}
	private textCount(): void {
		this.secondsText.text = 'TIME:' + (this.secondsCount++) + '         LV.:' + this.level;
	}
	private breakTile(): void {
		if (this.randomArr.length <= this.successNumber) {
			console.log('finish')
			if (this.randomArr.length == this.successNumber) {
				egret.setTimeout(() => { this.resetGame(++this.level); }, this, 1000)
			}

			return;
		}
		this.secondsText.text = 'Target:' + this.successNumber + '         LV.:' + this.level;
		let index = this.getRandomNum(0, this.randomArr.length - 1);
		let p = this.randomArr[index];
		let tile = this.map[p.x][p.y];
		let y = tile.y;
		egret.Tween.get(tile, { loop: true })
			.to({ y: y + 5 }, 25)
			.to({ y: y }, 25)
			.to({ y: y - 5 }, 25)
			.to({ y: y }, 25);
		egret.Tween.get(tile).wait(2000).call(() => {
			egret.Tween.removeTweens(tile);
			egret.Tween.get(tile).to({ scaleX: 0.7, scaleY: 0.7 }, 700).to({ alpha: 0 }, 300).call(() => {
				this.map[p.x][p.y].visible = false;
				if (!this.map[this.playerPos.x][this.playerPos.y].visible) {
					this.gameOver();
				}
			})
		});

		this.randomArr.splice(index, 1);

	}

	private getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
	}

	private gameOver(): void {
		console.log('gameover');
		this.timer.stop();
		this.secondsCounter.stop();
		this.player.die();
		egret.setTimeout(() => { this.resetGame(1); }, this, 3000)

	}
	private addSecondsText(): void {
		this.secondsCount = 0;
		this.secondsText = new egret.TextField();
		this.addChild(this.secondsText);
		this.secondsText.alpha = 1;
		this.secondsText.textAlign = egret.HorizontalAlign.CENTER;
		this.secondsText.size = 40;
		this.secondsText.textColor = 0xffd700;
		this.secondsText.x = 50;
		this.secondsText.y = 50;
		this.secondsText.text = 'TIME:' + this.secondsCount + '    LV.:' + this.level;
	}
}