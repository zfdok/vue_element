<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 权限列表 -->
      <el-table :data="rightsListData" style="width: 100%" stripe>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级" width="150" class="table_col_level">
          <div slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </div>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsListData: []
    }
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsListData = res.data
      console.log(this.rightsListData)
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 0.8rem;
}
.el-card {
  margin-top: 15px;
}
</style>
