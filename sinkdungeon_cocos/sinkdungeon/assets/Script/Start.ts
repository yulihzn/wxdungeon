import Logic from "./Logic";
import PlayerData from "./Data/PlayerData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
    }
    startGame(){
        Logic.level = 1;
        Logic.playerData = new PlayerData();
        cc.director.loadScene('loading');
    }
}
