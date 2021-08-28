
<template>
  <div class="app-container">
    <div class="explain">
      <div class="title">联系人欢迎语</div>
      <p class="">用户添加好友后，将会发送此欢迎语。设置状态为否，将不可用。</p>
    </div>

      <el-form ref="dataForm"
        v-loading="loading"
        :rules="rules" :model="temp"
        label-position="left"
        label-width="85px"
        style="width: 600px; margin-left:50px;">
        <el-form-item label="内容">
          <el-input v-model="temp.content" :autosize="{ minRows: 12, maxRows: 16}" type="textarea" placeholder="请输入回复内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="temp.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>

        <el-form-item label="">
          <div class="handle-bar">
            <el-button class="handle-button" type="primary" @click="updateData">
              更新
            </el-button>
          </div>
        </el-form-item>
      </el-form>

  </div>
</template>

<script>
import { fetchWelcome, updateWelcome } from '@/api/contact'
import CreateView from '../../components/CreateView.vue'

export default {
  components: { CreateView },
  name: 'ContactWelcome',
  props: { },
  data() {
    return {
      rules: {
        content: [{ required: true, message: '必须填写内容', trigger: 'change' }],
        status: [{ required: true, message: '必须选择状态', trigger: 'change' }],
      },
      tableKey: 0,
      temp: {
        id: undefined,
        content: '',
        status: true,
      },
      loading: false,
    }
  },
  created() {
    this.getWelcome()
  },
  methods: {
    getWelcome() {
      this.loading = true
      var id = 1;
      fetchWelcome(id).then(res => {
        this.temp = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateWelcome(tempData).then(() => {
            this.$notify({
              title: 'Success',
              message: '更新成功',
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
.app-container {
  padding-bottom: 0;
}
.container {
  .title-container {
    margin: 30px;
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
