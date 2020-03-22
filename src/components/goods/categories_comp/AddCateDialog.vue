<template>
  <div>
    <div>{{dialogVisible}}!!!!{{addCateDialogVisible}}</div>
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="50%"
      @closed="onAddCateDialogClosed"
    >
      <div>
        <el-form
          ref="addCateDlgform"
          :model="addCateDlgData"
          :rules="addCateDlgRules"
          label-width="90px"
        >
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCateDlgData.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
            <el-cascader
              :options="options"
              clearable
              :props="jilianProps"
              v-model="selectedOpt"
              @change="onCascaderValChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogOKBtnClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addCateDlgData: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateDlgRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      options: [],
      query_info: {
        type: 2
      },
      // 指定级联选择器的配置
      jilianProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      selectedOpt: null
    }
  },
  props: {
    addCateDialogVisible: Boolean
  },
  watch: {
    addCateDialogVisible (newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible (newVal) {
      if (newVal) {
        this.getParentCates()
      }
      this.$emit('update:addCateDialogVisible', newVal)
    }
  },
  methods: {
    onCascaderValChange () {
      if (this.selectedOpt.length > 0) {
        this.addCateDlgData.cat_pid = this.selectedOpt[
          this.selectedOpt.length - 1
        ]
        this.addCateDlgData.cat_level = this.selectedOpt.length
      } else {
        this.addCateDlgData.cat_pid = 0
        this.addCateDlgData.cat_level = 0
      }
    },
    onAddCateDialogClosed () {
      this.$refs.addCateDlgform.resetFields()
      this.selectedOpt = null
      this.addCateDlgData.cat_name = ''
      this.addCateDlgData.cat_pid = 0
      this.addCateDlgData.cat_level = 0
    },
    // 添加分类确定按钮被按下
    addCateDialogOKBtnClick () {
      this.$refs.addCateDlgform.validate(async (value, obj) => {
        if (!value) return
        const { data: res } = await this.$http.post('/categories', this.addCateDlgData)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.dialogVisible = false
        this.onAddCateDialogClosed()
        return this.$message.success(res.meta.msg)
      })
      this.$parent.$refs.catelist.getAllCates()
    },
    async getParentCates () {
      const res = await this.$http.get('/categories', {
        params: this.query_info
      })
      this.options = res.data.data
      console.log(res.data.data)
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}

</style>
