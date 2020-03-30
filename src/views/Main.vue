<template>
  <div class="flex flex-col break-words h-full">
    <h2 class="text-2xl flex-none">전체 순위표</h2>
    <!-- <p>{{ user.user }} 로(으로) 로그인 중</p> -->
    <div class="flex flex-wrap flex-1 min-h-0 overflow-y-auto">
      <div class="w-1/3">
        <div class="h-64 m-1 border border-solid border-gray-400">
          <p>그랑블루</p>
          <el-table class="flex flex-col " :data="rankList1" size="mini">
            <el-table-column type="index" label="순위" />
            <el-table-column prop="point" label="포인트" />
            <el-table-column prop="name" label="이름" />
          </el-table>
        </div>
      </div>
      <div class="w-1/3">
        <div class="h-64 m-1 border border-solid border-gray-400">
          <p>철권</p>
          <el-table class="flex flex-col" :data="rankList2" size="mini">
            <el-table-column type="index" label="순위" />
            <el-table-column prop="point" label="포인트" />
            <el-table-column prop="name" label="이름" />
          </el-table>
        </div>
      </div>
      <div class="w-1/3">
        <div class="h-64 m-1 border border-solid border-gray-400"></div>
      </div>
      <!-- <div class="w-1/3">
        <div class="h-64 m-1 border border-solid border-gray-400"></div>
      </div>
      <div class="w-1/3">
        <div class="h-64 m-1 border border-solid border-gray-400"></div>
      </div>
      <div class="w-1/3">
        <div class="h-64 m-1 border border-solid border-gray-400"></div>
      </div>
      <div class="w-1/3">
        <div class="h-64 m-1 border border-solid border-gray-400"></div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from '@/firebase'

export default {
  name: 'Main',
  data() {
    return {
      rankList1: [],
      rankList2: [],
      games: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  async created() {
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
    //랭크 목록 조회
    try {
      let data = await db
        .collection('GAME_BOARD_100_RANK')
        .orderBy('point', 'desc')
        .limit(5)
        .get()
      let rankData = []
      data.forEach(doc => {
        rankData.push(doc.data())
      })
      this.rankList1 = rankData
      data = await db
        .collection('GAME_BOARD_200_RANK')
        .orderBy('point', 'desc')
        .limit(5)
        .get()
      rankData = []
      data.forEach(doc => {
        rankData.push(doc.data())
      })
      this.rankList2 = rankData
    } catch (error) {
      this.errorNotification(error)
    }
  }
}
</script>
