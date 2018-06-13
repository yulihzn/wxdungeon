class Anubis extends Monster{
	public constructor() {
		super(NpcConstants.MONSTER_ANUBIS);
		this.maxHealth = 3;
		this.currentHealth = 3;
		this.damage = 2;
		this.healthBar.refreshHealth(this.currentHealth,this.maxHealth);
	}
}