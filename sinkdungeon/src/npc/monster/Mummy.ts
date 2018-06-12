class Mummy extends Monster{
	public constructor() {
		super(NpcConstants.MONSTER_MUMMY);
		this.maxHealth = 2;
		this.currentHealth = 2;
		this.healthBar.refreshHealth(this.currentHealth,this.maxHealth);
	}
}