<template>
  <div class="cate_list">
    <tree-table
      index-text="序号"
      :data="cateList"
      :columns="columns"
      :stripe="props.stripe"
      :border="props.border"
      :show-header="props.showHeader"
      :show-summary="props.showSummary"
      :show-row-hover="props.showRowHover"
      :show-index="props.showIndex"
      :tree-type="props.treeType"
      :is-fold="props.isFold"
      :expand-type="props.expandType"
      :selection-type="props.selectionType"
    >
      <template slot="cat_deleted" slot-scope="scope">
        <i class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
        <i class="el-icon-error" v-else></i>
      </template>
      <template slot="cat_level" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
        <el-tag v-else-if="scope.row.cat_level===1" type="success" size="mini">二级</el-tag>
        <el-tag v-else type="warning" size="mini">三级</el-tag>
      </template>
      <template slot="cat_opt">
        <el-button type="primary">
          <i class="el-icon-edit"></i>
          编辑
        </el-button>
        <el-button type="danger">
          <i class="el-icon-delete"></i>
          删除
        </el-button>
      </template>
    </tree-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query_info.pagenum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="query_info.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listTotalCount">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      query_info: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      listTotalCount: null,
      props: {
        stripe: false,
        border: false,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '200px'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          minWidth: '100px',
          type: 'template',
          template: 'cat_deleted'
        },
        {
          label: '排序',
          prop: 'cat_level',
          minWidth: '100px',
          type: 'template',
          template: 'cat_level'
        },
        {
          label: '操作',
          minWidth: '200px',
          type: 'template',
          template: 'cat_opt'
        }
      ]
    }
  },
  methods: {
    // 获取分类列表
    async getAllCates () {
      console.log('haha')
      const { data: res } = await this.$http.get('/categories', {
        params: this.query_info
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.listTotalCount = res.data.total
    },
    // 改变页码尺寸时触发value
    handleSizeChange (value) {
      this.query_info.pagesize = value
      this.getAllCates()
    },
    // 改变页码时触发
    handleCurrentChange (value) {
      this.query_info.pagenum = value
      this.getAllCates()
    }
  },
  created () {
    this.getAllCates()
  }
}
</script>

<style lang="less" scoped>
.cate_list {
  margin-top: 15px;
  .el-icon-success {
    color: green;
    font-size: 16px;
  }
}
</style>
