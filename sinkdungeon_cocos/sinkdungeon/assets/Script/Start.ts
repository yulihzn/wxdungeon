import Logic from "./Logic";
import WxHelper from "./WxHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    @property(cc.Node)
    continueButton: cc.Node = null;
    @property(WxHelper)
    wxhelper:WxHelper = null;
    start () {
        cc.view.enableAntiAlias(false)
        // init logic
        if(this.continueButton){
            this.continueButton.active = Logic.profile.hasSaveData;
        }
        this.convert();
    }
    startGame(){
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        Logic.profile.clearData();
        cc.director.loadScene('chapter');
    }
    continueGame(){
        if(this.wxhelper){
            this.wxhelper.CloseDialog();
        }
        cc.director.loadScene('chapter');
    }
    convert(){
        cc.loader.loadRes('Data/Rooms/解析-1812课堂模拟一', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                let strs: string = resource.text;
                let arr = new Array();
                for(let i = 1;i<200;i++){
                    let s1 = `${i}`
                    let index1 = strs.indexOf(s1)
                    let s2 = `${i+1}`
                    let index2 = strs.indexOf(s2)-s2.length;
                    arr.push(strs.substr(index1,index2))
                    strs = strs.substr(index2,strs.length)
                    if(i == 199){
                        arr.push(strs.substr(strs.indexOf(s2),strs.length));
                    }
                }
                // console.log(arr[0]+'\n');
                // console.log(arr[1]+'\n');
                // console.log(arr[2]+'\n');
                // console.log(arr[4]+'\n');
                // let ss = ''
                // for(let i = 0;i < arr.length;i++){
                //     ss+=arr[i]+'\n'
                // }
                // console.log(ss)
                this.convert1(arr);
            }
        })
    }
    convert1(arr1:string[]){
        cc.loader.loadRes('Data/Rooms/1812课堂模拟一', (err: Error, resource) => {
            if (err) {
                cc.error(err);
            } else {
                let strs: string = resource.text;
                let arr = new Array();
                for(let i = 1;i<200;i++){
                    let index1 = strs.indexOf(`${i}.`)
                    let index2 = strs.indexOf(`${i+1}.`)
                    arr.push(strs.substr(index1,index2-1)+'\n')
                    strs = strs.substr(0,index1)+strs.substr(index2,strs.length)
                    if(i == 199){
                        arr.push(strs.substr(strs.indexOf(`200.`),strs.length));
                    }
                }
                // console.log(arr[0]+'\n');
                // console.log(arr[1]+'\n');
                // console.log(arr[2]+'\n');
                let arr3 = new Array();
                for(let i = 0;i < 201;i++){
                    arr3.push(`${arr[i]}\n${arr1[i]}\n`)
                }
                let ss = ''
                for(let i = 0;i < arr3.length;i++){
                    ss+=arr3[i]+'\n'
                }
                console.log(ss)
            }
        })
    }
}
