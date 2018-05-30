class Dungeon extends egret.Stage {
	public readonly SIZE: number = 9;
	public readonly SUCCESS_NUMBER: number = 15;
	public map: Tile[][] = new Array();
	public player: Player;
	private originX: number;
	private originY: number;
	private dirs: egret.Bitmap[] = new Array(4);
	private playerShadow: egret.Bitmap;
	private randomArr: egret.Point[];
	//地板定时器
	private timer: egret.Timer;
	private gemTimer: egret.Timer;

	public level: number = 1;
	private isGameover: boolean = false;

	public portal: Portal;

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		this.addEventListener(LogicEvent.DUNGEON_BREAKTILE, this.breakTileFinish, this);


	}
	private onAddToStage(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;
		this.originX = stageW / 2 - Math.floor(this.SIZE / 2) * Tile.WIDTH;
		this.originY = 200;

		this.drawBg();
		this.drawMap();
		this.addPlayer();
		this.addTimer();
		this.resetGame(this.level);

	}
	private getInMapPos(pos: egret.Point): egret.Point {
		let x = this.originX + pos.x * Tile.WIDTH;
		let y = this.originY + pos.y * Tile.WIDTH;
		return new egret.Point(x, y);
	}
	private drawBg(): void {
		let bg = new egret.Shape();
		bg.graphics.beginFill(0x000000, 0.90);
		bg.graphics.drawRect(this.originX - Tile.WIDTH / 2, this.originY - Tile.HEIGHT / 2,Tile.WIDTH * this.SIZE, Tile.WIDTH * this.SIZE);
		bg.graphics.endFill();
		this.addChild(bg);
		let shadow = new egret.Bitmap(RES.getRes("shadow"));
		shadow.x = this.originX - Tile.WIDTH / 2;
		shadow.y = this.originY - Tile.WIDTH / 2;
		shadow.width = Tile.WIDTH * this.SIZE;
		shadow.height = Tile.WIDTH * this.SIZE;
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
				t.x = this.originX + i * Tile.WIDTH;
				t.y = this.originY + j * Tile.HEIGHT;
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
		let index = Math.floor(this.SIZE / 2)
		for (let i = 0; i < this.SIZE; i++) {
			for (let j = 0; j < this.SIZE; j++) {
				let t = this.map[i][j];
				egret.Tween.removeTweens(t.floor);
				t.isLooping = false;
				t.showTile();
				t.item.hide();
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
		this.player.pos.x = index;
		this.player.pos.y = index;
		let p = this.getInMapPos(this.player.pos);
		this.player.x = p.x;
		this.player.y = p.y;

		let delay = 200 - level * 10;
		if (delay < 100) {
			delay = 100;
		}
		this.timer.delay = delay;
		this.isGameover = false;
		this.timer.reset();
		this.timer.start();
		this.gemTimer.reset();
		this.gemTimer.start();
		this.dispatchEventWith(LogicEvent.UI_REFRESHTEXT);
	}
	private addPlayer(): void {
		this.player = new Player();
		let index = Math.floor(this.SIZE / 2)
		this.player.pos.x = index;
		this.player.pos.y = index;
		let p = this.getInMapPos(this.player.pos);
		this.player.x = p.x;
		this.player.y = p.y;
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
				if (this.player.pos.y - 1 >= 0) {
					this.player.pos.y--;
				}
				break;
			case 1:
				if (this.player.pos.y + 1 < this.SIZE) {
					this.player.pos.y++;
				}
				break;
			case 2:
				if (this.player.pos.x - 1 >= 0) {
					this.player.pos.x--;
				}
				break;
			case 3: if (this.player.pos.x + 1 < this.SIZE) {
				this.player.pos.x++;
			}
				break;
			default: break;

		}
		let tile = this.map[this.player.pos.x][this.player.pos.y];
		let p = this.getInMapPos(this.player.pos);
		this.player.walk(p.x, p.y, dir, tile.floor.visible);
		if (!tile.floor.visible) {
			this.gameOver();
		}
		if (tile.item) {
			tile.item.taken();
		}
		if (this.player.pos.x == this.portal.posIndex.x
			&& this.player.pos.y == this.portal.posIndex.y
			&& this.portal.isGateOpen()) {
			this.dispatchEventWith(LogicEvent.DUNGEON_NEXTLEVEL, false, { level: ++this.level });
		}

	}
	private addTimer(): void {
		this.timer = new egret.Timer(200 - this.level * 10);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
		this.gemTimer = new egret.Timer(5000);
		this.gemTimer.addEventListener(egret.TimerEvent.TIMER, this.addGem, this);
	}
	private addGem(): void {
		let x = this.getRandomNum(0, this.SIZE - 1);
		let y = this.getRandomNum(0, this.SIZE - 1);
		let tile = this.map[x][y];
		if (tile.item && !tile.item.visible) {
			tile.item.setId(this.getRandomNum(1, 4));
			tile.item.show();
		}
	}
	private breakTileFinish(evt: LogicEvent): void {
		if (this.player.pos.x == evt.data.x && this.player.pos.y == evt.data.y) {
			this.gameOver();
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
		tile.isLooping = true;
		tile.breakTile();


	}

	private getRandomNum(min, max): number {//生成一个随机数从[min,max]
		return min + Math.round(Math.random() * (max - min));
	}

	private gameOver(): void {
		console.log('gameover');
		if (this.isGameover) {
			return;
		}
		//让角色原地走一步触发死亡,防止走路清空动画
		this.movePlayer(-1);
		// egret.setTimeout(() => { this.resetGame(1); }, this, 3000)
		this.dispatchEventWith(LogicEvent.GAMEOVER);
		this.isGameover = true;

	}


}