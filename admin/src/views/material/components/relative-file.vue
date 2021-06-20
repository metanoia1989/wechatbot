<template>
  <div class="cr-contianer">
    <div class="title">关联文件素材</div>
    <div style="height: 100%; position: relative">
      <div :style="{ 'padding-left': crmType == '' ? '150px' : '0' }">
        <div class="cr-body-content">
          <flexbox class="content-header">
            <el-input v-model="searchContent" class="search-container">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click.native="searchInput"
              />
            </el-input>
            <el-button
              class="create-button"
              type="primary"
              @click="isCreate = true"
              >新建</el-button>
          </flexbox>
          <el-table
            v-loading="loading"
            ref="relativeTable"
            :data="list"
            :height="250"
            class="cr-table"
            stripe
            border
            highlight-current-row
            style="width: 100%"
            @select-all="selectAll"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick">
            <el-table-column
              show-overflow-tooltip
              type="selection"
              align="center"
              width="55" />
            <el-table-column
              v-for="(item, index) in fieldList"
              :key="index"
              :fixed="index === 0"
              :prop="item.prop"
              :label="item.label"
              :width="150"
              :formatter="fieldFormatter"
              show-overflow-tooltip />
            <el-table-column />
          </el-table>
          <div class="table-footer">
            <el-button
              :disabled="currentPage <= 1"
              @click.native="changePage('up')">
              上一页
            </el-button>
            <el-button
              :disabled="currentPage >= totalPage"
              @click.native="changePage('down')">
              下一页
            </el-button>
          </div>
          <file-form
            v-if="isCreate"
            :action="createActionInfo"
            @save-success="getList"
            @hiden-view="isCreate = false"
          />
        </div>
      </div>
    </div>
    <div class="handle-bar">
      <el-button @click.native="closeView">取消</el-button>
      <el-button type="primary" @click.native="confirmClick">确定</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { objDeepCopy } from "@/utils";
import { fetchFileList } from '@/api/file'
import FileForm from './file-form'

export default {
  name: "RelativeFile", // 相关
  components: {
    FileForm
   },
  props: {
    /** 多选框 只能选一个 */
    radio: {
      type: Boolean,
      default: true,
    },
    /** 已选信息 */
    selectedData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /** true 的时候 发请求 */
    show: {
      type: Boolean,
      default: true,
    },
    /**
     * default 默认  condition 固定条件筛选
     * relative: 相关 添加
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: "default",
          data: {},
        };
      },
    },
  },
  data() {
    return {
      /** 各类型选择的值 */
      currentSelectedData: {},

      loading: false, // 加载进度
      searchContent: '', // 输入内容
      isCreate: false, // 控制新建
      scenesList: [], // 场景信息
      sceneInfo: null,

      list: [], // 表数据
      fieldList: [], // 表头数据
      currentPage: 1, // 当前页数
      totalPage: 1, // 总页数

      otherItems: [],
      selectedItem: [], // 勾选的数据 点击确定 传递给父组件
      /** 格式化规则 */
      formatterRules: {}
    };
  },
  computed: {},
  watch: {
    selectedData: function (data) {
      this.currentSelectedData = objDeepCopy(data);
    },
    // 刷新标记
    show(val) {
      if (val) {
        this.currentSelectedData = objDeepCopy(this.selectedData);
      }
    },
  },
  mounted() {
    this.currentSelectedData = objDeepCopy(this.selectedData);
  },
  methods: {
    /**
     * 刷新列表
     */
    refreshList() {
      this.currentPage = 1
      this.getList()
    },

    /** 获取列表请求 */
    getDefaultField() {
        return [
          { name: '文件名', field: 'file_name' },
          { name: '预览', field: 'key' },
          { name: '大小', field: 'file_size' },
          { name: '时间 ', field: 'updated_at' }
        ]
    },
    /** 获取列表数据 */
    getList() {
      this.loading = true
      var params = {
        page: this.currentPage,
        limit: 10,
        search: this.searchContent
      }
      fetchFileList(params)
        .then(res => {
          this.list = res.data.list
          /**
           *  如果已选择的有数据
           */
          if (this.selectedData) {
            this.checkItemsWithSelectedData()
          } else {
            this.list = res.data.list
          }

          this.totalPage = Math.ceil(res.data.dataCount / 10)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 标记选择数据
    checkItemsWithSelectedData() {
      const selectedArray = this.selectedData.map(item => {
        item.has = false
        return item
      })

      const selectedRows = []
      this.otherItems = []

      this.list.forEach((item, index) => {
        selectedArray.forEach((selectedItem, selectedIndex) => {
          if (item['id'] == selectedItem['id']) {
            selectedItem.has = true
            selectedRows.push(item)
          }
        })
      })

      selectedArray.forEach((selectedItem, selectedIndex) => {
        if (!selectedItem.has) {
          this.otherItems.push(selectedItem)
        }
      })

      this.$nextTick(() => {
        this.$refs.relativeTable.clearSelection()
        selectedRows.forEach(row => {
          this.$refs.relativeTable.toggleRowSelection(row, true)
        })
      })
    },
    // 进行搜索操作
    searchInput() {
      this.currentPage = 1
      this.totalPage = 1
      this.getList()
    },
    changePage(type) {
      if (type == 'up') {
        this.currentPage = this.currentPage - 1
      } else if (type == 'down') {
        this.currentPage = this.currentPage + 1
      }
      if (this.currentPage <= this.totalPage && this.currentPage >= 1) {
        this.getList()
      }
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      if (this.radio) {
        // this.$refs.relativeTable.clearSelection();
        val.forEach((row, index) => {
          if (index === val.length - 1) return
          this.$refs.relativeTable.toggleRowSelection(row, false)
        })
        if (val.length === 0) {
          this.selectedItem = []
        } else {
          this.selectedItem = val.length === 1 ? val : [val[val.length - 1]]
        }
      } else {
        this.selectedItem = this.otherItems.concat(val)
      }
      this.$emit('changeCheckout', {
        data: this.selectedItem,
        type: this.crmType
      })
    },
    clearAll() {
      this.$refs.relativeTable.clearSelection()
    },
    // 	当用户手动勾选全选 Checkbox 时触发的事件
    selectAll() {},
    // 关闭操作
    closeView() {
      this.$emit("close");
    },
    // 确定选择
    confirmClick() {
      if (this.crmType) {
        // 以单类型传值
        this.$emit("changeCheckout", {
          data: this.currentSelectedData ? this.currentSelectedData : [],
        });
      } else {
        this.$emit("changeCheckout", { data: this.currentSelectedData });
      }
      this.$emit("close");
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.cr-contianer {
  height: 450px;
  position: relative;
  padding: 50px 0 50px 0;
}

.title {
  padding: 0 20px;
  font-size: 16px;
  line-height: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  border-bottom: 1px solid $xr-border-line-color;
}

.handle-bar {
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  button {
    float: right;
    margin-top: 10px;
    margin-right: 10px;
  }
}

.cr-body-side {
  flex-shrink: 0;
  z-index: 3;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 150px;
  font-size: 12px;
  background-color: white;
  height: 100%;
  border-right: 1px solid $xr-border-line-color;
  .side-item {
    height: 35px;
    line-height: 35px;
    padding: 0 20px;
    cursor: pointer;
  }
}

.side-item-default {
  color: #333;
}

.side-item-select {
  color: #409eff;
  background-color: #ecf5ff;
}
.cr-body-content {
  position: relative;
  background-color: white;
  border-bottom: 1px solid $xr-border-line-color;
}

.content-header {
  position: relative;
  padding: 10px 20px;
  .search-container {
    margin: 0 20px;
    width: 200px;
  }
  .create-button {
    position: absolute;
    right: 10px;
    top: 15px;
  }
}

//表尾 上一页按钮
.table-footer {
  padding: 8px 20px;
}

.el-table /deep/ thead th {
  font-weight: 400;
  font-size: 12px;
}

.el-table /deep/ tbody tr td {
  font-size: 12px;
}

.el-table /deep/ thead .el-checkbox {
  display: none;
}
</style>

