const { ccclass, property } = cc._decorator;

@ccclass
export default class Launch extends cc.Component {

    readonly wx = window['wx']
    @property(cc.Node)
    usercontent: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    start() {
        // init logic
        if (!this.wx) {
            return;
        }
        this.wx.onMessage(data => {
            console.log(data.message);
            this.updateFriend();
        });
        this.updateFriend();


    }
    updateFriend() {
        let that = this;
        this.content.removeAllChildren();
        https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getUserInfo.html
        this.wx.getUserInfo({
            openIdList: ['selfOpenId'],
            lang: 'zh_CN',
            success: (res) => {
                console.log('user', res.data);
                let userInfo = res.data[0];
                that.createUserBlock(that.usercontent, userInfo,0);
            },
            fail: (res) => {
                console.error(res);
            }
        });

        // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
        this.wx.getFriendCloudStorage({
            keyList: ['score'],
            success: function (res) {
                console.log('friend', res.data);
                let friendlist = new Array();
                friendlist = friendlist.concat(res.data);
                if(friendlist.length>0){
                    friendlist=friendlist.sort((a,b)=>{
                        let avalue =parseInt(a.KVDataList && a.KVDataList[0]&& a.KVDataList[0].value  ? a.KVDataList[0].value : '0');
                        let bvalue =parseInt(b.KVDataList && b.KVDataList[0]&& b.KVDataList[0].value  ? b.KVDataList[0].value : '0');
                        return bvalue-avalue;
                    })
                }
                for (let i = 0; i < friendlist.length; i++) {
                    let friendInfo = friendlist[i];
                    if (!friendInfo) {
                        continue;
                    }
                    that.createUserBlock(that.createPrefab(), friendInfo,i+1);
                }
            },
            fail: function (res) {
                console.error(res);
            }
        });
        this.wx.getUserCloudStorage({
            keyList: ['score'],
            success: function (res) {
                console.log('Cloud', res);

                let score = res.KVDataList[0].value ? res.KVDataList[0].value : '';
                let userScore = that.usercontent.getChildByName('score').getComponent(cc.Label);
                userScore.string = score;
            },
            fail: function (res) {
                console.error(res);
            }
        });

    }

    createUserBlock(node: cc.Node, user,rank:number) {
        // getUserInfo will return the nickName, getFriendCloudStorage will return the nickname.
        let nickName = user.nickName ? user.nickName : user.nickname;
        let avatarUrl = user.avatarUrl;
        let score = user.KVDataList && user.KVDataList[0]&& user.KVDataList[0].value  ? user.KVDataList[0].value : '';
        let userName = node.getChildByName('userName').getComponent(cc.Label);
        let userScore = node.getChildByName('score').getComponent(cc.Label);
        let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
        let userRankNode = node.getChildByName('rank')
        let userRank = userRankNode?userRankNode.getComponent(cc.Label):null;

        userName.string = nickName;
        userScore.string = score;
        if(userRank){userRank.string = ''+rank;}
        cc.loader.load({
            url: avatarUrl, type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    createPrefab(): cc.Node {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        return node;
    }
}
