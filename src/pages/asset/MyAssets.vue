<template>
  <div class="bh-root">
    <!--标题-->
    <el-row>
      <!--<el-col :span="24">-->
        <!--<span class="bh-background_normal bh-font_subtitle">我的订单</span>-->
      <!--</el-col>-->
    </el-row>
    <!--小标题-->
    <el-row>
      <el-col :span="24">
        <span class="bh-font_size__big" :class="{'bh-color_standard': selected==='law'}" @click="select('law')">法币交易账户</span>
        <!--<span class="bh-font_size__big" :class="{'bh-color_standard': selected==='electronic'}" @click="select('electronic')">币币交易账户</span>-->
        <i :class="{law: selected==='law',electronic: selected==='electronic'}"></i>
      </el-col>
    </el-row>
    <!--搜索导航栏-->
    <el-row style="width: 100%;margin:30px 0 15px 0;height: 26px;line-height: 26px;">
      <el-col :span="8" style="width:150px;height:26px;margin:0 60px 0 0px;">
        <div>
          <input v-model="searchKey" type="text" placeholder="币种搜索" class="le-input-size">
          <!--<el-autocomplete-->
            <!--v-model="state4"-->
            <!--:fetch-suggestions="querySearchAsync"-->
            <!--placeholder="币种搜索"-->
            <!--@select="handleSelect"-->
          <!--&gt;-->
          <!--</el-autocomplete>-->
          <!--<i class="el-icon-search" style="position: absolute; margin: -15px 0 0 6px;"></i>-->
        </div>
      </el-col>
      <el-col :span="8" style="width:100px; margin: 0 300px 0 0;">
        <div style="position: relative;">
          <el-checkbox v-model="assetsChecked">隐藏0资产币种</el-checkbox>
        </div>
      </el-col>
      <el-col :span="8" style="width:305px;">
        <span>
          当前总资产估值:
          <span style="color: #0bb2fe;cursor: pointer;">{{totalMoney}}</span> &nbsp;{{isCNY?'CNY':'USD'}}
        </span>
        <!--<span style="margin-left: 50px;cursor: pointer;" v-if="isCNY">-->
          <!--<span style="color: #0bb2fe;" @click="isCNY=true">CNY</span><span>/</span><span @click="isCNY=false">USD</span>-->
        <!--</span>-->
        <!--<span style="margin-left: 50px;cursor: pointer;" v-else>-->
          <!--<span @click="isCNY=true">CNY</span><span>/</span><span style="color: #0bb2fe;" @click="isCNY=false">USD</span>-->
        <!--</span>-->
      </el-col>
    </el-row>
    <!--订单呢-->
    <el-row>
      <el-col :span="24">
        <el-table :data="showData" border style="width: 100%">
          <el-table-column label="币种" align="center" width="60">
            <template slot-scope="scope">
              <span>{{scope.row.dictionariesId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="数量" align="center">
            <template slot-scope="scope">
              <span>{{NumberFormat.toFixed(scope.row.balance, 8)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="可用" align="center">
            <template slot-scope="scope">
              <span>{{NumberFormat.toFixed(new BigNumber(scope.row.balance).minus(new BigNumber(scope.row.frozenAmount)).toString(), 8)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="frozenAmount" label="下单冻结" align="center">
            <template slot-scope="scope">
              <span>{{NumberFormat.toFixed(scope.row.frozenAmount, 8)}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="isCNY?'资产估值(CNY)':'资产估值(USD)'" align="center">
            <template slot-scope="scope">
              <span :ref="scope.row.dictionariesId" v-if="isCNY">{{$store.getters.convertToCNY(scope.row.dictionariesId, NumberFormat.toFixed(scope.row.balance, 8)).cut(4)}}</span>
              <span :ref="scope.row.dictionariesId" v-else>{{$store.getters.convertToUSD(scope.row.dictionariesId, NumberFormat.toFixed(scope.row.balance, 8)).cut(4)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" align="center" width="240">
            <template slot-scope="scope">
              <el-button  type="primary" round class="bh-btn_plain"
                size="mini"
                @click="handleCB(scope.row.dictionariesId)">
                <span>充币</span>
              </el-button>
              <el-button type="primary" round class="bh-btn_plain"
                size="mini"
                @click="handleTB(scope.row.dictionariesId)">
                <span>提币</span>
              </el-button>
              <el-button round type="primary" class="bh-btn_plain"
                size="mini"
                @click="handleJY(scope.row.dictionariesId)">
                <span>交易</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  name: 'MyAssets',
  data () {
    return {
      BigNumber: BigNumber,
      // 平台币种详情列表
      platformCoinDetailList: this.$store.getters.getCoinDetailList,
      // 复选框选定
      assetsChecked: false,
      restaurants: [],
      state4: '',
      timeout: null,
      tableData: [],
      showData: [],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      selected: 'law',
      // 默认单位人民币
      isCNY: true,
      // 搜索条件
      searchKey: ''
    }
  },
  computed: {
    totalMoney () {
      let total = 0
      if (this.isCNY) {
        for (let i in this.showData) {
          total += this.$store.getters.convertToCNY(this.showData[i].dictionariesId, this.showData[i].balance)
        }
      } else {
        for (let i in this.showData) {
          total += this.$store.getters.convertToUSD(this.showData[i].dictionariesId, this.showData[i].balance)
        }
      }
      return total.cut(4)
    }
  },
  watch: {
    assetsChecked () {
      this.screenData()
    },
    searchKey (val) {
      if (val) {
        let list = []
        for (let i in this.tableData) {
          if (new RegExp(val.toLowerCase()).test(this.tableData[i].dictionariesId.toString().toLowerCase())) {
            list.push(this.tableData[i])
          }
        }
        this.showData = list
      } else {
        this.screenData()
      }
    }
  },
  methods: {
    // 过滤零资产数据
    screenData () {
      if (this.assetsChecked) {
        this.showData = []
        for (let i in this.tableData) {
          if (Number(this.tableData[i].balance) > 0) {
            this.showData.push(this.tableData[i])
          }
        }
      } else {
        this.showData = this.tableData
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    handleCB (coin) {
      this.$router.push({name: 'TopUp', params: {coin: coin}})
    },
    handleTB (coin) {
      this.$router.push({name: 'MentionMoney', params: {coin: coin}})
    },
    handleJY (coin) {
      this.$router.push({name: 'OtcTrading', params: {coin: coin}})
    },
    select (key) {
      switch (key) {
        case 'law':
          this.query()
          this.selected = 'law'
          break
        case 'electronic':
          this.tableData = []
          this.selected = 'electronic'
          break
      }
    },
    loadAll () {
      return [
      ]
    },
    querySearchAsync (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      console.log(item)
    },
    query () {
      // 查询总资产
      this.$store.dispatch('encryptConnection', {
        url: '/wallet/selectWalletListUI',
        data: {
          currencyCode: ''
        }
      }).then(response => {
        this.tableData = response.body.data
        this.screenData()
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    }
  },
  mounted () {
    this.restaurants = this.loadAll()
  },
  created () {
    this.query()
  }
}
</script>

<style scoped>
  /*路由的标题*/
  .bh-root .el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
  }

  .bh-root .el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
  }

  /*小标题*/
  .bh-root .el-row:nth-child(2) {
    height: 38px;
    line-height: 38px;
    border-bottom: 3px solid #D8D8D8;
    margin-top: 6px;
    margin-bottom: 10px;
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .bh-root .el-row:nth-child(2) span {
    display: inline-block;
    width: 146px;
    height: 100%;
    text-align: center;
    cursor: pointer;
  }

  .bh-root .el-row:nth-child(2) i {
    display: inline-block;
    width: 146px;
    height: 3px;
    background-color: #0BB2FE;
    position: absolute;
    bottom: -3px;
    left: 0;
    -webkit-transition: all 400ms ease;
    -moz-transition: all 400ms ease;
    -ms-transition: all 400ms ease;
    -o-transition: all 400ms ease;
    transition: all 400ms ease;
  }

  .bh-root .el-row:nth-child(2) i.law {
    left: 0;
  }
  .bh-root .el-row:nth-child(2) i.electronic {
    -webkit-transform: translateX(100%);
    -moz-transform: translateX(100%);
    -ms-transform: translateX(100%);
    -o-transform: translateX(100%);
    transform: translateX(100%);
  }

  /*翻页器*/
  .bh-root .el-row:last-child {
    text-align: right;
    margin-top: 15px;
  }
  /*button样式*/
  .el-button{
    line-height: 0;
  }
  .bh-btn_plain {
    color: #0BB2FE;
    background-color: #FFF;
    /*border: 1px solid #0BB2FE;*/
    min-width: 0px;
    height: 21px;
  }
 /*币种搜索*/
  .le-input-size{
    border:0.5px solid #d8d8d8;
    border-radius:100px;
    width:149px;
    height:25px;
  }
</style>
