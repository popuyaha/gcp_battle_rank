<template>
  <div class="h-full overflow-y-auto">
    <div class="flex border-b-4 border-solid border-gray-300 w-full">
      <div class="w-3/4 text-2xl text-left">
        {{ items.title }}
      </div>
      <div class="w-1/4 text-right">
        <div class="text-sm">글쓴이: {{ items.name }}</div>
        <div class="text-sm">등록일: {{ dateFmt(items.created_at) }}</div>
      </div>
    </div>
    <div class="w-full text-left">
      <viewer
        v-model="items.content"
        :options="editorOptions"
        :html="editorHtml"
        :visible="editorVisible"
        previewStyle="vertical"
        mode="wysiwyg"
      />
    </div>

    <div
      class="w-full btn_box border-b-4 border-solid border-gray-300 text-right"
    >
      <template v-if="items.uid == user.user.uid">
        <el-button type="primary" class="btn_01" @click="updateData(items)"
          >수정</el-button
        >
        <el-button type="danger" class="btn_02" @click="deleteDataConfirm"
          >삭제</el-button
        >
      </template>

      <el-button type="warning" class="btn_03" @click="back"
        >돌아가기</el-button
      >
    </div>
    <CommentList :noteId="item" class="w-full text-right mt-4" />
  </div>
</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import router from '@/router'
import firebase from '@/firebase'
import CommentList from './comment/CommentList'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import 'tui-editor/dist/tui-editor-contents.css'
import 'highlight.js/styles/github.css'
import { Viewer } from '@toast-ui/vue-editor'

Vue.use(VueMomentJS, moment)

export default {
  components: {
    CommentList,
    viewer: Viewer
  },
  data() {
    const item = this.$route.query.gameId
    return {
      editorOptions: {
        hideModeSwitch: true
      },
      editorHtml: '',
      editorVisible: true,
      item: item,
      items: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  async created() {
    try {
      let data = []
      let db = firebase.firestore()
      let collectionPath = 'GAME_BOARD_' + this.$route.params.id
      //게시글 ID로 게시글 데이터 조회
      data = await db
        .collection(collectionPath)
        .doc(this.item)
        .get()
      this.items = data.data()
    } catch (error) {
      this.errorNotification(error)
    }
  },

  methods: {
    back() {
      router.replace(`/game-board/${this.$route.params.id}`)
    },
    async deleteDataConfirm() {
      this.$confirm('정말 삭제하시겠습니까?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.deleteData()
          this.$message({
            type: 'success',
            message: '게시글 삭제 완료'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '게시글 삭제 취소'
          })
        })
    },
    updateData(item) {
      this.$nextTick(function() {
        router.push({ name: 'WriteGameBoard', params: { item } })
      })
    },
    dateFmt(date) {
      return moment(date).format('YYYY년 MM월 DD일')
    },
    async deleteData() {
      try {
        let db = firebase.firestore()
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id
        let data
        let id = ''
        //게시글 ID 조회
        data = await db
          .collection(collectionPath)
          .where('sort', '==', this.items.sort)
          .get()
        data.forEach(doc => {
          id = doc.id
        })
        //게시글 ID로 게시글 삭제
        await db
          .collection(collectionPath)
          .doc(id)
          .delete()
        router.replace(`/game-board/${this.$route.params.id}`)
      } catch (e) {
        this.errorNotification(e)
      }
    },
    errorNotification(error) {
      this.$notify.error({
        title: 'Error',
        message: error
      })
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
