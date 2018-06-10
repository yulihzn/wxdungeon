class Player extends egret.DisplayObjectContainer {
	public tag: string = 'player';
	private player: egret.Bitmap;
	private playerShadow: egret.Bitmap;
	private item: egret.Bitmap;
	private walking: boolean = false;
	private isdead: boolean = false;
	public currentHealth: number = 1;
	public maxHealth: number = 3;
	public attackNumber: number = 1;
	public pos: egret.Point = new egret.Point();
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		this.player = new egret.Bitmap(RES.getRes("player00" + Logic.getRandomNum(1, 3)));
		this.player.smoothing = false;
		this.playerShadow = new egret.Bitmap(RES.getRes("shadow"));
		this.playerShadow.smoothing = false;
		this.item = new egret.Bitmap();
		this.item.smoothing = false;
		this.player.anchorOffsetX = this.player.width / 2;
		this.player.anchorOffsetY = this.player.height;
		this.player.x = 0;
		this.player.y = 0;
		this.player.scaleX = 5;
		this.player.scaleY = 5;
		this.playerShadow.anchorOffsetX = this.playerShadow.width / 2;
		this.playerShadow.anchorOffsetY = this.playerShadow.height / 2;
		this.playerShadow.x = 0;
		this.playerShadow.y = 0;
		this.playerShadow.alpha = 0.3;
		this.playerShadow.scaleX = 2;
		this.playerShadow.scaleY = 2;
		this.addChild(this.player);
		this.addChild(this.playerShadow);
		this.addChild(this.item);
	}
	public changeItemRes(texRes:string):void{
		if(!texRes){
			texRes = ItemConstants.EMPTY;
		}
		this.item.texture = RES.getRes(texRes);
		this.item.anchorOffsetX = this.item.width / 2;
		this.item.anchorOffsetY = this.item.height;
		this.item.rotation = 0;
		this.item.scaleX = 1;
		this.item.scaleY = 1;
		this.item.x = -this.player.width*5/2;
		this.item.y = -40;
	}
	
	public isWalking(): boolean {
		return this.walking;
	}
	public isDying(): boolean {
		return this.isdead;
	}
	public resetPlayer(): void {
		egret.Tween.removeTweens(this.player);
		egret.Tween.removeTweens(this);
		this.parent.setChildIndex(this, 100);
		this.player.scaleX = 5;
		this.player.scaleY = 5;
		this.player.visible = true;
		this.player.alpha = 1;
		this.player.x = 0;
		this.player.y = 0;
		this.item.alpha = 1;
		this.item.anchorOffsetX = this.item.width / 2;
		this.item.anchorOffsetY = this.item.height;
		this.item.x = -this.player.width*5/2;
		this.item.y = -40;
		this.player.rotation = 0;
		this.playerShadow.visible = true;
		this.isdead = false;
		this.walking = false;
		if (this.currentHealth < 1) {
			this.currentHealth = this.maxHealth;
		}
		let index = Math.floor(Logic.SIZE / 2);
		this.pos.x = index;
		this.pos.y = index;
		let p = Logic.getInMapPos(this.pos);
		this.x = p.x;
		this.y = p.y;
	}
	public die(isFall: boolean): void {
		if (this.isdead) {
			return;
		}
		this.isdead = true;
		this.currentHealth = 0;
		this.item.texture = null;
		this.playerShadow.visible = false;
		if (isFall) {
			egret.Tween.get(this.player).to({ y: 32, scaleX: 2.5, scaleY: 2.5 }, 200).call(() => {
				this.parent.setChildIndex(this, 0);
			}).to({ scaleX: 1, scaleY: 1, y: 100 }, 100).call(() => {
				this.player.alpha = 0;
				this.player.texture = RES.getRes("player00" + Logic.getRandomNum(1, 3));

			});
		} else {
			egret.Tween.get(this.item).to({ rotation: 90,y:-100}, 100).to({ alpha: 0 }, 200);
			egret.Tween.get(this.player).to({ rotation: 90 }, 100).to({ rotation: 70 }, 50).to({ rotation: 90 }, 100).to({ alpha: 0 }, 100).call(() => {
				this.player.alpha = 0;
				this.player.texture = RES.getRes("player00" + Logic.getRandomNum(1, 3));
			});
		}

	}

	private walk(px: number, py: number, dir: number, reachable: boolean): void {
		if (this.walking) {
			console.log("cant")
			return;
		}
		this.walking = true;
		let offsetY = 10;
		let ro = 10;
		if (dir == 1 || dir == 3) {
			offsetY = -offsetY;
			ro = -ro;
		}
		egret.Tween.get(this.player, { loop: true })
			.to({ rotation: ro, y: this.player.y + offsetY }, 25)
			.to({ rotation: 0, y: 0 }, 25)
			.to({ rotation: -ro, y: this.player.y - offsetY }, 25)
			.to({ rotation: 0, y: 0 }, 25);
		egret.Tween.get(this, { onChange: () => { } }).to({ x: px, y: py }, 200).call(() => {
			egret.Tween.removeTweens(this.player);
			this.player.rotation = 0;
			this.player.y = 0;
			this.walking = false;
			if (!reachable) {
				this.die(true);
			}
		});
	}
	public takeDamage(damage: number): void {
		this.currentHealth -= damage;
		if (this.currentHealth > this.maxHealth) {
			this.currentHealth = this.maxHealth;
		}
		if (this.currentHealth < 1) {
			this.die(false);
			this.parent.dispatchEventWith(LogicEvent.GAMEOVER);
		}
	}
	public attack(dir, finish): void {
		let x = 0;
		let y = 0;
		switch (dir) {
			case 0: y -= 40; break;
			case 1: y += 40; break;
			case 2: x -= 40; break;
			case 3: x += 40; break;
			case 4: break;
		}
		egret.Tween.get(this.player).to({ x: x, y: y }, 100).call(() => {
			if (finish) {
				finish();
			}
		}).to({ x: 0, y: 0 }, 100);

	}
	//01234 top bottom left right middle
	public move(dir: number, dungeon: Dungeon) {
		if (this.isWalking() || this.isDying()) {
			return;
		}
		console.log('walking')
		switch (dir) {
			case 0:
				if (this.pos.y - 1 >= 0) {
					this.pos.y--;
				}
				break;
			case 1:
				if (this.pos.y + 1 < Logic.SIZE) {
					this.pos.y++;
				}
				break;
			case 2:
				if (this.pos.x - 1 >= 0) {
					this.pos.x--;
				}
				break;
			case 3: if (this.pos.x + 1 < Logic.SIZE) {
				this.pos.x++;
			}
				break;
			case 4:
				break;
			default: break;

		}
		let tile = dungeon.map[this.pos.x][this.pos.y];
		let p = Logic.getInMapPos(this.pos);
		this.walk(p.x, p.y, dir, tile.floor.visible);
		let index = Math.floor(Logic.SIZE / 2);
		if (!tile.floor.visible) {
			this.parent.dispatchEventWith(LogicEvent.GAMEOVER);
		}
		if (tile.floor.visible) {
			egret.setTimeout(() => {
				tile.breakTile();
			}, this, 1000)
		}
		let olditem = dungeon.itemManager.getItem(this.pos);
		if (olditem && (olditem.isAutoPicking())) {
			olditem.taken();
		}
		if (this.pos.x == dungeon.portal.posIndex.x
			&& this.pos.y == dungeon.portal.posIndex.y
			&& dungeon.portal.isGateOpen()) {
			this.parent.dispatchEventWith(LogicEvent.DUNGEON_NEXTLEVEL, false, { level: ++dungeon.level });
		}
	}

	public useItem():void{
		egret.Tween.get(this.item).to({scaleX:2,scaleY:2,alpha:0},1000).call(()=>{
			this.changeItemRes(RES.getRes(ItemConstants.EMPTY));
		});
	}
	
}