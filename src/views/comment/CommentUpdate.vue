<template>
  <div class="flex flex-col">
    <el-form class="flex w-full" ref="form" label-width="120px">
      <el-input
        type="textarea"
        v-model="context"
        :placeholder="'코멘트를 달아주세요~!'"
        class="m-1"
      ></el-input>
      <el-button type="primary" class="btn" @click="updateComment"
        >수정하기</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from '@/firebase'

export default {
  name: 'CommentUpdate',
  props: {
    contentId: String,
    reloadComment: Function,
    reloadSubComments: Function,
    content: Object,
    subUpdateCommentToggle: Function,
    isSubComment: Boolean,
    commentId: String,
    noteId: String
  },
  data() {
    return {
      name: '',
      context: this.content.content,
      datas: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  methods: {
    async updateComment() {
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
          //댓글 ID로 댓글 수정
          await db
            .collection(collectionPath)
            .doc(this.noteId)
            .collection('reply')
            .doc(id)
            .update({
              content: this.context,
              updateDate: Date.now()
            })
          this.reloadSubComments()
        } catch (error) {
          this.errorNotification(error)
        }
      } catch (e) {
        this.errorNotification(e)
      }
    },
    errorNotification(error) {
      this.$notify.error({
        title: '댓글 수정 시 에러 발생',
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
