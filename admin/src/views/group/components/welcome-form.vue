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
            <el-form-item label="微信群">
              <el-select v-model="temp.room_ident" filterable placeholder="请选择">
                <el-option
                  v-for="item in roomOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-model="temp.content" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入欢迎语内容" />
            </el-form-item>
            <el-form-item label="图片">
              <el-select v-model="temp.img_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in fileOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="链接标题" prop="link_title">
              <el-input v-model="temp.link_title" placeholder="链接标题" />
            </el-form-item>
            <el-form-item label="链接描述" prop="link_desc">
              <el-input v-model="temp.link_desc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入链接描述" />
            </el-form-item>
            <el-form-item label="链接图片">
              <el-select v-model="temp.link_img_id" filterable placeholder="请选择">
                <el-option
                  v-for="item in fileOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
import { fetchWelcome, updateWelcome, createWelcome, fetchAllRoom } from '@/api/group'
import { fetchAllFile } from '@/api/file'
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
        room_ident: [{ required: true, message: '必须选择微信群', trigger: 'change' }],
      },
      tableKey: 0,
      temp: {
        id: undefined,
        room_ident: '',
        content: undefined,
        img_id: undefined,
        link_title: undefined,
        link_desc: undefined,
        link_img_id: undefined,
        link_url: undefined,
        status: true,
      },
      roomOptions: [],
      fileOptions: [],
      loading: false,
    }
  },
  created() {   
    this.getWelcome()
  },
  methods: {
    getWelcome() {
      Promise.all([fetchAllRoom(), fetchAllFile()]).then((values) => {
          let [roomRes, fileRes] = values
          console.log(roomRes, fileRes)
          this.roomOptions = roomRes.data.map(item => {
            let { room_ident, name } = item
            return { value: room_ident, label: name }
          })
          this.fileOptions = fileRes.data.map(item => {
            let { id, file_name } = item
            return { value: id, label: file_name }
          })
      })
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