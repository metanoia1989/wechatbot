<template>
  <div class="dashboard-container">
    <div class="dashboard-text">每日资讯订阅，待开发...</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ContactDaily',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
