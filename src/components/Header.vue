<template>
  <div class="flex w-full h-12 border border-solid border-black">
    <div class="flex flex-grow items-center text-left">
      <router-link to="/">
        <h1 class="mx-2">Battle Rank</h1>
      </router-link>
      <template v-if="isAdmin">
        <el-dropdown
          v-for="game in games"
          v-bind:key="game.id"
          @command="adminCommand"
        >
          <span class="px-1">
            {{ game.name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="game.id">게시판</el-dropdown-item>
            <el-dropdown-item :command="game">등록요청 페이지</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else>
        <template v-for="game in games">
          <router-link
            class="mx-2"
            :key="`game_${game.id}`"
            :to="`/game-board/${game.id}`"
            >{{ game.name }}</router-link
          >
        </template>
      </template>
    </div>
    <div class="flex flex-none items-center w-48 justify-end mr-2">
      <el-dropdown v-if="!isAuthenticated"></el-dropdown>
      <el-dropdown v-if="isAuthenticated" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ user.user.displayName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>메뉴1</el-dropdown-item>
          <el-dropdown-item>메뉴2</el-dropdown-item>
          <el-dropdown-item>메뉴3</el-dropdown-item>
          <el-dropdown-item command="SignOut" divided
            >로그아웃</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { mapState } from 'vuex'
import router from '@/router'

export default {
  name: 'Header',
  data() {
    return {
      games: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated,
      isAdmin: state => state.auth.isAdmin
    })
  },
  async mounted() {
    let db = firebase.firestore()
    try {
      let data = await db.collection('GAME_BOARD_LIST').get()
      let gameList = []
      data.forEach(doc => {
        gameList.push(doc.data())
      })
      this.games = gameList
    } catch (error) {
      this.errorNotification(error)
    }
    try {
      let data = await db.collection('ADMIN_LIST').get()
      let adminList = []
      data.forEach(doc => {
        if (doc.data().uid == this.user.user.uid) {
          this.$store.dispatch('auth/SetUserAdmin')
        }
      })
      this.admin = adminList
    } catch (error) {
      this.errorNotification(error)
    }
  },
  methods: {
    errorNotification(error) {
      this.$notify.error({
        title: 'Error',
        message: error
      })
    },
    handleCommand(command) {
      if (command == 'SignOut') {
        this.$store.dispatch('auth/SignOut')
        router.replace('/signIn')
      }
    },
    adminCommand(command) {
      if (command.name) {
        router.replace(`/game-board/${command.id}/PointRequestList`)
      } else {
        router.replace(`/game-board/${command}`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 0.5rem;
}
</style>
