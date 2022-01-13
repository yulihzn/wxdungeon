VAR metrocount = 0
VAR waitcount = 0
VAR buscount = 0
VAR metroevent = 0

VAR line = 0
VAR enemylife = 0
VAR enemyturns = 0
VAR energy = 5//体力
VAR sanity = 5//精神状态
VAR strength = 0//0文文弱弱1身强力壮2力大无穷
VAR agility = 0//0很少运动1灵活敏捷2健步如飞
VAR charisma = 0//0平平无奇1魅力四射2倾国倾城
VAR lucky = 0//0没啥运气1运气不错2运气爆棚
->start
//成就
//地铁格斗王 打败三名乘客
//高处不胜寒 被挤到天花板
//喷射战士 被挤出屎
===start===
+(pickcustom)[选择身份]
    --你是一个<>
        ++文文弱弱<>
            ~strength = 0
        ++身强力壮<>
            ~strength = 1
        ++力大无穷<>
            ~strength = 2
    --的人，平日里<>
        ++很少运动。<>
            ~agility = 0
        ++身手敏捷。<>
            ~agility = 1
        ++健步如飞。<>
            ~agility = 2
    --长得<>
        ++平平无奇，<>
            ~charisma = 0
        ++{agility+strength<4 }眉清目秀，<>
            ~charisma = 1
        ++{agility+strength<3 }魅力四射，<>
            ~charisma = 2
    --<>总是<>
        ++没啥运气
            ~lucky = 0
        ++{agility+strength+charisma<4 }运气不错<>
            ~lucky = 1
        ++{agility+strength+charisma<3 }运气爆棚<>
        ~lucky = 2
        
+(pickrandom)[随机身份]
~strength = RANDOM(0, 2)
~agility = RANDOM(0, 2)
~temp t1 = agility+strength
{t1:
- 0: ~charisma = RANDOM(0, 2)
- 1: ~charisma = RANDOM(0, 2)
- 2: ~charisma = RANDOM(0, 2)
- 3: ~charisma = RANDOM(0, 1)
- else: ~charisma = 0
}
~temp t2 = t1+charisma
{t2:
- 0: ~lucky = RANDOM(0, 2)
- 1: ~lucky = RANDOM(0, 2)
- 2: ~lucky = RANDOM(0, 2)
- 3: ~lucky = RANDOM(0, 1)
- else: ~lucky = 0
}

你是一个<>{strength:
- 0:文文弱弱
- 1:身强力壮
- 2:力大无穷
}
<>的人，平日里<>
{agility:
- 0:很少运动。
- 1:身手敏捷。
- 2:健步如飞。
}
长得<>
{charisma:
- 0:平平无奇，
- 1:眉清目秀，
- 2:魅力四射，
}
<>总是<>
{lucky:
- 0:没啥运气
- 1:运气不错
- 2:运气爆棚
}
-<>。
+[开始剧情]下班了，->paragraph1
+[再次随机]->pickrandom
+[选择身份]->pickcustom

=== paragraph1 ===
~energy=5
~sanity=5
你又来到了地铁:
+(two)[2号线]人真特么多，进站好不容易排上了队伍，
    发现至少得等三班车才能上去。
    这一站的护栏不是全封闭的，你望着黑洞洞的隧道发了一会儿呆。
    ~line = 2
    ->waitmetro
+(six)[6号线]今天下雨，这一站人超级多。
    虽然很容易进站了，但是队伍也超级长，队伍也歪歪扭扭的，看来不少人没挤进去。
~line = 6
->waitmetro
+(sixteen)[16号线]人山人海，你连站都进不去。
    还进不进去呢？
    ++[排队进站]你掏出了手机开始看剧。
    大约十五分钟你终于进站了。
    ~line = 16
    ->waitmetro
    ++[转乘公交]你狠心回头走向了公交站。
    ->busstation


===busstation===
此时你的内心有个声音在喊：
{&别犹豫了，快点去坐地铁啊！|今天地铁APP支付打折。|刚刚在地铁站看到一个身材超辣的美女！|今天太冷了，坐地铁舒服。|公交车不会来了，别等了。|高峰期路上太堵了。|要不再回去看看也许人少了。|真的有必要等下去吗?|赶紧去坐地铁好回家吃饭。}
+[放弃等公交]于是<>
~buscount = 0
->paragraph1
+[坚持等公交]
~buscount = buscount+1
{buscount>18:
    真佩服你的毅力与无聊。。。
    在漫长的旅途中你终于到家啦。
    +[但是。。。]
    你居然不去挤地铁！
    真是电线杆子上裹鸡毛，好！大！的！掸！子！
    ->gamefail
-else:
    你已经等了{buscount*5}分钟了，公交车却迟迟没来，
    ->busstation
}


===waitmetro===
{waitcount<1:你等很久终于站在第一个了。}
~waitcount=waitcount+1
-地铁来了，里面挤满了人，但是没有一个下的。
+(wait)[让后面的人先上]->energyup->sanitydown->

于是你又开始等下一班地铁。->waitmetro
+(pushin)[拼命挤上去]你使出了吃奶的力气往前赶。
    {
    - line==2: 地铁没停稳,围栏居然坏了。
            {
            - agility>0:
                好在平日锻炼的多，你站稳了。
            - lucky>0:
                好在你运气还不错，一屁股坐在了地上与地铁擦肩而过。
            - charisma>1:
                平日里魅力四射的你，后面一个早已对你心仪的小哥哥看到了，一把拉住了你。
            - else: 
                {~你一下没站稳被飞驰而来的地铁给干掉了。->gamefail|还好你及时刹住了。}
            }
                工作人员疏散人群清理了一下让你们到旁边车门上车。
                ~line=0
        
    }
+[查看状态]你的体力为{energy}，精神为{sanity}
    ++[让后面的人先上]->wait
    ++[拼命挤上去]->pushin
    
-但是你后面几个人蜂拥而上一下就超过了你。
    +你冲了过去->energydown->
        <>{~, 顺利进去了。->inmetro|, 没能快过他们只好再等一波。->sanitydown->waitmetro|, 没能快过他们只好再等一波。->sanitydown->waitmetro|, 没能快过他们只好再等一波。->sanitydown->waitmetro}
    +{agility>0}你快步冲了上去->energydown->
        <>{~,顺利进去了。->inmetro|,顺利进去了。->inmetro|,顺利进去了。->inmetro|,没能快过他们只好再等一波。->waitmetro}
    +{agility>1}你闪电般地冲了上去。->energydown->
        <>,顺利进去了。->inmetro
-终于挤进了地铁->inmetro

===inmetro===
地铁里留下的空隙不多,
+[门口侧边]你瞅准了门口侧边一个小缝隙挤了进去,门口几个抓座位扶手的一下被迫抓着吊顶的扶手。-> quarrel
+[被后面的人推进去了]你正不知道站哪的时候被后面的人一把推进了地铁。-> quarrel
+{agility>0}[靠里面车门]你非常灵活地侧身挤了进去但是不小心踩到了几个人。-> quarrel
+{strength>0}[直接进去]你的力气非常大，一下就挤进去了。-> quarrel
+{charisma>1}[乘客侧身让你进去]你无奈的摇了摇头不知道往哪站，旁边一个乘客被你的样子萌翻了，侧身让你站了过去。-> quarrel
+{lucky>0}[正好有人准备下车]这个时候正好有个乘客准备下车，你瞅准机会站到了他的位置，但是你的包还是挤到了几个人。-> quarrel
=quarrel
只听见哎呀几声，你尴尬的清了下嗓子表情十分难看，不过你带着口罩也没人看得出来。
旁边几个人小声咕隆了几句，“这人怎么这么没素质。”
{charisma>1:往你这边看过来被你长长的睫毛和卡姿兰大眼睛迷住了，也没再说什么。->main}
{
    - charisma<2:
    旁边一精神小伙说，“你这人怎么这样，我的新AJ被你一脚踩脏了，你今天必须得像我道歉！”
    你也是被逼无奈，你决定
    ++[默不作声]一声不吭，直接无视他。
    {strength>0:对面看你一身腱子肉，到嘴边的话又收回去了{strength<2:，恶狠狠地瞪了你一眼}。}
    ->main
    ++[怼回去]怼回去：“地铁这么挤怪我咯？你穿新鞋不会自己打车吗？”
        小伙说：“我看你是活腻了，今天你必须得给我道歉！”。
        说完一把揪住了你的衣领。你也不甘示弱决定反击。
        ~enemylife = 3
        ~enemyturns = 0
        ->fight->main
    ++[道歉]道个歉：“不好意思，我不是故意的。”
        对面也不好再说什么。->sanitydown->main
}
-列车关门了，开始漫长的回家之路了。->DONE


===fight===
=turnstart
->enemyturn->attack
=attack
{enemyturns>5:->fightfinsh}
{enemylife<0:->fightfinsh}
+(punch)[上勾拳]一记上勾拳直击对面下巴,
    {strength>1&&agility>1:迅速而且有力，直接把对面击晕了。下一站你就被乘警抓走去喝茶了。->gamefail}
    {~对面被你结实地打了一拳。->enemyhit->attack|对面躲开了然后给你来了一拳。->dodge}
+(pushaway)[推开对面]你推开了对面。对面也打算推你。->dodge
+(kick)[用脚踹]一脚往他身上踹过去了，
    {strength>1&&agility>1:迅速而且有力，直接把对面踢骨折了。下一站你就被乘警抓走去喝茶了。->gamefail}
    {~对面被你踹了一脚。->enemyhit->energydown->attack|对面躲开了然后给你来了鞭腿。->dodge}
+(hair)[抓头发]
    {~对面被你抓住了头发。->attack|对面躲开了然后也抓住了你的头发。->dodge}
+[抓衣领]
    对面被你抓住了衣领,对面也抓住了你的衣领。->attack
=dodge
{attack.pushaway:{agility>1:你灵活地躲开了。->attack}{~你灵活地躲开了。->attack|你也被推了一把。->attack}}
{attack.punch:{agility>1:你灵活地躲开了。->attack}{~你灵活地躲开了。->attack|你也被锤了一拳。->energydown->attack}}
{attack.kick:{agility>1:你灵活地躲开了。->attack}{~你灵活地躲开了。->attack|你也被踢了一脚。->energydown->attack}}
{attack.hair:{agility>1:你灵活地躲开了。->attack}{~你灵活地躲开了。->attack|你也被抓住了头发。->energydown->attack}}
->attack
=enemyhit
~enemylife--
{enemylife<0:对面被你击败了也不敢说啥，几个人来劝架把你们拉开了，他在下一站就灰溜溜地下车了。}
->->
=enemyturn
~enemyturns++
{enemyturns>5:几个人来劝架把你们拉开了，他在下一站就灰溜溜地下车了。}
->->
=fightfinsh
战斗结束了。
->->
->->

===main===
~metrocount++
{metrocount>10:你终于到站了。->gamesuccess}
~metroevent = RANDOM(0,5)
->dooropen
=dooropen
列车进站，门又打开了，下去一批人，又涌上来一批人。
{metroevent:
- 0:眼看你所处的位置变得十分拥挤。
- 1:你所处的位置变得十分宽松。
- 2:你旁边有个人好像要吐了。
- 3:你旁边有个人的脚奇臭无比。
- 4:有几个人拼命地往你这边挤。
}
你决定
+(move)[挪个地方]你决定挪个地方。
    {metroevent:
        - 0:幸好你挪了个宽松位置。->energydown->main
        - 1:你白费劲了一番。->energydown->main
        - 2:幸好你挪了个位置。->energydown->main
        - 3:幸好你挪了个位置。->energydown->main
        - 4:幸好你挪了个位置。->energydown->main
    }
    ->main
+(stay)[原地不动]你决定原地不动。
    {metroevent:
        - 0:你被挤到要吐血了。->sanitydown->main
        - 1:你在原地不动。->energyup->main
        - 2:{agility>0||lucky>0:{~吐了你一身。->sanitydown->main|你躲开了。->main}}{agility<1:吐了你一身。->sanitydown->main}
        - 3:{charisma>0:{~你差点被熏吐了。->sanitydown->main|他看到了你靓丽姿态，默默收起了自己的脚。->main}}{charisma<1:你差点被熏吐了。->sanitydown->main}
        - 4:你被挤到了天花板了。->energydown->sanitydown->main
    }
    ->main
+[查看状态]你的体力为{energy}，精神为{sanity}
    ++[挪个地方]->move
    ++[原地不动]->stay
    ->main
    
->gamesuccess

===gamesuccess===
在漫长的旅途中你终于到家啦!
+[成功通关！！！]
# RESTART
->END
===gamefail===
+[再试一次]
# RESTART
->END

===sanityup===
~sanity=sanity+1
{sanity>10:
    ~sanity=10
}
你感觉精神状态好了点({sanity})。
->->
===sanitydown===
~sanity=sanity-1
你感觉精神有些许疲惫({sanity})。
{sanity<1:你的精神崩溃了，一下子晕过去了->gamefail}
->->
===energyup===
~energy=energy+1
{energy>10:
~energy=10
}
你感觉体力恢复了一点({energy})。
->->
===energydown===
~energy=energy-1
你感觉耗费了一点力气({energy})。
{energy<1:你的身体累垮了，一下子晕过去了->gamefail}
->->