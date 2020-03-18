<template>
  <div class="el">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="28">
        <el-col :span="16">
          <el-input placeholder="请输入搜索内容" v-model="input_search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <el-switch
            slot-scope="scope"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-end" :enterable=false :open-delay=200 :hide-after=2000>
              <el-button type="warning" icon="el-icon-magic-stick"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-table-column>
      </el-table>
      <div>{{userList}}</div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input_search: '',
      query_info: {
        params: {
          pagenum: 1,
          pagesize: 10
        }
      },
      userList: []
    }
  },
  methods: {
    user_edit () {}
  },
  async created () {
    const res = await this.$http.get('users', this.query_info)
    if (res.data.meta.status !== 200) {
      return this.$message.error('读取数据发生错误:' + res.data.meta.msg)
    }
    console.log(res.data.data)

    this.userList = res.data.data.users
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 0.8rem;
}
.el-card {
  margin-top: 15px;
  .el-table {
    margin-top: 15px;
  }
}
</style>
