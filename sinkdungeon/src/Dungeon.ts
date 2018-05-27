class Dungeon extends egret.Stage {
	public readonly SIZE: number = 9;
	public readonly SUCCESS_NUMBER: number = 15;
	public map: egret.Bitmap[][] = new Array();4
	public player: Player;
	private originX: number;
	private originY: number;
	private playerPos: egret.Point = new egret.Point();
	private dirs: egret.Bitmap[] = new Array(4);
	private playerShadow: egret.Bitmap;
	private randomArr: egret.Point[];
	private timer: egret.Timer;
	private gems:Gem[];

	public successNumber: number = this.SUCCESS_NUMBER;
	public level: number = 1;
	private isReseting: boolean = false;
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
		this.addGems();
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

		let delay = 200 - level * 10;
		if (delay < 100) {
			delay = 100;
		}
		this.timer.delay = delay;
		this.isReseting = false;
		this.timer.reset();
		this.timer.start();
		this.dispatchEventWith(LogicEvent.UI_REFRESHTEXT,false,{tileNum:this.randomArr.length});
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
		this.player.walk(px, py, dir, this.map[this.playerPos.x][this.playerPos.y].visible);
		if (!this.map[this.playerPos.x][this.playerPos.y].visible) {
			this.gameOver();
		}
	}
	private addTimer(): void {
		this.timer = new egret.Timer(200 - this.level * 10, this.SIZE * this.SIZE);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.breakTile, this);
		this.timer.start();
	}
	
	private breakTile(): void {
		if (this.randomArr.length <= this.successNumber) {
			console.log('finish')
			if (!this.isReseting) {
				this.isReseting = true;
				egret.setTimeout(() => { this.resetGame(++this.level); }, this, 1000)
			}

			return;
		}
		//发送breaktile消息
		this.dispatchEventWith(LogicEvent.DUNGEON_BREAKTILE,false,{tileNum:this.randomArr.length});
		let index = this.getRandomNum(0, this.randomArr.length - 1);
		let p = this.randomArr[index];
		let tile = this.map[p.x][p.y];
		let y = tile.y;
		this.randomArr.splice(index, 1);
		if(p.x==Math.floor(this.SIZE / 2)&&p.y==Math.floor(this.SIZE / 2)){
			return;
		}
		egret.Tween.get(tile, { loop: true })
			.to({ y: y + 5 }, 25)
			.to({ y: y }, 25)
			.to({ y: y - 5 }, 25)
			.to({ y: y }, 25);
		egret.Tween.get(tile).wait(2000).call(() => {
			egret.Tween.removeTweens(tile);
			egret.Tween.get(tile).to({ scaleX: 0.7, scaleY: 0.7 }, 700).to({ alpha: 0 }, 300).call(() => {
				this.map[p.x][p.y].visible = false;
				if (this.playerPos.x == p.x && this.playerPos.y == p.y) {
					this.gameOver();
				}
			})
		});


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

	private addGems():void{
		let gem = new Gem('01')
		let index = Math.floor(this.SIZE / 2)
		gem.x = this.map[index+1][index].x;
		gem.y = this.map[index+1][index].y;
		this.addChild(gem);
	}
}