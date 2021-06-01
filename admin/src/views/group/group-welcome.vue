<template>
  <div class="app-container">
    <div class="explain">
      <h2>群欢迎语</h2>
      <p class="list">群员入群后，如果没有设置欢迎语，将会发送默认欢迎语。默认欢迎语不允许删除。</p>
      <p class="list">
        <span class="nickname" v-pre>{{username}}</span> 将会被替换为入群的成员昵称
      </p>
    </div>

    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="群名" style="width: 200px;margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
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
      :height="tableHeight"
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
      <el-table-column label="群名" min-width="100px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.group_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="110px" align="left">
        <template slot-scope="{row}">
          <el-tooltip :content="row.content" placement="bottom" popper-class="fix-width-tooltip">
            <span>{{ row.content | strSlice(50) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="图片" min-width="50px" align="left">
        <template slot-scope="{row}"> 
          <el-avatar shape="square" :size="100" fit="fill" :src="row.img_url" v-if="row.img_url"></el-avatar>
          <span class="not-img">未设置</span>
        </template>
      </el-table-column>
      <el-table-column label="链接" min-width="180px" align="left">
        <template slot-scope="{row}"> 
          <a class="link-box" target="_blank" :href="row.link_url" v-if="row.link_url">
            <el-avatar class="link-img" :size="100" shape="square" fit="fill" :src="row.link_img"></el-avatar>
            <div class="link-right">
              <p class="link-title">{{ row.link_title }}</p>
              <p class="link-desc">{{ row.link_desc | strSlice(34) }}</p>
            </div>
          </a>
          <span class="not-img" v-else>未设置</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" align="center" width="100px">
        <template slot-scope="{row}">
          <el-switch
            :value="row.status ? true : false"
            @change="handleModifyStatus(row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
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
    <!-- 欢迎语列表页 END -->

    <welcome-form
      v-if="isCreate"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"
    />
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex'
import { fetchWelcomeList, updateWelcome, deleteWelcome } from '@/api/group'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import WelcomeForm from './components/welcome-form'

export default {
  name: 'GroupWelcome',
  components: { WelcomeForm, Pagination },
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
      tableHeight: document.documentElement.clientHeight - 380, // 表的高度
    }
  },
  created() {
    this.getList()
    console.log("测试") 
  },
  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function() {
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = 380
      self.tableHeight = offsetHei - removeHeight
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      if (!this.listQuery.keyword) {
        this.listQuery.keyword = undefined
      }
      fetchWelcomeList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row) {
      let status = row.status ? 0 : 1
      updateWelcome({
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
      console.log("测试这个值是多少呢？", this.isCreate) 
    },
    handleUpdate(row) {
      this.createActionInfo = { type: 'update', id: row.id }
    },
    handleDelete(row, index) {
      deleteWelcome(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功！',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
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
