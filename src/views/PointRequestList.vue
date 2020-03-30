<template>
  <div class="flex flex-col h-1/2">
    <h1>Game Board : {{ $route.params.id }}</h1>
    <div class="px-20 py-2">
      <el-table :data="boardListData" border @row-click="readRankBoard">
        <el-table-column prop="title" label="제목"></el-table-column>
        <el-table-column prop="name" label="이름"></el-table-column>
        <el-table-column prop="userId" label="요청대상"></el-table-column>
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import router from '@/router'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import moment from 'moment'
export default {
  name: 'GameBoard',
  data() {
    return {
      boardList: [],
      multipleSelection: [],
      total: 0,
      pagesize: 5,
      currentPage: 1
    }
  },
  async beforeRouteUpdate(to, from, next) {
    let db = firebase.firestore()
    try {
      //게시글 목록 조회
      let data = await db
        .collection('GAME_BOARD_' + to.params.id + '_REQUEST')
        .orderBy('sort', 'desc')
        .get()
      let boardData = []
      data.forEach(doc => {
        boardData.push(doc.data())
      })
      this.boardList = boardData
      this.total = this.boardList.length * 2
      this.currentPage = 1
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
    try {
      //게시글 목록 조회
      let data = await db
        .collection('GAME_BOARD_' + this.$route.params.id + '_REQUEST')
        .orderBy('sort', 'desc')
        .get()
      let boardData = []
      data.forEach(doc => {
        boardData.push(doc.data())
      })
      this.boardList = boardData
      this.total = this.boardList.length * 2
      this.currentPage = 1
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
    async readRankBoard(item) {
      try {
        let db = firebase.firestore()
        let data = []
        let id = ''
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id + '_REQUEST'
        //게시글 ID 조회
        data = await db
          .collection(collectionPath)
          .where('sort', '==', item.sort)
          .get()
        data.forEach(doc => {
          id = doc.id
        })
        router.push(`readRankBoard?gameId=${id}`)
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
    }
  }
}
</script>
