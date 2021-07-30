export default class AchievementData{
    index = 0;
    monsters :{[key:string]:number}={};
    items:{[key:string]:number}={};
    equips:{[key:string]:number}={};
    npcs:{[key:string]:number}={};
    maps:{[key:string]:number}={};
    challenges:{[key:string]:number}={};
    furnitures:{[key:string]:number}={};
    playerLifes = 0;
    valueCopy(data:AchievementData){
        if(!data){
            return;
        }
        this.index = data.index?data.index:0;
        this.monsters = data.monsters?data.monsters:{};
        this.items = data.items?data.items:{};
        this.equips = data.equips?data.equips:{};
        this.npcs = data.npcs?data.npcs:{};
        this.maps = data.maps?data.maps:{};
        this.challenges = data.challenges?data.challenges:{};
        this.furnitures = data.furnitures?data.furnitures:{};
        this.playerLifes = data.playerLifes?data.playerLifes:0;
    }
}