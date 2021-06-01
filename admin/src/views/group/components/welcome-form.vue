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
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="群名" prop="group_name">
              <el-input v-model="temp.group_name" placeholder="请输入群名" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-model="temp.content" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入欢迎语内容" />
            </el-form-item>
            <el-form-item label="图片" prop="img_url">
              <el-input v-model="temp.img_url" placeholder="图片地址" />
            </el-form-item>
            <el-form-item label="链接标题" prop="link_title">
              <el-input v-model="temp.link_title" placeholder="链接标题" />
            </el-form-item>
            <el-form-item label="链接描述" prop="link_desc">
              <el-input v-model="temp.link_desc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入链接描述" />
            </el-form-item>
            <el-form-item label="链接地址" prop="link_url">
              <el-input v-model="temp.link_url" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入链接描述" />
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
import { fetchWelcome, updateWelcome, createWelcome } from '@/api/group'
import CreateView from '../../../components/CreateView.vue'

export default {
  components: { CreateView },
  name: 'WelcomeForm',
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
        update: '编辑欢迎语',      
        create: '创建欢迎语'
      },
      rules: {
        group_name: [{ required: true, message: '必须填写群名', trigger: 'change' }],
      },
      tableKey: 0,
      temp: {
        id: undefined,
        group_name: '',
        content: undefined,
        img_url: undefined,
        link_title: undefined,
        link_desc: undefined,
        link_url: undefined,
        status: true,
      },
      loading: false,
    }
  },
  created() {   

  },
  methods: {
    getWelcome() {
      if (this.action.type == 'update') {
        this.loading = true
        var id = this.action.id
        fetchWelcome(id).then(res => {
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
          createWelcome(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '创建欢迎语成功',
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
          updateWelcome(tempData).then(() => {
            this.dialogFormVisible = false
            this.$emit('save-success')
            this.hidenView()
            this.$notify({
              title: 'Success',
              message: '更新欢迎语成功',
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