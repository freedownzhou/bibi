<template>
  <div class="order_completed">
    <el-table :data="originOrder" border v-loading="loading">
      <el-table-column prop="oCode" label="订单" align="center"></el-table-column>
      <el-table-column label="商家" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.oBuyerId === user.userId ? scope.row.sellNickName : scope.row.buyNickName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oCode" label="类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.oBuyerId === user.userId ? '买入' : '卖出'}}{{scope.row.oCoinType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oCapitalCount" label="价格(CNY)" align="center">
        <template slot-scope="scope">
          <span>{{Number(new BigNumber(scope.row.oCapitalCount).div(new BigNumber(scope.row.oCoinCount))).cut(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oCoinCount" label="数量" align="center">
        <template slot-scope="scope">
          <span>{{NumberFormat.toFixed(scope.row.oCoinCount, 8)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oCapitalCount" label="金额(CNY)" align="center">
        <template slot-scope="scope">
          <span>{{Number(scope.row.oCapitalCount).cut(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" min-width="95">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.oCreateTime).format('yyyy-MM-dd')}}</span><br>
          <span>{{new Date(scope.row.oCreateTime).format('hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="取消时间" align="center" min-width="95">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.oUpdateTime).format('yyyy-MM-dd')}}</span><br>
          <span>{{new Date(scope.row.oUpdateTime).format('hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oStatus" label="状态" align="center">
        <template slot-scope="scope">
              <span>
                <!--1 待付款2.待确认收款 3.已收款,待放币 4.平台已放币,待确认收币 5.商家放币 ,待确认收币  6.收币完成 7.超时取消 8.手动取消-->
                {{scope.row.oStatus === '1' ? '待付款' : scope.row.oStatus === '2' ? '待确认收款' : scope.row.oStatus === '3' ? '已收款,待放币' : scope.row.oStatus === '4' ? '平台已放币,待确认收币' : scope.row.oStatus === '5' ? '商家放币 ,待确认收币' : scope.row.oStatus === '6' ? '收币完成' : scope.row.oStatus === '7' ? '超时取消' : scope.row.oStatus === '8' ? '手动取消' : '状态错误'}}
              </span>
        </template>
      </el-table-column>
      <el-table-column prop="character" label="操作" align="center" width="150%">
        <template slot-scope="scope">
          <el-row style="margin-left: 10px;text-align: center;">
            <el-col :span="8" class="pointer">
              <div @click="addList(scope.row.oBuyerId === user.userId ? scope.row.oSellerId : scope.row.oBuyerId, '2')">
                <p style="margin: 0;"><img class="bh-icon_hover" src="../../assets/images/hmd.svg" style="width: 17px; height: 20px;"></p>
                <p><span>拉黑</span></p>
              </div>
            </el-col>
            <el-col :span="8" class="pointer">
              <div @click="addList(scope.row.oBuyerId === user.userId ? scope.row.oSellerId : scope.row.oBuyerId, '1')">
                <p style="margin: 0;"><img class="bh-icon_hover" src="../../assets/images/mdl.svg" style="width: 17px; height: 20px;"></p>
                <p><span>信任</span></p>
              </div>
            </el-col>
            <el-col :span="8">
              <el-tooltip class="item" effect="dark" content="什么是黑名单？"  placement="top-end" style="">
                <a target="_blank" href="https://8bihui.zendesk.com/hc/zh-cn/community/posts/360022580692-2-5-%E5%90%8D%E5%8D%95%E7%AE%A1%E7%90%86"><img class="bh-icon_hover" src="../../assets/images/hello_1.svg" style="width: 14px; height: 14px;"></a>
              </el-tooltip>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--翻页呢-->
    <el-row style="text-align: right;margin-top: 30px;">
      <el-col :span="24">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="5"
          :total="orderTotalCount"
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  props: ['originOrder', 'orderTotalCount', 'orderCurrentPage'],
  data () {
    return {
      BigNumber: BigNumber,
      rate: 0,
      loading: false,
      currentPage: 0
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    // 信任
    addList (id, type) {
      this.loading = true
      this.$http.post('/userTrust/addUserTrustById', {
        trustUserId: id + '',
        type: type
      }).then(response => {
        this.$message.success('添加成功')
        this.loading = false
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'E2801':
            this.$message.error('不可重复添加')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.loading = false
      })
    },
    handleCurrentChange (val) {
      this.$emit('refresh', val - 1)
    }
  },
  created () {
    this.currentPage = (this.orderCurrentPage || 0) + 1
  }
}
</script>

<style scoped>
  .order_completed {
    position: relative;
  }

  .order_completed .pointer {
    cursor: pointer;
  }
</style>
