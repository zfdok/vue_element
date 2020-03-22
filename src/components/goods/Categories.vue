<template>
  <div>
    <MyBreadcrumb firstLv="商品管理" secondLv="商品分类"></MyBreadcrumb>
    <el-card>
      <el-button type="primary" @click="addCateBtnClicked">添加分类</el-button>
      <CateList ref="catelist"></CateList>
    </el-card>
    <AddCateDialog :addCateDialogVisible.sync="addCateDialogVisible"></AddCateDialog>
  </div>
</template>

<script>
import MyBreadcrumb from '../common/MyBreadcrumb'
import CateList from './categories_comp/CateList'
import AddCateDialog from './categories_comp/AddCateDialog'
export default {
  data () {
    return {

      addCateDialogVisible: false
    }
  },
  components: {
    MyBreadcrumb,
    CateList,
    AddCateDialog
  },
  methods: {
    addCateBtnClicked () {
      this.addCateDialogVisible = true
      console.log(this.addCateDialogVisible)
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
