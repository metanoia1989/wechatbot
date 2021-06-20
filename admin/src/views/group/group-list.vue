<template>
  <div class="dashboard-container">
    <div class="explain">
      <div class="title">群组列表</div>
    </div>
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="群名" style="width: 200px;margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves type="warning" icon="el-icon-cherry" @click="handleSyncRoom">
        同步微信群
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
      <el-table-column label="群号" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.room_ident }}</span>
        </template>
      </el-table-column>
      <el-table-column label="群名" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleBind(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联分馆" min-width="110px" align="left">
        <template slot-scope="{row}">
            <span>{{ row.Group ? row.Group.groupname : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="动作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleBind(row)">
            绑定分馆
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 欢迎语列表页 END -->

    <group-lib-form
      v-if="isBind"
      :action="actionInfo"
      @save-success="bindSuccess"
      @hiden-view="hideView"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchRoomList, syncRoomList } from '@/api/group'
import GroupLibForm from './components/group-lib-form'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'GroupList',
  components: { GroupLibForm, Pagination },
  directives: { waves },
  computed: {
    ...mapGetters([
      'name'
    ])
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
      actionInfo: { },
      isBind: false, // 是创建
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
      fetchRoomList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSyncRoom() {
      this.$confirm('确定要进行同步操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          syncRoomList().then(() => {
            this.$notify({
              title: '成功',
              message: '同步成功！',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    bindSuccess() {
      this.getList()
    },
    hideView() {
      this.isBind = false
    },
    handleBind(row) {
      this.actionInfo = { 
        room_id: row.id,
        name: row.name,
        groupid: row.Group ? row.Group.groupid : '',
       }
      this.isBind = true
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
