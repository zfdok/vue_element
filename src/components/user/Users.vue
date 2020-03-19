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
          <el-input
            placeholder="请输入搜索内容"
            v-model="query_info.params.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
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
            @change="userStateChange(scope.row)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <el-button-group slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="user_edit(scope)"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-end"
              :enterable="false"
              :open-delay="200"
              :hide-after="2000"
            >
              <el-button type="warning" icon="el-icon-magic-stick"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query_info.params.pagenum"
        :page-sizes="[1, 2, 3, 5, 20, 50]"
        :page-size="query_info.params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @closed="add_dlg_closed">
      <span>
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username" required>
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" required>
            <el-input v-model="addForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail" required>
            <el-input v-model="addForm.mail"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile" required>
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkAddForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @closed="edit_dlg_closed">
      <span>
        <el-form
          :model="nowEditing"
          :rules="editRules"
          ref="editFormRef"
          label-width="70px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="nowEditing.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" >
            <el-input v-model="nowEditing.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile" >
            <el-input v-model="nowEditing.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkMail = (rule, value, callback) => {
      var reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式错误!'))
      }
      callback()
    }
    var checkMobile = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(value)) {
        return callback(new Error('手机号格式错误'))
      }
      callback()
    }

    return {
      query_info: {
        params: {
          query: '',
          pagenum: 1,
          pagesize: 5
        }
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '范冰冰',
        password: '123123',
        mail: 'fbb@girls.com',
        mobile: '13546554628'
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      nowEditing: {},
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    user_edit (scope) {
      console.log(scope.row)
      this.nowEditing = scope.row
      this.editDialogVisible = true
    },
    handleSizeChange (value) {
      this.query_info.params.pagesize = value
      this.getUserList()
    },
    handleCurrentChange (value) {
      this.query_info.params.pagenum = value
      this.getUserList()
    },
    async getUserList () {
      const res = await this.$http.get('users', this.query_info)
      if (res.data.meta.status !== 200) {
        return this.$message.error('读取数据发生错误:' + res.data.meta.msg)
      }
      this.total = res.data.data.total
      this.userList = res.data.data.users
    },
    async userStateChange (userinfo) {
      console.log(userinfo)
      const str = '/users/' + userinfo.id + '/state/' + userinfo.mg_state
      const res = await this.$http.put(str)
      console.log(res)
      if (res.data.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.data.meta.msg)
      }
      return this.$message({
        message: res.data.meta.msg,
        type: 'success'
      })
    },
    handleClose () {},
    add_dlg_closed () {
      this.$refs.addFormRef.resetFields()
    },
    edit_dlg_closed () {
      this.$refs.editFormRef.resetFields()
    },
    checkAddForm () {
      this.$refs.addFormRef.validate(async (value, obj) => {
        if (value) {
          console.log('haha')
          const { data: res } = await this.$http.post('/users', this.addForm)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.dialogVisible = false
          this.getUserList()
          return this.$message({
            message: '用户添加成功!',
            type: 'success'
          })
        }
        console.log(value)
        return this.$message.error('填写信息有误')
      })
    }
  },
  async created () {
    this.getUserList()
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
