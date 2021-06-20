<template>
  <div class="dashboard-container">
    <div class="explain">
      <div class="title">文件素材</div>
    </div>
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="素材名" style="width: 200px;margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    
    <!-- 列表项 START -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" min-width="100px">
        <template slot-scope="{row}">
          <!-- <span class="link-type" @click="handleUpdate(row)"> -->
            <span>{{ row.file_name }}</span>
          <!-- </span> -->
        </template>
      </el-table-column>
      <el-table-column label="预览" min-width="50px" align="center">
        <template slot-scope="{row}">
          <el-image
            shape="square" 
            style="width: 100px; height: 100px"
            fit="fill" 
            :src="row.key" 
            :preview-src-list="[row.key]"
            v-if="row.file_type === 0">
          </el-image>
          <span class="not-img" v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="大小" min-width="20px">
        <template slot-scope="{row}">
            <span>{{ row.file_size | humanFileSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复制链接" min-width="25px" align="center">
        <template slot-scope="{row}">
            <span @click="handleClipboard(row.key, $event)">
              <i class="el-icon-document-copy"></i>
            </span> 
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="40px" align="center">
        <template slot-scope="{row}">
            <span>{{ row.updated_at | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="动作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 列表项 END -->

    <file-form
      v-if="isCreate"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"
    />

  </div>
</template>

<script>
import { fetchFileList, deleteFile } from '@/api/file'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import FileForm from './components/file-form'
import clipboard from '@/utils/clipboard'

export default {
  name: 'FileText',
  components: { FileForm, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keyword: undefined,
      },
      createActionInfo: { type: 'create' },
      isCreate: false, // 是创建
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      this.listLoading = true
      if (!this.listQuery.keyword) {
        this.listQuery.keyword = undefined
      }
      fetchFileList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    createSaveSuccess() {
      this.getList()
    },
    hideView() {
      this.isCreate = false
    },
    handleCreate() {
      this.createActionInfo = { type: 'create' }
      this.isCreate = true
    },
    handleUpdate(row) {
      this.createActionInfo = { type: 'update', id: row.id }
      this.isCreate = true
    },
    handleDelete(row, index) {
        this.$confirm('确定要删除这些数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteFile(row.id).then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功！',
                type: 'success',
                duration: 2000
              })
              this.list.splice(index, 1)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
