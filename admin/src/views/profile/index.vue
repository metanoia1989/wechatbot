<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <!-- <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col> -->

        <el-col :span="18" :xs="24">
          <el-card>
            <account :user="user" />
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Account },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        username: this.name,
      }
    }
  }
}
</script>
