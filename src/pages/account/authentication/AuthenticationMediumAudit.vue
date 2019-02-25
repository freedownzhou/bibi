<template>
  <div class="bh-root">
    <p style="text-align: center;font-size: 48px;color: #FF7C44;" v-if="cause===0">人工审核中</p>
    <p style="text-align: center;font-size: 48px;color: #FF7C44;" v-else-if="cause===1">审核失败-_-!  原因:不是手持证件照</p>
    <p style="text-align: center;font-size: 48px;color: #FF7C44;" v-else-if="cause===2">审核失败-_-!  原因:图片不清晰</p>
    <p style="text-align: center;font-size: 48px;color: #FF7C44;" v-else-if="cause===3">审核失败-_-!  原因:不是本人</p>
    <p style="text-align: center;font-size: 48px;color: #FF7C44;cursor: pointer;" v-if="cause!==0" @click="commit">点这里！重新审核</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cause: 0
    }
  },
  methods: {
    commit () {
      this.$store.commit('setUser', {
        identityAuthenticator: 1
      })
      this.$router.push({name: 'AuthenticationMedium'})
    }
  },
  created () {
    this.cause = this.$route.query.cause
    switch (parseInt(this.$store.getters.getUser.identityAuthenticator)) {
      case 0:
        this.$router.push({name: 'AuthenticationLow'})
        break
      case 1:
        this.$router.push({name: 'AuthenticationMedium'})
        break
      case 3:
        this.$router.push({name: 'AuthenticationHigh'})
        break
      case 4:
        this.$router.push({name: 'AuthenticationHigh'})
        break
    }
  }
}
</script>

<style scoped>
</style>
