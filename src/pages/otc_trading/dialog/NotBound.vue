<template>
  <div class="">
    <!--绑定实名银行卡-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="590" :height="353">
      <div slot="body">
        <!--标题-->
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span>完成交易设置</span>
          </el-col>
        </el-row>
        <!--银行卡位置-->
        <el-row>
          <div style="text-align: center; margin: 20px 0 20px 0;">
            <img src="../../../assets/images/bank_card.svg" alt="" style="width: 120px; height: 120px;">
          </div>
        </el-row>
        <!--提示-->
        <el-row style="text-align: center;margin-bottom: 30px;font-size:14px;color:#666666;">
          <span>提示: 进行场外交易，需要先完成交易设置</span>
        </el-row>
        <!--取消、确认-->
        <el-row style="text-align: center;">
          <el-col :span="12">
            <button style="width: 150px; height: 34px;padding: 0;margin: 10px 40px 40px 40px;font-size: 14px;" class="bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" style="width: 150px; height: 34px;padding: 0;margin: 10px 50px 40px 15px;" class="bh-btn_primary" @click="$router.push({name: 'TransactionSettings'})">
              去绑定
            </el-button>
          </el-col>
        </el-row>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../components/BHDialog'
export default {
  data () {
    return {
      committing: false
    }
  },
  name: 'IsBuying',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BhDialog
  }
}
</script>

<style scoped>

</style>
