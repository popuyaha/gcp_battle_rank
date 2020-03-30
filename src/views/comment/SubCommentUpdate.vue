<template>
  <div class="flex flex-col">
    <el-form class="flex w-full" ref="form" label-width="120px">
      <el-input
        type="textarea"
        v-model="context"
        :placeholder="'코멘트를 달아주세요~!'"
        class="m-1"
      ></el-input>
      <el-button type="primary" class="btn" @click="updateComment()"
        >수정하기</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from '@/firebase'

export default {
  name: 'SubCommentUpdate',
  props: {
    contentId: String,
    reloadComment: Function,
    reloadSubSubComments: Function,
    content: Object,
    subsubCommentUpdateToggle: Function,
    isSubComment: Boolean,
    noteId: String,
    replyData: Object
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
        let db = firebase.firestore()
        let collectionPath = 'GAME_BOARD_' + this.$route.params.id
        let list
        let replyList = ''
        let id = ''
        let replyId = ''
        //댓글 ID 조회
        list = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .where('sort', '==', this.replyData.sort)
          .get()
        list.forEach(doc => {
          id = doc.id
        })
        //대댓글 ID 조회
        replyList = await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .doc(id)
          .collection('rereply')
          .where('sort', '==', this.content.sort)
          .get()
        replyList.forEach(doc => {
          replyId = doc.id
        })
        //대댓글 ID로 대댓글 수정
        await db
          .collection(collectionPath)
          .doc(this.noteId)
          .collection('reply')
          .doc(id)
          .collection('rereply')
          .doc(replyId)
          .update({
            content: this.context,
            updateDate: Date.now()
          })
        this.subsubCommentUpdateToggle()
        this.reloadSubSubComments()
      } catch (e) {
        this.errorNotification(e)
      }
    },
    errorNotification(error) {
      this.$notify.error({
        title: '대댓글 수정 시 에러 발생',
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
