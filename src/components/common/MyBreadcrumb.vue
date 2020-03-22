<template>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{firstLv}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{secondLv}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'MyBreadcrumb',
  props: {
    firstLv: String,
    secondLv: String
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 0.8rem;
}
</style>
