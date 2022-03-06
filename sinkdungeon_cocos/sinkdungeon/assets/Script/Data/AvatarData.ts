import DataUtils from "../utils/DataUtils";
import ProfessionData from "./ProfessionData";

export default class AvatarData {
    static readonly FOLLOWER = 0;
    static readonly HUNTER = 1;
    static readonly GURAD = 2;
    static readonly TECH = 3;
    static readonly ORGANIZATION = ['弥世逐流', '宝藏猎人', '幽光守护', '翠金科技'];
    organizationIndex: number = 0;//['弥世逐流','宝藏猎人','幽光守护','翠金科技']
    professionData: ProfessionData = new ProfessionData();
    skinColor: string = '#ffe1c5';
    hairResName: string = 'avatarhair000anim00';
    hairColor: string = '#000000';
    eyesResName: string = 'avatareyes000';
    eyesColor: string = '#000000';
    faceResName: string = 'avatarface000';
    faceColor: string = '#FBA1DE';
    petName: string = 'nonplayer100';

    public valueCopy(data: AvatarData): void {
        if (!data) {
            return;
        }
        DataUtils.baseCopy(this,data,true);
        // this.organizationIndex = data.organizationIndex ? data.organizationIndex : this.organizationIndex;
        this.professionData.valueCopy(data.professionData);
        // this.skinColor = data.skinColor ? data.skinColor : this.skinColor;
        // this.hairResName = data.hairResName ? data.hairResName : this.hairResName;
        // this.hairColor = data.hairColor ? data.hairColor : this.hairColor;
        // this.eyesResName = data.eyesResName ? data.eyesResName : this.eyesResName;
        // this.eyesColor = data.eyesColor ? data.eyesColor : this.eyesColor;
        // this.faceResName = data.faceResName ? data.faceResName : this.faceResName;
        // this.faceColor = data.faceColor ? data.faceColor : this.faceColor;
        // this.petName = data.petName&&data.petName ? data.petName : this.petName;

    }
    public clone(): AvatarData {
        let e = new AvatarData();
        e.valueCopy(this);
        // e.organizationIndex = this.organizationIndex;
        // e.professionData = this.professionData;
        // e.skinColor = this.skinColor;
        // e.hairResName = this.hairResName;
        // e.hairColor = this.hairColor;
        // e.eyesResName = this.eyesResName;
        // e.eyesColor = this.eyesColor;
        // e.faceResName = this.faceResName;
        // e.faceColor = this.faceColor;
        // e.petName = this.petName;
        return e;
    }
}