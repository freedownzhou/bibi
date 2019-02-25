<template>
  <div class="pupcon" :visible="visible">
    <div class="title ft28 bold pt50">JON农生链上线活动，交易轻松瓜分20万JON</div>
    <div class="fontBox color-333 ft16">
      <div>欢贺新年～热烈祝贺JON上线ETC社区交易所币汇网。JON三重豪礼大放送！</div>
      <div>活动期间注册ETC社区交易所币汇网会员，自动升级为vip会员享受JON千分之一（超低）交易手续费。</div>
      <div>活动期间注册ETC社区交易所币汇网会员，<span class="red">享受所推荐用户交易费50%返佣。</span></div>
      <div>活动时间：2019年2月26日 12:00 – 2019年3月5日 24:00（UTC + 8）</div>
      <div>活动规则：</div>
      <div>活动一、JON注册礼</div>
      <div>活动期间，在ETC社区交易所注册且就送10个JON，中级实名通过后再送100个JON。(提币最少数量200个JON，每笔提币矿工费80个JON)</div>
      <div class="blue mt20 mb20" @click="$router.push({name: 'Register', params: {inviteeCode: 'inviteeCode'}})">马上注册></div>
      <div>活动二、3万JON充值礼</div>
      <div>活动期间，在ETC社区交易所充值数量≥500JON的用户，且活动期间每日保持不低于500JON，截止之前账户保留500以上JON即可获赠5JON奖励！
        注：5000个送58个、10000个送106个、20000个送212个。充50000个送580个，以此类推。</div>
      <div>* 每位用户充值最高奖励5800JON ，充值活动总奖池30000JON ，根据满足金额的充值时间顺序发放，先到先得！</div>
      <div class="red">1. 2019年2月26日 12:00 – 2019年3月5日 24:00（UTC + 8）期间如有提现任何币种行为，将失去奖励资格；</div>
      <div class="red">2. 活动二奖励将统一在2019年3月5日24:00（UTC+8）前发放至ETC社区交易所账户；</div>
      <div class="blue mt20 mb20" @click="$router.push({name: 'TopUp'})">马上充值></div>
      <div>活动三、JON 交易奖</div>
      <div>活动期间，所有用户在ETC社区交易所交易2天（活动期间每累计交易即可获得一次抽奖机会，可不连续2天）即可获得一次抽奖机会（抽奖奖励见活动四）</div>
      <div>活动期间，累计交易额排行前10的用户奖励如下：</div>
      <table class="table" border="1" cellspacing="0" >
        <tr>
          <th>累计交易额</th>
          <th>交易奖励</th>
        </tr>
        <tr v-for="(item, index) in tableData1" :key="index">
          <td>{{index + 1}}</td>
          <td>{{item}}</td>
        </tr>
      </table>
      <div>（每个自然日 上午10:00会更新交易额排名榜单）</div>
      <div class="blue mt20 mb20" @click="$router.push({name: 'OtcTrading'})">立即交易></div>
      <div>活动四、邀请好友中Iphone XS</div>
      <div>邀请奖励：活动期间用户每邀请2人完成注册通过中级认证即可获得一次抽奖机会，参与幸运抽奖上不封顶（百分百中奖）</div>
      <table class="table" border="1" cellspacing="0">
        <tr>
          <th>奖项</th>
          <th>活动奖励</th>
        </tr>
        <tr v-for="(item, index) in tableData2" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.value}}</td>
        </tr>
      </table>
      <div>（每个自然日 上午10:00会更新一次抽奖排名榜单）</div>
      <div>注意事项：</div>
      <div>1. 如果对奖励发放存在疑问，请在奖励发放后5日内提交工单，过时将不予处理，敬请谅解；</div>
      <div>2. 为保证活动公平，一旦发现作弊行为，将取消奖励资格。www.8bihui.com保留对活动的最终解释权；</div>
      <div>ETC社区交易所币汇官方交流QQ群860165622</div>
      <div>风险提示：</div>
      <div>数字货币是一种高风险的投资方式，请投资者理性判断自己的投资能力，审慎做出投资决策。</div>
    </div>
    <img src="../../assets/images/activity/closeBtn.png" class="closeBtn" @click="closeBtn()">
  </div>
</template>

<script>
export default {
  name: 'ActivityDialog',
  data () {
    return {
      tableData1: [
        '20000个JON',
        '10000个JON',
        '5000个JON',
        '2000个JON',
        '2000个JON',
        '2000个JON',
        '1000个JON',
        '1000个JON',
        '1000个JON',
        '1000个JON'
      ],
      tableData2: [
        {
          name: '一等奖', value: 'Iphone XS'
        },
        {
          name: '二等奖', value: '价值1000元京东购物卡'
        },
        {
          name: '三等奖', value: '2000个JON'
        },
        {
          name: '四等奖', value: '1000个JON'
        },
        {
          name: '五等奖', value: '500个JON'
        },
        {
          name: '六等奖', value: '300个JON'
        },
        {
          name: '参与有奖', value: '100个JON'
        }
      ]
    }
  },
  methods: {
    closeBtn () {
      this.$emit('update:visible', false)
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .pupcon{position: relative;width: 70%;height: 70%;margin: 0 auto;top: 12%;max-width: 1000px;background-color: #fff;border-radius: 20px;z-index: 1111;}
  .pupcon .title{color: #4E1496;text-align: center;position: relative;width: 100%;}
  .pupcon .fontBox{position: relative;width: 70%;left: 15%;top: 5%;height: 60%;overflow-y: scroll;line-height: 32px;}
  .pupcon .table{position: relative;width: 100%;top: 0;left: 0;text-align: center;}
  .pupcon .red{color: #FF0000;}
  .pupcon .blue{color: #008AFF;cursor: pointer;}
  .pupcon .closeBtn{position: absolute;width: 16%;left: 42%;top: 90%;cursor: pointer;}
</style>
