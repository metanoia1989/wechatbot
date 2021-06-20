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
          <el-form ref="dataForm" :rules="rules" :model="action" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <el-form-item label="素材名" prop="name">
              <el-input v-model="temp.title" placeholder="请输入素材名" />
            </el-form-item>
            <el-form-item label="素材内容">
              <el-input
                type="textarea"
                :autosize="{ minRows: 8 }"
                placeholder="请输入素材内容"
                v-model="temp.content">
              </el-input>
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
import { fetchMaterial,  createMaterial,  updateMaterial } from '@/api/material'
import CreateView from '@/components/CreateView.vue'

export default {
  components: { CreateView },
  name: 'TextForm',
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
        update: '编辑文本素材',      
        create: '创建文本素材'
      },
      rules: {
        groupid: [{ required: true, message: '必须选择分馆', trigger: 'change' }],
      },
      tableKey: 0,
      loading: false,
      temp: {
        id: undefined,
        title: undefined,
        content: undefined,
      },
      loading: false,
    }
  },
  created() {   
    this.getMaterial()
  },
  methods: {
    getMaterial() {
      if (this.action.type == 'update') {
        this.loading = true
        fetchMaterial(this.action.id).then(res => {
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
    submitData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let request = this.action.type == 'create' ? createMaterial : updateMaterial
          let param = Object.assign({}, this.temp)
          request(param).then(() => {
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