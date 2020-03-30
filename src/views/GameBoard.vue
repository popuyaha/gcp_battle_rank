<template>
  <div class="flex flex-col h-full">
    <h1>Game Board : {{ $route.params.id }}</h1>
    <div class="flex flex-1 min-h-0 overflow-y-auto">
      <div class="w-1/4 p-1">
        <el-table class="flex flex-col" :data="rankList">
          <el-table-column type="index" label="순위" />
          <el-table-column prop="point" label="포인트" />
          <el-table-column prop="name" label="이름" />
        </el-table>
      </div>
      <div class="w-3/4 p-1">
        <el-table
          :data="boardListData"
          class="flex flex-col h-auto"
          @row-click="readBoard"
        >
          <el-table-column type="index" label="번호"></el-table-column>
          <el-table-column prop="title" label="제목"></el-table-column>
          <el-table-column prop="name" label="이름"></el-table-column>
          <el-table-column
            prop="createDate"
            :formatter="dataFmt"
            label="생성일"
          ></el-table-column>
        </el-table>
        <div class="flex w-full justify-center mt-3">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="current_change"
          >
          </el-pagination>
        </div>
        <div class="w-full btn_box mt-2 text-right">
          <el-button type="primary" @click="pointReq">등록</el-button>
          <el-button type="primary" @click="newBoard">글쓰기</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '@/router'
import firebase from '@/firebase'
import moment from 'moment'

export default {
  name: 'GameBoard',
  data() {
    return {
      rankList: [],
      boardList: [],
      multipleSelection: [],
      total: 0,
      pagesize: 10,
      currentPage: 1
    }
  },
  async beforeRouteUpdate(to, from, next) {
    let db = firebase.firestore()
    //게시글 목록 조회
    try {
      let data = await db
        .collection('GAME_BOARD_' + to.params.id)
        .orderBy('sort', 'desc')
        .get()
      let boardData = []
      data.forEach(doc => {
        boardData.push(doc.data())
      })
      this.boardList = boardData
      this.total = this.boardList.length
      this.currentPage = 1
    } catch (error) {
      this.errorNotification(error)
    }

    //랭크 목록 조회
    try {
      let data = await db
        .collection('GAME_BOARD_' + to.params.id + '_RANK')
        .orderBy('point', 'desc')
        .limit(10)
        .get()
      let rankData = []
      data.forEach(doc => {
        rankData.push(doc.data())
      })
      this.rankList = rankData
    } catch (error) {
      this.errorNotification(error)
    }
    next()
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    }),
    boardListData() {
      return this.boardList.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      )
    }
  },
  async created() {
    let db = firebase.firestore()
    //게시글 목록 조회
    try {
      let data = await db
        .collection('GAME_BOARD_' + this.$route.params.id)
        .orderBy('sort', 'desc')
        .get()
      let boardData = []
      data.forEach(doc => {
        boardData.push(doc.data())
      })
      this.boardList = boardData
      this.total = this.boardList.length
      this.currentPage = 1
    } catch (error) {
      this.errorNotification(error)
    }
    //랭크 목록 조회
    try {
      let data = await db
        .collection('GAME_BOARD_' + this.$route.params.id + '_RANK')
        .orderBy('point', 'desc')
        .limit(10)
        .get()
      let rankData = []
      data.forEach(doc => {
        rankData.push(doc.data())
      })
      this.rankList = rankData
    } catch (error) {
      this.errorNotification(error)
    }
  },
  methods: {
    newBoard() {
      router.push(`${this.$route.params.id}/writeGameBoard`)
    },
    errorNotification(error) {
      this.$notify.error({
        title: 'Error',
        message: error
      })
    },
    async readBoard(item) {
      try {
        let db = firebase.firestore()
        let data = []
        let id = ''
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id
        //게시글 ID 조회
        data = await db
          .collection(collectionPath)
          .where('sort', '==', item.sort)
          .get()
        data.forEach(doc => {
          id = doc.id
        })
        router.push(`${this.$route.params.id}/readGameBoard?gameId=${id}`)
      } catch (error) {
        this.errorNotification(error)
      }
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage
    },
    //row,column,cellValue,index
    dataFmt(row) {
      return this.dateFmt(row.createDate)
    },
    dateFmt(date) {
      return moment(date).format('YYYY년 MM월 DD일')
    },
    pointReq() {
      router.push(`${this.$route.params.id}/pointRequest`)
    }
  }
}
</script>
<style scoped lang="less">
.btn_box {
  .el-button {
    @apply m-1 py-2 px-2;
  }
}
</style>
