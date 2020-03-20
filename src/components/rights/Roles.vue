<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addBtnClick">添加角色</el-button>
      <el-table :data="roleListData" stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div>{{props.row}}</div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column label="操作">
          <el-button-group slot-scope="aRole">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="roleEdit(aRole.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="roleDle(aRole.row.id)"
            >删除</el-button>
            <el-button type="warning" icon="el-icon-magic-stick" size="small">分配权限</el-button>
          </el-button-group>
        </el-table-column>
      </el-table>
      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="50%"
        center
        @closed="addRoleDialogClosed"
      >
        <span>
          <el-form
            :model="roleAddData"
            :rules="roleAddDataRules"
            ref="roleAddDataRef"
            label-width="90px"
            class="demo-ruleForm"
          >
            <el-form-item label="角色名称:" prop="roleName">
              <el-input v-model="roleAddData.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述:" prop="roleDesc">
              <el-input v-model="roleAddData.roleDesc"></el-input>
            </el-form-item>
            <div>{{roleAddData}}</div>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadAddRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editRoleDialogVisible"
        width="50%"
        center
        @closed="editRoleDialogClosed"
      >
        <span>
          <el-form
            :model="roleEditData"
            :rules="roleEditDataRules"
            ref="roleEditDataRef"
            label-width="90px"
            class="demo-ruleForm"
          >
            <el-form-item label="角色名称:" prop="roleName">
              <el-input v-model="roleEditData.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述:" prop="roleDesc">
              <el-input v-model="roleEditData.roleDesc"></el-input>
            </el-form-item>
            <div>{{roleEditData}}</div>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadEditRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleListData: [],
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      roleAddData: {
        roleName: '',
        roleDesc: ''
      },
      roleAddDataRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      editingId: null,
      roleEditData: {
        roleName: '',
        roleDesc: ''
      },
      roleEditDataRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async roleDle (id) {
      const { data: res } = await this.$http.delete('/roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRolesList()
      return this.$message.success(res.meta.msg)
    },
    async roleEdit (id) {
      this.editRoleDialogVisible = true
      const { data: res } = await this.$http.get('/roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleEditData.roleName = res.data.roleName
      this.roleEditData.roleDesc = res.data.roleDesc
      this.editingId = parseInt(res.data.roleId)
    },
    uploadAddRole () {
      this.$refs.roleAddDataRef.validate(async (value, obj) => {
        if (!value) return
        const { data: res } = await this.$http.post('/roles', this.roleAddData)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.addRoleDialogVisible = false
        return this.$message.success(res.meta.msg)
      })
    },
    uploadEditRole (id) {
      this.$refs.roleEditDataRef.validate(async (value, obj) => {
        if (!value) return
        console.log(typeof (this.roleEditData.id))
        const { data: res } = await this.$http.put(
          '/roles/' + this.editingId,
          this.roleEditData
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.editRoleDialogVisible = false
        return this.$message.success(res.meta.msg)
      })
    },
    addBtnClick () {
      this.addRoleDialogVisible = true
    },
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleListData = res.data
    },
    addRoleDialogClosed () {
      this.$refs.roleAddDataRef.resetFields()
    },
    editRoleDialogClosed () {
      this.$refs.roleEditDataRef.resetFields()
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
