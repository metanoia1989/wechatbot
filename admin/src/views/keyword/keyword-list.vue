<template>
  <div class="app-container">
    <div class="explain">
      <div class="title">关键词</div>
      <p class="">关键词分为文本回复关键词、事件关键词和加群关键词。</p>
    </div>

    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="请搜索关键词" style="width: 200px;margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <!-- 欢迎语列表页 START -->
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
      <el-table-column label="关键词" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.keyword }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="50px" align="left">
        <template slot-scope="{row}"> 
          <span class="">{{ types[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复内容" min-width="110px" align="left">
        <template slot-scope="{row}">
          <el-tooltip :content="row.reply" placement="bottom" popper-class="fix-width-tooltip">
            <span>{{ row.reply | strSlice(50) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="事件" min-width="70px" align="left">
        <template slot-scope="{row}"> 
          <p class="link-desc">{{ row.event ? events[row.event] : '' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" align="center" width="70px">
        <template slot-scope="{row}">
          <el-switch
            :value="row.status ? true : false"
            @change="handleModifyStatus(row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" min-width="180px" align="left">
        <template slot-scope="{row}"> 
          <p class="link-desc">{{ row.created_at }}</p>
        </template> 
      </el-table-column> -->
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
    <!-- 欢迎语列表页 END -->

    <keyword-form
      v-if="isCreate"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"
    />
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex'
import { fetchKeywordList, updateKeyword, deleteKeyword } from '@/api/keyword'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import KeywordForm from './components/keyword-form'
import settings from '@/settings'

export default {
  name: 'KeywordList',
  components: { KeywordForm, Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
  },
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
      tableHeight: document.documentElement.clientHeight - 320, // 表的高度
      types: settings.keywordTypes,
      events: settings.keywordEventList,
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    var self = this
  },
  methods: {
    getList() {
      this.listLoading = true
      if (!this.listQuery.keyword) {
        this.listQuery.keyword = undefined
      }
      fetchKeywordList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row) {
      let status = row.status ? 0 : 1
      updateKeyword({
        id: row.id, status
      }).then(() => {
        row.status = status
        this.$notify({
          title: '成功',
          message: '更新状态成功',
          type: 'success',
          duration: 2000,
        })
      })
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
            deleteKeyword(row.id).then(() => {
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
.app-container {
  padding-bottom: 0;
}
.pagination-container {
  padding-bottom: 0;
}
.container {
  .title-container {
    margin: 30px;
    font-size: 30px;
    line-height: 46px;
  }
}
.title {
  font-size: 25px;
  font-weight: bolder;
}
.explain {
  margin-bottom: 5px;
}
.filter-container {
    padding-bottom: 10px;
}
.nickname {
  color: #f56c6c;
}
.not-img {
  color: #c0c4cc;
}
.link-box {
  display: flex;
  align-items: center;

  .link-right {
    flex: 1;
    margin-left: 10px;

    .link-title {
      font-size: 16px;
      margin: 5px 0;
    }
    .link-desc {
      font-size: 12px;
      color: #b2b2b2;
      margin: 5px 0;
    }
  }

}
</style>
