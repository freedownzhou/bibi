<template>
  <transition name="el-fade-in">
    <div class="bh-root" v-if="visible">
      <div class="bh-dialog" :style="size" @click.stop="()=>{}">
        <i class="iconfont icon-close" @click="closeDialog" v-if="closeButton"></i>
        <div class="bh-dialog_top" v-else></div>
        <slot name="body"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closeButton: {
      type: Boolean,
      default: true
    },
    handleClose: {
      type: Function,
      default: () => {}
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    }
  },
  computed: {
    size () {
      const width = this.width ? 'width: ' + this.width + 'px; ' : ''
      const height = this.height ? 'height: ' + this.height + 'px;' : ''
      return width + height
    }
  },
  methods: {
    closeDialog () {
      this.handleClose()
      this.$emit('updateVisible')
    }
  }
}
</script>

<style scoped>
  .bh-root {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    filter: alpha(opacity=35);
    background-color: rgba(0, 0, 0, .35);
  }

  /*小XX*/
  .bh-dialog {
    position: absolute;
    left: 0;
    right: 0;
    margin: 5% auto;
    border-radius: 4px;
    background-color: #FFF;
    padding: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .bh-dialog i {
    font-size: 13px;
    color: #666;
    position: absolute;
    top: 17px;
    right: 17px;
    -webkit-transition: all 300ms;
    -moz-transition: all 300ms;
    -ms-transition: all 300ms;
    -o-transition: all 300ms;
    transition: all 300ms;
  }

  .bh-dialog i:hover {
    transform: rotate(180deg);
    cursor: pointer;
    color: #0BB2FE;
  }

  /*顶部丑死的蓝条*/
  .bh-dialog_top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: #0BB2FE;
    height: 10px;
    -webkit-border-radius: 4px 4px 0 0;
    -moz-border-radius: 4px 4px 0 0;
    border-radius: 4px 4px 0 0;
  }
</style>
