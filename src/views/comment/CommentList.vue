<template>
  <div>
    <div
      :key="index"
      v-for="(data, index) in datas"
      class="w-full border-b-2 border-gray-400 rounded-t-lg"
    >
      <CommentListItem
        :commentObj="data"
        :noteId="noteId"
        :reloadComment="reloadComment"
      />
    </div>
    <CommentCreate v-bind:noteId="noteId" :reloadComment="reloadComment" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import firebase from '@/firebase'
import CommentCreate from './CommentCreate'
import CommentListItem from './CommentListItem'

export default {
  name: 'CommentList',
  data() {
    return {
      datas: []
    }
  },
  props: {
    noteId: String
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  created() {
    this.commentList()
  },
  components: {
    CommentCreate,
    CommentListItem
  },
  methods: {
    async commentList() {
      try {
        let data = []
        this.datas = []
        let db = firebase.firestore()
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id
        //댓글 리스트 조회
        data = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .orderBy('sort', 'desc')
          .get()
        data.forEach(doc => {
          this.datas.push(doc.data())
        })
      } catch (e) {
        this.errorNotification(e)
      }
    },
    reloadComment() {
      this.commentList()
    },
    errorNotification(error) {
      this.$notify.error({
        title: '댓글 목록 로드 시 에러 발생',
        message: error
      })
    }
  }
}
</script>
