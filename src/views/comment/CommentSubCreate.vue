<template>
  <div class="flex flex-col">
    <el-form class="flex w-full" ref="form">
      <el-input
        type="textarea"
        v-model="context"
        :placeholder="'덧글에 덧글을 달아주세요~!'"
        class="m-1"
      ></el-input>
      <el-button type="primary" class="btn" @click="createSubComment"
        >작성하기</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from '@/firebase'

export default {
  name: 'CommentSubCreate',
  props: {
    contentId: String,
    reloadComment: Function,
    reloadSubSubComments: Function,
    subCommentToggle: Function,
    isSubComment: Boolean,
    commentId: String,
    content: Object,
    noteId: String,
    datas: Object
  },
  data() {
    return {
      name: '',
      context: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  methods: {
    async createSubComment() {
      if (!this.context) return
      try {
        let list
        let id = ''
        let db = firebase.firestore()
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id
        //댓글 ID 조회
        list = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .where('sort', '==', this.content.sort)
          .get()
        list.forEach(doc => {
          id = doc.id
        })
        try {
          //댓글 ID로 대댓글 생성
          db.collection(collectionPath)
            .doc(this.noteId)
            .collection('reply')
            .doc(id)
            .collection('rereply')
            .add({
              content: this.context,
              uid: this.user.user.uid,
              name: this.user.user.displayName,
              sort: firebase.firestore.FieldValue.serverTimestamp(),
              createDate: Date.now()
            })
            .then(() => {
              this.context = ''
              this.subCommentToggle()
              this.reloadSubSubComments()
            })
        } catch (error) {
          this.errorNotification(error)
        }
      } catch (e) {
        this.errorNotification(e)
      }
    },
    errorNotification(error) {
      this.$notify.error({
        title: '대댓글 생성 시 에러 발생',
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
.btn {
  @apply m-1;
}
</style>
