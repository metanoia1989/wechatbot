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
          <div style="flex:1;font-size:17px;color:#333;">{{ textMap[action.type]}}</div>
          <img
            class="close"
            src="@/assets/img/task_close.png"
            @click="hidenView" >
        </flexbox>
        <div class="crm-create-flex">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="85px" style="width: 440px; margin-left:50px;">
            <el-form-item label="关键词" prop="link_title">
              <el-input v-model="temp.keyword" placeholder="请输入关键词" />
            </el-form-item>
            <el-form-item label="关键词类型">
              <el-radio-group v-model="temp.type">
                <el-radio :label="1">普通关键词</el-radio>
                <el-radio :label="2">事件关键词</el-radio>
                <el-radio :label="3">加群关键词</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="回复内容">
              <el-input v-model="temp.reply" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入回复内容" />
            </el-form-item>
            <el-form-item label="事件类型">
              <el-select v-model="temp.event" filterable clearable  placeholder="请选择事件类型">
                <el-option
                  v-for="(item, i) in events"
                  :key="i"
                  :label="item"
                  :value="i">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch v-model="temp.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-form>

        </div>

        <div class="handle-bar">
          <el-button class="handle-button" @click="hidenView">
            取消
          </el-button>
          <el-button class="handle-button" type="primary" @click="action.type ==='create' ? createData() : updateData()">
            确认  
          </el-button>
        </div>

    </flexbox> 
    </create-view>
</template>

<script>
import { fetchKeyword, updateKeyword, createKeyword } from '@/api/keyword'
import CreateView from '../../../components/CreateView.vue'
import settings from '@/settings'

export default {
  components: { CreateView },
  name: 'KeywordForm',
  props: {
    /**
     * save:添加、update:编辑(action_id)
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: ''
        }
      }
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑关键词',      
        create: '创建关键词'
      },
      rules: {
        keyword: [{ required: true, message: '必须填写关键词', trigger: 'change' }],
        type: [{ required: true, message: '必须选择关键词类型', trigger: 'change' }],
      },
      tableKey: 0,
      temp: {
        id: undefined,
        keyword: '',
        type: 1,
        reply: undefined,
        event: undefined,
        status: true,
      },
      loading: false,
      types: settings.keywordTypes,
      events: settings.keywordEventList,
    }
  },
  created() {   
    this.getKeyword()
  },
  methods: {
    getKeyword() {
      if (this.action.type == 'update') {
        this.loading = true
        var id = this.action.id
        fetchKeyword(id).then(res => {
          this.temp = res.data 
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    hidenView() {
      this.$emit('hiden-view')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createKeyword(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '创建关键词成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateKeyword(tempData).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '更新关键词成功',
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