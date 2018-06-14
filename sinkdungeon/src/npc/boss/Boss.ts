class Boss extends egret.DisplayObjectContainer {
	private bossBitmap: egret.Bitmap;
	private hands: egret.MovieClip[];
	protected healthBar: HealthBar;
	protected currentHealth: number = 20;
	protected maxHealth: number = 20;
	protected damage: number = 1;
	public isShow = false;
	public isDead = false;
	public bullet: Bullet;
	private frontHands:egret.Bitmap[];

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
	}
	private init(): void {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.init, this);
		this.bossBitmap = new egret.Bitmap(RES.getRes('boss001'));
		this.bossBitmap.smoothing = false;
		this.bossBitmap.anchorOffsetX = this.bossBitmap.width / 2;
		this.bossBitmap.anchorOffsetY = this.bossBitmap.height;
		this.bossBitmap.scaleX = 20;
		this.bossBitmap.scaleY = 20;
		this.hands = new Array();
		let data = RES.getRes('bosshand_json');
		let tex: egret.Texture = RES.getRes('bosshand_png');
		let fac = new egret.MovieClipDataFactory(data, tex);
		for (let i = 0; i < 4; i++) {
			let anim = new egret.MovieClip(fac.generateMovieClipData('bosshandswip'));
			anim.smoothing = false;
			anim.x = -this.bossBitmap.width / 2 * 20 + this.bossBitmap.width * i / 3 * 20;
			anim.scaleX = 16;
			anim.scaleY = 16;
			if (i == 2 || i == 3) {
				anim.skewY = 180;
			}
			if (i == 1 || i == 2) {
				anim.scaleX = 15;
				anim.scaleY = 15;
			}
			anim.rotation = 180;
			this.addChild(anim);
			anim.play(-1);
			this.hands.push(anim);
		}
		this.addChild(this.bossBitmap);

		this.healthBar = new HealthBar();
		this.addChild(this.healthBar);
		this.healthBar.x = -this.bossBitmap.width / 2 * 20;
		this.healthBar.y = -this.bossBitmap.height * 20 - 32;
		this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
		this.bullet = new Bullet(4, 2);
		this.parent.addChild(this.bullet);
		this.addFrontHands();
	}
	private addFrontHands():void{
		this.frontHands = new Array();
		let index = Math.floor(Logic.SIZE / 2);
		for (let i = 0; i < 4; i++) {
			let hand = new egret.Bitmap(RES.getRes('boss001hand'));
			hand.smoothing = false;
			hand.scaleX = 4;
			hand.scaleY = 4;
			if (i == 0 || i == 1) {
				hand.skewY = 180;
			}
			let p = Logic.getInMapPos(new egret.Point(index-1+i, index-1));
			hand.x = p.x;
			hand.y = p.y;
			this.parent.addChild(hand);
			this.frontHands.push(hand);
		}

	}
	/**是否是boss区域 */
	public isBossZone(target: egret.Point): boolean {
		return target.y < 4 && target.x != 0 && target.x != 8;
	}
	public takeDamage(damage: number): void {
		this.currentHealth -= damage;
		if (this.currentHealth > this.maxHealth) {
			this.currentHealth = this.maxHealth;
		}
		if (this.currentHealth < 1) {
			this.die();
		}
		this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
	}
	private die(): void {
		this.isDead = true;
		let index = Math.floor(Logic.SIZE / 2)
		let p = Logic.getInMapPos(new egret.Point(index, Logic.SIZE));
		egret.Tween.get(this).to({ y: p.y - 64, alpha: 0 }, 3000).call(() => {
			this.resetBoss();
			Logic.eventHandler.dispatchEventWith(LogicEvent.OPEN_GATE);
		});
	}
	public resetBoss(): void {
		let index = Math.floor(Logic.SIZE / 2)
		let p = Logic.getInMapPos(new egret.Point(index, Logic.SIZE));
		this.alpha = 0;
		this.x = p.x;
		this.y = p.y - 128;
		this.visible = false;
		this.isShow = false;
		this.isDead = true;
		this.bullet.parent.setChildIndex(this.bullet, 1000);
	}
	public showBoss(): void {
		this.resetBoss();
		let index = Math.floor(Logic.SIZE / 2);
		let p = Logic.getInMapPos(new egret.Point(index, index-1));
		this.visible = true;
		egret.Tween.get(this).to({ y: p.y, alpha: 1 }, 3000).call(() => {
			this.isDead = false;
			this.isShow = true;
		})
	}
	public fire(perMove): void {
		this.bullet.fire(1, perMove);
	}
}