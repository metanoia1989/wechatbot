<template>
    <create-view 
      v-loading="loading" 
      :body-style="{ height: '100%'}"
    >
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
        <flexbox class="crm-create-header">
          <div style="flex:1;font-size:17px;color:#333;">绑定分馆</div>
          <img
            class="close"
            src="@/assets/img/task_close.png"
            @click="hidenView" >
        </flexbox>
        <div class="crm-create-flex">
          <el-form ref="dataForm" :rules="rules" :model="action" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="群名" prop="name">
              <el-input v-model="action.name" placeholder="请输入群名" :disable="true" />
            </el-form-item>
            <el-form-item label="微澜分馆">
              <el-select v-model="action.groupid" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div class="handle-bar">
          <el-button class="handle-button" @click="hidenView">
            取消
          </el-button>
          <el-button class="handle-button" type="primary" @click="submitData">
            确认  
          </el-button>
        </div>

    </flexbox> 
    </create-view>
</template>

<script>
import { fetchLibraryList, relateRoomLibrary } from '@/api/group'
import CreateView from '../../../components/CreateView.vue'

export default {
  components: { CreateView },
  name: 'GroupLibForm',
  props: {
    action: {
      type: Object,
      default: () => {
        return {
          room_id: '',
          name: '',
          groupid: '',
        }
      }
    }
  },
  data() {
    return {
      rules: {
        groupid: [{ required: true, message: '必须选择分馆', trigger: 'change' }],
      },
      tableKey: 0,
      loading: false,
      options: [],
    }
  },
  created() {   
    this.getLibraryList()
  },
  methods: {
    getLibraryList() {
        this.loading = true
        fetchLibraryList().then(res => {
          this.options = res.data.map(item => {
            let { groupid, groupname } = item
            return { value: groupid, label: groupname }
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    hidenView() {
      this.$emit('hiden-view')
    },
    submitData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          relateRoomLibrary(this.action).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '关联分馆成功!',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
}

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}

</style>