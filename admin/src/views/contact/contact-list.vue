<template>
  <div class="dashboard-container">
    <div class="explain">
      <div class="title">联系人列表</div>
    </div>
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="联系人名" style="width: 200px;margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves type="warning" icon="el-icon-cherry" @click="handleSyncContact">
        同步微信联系人
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
      <el-table-column label="微信号" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.weixin }}</span>  
        </template>
      </el-table-column>
      <el-table-column label="头像" min-width="50px" align="center">
        <template slot-scope="{row}">
          <el-image
            shape="square" 
            style="width: 50px; height: 50px"
            fit="fill" 
            :src="row.avatar" 
            :preview-src-list="[row.avatar]"
            v-if="row.avatar">
          </el-image>
          <span class="not-img" v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="联系人名" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleBind(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联用户" min-width="110px" align="left">
        <template slot-scope="{row}">
            <span>{{ row.UserInfo ? row.UserInfo.username : '' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="动作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleBind(row)">
            绑定分馆
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 欢迎语列表页 END -->


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchContactList, syncContactList } from '@/api/contact'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ContactList',
  components: { Pagination },
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
      fetchContactList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSyncContact() {
      this.$confirm('确定要进行同步操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          syncContactList().then(() => {
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
