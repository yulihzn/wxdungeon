abstract class Monster extends egret.DisplayObjectContainer {
	public tag: string = 'monster';
	protected character: egret.Bitmap;
	protected characterShadow: egret.Bitmap;
	protected walking: boolean = false;
	protected isdead: boolean = false;
	protected healthBar: HealthBar;
	protected currentHealth: number = 2;
	protected maxHealth: number = 2;
	protected damage: number = 1;
	public posIndex: egret.Point = new egret.Point();
	protected astarGrid: AstarGrid;
	protected type: string = 'empty'
	public constructor(type: string) {
		super();
		this.type = type;
		this.init();
	}

	protected init(): void {
		this.character = new egret.Bitmap(RES.getRes(this.type));
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
		this.healthBar = new HealthBar();
		this.addChild(this.healthBar);
		this.healthBar.x = 0;
		this.healthBar.y = -103;
		this.astarGrid = new AstarGrid(Logic.SIZE, Logic.SIZE);
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
		egret.Tween.get(this.character).to({ x: x, y: y }, 100).call(() => {
			if (finish) {
				finish();
			}
		}).to({ x: 0, y: 0 }, 100);

	}
	public isWalking(): boolean {
		return this.walking;
	}
	public isDying(): boolean {
		return this.isdead;
	}
	public resetCharacter(indexX: number, indexY: number): void {
		egret.Tween.removeTweens(this.character);
		egret.Tween.removeTweens(this);
		this.parent.setChildIndex(this, 100);
		this.character.scaleX = 5;
		this.character.scaleY = 5;
		this.character.visible = true;
		this.character.alpha = 1;
		this.character.x = 0;
		this.character.y = 0;
		this.character.rotation = 0;
		this.characterShadow.visible = true;
		this.isdead = false;
		this.walking = false;
		this.currentHealth = this.maxHealth;
		this.healthBar.visible = true;
		this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
		this.posIndex.x = indexX;
		this.posIndex.y = indexY;
		let p = Logic.getInMapPos(this.posIndex);
		this.x = p.x;
		this.y = p.y;
	}
	public die(isFall: boolean): void {
		if (this.isdead) {
			return;
		}
		this.isdead = true;
		this.characterShadow.visible = false;

		if (isFall) {
			egret.Tween.get(this.character).to({ y: 32, scaleX: 2.5, scaleY: 2.5 }, 200).call(() => {
				this.parent.setChildIndex(this, 0);
			}).to({ scaleX: 1, scaleY: 1, y: 100 }, 100).call(() => {
				this.character.alpha = 0;
				this.healthBar.visible = false;
				this.character.texture = RES.getRes("monster00" + Logic.getRandomNum(1, 3));

			});
		} else {
			egret.Tween.get(this.character).to({ rotation: 90 }, 100).to({ rotation: 70 }, 50).to({ rotation: 90 }, 100).to({ alpha: 0 }, 100).call(() => {
				this.character.alpha = 0;
				this.healthBar.visible = false;
				this.character.texture = RES.getRes("monster00" + Logic.getRandomNum(1, 3));
			});
		}

	}
	protected walk(px: number, py: number, reachable: boolean): void {
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
		egret.Tween.get(this, { onChange: () => { } }).to({x:px, y: py}, 200).call(() => {
			if (this.isdead) {
				this.visible = false;
			}
			egret.Tween.removeTweens(this.character);
			this.character.rotation = 0;
			this.character.y = 0;
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
		}
		this.healthBar.refreshHealth(this.currentHealth, this.maxHealth);
	}
	//01234 top bottom left right middle
	public move(target: egret.Point, dungeon: Dungeon) {
		if (this.isWalking() || this.isDying()) {
			return;
		}
		let tile = dungeon.map[target.x][target.y];
		if (tile.building && tile.building.visible && tile.building.isblock) {
			return;
		}
		if (tile.floor.visible){
			this.posIndex = target;
		}
		let p = Logic.getInMapPos(this.posIndex);
		this.walk(p.x, p.y, tile.floor.visible);
		if (!tile.floor.visible) {
			this.move(this.posIndex, dungeon)
		}

	}
	public monsterAction(monsters: Monster[], player: Player, dungeon: Dungeon): void {
		if (this.isDying()) {
			return;
		}
		let endIndex = new egret.Point(player.pos.x, player.pos.y);
		if (Math.abs(player.pos.x - this.posIndex.x) > 1 && Math.abs(player.pos.y - this.posIndex.y) > 1) {
			endIndex.x = Logic.getRandomNum(0, 8);
			endIndex.y = Logic.getRandomNum(0, 8);
		}
		let targetPos = this.getNextStep(this.posIndex, endIndex);
		let dir = 4;
		if (targetPos.y != this.posIndex.y) {
			dir = targetPos.y - this.posIndex.y < 0 ? 0 : 1;
		}
		if (targetPos.x != this.posIndex.x) {
			dir = targetPos.x - this.posIndex.x < 0 ? 2 : 3;
		}
		if (Logic.isPointEquals(targetPos, player.pos)) {
			this.attack(dir, () => {
				if (targetPos.x == player.pos.x && targetPos.y == player.pos.y) {
					Logic.eventHandler.dispatchEventWith(LogicEvent.DAMAGE_PLAYER, false, { damage: this.damage });
				}
			});
		} else if (!dungeon.map[targetPos.x][targetPos.y].isBreakingNow) {
			let hasOther = false;
			for (let m of monsters) {
				if (Logic.isPointEquals(m.posIndex, targetPos)) {
					hasOther = true;
					break;
				}
			}
			if (!hasOther) {
				this.move(targetPos, dungeon);
			}
		}

	}
	protected getNextStep(startIndex: egret.Point, endIndex: egret.Point): egret.Point {
		let p = new egret.Point(startIndex.x, startIndex.y);
		this.astarGrid.setStartNode(startIndex.x, startIndex.y);
		this.astarGrid.setEndNode(endIndex.x, endIndex.y);
		let aStar: AstarMap = new AstarMap();
		if (aStar.findPath(this.astarGrid)) {
			let path = aStar.path;
			if (path.length > 1) {
				p.x = path[1].x;
				p.y = path[1].y;
			}
		}
		return p;
	}
}