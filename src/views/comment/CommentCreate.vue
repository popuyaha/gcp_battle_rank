<template>
  <div class="flex flex-col my-2">
    <el-form class="flex w-full" ref="form">
      <el-input
        type="textarea"
        v-model="content"
        :placeholder="'코멘트를 달아주세요~!'"
        class="mr-2"
      ></el-input>
      <el-button type="primary" @click="createComment()">작성하기</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from '@/firebase'

export default {
  name: 'CommentCreate',
  props: {
    contentId: String,
    reloadComment: Function,
    reloadSubComments: Function,
    subCommentToggle: Function,
    isSubComment: Boolean,
    commentId: String,
    noteId: String,
    datas: Object
  },
  data() {
    return {
      name: '',
      content: '',
      subNoteId: ''
    }
  },
  mounted() {
    this.subNoteId = this.commentId
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  methods: {
    async createComment() {
      if (!this.content) return
      try {
        let db = firebase.firestore()
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id
        //댓글 생성
        db.collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .add({
            content: this.content,
            uid: this.user.user.uid,
            name: this.user.user.displayName,
            sort: firebase.firestore.FieldValue.serverTimestamp(),
            createDate: Date.now()
          })
          .then(() => {
            this.content = ''
            this.reloadComment()
          })
      } catch (e) {
        this.errorNotification(e)
      }
    },
    errorNotification(error) {
      this.$notify.error({
        title: '댓글 생성 시 에러 발생',
        message: error
      })
    }
  }
}
</script>

<style scoped lang="less">
.comment-create {
  display: flex;
  margin-bottom: 1em;
}
</style>
