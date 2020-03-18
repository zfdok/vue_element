<template>
  <div>Home
    <el-button  @click="exit_login" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  home: 'Home',
  methods: {
    exit_login () {
      window.sessionStorage.clear()
      this.$router.replace('/')
      this.$message({
        message: '您已经退出登录',
        type: 'warning'
      })
    }
  }
}
</script>

<style>

</style>
