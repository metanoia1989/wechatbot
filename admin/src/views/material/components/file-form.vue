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
          <el-form ref="dataForm" :model="action" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
              <el-upload
                class="upload-demo"
                name="file"
                ref="upload"
                action=""
                drag
                list-type="picture"
                :auto-upload="false"
                :file-list="fileList"
                :http-request="submitData"
              >
               <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
          </el-form>
        </div>

        <div class="handle-bar">
          <el-button class="handle-button" @click="hidenView">
            取消
          </el-button>
          <el-button class="handle-button" type="success" @click="triggerFile">
            确认  
          </el-button>
        </div>

    </flexbox> 
    </create-view>
</template>

<script>
import { fetchFile,  createFile,  updateFile } from '@/api/file'
import CreateView from '@/components/CreateView.vue'

export default {
  components: { CreateView },
  name: 'FileForm',
  props: {
    action: {
      type: Object,
      default: () => {
        return {
          type: 'create',
          id: ''
        }
      }
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑文件素材',      
        create: '创建文件素材'
      },
      tableKey: 0,
      loading: false,
      temp: {
        id: undefined,
      },
      loading: false,
      fileList: [],
      // fileList: [{ name: '', url: ''}],
    }
  },
  created() {   
    this.getFile()
  },
  methods: {
    getFile() {
      if (this.action.type == 'update') {
        this.loading = true
        fetchFile(this.action.id).then(res => {
          this.temp = res.data
          this.fileList.push({
            name: this.temp.file_name,
            url: this.temp.key,
          })
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    hidenView() {
      this.$emit('hiden-view')
    },
    triggerFile() {
      this.$refs.upload.submit();
    },
    submitData(file) {
      let request = this.action.type == 'create' ? createFile : updateFile
      let param = new FormData() 
      param.append('file',file.file)
      param.append('id', this.temp.id)

      request(param).then(res => {
        this.dialogFormVisible = false
        this.$emit('save-success')
        this.hidenView()
        this.$notify({
          title: 'Success',
          message: this.action.type == 'create' ? '新增素材成功!' : '更新素材成功',
          type: 'success',
          duration: 2000
        })
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