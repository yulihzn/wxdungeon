import Logic from "./Logic";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class WxHelper extends cc.Component {
    readonly wx = window['wx'];
    @property(cc.Node)
    user: cc.Node = null;
    @property(cc.Node)
    startButtonNode: cc.Node = null;
    @property(cc.WXSubContextView)
    rankList: cc.WXSubContextView = null;
    @property
    rankListOpen: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        if (this.rankList) {
            this.CloseDialog();
            this.rankList.node.active = this.rankListOpen;
        }
        if (!this.wx) {
            return;
        }
        if (!this.startButtonNode) {
            this.saveRankData();
            return;
        }
        let btnSize = cc.size(this.startButtonNode.width + 10, this.startButtonNode.height + 10);
        let frameSize = cc.view.getFrameSize();
        let winSize = cc.director.getWinSize();
        //适配不同机型来创建微信授权按钮
        let left = (winSize.width * 0.5 + this.startButtonNode.x - btnSize.width * 0.5) / winSize.width * frameSize.width;
        let top = (winSize.height * 0.5 - this.startButtonNode.y - btnSize.height * 0.5) / winSize.height * frameSize.height;
        let width = btnSize.width / winSize.width * frameSize.width;
        let height = btnSize.height / winSize.height * frameSize.height;
        // https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html
        let button = this.wx.createUserInfoButton({
            type: 'text',
            text: 'getUserInfo',
            style: {
                left: left,
                top: top,
                width: width,
                height: height,
                lineHeight: 0,
                backgroundColor: '',
                color: '#000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 3
            }
        });

        let that = this;
        let userInfo = null;
        button.onTap((res) => {
            if (userInfo) {
                button.hide();
                return;
            }
            switch (res.errMsg) {
                case 'getUserInfo:ok':
                    button.hide();
                    cc.sys.localStorage.setItem('hasUserInfo','1');
                    userInfo = res.userInfo;
                    let nickName = userInfo.nickName;
                    let avatarUrl = userInfo.avatarUrl;
                    that.setUserConfig(nickName, avatarUrl);
                    that.wx.getOpenDataContext().postMessage({
                        message: "User info get success."
                    });
                default:
                    console.error(res.errMsg);
                    break;
            }
        });
        let hasUserInfo = cc.sys.localStorage.getItem('hasUserInfo');
        if(hasUserInfo == '1'){
            button.hide();
        }
    }
    setUserConfig(nickName, avatarUrl) {
        if (!this.user) {
            return;
        }
        let userAvatarSprite = this.user.getChildByName('mask').getComponentInChildren(cc.Sprite);
        let nickNameLabel = this.user.getChildByName('userName').getComponent(cc.Label);

        nickNameLabel.string = nickName;
        cc.loader.load({
            url: avatarUrl,
            type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userAvatarSprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    }
    // update (dt) {}

    //button close
    CloseDialog() {
        if (this.wx&&this.node&&this.rankList&&this.rankList.node) {
            this.rankList.node.active = false;
            let openDataContext = this.wx.getOpenDataContext();
                openDataContext.postMessage({
                    message: 'close',
                });
        }
    }
    OpenDialog() {
        if (this.wx&&this.rankList) {
            this.rankList.node.active = true;
            this.saveRankData();
        }
    }


    saveRankData() {
        if (!this.wx) {
            console.log('wx is empty')
            return;
        }
        let that = this;
        that.wx.setUserCloudStorage({
            KVDataList: [{ key: 'score', value: Logic.coins + '' }],
            success: res => {
                console.log('score' + Logic.coins + '');
                console.log(res);
                // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                let openDataContext = that.wx.getOpenDataContext();
                openDataContext.postMessage({
                    message: 'updateMaxScore',
                });
            },
            fail: res => {
                console.log('failed' + Logic.coins + '');
                console.log(res);
            }
        });
    }
    
}
