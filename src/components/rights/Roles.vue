<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleListData" stripe style="width: 100%">
            <el-table-column type="expand">
      <template slot-scope="props">
        <div>{{props.row}}</div>
      </template>
    </el-table-column>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column  label="操作">
          <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
          <el-button type="warning" icon="el-icon-magic-stick" size="small">分配权限</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleListData: []
    }
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleListData = res.data
      console.log(res.data)
    }
  },
  created () {
    this.getRolesList()
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
