class Monster extends egret.DisplayObjectContainer {
	private character: egret.Bitmap;
	private characterShadow: egret.Bitmap;
	private walking: boolean = false;
	private isdead: boolean = false;
	private health: number = 1;
	public posIndex: egret.Point = new egret.Point();
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		this.character = new egret.Bitmap(RES.getRes("monster00" + Logic.getRandomNum(1, 3)));
		this.character.smoothing = false;
		this.characterShadow = new egret.Bitmap(RES.getRes("shadow"));
		this.characterShadow.smoothing = false;
		let index = 0
		this.character.anchorOffsetX = this.character.width / 2;
		this.character.anchorOffsetY = this.character.height;
		this.character.x = 0;
		this.character.y = 0;
		this.character.scaleX = 5;
		this.character.scaleY = 5;
		this.characterShadow.anchorOffsetX = this.characterShadow.width / 2;
		this.characterShadow.anchorOffsetY = this.characterShadow.height / 2;
		this.characterShadow.x = 0;
		this.characterShadow.y = 0;
		this.characterShadow.alpha = 0.3;
		this.characterShadow.scaleX = 2;
		this.characterShadow.scaleY = 2;
		this.addChild(this.character);
		this.addChild(this.characterShadow);
	}
	public isWalking(): boolean {
		return this.walking;
	}
	public isDying(): boolean {
		return this.isdead;
	}
	public resetCharacter(indexX:number,indexY:number): void {
		egret.Tween.removeTweens(this.character);
		egret.Tween.removeTweens(this);
		this.parent.setChildIndex(this, 100);
		this.character.scaleX = 5;
		this.character.scaleY = 5;
		this.character.visible = true;
		this.character.alpha = 1;
		this.character.x = 0;
		this.character.y = 0;
		this.characterShadow.visible = true;
		this.isdead = false;
		this.walking = false;

		this.posIndex.x = indexX;
		this.posIndex.y = indexY;
		let p = Logic.getInMapPos(this.posIndex);
		this.x = p.x;
		this.y = p.y;
	}
	public die(): void {
		if (this.isdead) {
			return;
		}
		this.isdead = true;
		this.characterShadow.visible = false;
		egret.Tween.get(this.character).to({ y: 32, scaleX: 2.5, scaleY: 2.5 }, 200).call(() => {
			this.parent.setChildIndex(this, 0);
		}).to({ scaleX: 1, scaleY: 1, y: 100 }, 100).call(() => {
			this.character.alpha = 0;
			this.character.texture = RES.getRes("monster00" + Logic.getRandomNum(1, 3));

		});
	}
	private walk(px: number, py: number , reachable: boolean): void {
		if (this.walking) {
			console.log("cant")
			return;
		}
		this.walking = true;
		let offsetY = 10;
		let ro = 10;
		egret.Tween.get(this.character, { loop: true })
			.to({ rotation: ro, y: this.character.y + offsetY }, 25)
			.to({ rotation: 0, y: 0 }, 25)
			.to({ rotation: -ro, y: this.character.y - offsetY }, 25)
			.to({ rotation: 0, y: 0 }, 25);
		egret.Tween.get(this, { onChange: () => { } }).to({
			x:
			px, y: py
		}, 200).call(() => {
			egret.Tween.removeTweens(this.character);
			this.character.rotation = 0;
			this.character.y = 0;
			this.walking = false;
			if (!reachable) {
				this.die();
			}
		});
	}
	public takeDamage(damage: number): void {
		this.health -= damage;
		if (this.health < 0) {
			this.die()
		}
	}
	//01234 top bottom left right middle
	public move(target: egret.Point, dungeon: Dungeon) {
		if (this.isWalking() || this.isDying()) {
			return;
		}
		let tile = dungeon.map[target.x][target.y];
		if (tile.building&&tile.building.visible&&tile.building.isblock) {
			return;
		}
		if(tile.floor.visible)
		this.posIndex = target;
		let p = Logic.getInMapPos(target);
		this.walk(p.x, p.y, tile.floor.visible);
		if (!tile.floor.visible) {
			this.move(this.posIndex,dungeon)
		}
		
	}
}