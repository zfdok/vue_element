<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addBtnClick">添加角色</el-button>
      <!-- 角色清单 -->
      <el-table :data="roleListData" stripe style="width: 100%">
        <!-- 展开项 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <div v-for="(item1st, index) in props.row.children" :key="index">
              <el-row type="flex" align="middle" :class="index===0? '':'border-top'">
                <el-col :span="6">
                  <el-tag
                    closable
                    @close="removeRightById(props.row,item1st.id)"
                  >{{item1st.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-row
                    v-for="(item2nd, index) in item1st.children"
                    :key="index"
                    type="flex"
                    align="middle"
                    :class="index===0? '':'border-top'"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRightById(props.row,item2nd.id)"
                      >{{item2nd.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag
                        v-for="(item3rd, index) in item2nd.children"
                        :key="index"
                        type="warning"
                        closable
                        @close="removeRightById(props.row,item3rd.id)"
                      >{{item3rd.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <!-- 序列行 -->
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="280">
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
            <el-button
              type="warning"
              icon="el-icon-magic-stick"
              size="small"
              @click="showAddRightsDlg(aRole.row)"
            >分配权限</el-button>
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
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="addRightDialogVisible"
        width="70%"
        @closed="addRightDialogClosed"
      >
        <span>
          <el-tree
            :data="allRights"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="defaultProps"
            :default-checked-keys="defaultCheckedKeys"
            default-expand-all
          ></el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadEditRights">确 定</el-button>
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
      sureToDelDialogVisible: false,
      addRightDialogVisible: false,
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
      editRightRoleId: null,
      roleEditData: {
        roleName: '',
        roleDesc: ''
      },
      roleEditDataRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      allRights: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    async uploadEditRights () {
      const selectedKeys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      const keysStr = selectedKeys.join(',')
      console.log(keysStr)
      console.log(this.editRightRoleId)
      const { data: res } = await this.$http.post(
        `roles/${this.editRightRoleId}/rights`,
        {
          rids: keysStr
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRightRoleId = null
      this.addRightDialogVisible = false
      this.getRolesList()
      return this.$message.success(res.meta.msg)
    },
    addRightDialogClosed () {
      this.defaultCheckedKeys = []
    },
    // 添加权限按钮点击
    async showAddRightsDlg (role) {
      this.editRightRoleId = role.id
      this.addRightDialogVisible = true
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.allRights = res.data
      role.children.forEach(rigths1 => {
        rigths1.children.forEach(rigths2 => {
          rigths2.children.forEach(rigths3 => {
            this.defaultCheckedKeys.push(rigths3.id)
          })
        })
      })
    },
    removeRightById (role, rightId) {
      this.$confirm('此操作将取消该用户的此权限, 是否继续?', '取消权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          role.children = res.data
          return this.$message.success(res.meta.msg)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async roleDle (id) {
      this.$confirm('确认删除此角色??', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('/roles/' + id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getRolesList()
          return this.$message.success(res.meta.msg)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.addRoleDialogVisible = false
        return this.$message.success(res.meta.msg)
      })
    },
    uploadEditRole (id) {
      this.$refs.roleEditDataRef.validate(async (value, obj) => {
        if (!value) return
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
.el-row {
  padding: 5px;
}
.el-tag {
  margin: 5px;
}
.border-top {
  border-top: 1px solid #eeeeee;
}
</style>
