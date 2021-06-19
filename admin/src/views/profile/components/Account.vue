<template>
  <el-form>
    <el-form-item label="用户名">
      <el-input v-model.trim="user.username" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model.trim="user.password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          password: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$store.dispatch('user/updateInfo', this.user).then(() => {
        this.$message({
          message: '更新用户信息成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
